import { Signal, signal } from '@preact/signals';
import { StateUpdater, useCallback } from 'preact/hooks';

export const useGlobalState = <T>(key: string, defaultValue: T = null): [T, StateUpdater<T>] => {
  const signal = useGlobalSignal(key, defaultValue);

  const set = useCallback<StateUpdater<typeof defaultValue>>(
    (v) => {
      const newValue = isFunction(v) && 'call' in v ? v(signal.value) : (v as T);
      signal.value = newValue;
    },
    [signal]
  );
  return [store[key].value, set];
};

export const useGlobalSignal = <T>(key: string, defaultValue: T = null): Signal<T> => {
  store[key] = store[key] ?? signal(defaultValue);
  return store[key];
};

const isFunction = (v: any): boolean => typeof v === 'function';

export const store: Record<string, Signal> = {};

export const Store = (initialValues: Record<string, unknown>): void => {
  Object.entries(initialValues).forEach(([key, value]) => {
    store[key] = signal(value);
  });
};
