import type { ReactNode } from 'react';

interface Props {
  isLoading: boolean;
  error: unknown;
  loadingMessage?: string;
  errorMessagePrefix?: string;
  children: ReactNode;
}

export default function QueryStateWrapper({
  isLoading,
  error,
  loadingMessage = 'Loading…',
  errorMessagePrefix = 'Failed to load data',
  children,
}: Props) {
  if (isLoading) {
    return <p className="text-muted-foreground">{loadingMessage}</p>;
  }

  if (error) {
    const message = (error as { message?: string }).message ?? 'Unknown error';
    const isNetworkError = message === 'Network Error';
    const errorMessage = isNetworkError
      ? 'Cannot reach server — make sure the backend is running.'
      : `${errorMessagePrefix}: ${message}`;
    return <p className="text-destructive">{errorMessage}</p>;
  }

  return <>{children}</>;
}