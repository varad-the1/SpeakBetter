import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public props: Readonly<Props>; // Explicitly define props
  public state: Readonly<State>; // Explicitly define state

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-zinc-100 p-4">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Oops! Something went wrong.</h1>
          <p className="text-zinc-400 text-center mb-4">We're sorry for the inconvenience. Please try refreshing the page.</p>
          {this.state.error && (
            <div className="bg-surface border border-border rounded-lg p-4 text-sm text-red-300 max-w-lg overflow-auto">
              <pre className="whitespace-pre-wrap">{this.state.error.message}</pre>
            </div>
          )}
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-6 py-3 bg-accent text-background rounded-lg font-semibold hover:bg-accent/80 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
