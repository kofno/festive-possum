import { fromNullable, just, Maybe, nothing } from 'maybeasy';

export interface PopResult<T> {
  stack: Stack<T>;
  top: T;
}

export class Stack<T> {
  constructor(private top: Maybe<T>, private rest: T[]) {}

  push = (value: T): Stack<T> =>
    this.top.cata({
      Just: oldTop => new Stack(just(value), [oldTop].concat(this.rest)),
      Nothing: () => new Stack(just(value), []),
    });

  pop = (): Maybe<PopResult<T>> =>
    just({})
      .assign('top', this.top)
      .assign('stack', () => just(fromArray(this.rest)));

  get peek(): Maybe<T> {
    return this.top;
  }

  get length(): number {
    return this.top.map(() => 1 + this.rest.length).getOrElseValue(0);
  }
}

export function fromArray<T>(ts: T[]): Stack<T> {
  const [top, ...rest] = ts;
  return new Stack(fromNullable(top), rest);
}

export function newStack<T>(): Stack<T> {
  return new Stack<T>(nothing(), []);
}
