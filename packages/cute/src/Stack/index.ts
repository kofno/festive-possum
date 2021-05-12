import { fromEmpty, Maybe } from 'maybeasy';

export interface Stack<T> {
  readonly items: ReadonlyArray<T>;
}

export function emptyStack<T>(): Stack<T> {
  return { items: [] };
}

export function fromArray<T>(ts: T[]): Stack<T> {
  return { items: [...ts] };
}

export function pop<T, S extends Stack<T> = Stack<T>>(stack: S): Maybe<[S, T]> {
  return fromEmpty(stack.items).map(([top, ...rest]) => [{ ...stack, items: rest }, top]);
}

export function push<T, S extends Stack<T> = Stack<T>>(stack: S): (item: T) => S;
export function push<T, S extends Stack<T> = Stack<T>>(stack: S, item: T): S;
export function push<T, S extends Stack<T> = Stack<T>>(stack: S, item?: T) {
  const doit = (item: T) => ({ ...stack, items: [item, ...stack.items] });
  return typeof item === 'undefined' ? doit : doit(item);
}

export function peek<T, S extends Stack<T> = Stack<T>>(stack: S): Maybe<T> {
  return fromEmpty(stack.items).map(([first, ..._]) => first);
}

export function length<T, S extends Stack<T> = Stack<T>>(stack: S): number {
  return stack.items.length;
}
