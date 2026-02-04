import { ComponentExample } from "@/components/component-example";
import { ErrorBoundary } from "@/components/error-boundary";

export default function Page() {
    return (
        <ErrorBoundary>
            <ComponentExample />
        </ErrorBoundary>
    );
}