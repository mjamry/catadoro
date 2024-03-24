import React, { Component, ErrorInfo, ReactNode } from "react";
import ErrorScreen from './screens/ErrorScreen';
import useLoggerService from "./services/logger/LoggerService";

interface DefaultProps {
  children?: ReactNode;
  onError: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: string;
}

class DefaultErrorBoundary extends Component<DefaultProps, State> {
  public state: State = {
    hasError: false,
    error: ''
  };

  public static getDerivedStateFromError(e: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: e.message};
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorScreen error={this.state.error} />
    }

    return (
      this.props.children
    )
  }
}

type ErrorBoundaryProps = {
  children?: ReactNode;
}

const ErrorBoundary = (props: ErrorBoundaryProps) => {
  const { children } = props;
  const logger = useLoggerService('EB');

  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    logger.error(error.message, error, errorInfo);
  }

  return (
    <DefaultErrorBoundary onError={handleError}>
      {children}
    </DefaultErrorBoundary>
  );

};

export default ErrorBoundary;