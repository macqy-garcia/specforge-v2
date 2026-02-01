/**
 * OpenAPI Specification Validator
 * Validates OpenAPI/Swagger specifications by checking structure and required fields
 */

export interface ValidationResult {
  isValid: boolean
  error?: string
  specData?: any
  version?: string
  type?: 'openapi' | 'swagger'
}

/**
 * Validates if a URL is properly formatted
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Fetches OpenAPI spec from a URL
 */
export async function fetchOpenApiSpec(url: string): Promise<ValidationResult> {
  // Validate URL format first
  if (!isValidUrl(url)) {
    return {
      isValid: false,
      error: 'Invalid URL format'
    }
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, application/yaml, application/x-yaml, text/yaml, text/x-yaml'
      }
    })

    if (!response.ok) {
      return {
        isValid: false,
        error: `Failed to fetch spec: ${response.status} ${response.statusText}`
      }
    }

    const contentType = response.headers.get('content-type') || ''
    let specData: any

    // Try to parse as JSON first
    if (contentType.includes('application/json') || contentType.includes('json')) {
      try {
        specData = await response.json()
      } catch (e) {
        return {
          isValid: false,
          error: 'Failed to parse JSON response'
        }
      }
    } else {
      // For YAML or other formats, try to get text and parse
      const text = await response.text()

      // Try to parse as JSON (in case content-type is wrong)
      try {
        specData = JSON.parse(text)
      } catch {
        // If we can't parse as JSON, we might need a YAML parser
        // For now, return error asking for JSON format
        return {
          isValid: false,
          error: 'Please provide the spec in JSON format or ensure the URL returns valid JSON'
        }
      }
    }

    // Validate the OpenAPI spec structure
    return validateOpenApiSpec(specData)

  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Failed to fetch OpenAPI specification'
    }
  }
}

/**
 * Validates the structure of an OpenAPI/Swagger specification
 */
export function validateOpenApiSpec(spec: any): ValidationResult {
  if (!spec || typeof spec !== 'object') {
    return {
      isValid: false,
      error: 'Spec must be a valid JSON object'
    }
  }

  // Check for OpenAPI 3.x
  if (spec.openapi && typeof spec.openapi === 'string') {
    const version = spec.openapi

    // Validate OpenAPI 3.x required fields
    if (!spec.info || typeof spec.info !== 'object') {
      return {
        isValid: false,
        error: 'Missing required "info" object in OpenAPI spec'
      }
    }

    if (!spec.info.title || typeof spec.info.title !== 'string') {
      return {
        isValid: false,
        error: 'Missing required "info.title" in OpenAPI spec'
      }
    }

    if (!spec.info.version || typeof spec.info.version !== 'string') {
      return {
        isValid: false,
        error: 'Missing required "info.version" in OpenAPI spec'
      }
    }

    if (!spec.paths || typeof spec.paths !== 'object') {
      return {
        isValid: false,
        error: 'Missing required "paths" object in OpenAPI spec'
      }
    }

    return {
      isValid: true,
      specData: spec,
      version,
      type: 'openapi'
    }
  }

  // Check for Swagger 2.0
  if (spec.swagger && typeof spec.swagger === 'string') {
    const version = spec.swagger

    // Validate Swagger 2.0 required fields
    if (!spec.info || typeof spec.info !== 'object') {
      return {
        isValid: false,
        error: 'Missing required "info" object in Swagger spec'
      }
    }

    if (!spec.info.title || typeof spec.info.title !== 'string') {
      return {
        isValid: false,
        error: 'Missing required "info.title" in Swagger spec'
      }
    }

    if (!spec.info.version || typeof spec.info.version !== 'string') {
      return {
        isValid: false,
        error: 'Missing required "info.version" in Swagger spec'
      }
    }

    if (!spec.paths || typeof spec.paths !== 'object') {
      return {
        isValid: false,
        error: 'Missing required "paths" object in Swagger spec'
      }
    }

    return {
      isValid: true,
      specData: spec,
      version,
      type: 'swagger'
    }
  }

  // Neither OpenAPI nor Swagger
  return {
    isValid: false,
    error: 'Invalid specification: must be OpenAPI 3.x (with "openapi" field) or Swagger 2.0 (with "swagger" field)'
  }
}

/**
 * Helper to get a summary of the OpenAPI spec
 */
export function getSpecSummary(spec: any): { title: string; version: string; description?: string; pathCount: number } | null {
  if (!spec || !spec.info) return null

  return {
    title: spec.info.title || 'Untitled',
    version: spec.info.version || 'Unknown',
    description: spec.info.description,
    pathCount: spec.paths ? Object.keys(spec.paths).length : 0
  }
}
