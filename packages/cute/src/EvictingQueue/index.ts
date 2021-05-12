import { emptyEvictingStack, EvictingStack } from '../EvictingStack';

export type EvictingQueue<T> = EvictingStack<T>;

export function emptyEvictingQueue<T>(capacity: number): EvictingQueue<T> {
  return {
    ...emptyEvictingStack(capacity),
  };
}

export function queueWithEviction<T>(queue: EvictingQueue<T>, item?: T) {
  const doit = (item: T) => ({ ...queue, items: [item, ...queue.items].slice(0, queue.capacity) });
  return typeof item === 'undefined' ? doit : doit(item);
}
