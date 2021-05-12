import * as Stack from '../Stack';

export interface HasCapactiy {
  capacity: number;
}

export type EvictingStack<T> = Stack.Stack<T> & HasCapactiy;

export function emptyEvictingStack<T>(capacity: number): EvictingStack<T> {
  return { ...Stack.emptyStack(), capacity };
}

export function fromArrayHead<T>(capacity: number, ts: T[]): EvictingStack<T> {
  return {
    items: ts.slice(0, capacity),
    capacity,
  };
}

export function fromArrayTail<T>(capacity: number, ts: T[]): EvictingStack<T> {
  return {
    items: ts.slice(-capacity),
    capacity,
  };
}

export function pushWithEviction<T, S extends EvictingStack<T> = EvictingStack<T>>(
  stack: S
): (item: T) => S;
export function pushWithEviction<T, S extends EvictingStack<T> = EvictingStack<T>>(
  stack: S,
  item: T
): S;
export function pushWithEviction<T, S extends EvictingStack<T> = EvictingStack<T>>(
  stack: S,
  item?: T
) {
  const doit = (item: T) => ({ ...stack, items: [item, ...stack.items].slice(0, stack.capacity) });
  return typeof item === 'undefined' ? doit : doit(item);
}
