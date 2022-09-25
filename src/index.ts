import { Signal, signal } from '@preact/signals';
import { StateUpdater, useCallback } from 'preact/hooks';

export const useGlobalState: UseGlobalState = (key, defaultValue = null) => {
  store[key] = store[key] ?? signal(defaultValue);

  const set = useCallback<StateUpdater<typeof defaultValue>>(
    (v) => {
      const newValue = 'call' in v ? v(store[key].value) : v;
      store[key].value = newValue;
    },
    [store[key]]
  );
  return [store[key].value, set];
};

export const store: Record<string, Signal> = {};

export const Store: StoreInitializer = (initialValues) => {
  Object.entries(initialValues).forEach(([key, value]) => {
    store[key] = signal(value);
  });
};

type UseGlobalState = <T>(key: string, defaultValue?: T) => [T, StateUpdater<T>];

type StoreInitializer = (initialValues: Record<string, unknown>) => void;
