import React from "react";
import type { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryClass extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    process.stdout.write('\x1b[?25h');
    process.stdout.write('\x1b[2J\x1b[H');
    console.error('TUI Error:', error);
    console.error('Error Info:', errorInfo);
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <box 
          backgroundColor="#d8647e"
          flexGrow={1}
          justifyContent="center"
          alignItems="center"
        >
          <text>An error occurred. Please restart the application.</text>
        </box>
      );
    }

    return this.props.children;
  }
}

export const TUIErrorBoundary = ErrorBoundaryClass as any;
