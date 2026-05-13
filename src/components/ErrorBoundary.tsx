import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="max-w-2xl bg-white p-12 rounded-[48px] border border-red-200 shadow-2xl text-center">
            <h1 className="text-4xl font-black text-red-600 mb-6">Something went wrong</h1>
            <p className="text-text-muted mb-6 leading-relaxed">
              An unexpected error occurred while loading the page. Please try refreshing.
            </p>
            <pre className="text-left bg-red-50 p-6 rounded-2xl overflow-auto text-xs text-red-800 font-mono mb-6">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="bg-secondary text-primary px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
