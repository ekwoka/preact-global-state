# Peact Global State

[<img src="https://img.shields.io/npm/v/@ekwoka/preact-global-state?style=for-the-badge">](https://www.npmjs.com/package/@ekwoka/preact-global-state)
<img src="https://img.shields.io/npm/types/@ekwoka/preact-global-state?label=%20&amp;logo=typescript&amp;logoColor=white&amp;style=for-the-badge">
<img src="https://img.shields.io/npm/dt/@ekwoka/preact-global-state?style=for-the-badge" >
[<img src="https://img.shields.io/bundlephobia/minzip/@ekwoka/preact-global-state?style=for-the-badge">](https://bundlephobia.com/package/@ekwoka/preact-global-state)

This is a rewrite of `preact-global-state` to add types, improve support for ESM modules, and also give `useGlobalState` more feature parity with `useState`.

This allows you to share state between multiple components, similar to `useContext` or even `redux` but at a simpler and more focussed level.

## Usage

In your components:

```ts
const [counter, setCounter] = useGlobalState<number>('my-counter', 0); // (state label: string; initial value?: any)

return (
  <div>
    <button onClick={() => setCounter(1)}> // directly setting the state Set to 1!</button>
    <button onClick={() => setCounter((prev) => prev + 1)}> // using a state function to update the state Increment!</button>
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

This state can be shared among any number of components. The only consideration regarding the order, is that the first `useGlobalState` called on a key will be the initial value used.

This can also be useful in your own custom hooks where you want the hooks to share state and maintain reactivity.
