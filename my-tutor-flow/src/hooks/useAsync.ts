import { useState, useCallback, useEffect } from 'react';
import type { LoadingState } from '../types';

interface UseAsyncState<T> {
  data: T | null;
  error: string | null;
  status: LoadingState;
}

interface UseAsyncReturn<T> extends UseAsyncState<T> {
  execute: (...args: any[]) => Promise<T | undefined>;
  reset: () => void;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isIdle: boolean;
}

export const useAsync = <T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  immediate: boolean = false
): UseAsyncReturn<T> => {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    error: null,
    status: 'idle',
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | undefined> => {
      setState(prev => ({ ...prev, status: 'loading', error: null }));

      try {
        const data = await asyncFunction(...args);
        setState({ data, error: null, status: 'success' });
        return data;
      } catch (error: any) {
        const errorMessage = error?.message || 'An unexpected error occurred';
        setState({ data: null, error: errorMessage, status: 'error' });
        throw error;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, status: 'idle' });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset,
    isLoading: state.status === 'loading',
    isError: state.status === 'error',
    isSuccess: state.status === 'success',
    isIdle: state.status === 'idle',
  };
};
