import { fromEmpty, Maybe } from 'maybeasy';
import { emptyStack, push, Stack } from '../Stack';

export type Queue<T> = Stack<T>;

export function emptyQueue<T>(): Queue<T> {
  return {
    ...emptyStack,
  } as Queue<T>;
}

export const queue = push;

export function dequeue<T, S extends Queue<T> = Queue<T>>(stack: S): Maybe<[S, T]> {
  return fromEmpty(stack.items).map(items => {
    const [next] = items.slice(-1);
    const rest = items.slice(0, -1);
    return [{ ...stack, items: rest }, next];
  });
}
