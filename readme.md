# Peact Global State

[<img src="https://img.shields.io/npm/v/@ekwoka/preact-global-state?style=for-the-badge">](https://www.npmjs.com/package/@ekwoka/preact-global-state)
<img src="https://img.shields.io/npm/types/@ekwoka/preact-global-state?label=%20&amp;logo=typescript&amp;logoColor=white&amp;style=for-the-badge">
<img src="https://img.shields.io/npm/dt/@ekwoka/preact-global-state?style=for-the-badge" >
[<img src="https://img.shields.io/bundlephobia/minzip/@ekwoka/preact-global-state?style=for-the-badge">](https://bundlephobia.com/package/@ekwoka/preact-global-state)

Preact Global State is a simple state management library for Preact, enabling the sharing of state between components, similar to React's Context API, or other libraries like Redux. The big benefit of Preact Global State over these alternatives is the ease-of use and surgical precision (improved even further with the use of signals instead of classic state).

This project began as a rewrite of `preact-global-state` but has since been dramatically altered and extended. With `2.0.0`, the core utilizes `@preact/signals` (and requires it as a peer). This does increase the overall footprint of adding this to a non-signal project, but reduces the footprint when already using signals.

If you are not using `signals` and just want a global equivalent to `useState`, you can install `1.0.1` instead.

## Installation

```bash
pnpm add @ekwoka/preact-global-state # for signals
pnpm add @ekwoka/preact-global-state@1.0.1  # for non-signals projects
```

## Usage

### Classic state

```ts
const [counter, setCounter] = useGlobalState<number>('my-counter', 0); // (state label: string; initial value?: any)

return (
  <div>
    <button onClick={() => setCounter(1)}> /* directly setting the state Set to 1! */</button>
    <button onClick={() => setCounter((prev) => prev + 1)}> /* using a state function to update the state Increment! */</button>
  </div>
);
```

And in another

```ts
const [counter] = useGlobalState<number>('my-counter', 0);

return (
  <div>
    <p>{counter}</p>
  </div>
);
```

### Using signals

```ts
const count = useGlobalSignal<number>('my-counter', 0); // (state label: string; initial value?: any)

return (
  <div>
    <button onClick={() => count.value++}> /* Incrementing the signal value */ </button>
  </div>
);
```

And in another

```ts
const count = useGlobalSignal<number>('my-counter', 0);

return (
  <div>
    <p>{count}</p>
  </div>
);
```

This state can be shared among any number of components, and the use of `useGlobalState` and `useGlobalSignal` can be mixed! This allows you to get the benefits of a global signal while also having state updaters to pass to external libraries, or to mix legacy components with newer signals based components.

### Store

One consideration of these hooks is that the first calling of a hook with a specific default value will set that value to the state. Subsequent initializations will ignore the default value.

While smart usage can ensure that this is not an issue, it could be the cause of any issues.

To avoid this, or to simply enable an explicit initialization of the global state, you can use the `Store` function outside of components (or at some root level).

```ts
Store({
  hello: 'world',
  foo: 'bar',
  blazeit: 420
});
```
