import { h } from 'preact';
import { render, fireEvent, screen, cleanup, renderHook, act } from '@testing-library/preact';
import { afterEach, describe, expect, it } from 'vitest';
import { useGlobalState } from '../src';

describe('useGlobalState', () => {
  afterEach(cleanup);
  it('should behave like state', () => {
    const { result } = renderHook(() => useGlobalState('test', 0));
    expect(result.current[0]).toBe(0);
    act(() => result.current[1](1));
    expect(result.current[0]).toBe(1);
  });
  it('should work with updater function', () => {
    const { result } = renderHook(() => useGlobalState('updater', 0));
    expect(result.current[0]).toBe(0);
    act(() => result.current[1]((v) => v + 1));
    expect(result.current[0]).toBe(1);
  });
  it('should work with multiple instances', () => {
    const { result: result1 } = renderHook(() => useGlobalState('multi', 0));
    const { result: result2 } = renderHook(() => useGlobalState('multi', 0));
    expect(result1.current[0]).toBe(0);
    expect(result2.current[0]).toBe(0);
    act(() => result1.current[1](1));
    expect(result1.current[0]).toBe(1);
    expect(result2.current[0]).toBe(1);
    act(() => result2.current[1](2));
  });
  it('should work with multiple instances with different keys', () => {
    const { result: result1 } = renderHook(() => useGlobalState('multi1', 0));
    const { result: result2 } = renderHook(() => useGlobalState('multi2', 0));
    expect(result1.current[0]).toBe(0);
    expect(result2.current[0]).toBe(0);
    act(() => result1.current[1](1));
    expect(result1.current[0]).toBe(1);
    expect(result2.current[0]).toBe(0);
    act(() => result2.current[1](2));
    expect(result1.current[0]).toBe(1);
    expect(result2.current[0]).toBe(2);
  });
  it('should work in a component', async () => {
    const Counter = ({ id }: { id: string }) => {
      const [count, setCount] = useGlobalState('counter', 0);
      return (
        <div>
          <button data-testid={`button-${id}`} onClick={() => setCount(count + 1)}>
            +
          </button>
          <span data-testid={`span-${id}`}>{count.toString()}</span>
        </div>
      );
    };
    render(
      <div>
        <Counter id='1' />;
        <Counter id='2' />;
      </div>
    );
    expect((await screen.findByTestId('span-1')).textContent).toBe('0');
    expect((await screen.findByTestId('span-2')).textContent).toBe('0');
    fireEvent.click(await screen.findByTestId('button-1'));
    expect((await screen.findByTestId('span-1')).textContent).toBe('1');
    expect((await screen.findByTestId('span-2')).textContent).toBe('1');
    fireEvent.click(await screen.findByTestId('button-2'));
    expect((await screen.findByTestId('span-1')).textContent).toBe('2');
    expect((await screen.findByTestId('span-2')).textContent).toBe('2');
  });
});
