import { StateUpdater, useCallback, useEffect, useState } from 'preact/hooks';

const GlobalState = <T>(initialValue: T): GlobalStateMethods<T> => {
  let value: T = initialValue;
  let subscribers: ((value: T) => void)[] = [];

  return {
    getValue: () => value,
    setValue: (newState: T) => {
      if (value === newState) return;
      value = newState;
      subscribers.forEach((subscriber) => subscriber(value));
    },
    subscribe: (itemToSubscribe: (value: T) => void) => {
      if (subscribers.indexOf(itemToSubscribe) > -1) return;
      subscribers.push(itemToSubscribe);
    },
    unsubscribe(itemToUnsubscribe: (value: T) => void) {
      subscribers = subscribers.filter((subscriber) => subscriber !== itemToUnsubscribe);
    }
  };
};
export const Store = () => {
  const store: StoreObject = {};

  return {
    init(obj: { [key: string]: any }) {
      Object.entries(obj).forEach(([key, value]) => this.setState(key, value));
    },

    getState(key: string, defaultValue: any) {
      if (store[key] === undefined) {
        this.setState(key, defaultValue);
      }
      return store[key];
    },

    setState: (key: string, value: any): void => {
      store[key] = GlobalState(value);
    }
  };
};

export const useGlobalState: UseGlobalState = (key, defaultValue) => {
  if (typeof defaultValue === 'undefined') {
    defaultValue = null;
  }

  const [, setState] = useState<object>();
  const globalState = store.getState(key, defaultValue);

  const currentState = globalState.getValue();

  function reRender() {
    setState({});
  }

  useEffect(() => {
    globalState.subscribe(reRender);
    return function () {
      globalState.unsubscribe(reRender);
    };
  });

  const set = useCallback(
    (v: any) => {
      const newValue = typeof v === 'function' ? v(globalState.getValue()) : v;
      globalState.setValue(newValue);
    },
    [globalState]
  );
  return [currentState, set];
};

export const store = Store();

type UseGlobalState = <T>(key: string, defaultValue?: T | null) => [T, StateUpdater<T>];

type GlobalStateMethods<T> = {
  getValue: () => T;
  setValue: (newState: T) => void;
  subscribe: (itemToSubscribe: (value: T) => void) => void;
  unsubscribe: (itemToUnsubscribe: (value: T) => void) => void;
};

type StoreObject = {
  [key: string]: GlobalStateMethods<any>;
};
