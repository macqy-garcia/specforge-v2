import { ComponentExample } from "@/components/component-example";
import { ErrorBoundary } from "@/components/error-boundary";
import { HappyPathProvider } from "@/components/happy-path-context";

export default function Page() {
    return (
        <ErrorBoundary>
            <HappyPathProvider>
                <ComponentExample />
            </HappyPathProvider>
        </ErrorBoundary>
    );
}