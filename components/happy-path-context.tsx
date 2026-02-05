"use client"

import * as React from "react"

interface HappyPathContextValue {
  happyPath: boolean
  setHappyPath: (value: boolean) => void
}

const HappyPathContext = React.createContext<HappyPathContextValue>({
  happyPath: true,                          // default ON so the demo never blocks
  setHappyPath: () => {},
})

export function HappyPathProvider({ children }: { children: React.ReactNode }) {
  const [happyPath, setHappyPath] = React.useState(true)
  return (
    <HappyPathContext.Provider value={{ happyPath, setHappyPath }}>
      {children}
    </HappyPathContext.Provider>
  )
}

export function useHappyPath() {
  return React.useContext(HappyPathContext)
}
