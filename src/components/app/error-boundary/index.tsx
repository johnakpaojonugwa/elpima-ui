import { Component, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  label?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(
      `[ErrorBoundary${this.props.label ? `:${this.props.label}` : ""}]`,
      error,
      info.componentStack,
    );
  }

  private reset = () => this.setState({ hasError: false, error: undefined });

  override render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-6 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-rose-500" />
        <p className="mt-3 text-sm font-semibold text-rose-900">
          This section failed to load.
        </p>
        <p className="mt-1 text-xs text-rose-700/80">
          You can keep using the rest of the page.
        </p>
        <button
          type="button"
          onClick={this.reset}
          className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors cursor-pointer"
        >
          Try again
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;

