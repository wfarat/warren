import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary złapał nieobsłużony błąd:', error, errorInfo);
  }

  private handleReset = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center h-120 p-6 text-center gap-3 bg-bg-3 border border-danger-dark/30 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-danger-dark/10 flex items-center justify-center text-danger-dark font-bold text-lg">
            !
          </div>
          <h4 className="text-white text-sm font-semibold">Error when fetching</h4>
          <p className="text-grey-1 text-xs max-w-[220px] leading-relaxed">
            {this.state.error?.message?.includes('permission')
              ? 'Insufficient permission. Try to log in again.'
              : 'Connection error. Check your connection.'}
          </p>
          <Button
            type="button"
            intent="outlined"
            className="mt-2 text-xs py-1.5 px-4"
            onClick={this.handleReset}
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
