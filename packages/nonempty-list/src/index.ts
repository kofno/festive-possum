import { just, Maybe, nothing } from 'maybeasy';
import { err, ok, Result } from 'resulty';
import { find } from './Helpers';

export class NonEmptyList<T> implements Iterable<T> {
  readonly first: T;
  readonly rest: ReadonlyArray<T>;

  constructor(first: T, rest: T[]) {
    this.first = first;
    this.rest = rest;
  }

  public reverse = () => {
    const reverseRest = this.rest.slice().reverse();
    const [newFirst, ...newRest] = reverseRest.concat([this.first]);
    return new NonEmptyList(newFirst, newRest);
  };

  public includes = (value: T): boolean => this.first === value || this.rest.indexOf(value) >= 0;

  public take = (count: number): T[] => this.toArray().slice(0, count);

  public drop = (count: number): T[] => this.toArray().slice(count);

  public concat = (values: T[] | NonEmptyList<T>): NonEmptyList<T> =>
    values instanceof NonEmptyList
      ? new NonEmptyList(this.first, this.rest.concat(values.toArray()))
      : new NonEmptyList(this.first, this.rest.concat(values));

  public every = (fn: (t: T) => boolean): boolean => fn(this.first) && this.rest.every(fn);

  public some = (fn: (t: T) => boolean): boolean => fn(this.first) || this.rest.some(fn);

  public find = (fn: (t: T) => boolean): Maybe<T> => {
    if (fn(this.first)) {
      return just(this.first);
    }

    return find(fn, this.rest);
  };

  public map = <S>(fn: (t: T) => S): NonEmptyList<S> =>
    new NonEmptyList(fn(this.first), this.rest.map(fn));

  /**
   * An alias for `map`
   */
  public and = this.map;

  public reduce<S>(fn: (accum: S, t: T) => S, start: S): S;
  public reduce(fn: (accum: T, t: T) => T): T;
  public reduce<S>(fn: (accum: S | undefined, t: T) => S, start?: S) {
    return this.toArray().reduce(fn, start);
  }

  public filter = (fn: (t: T) => boolean): T[] => this.toArray().filter(fn);

  public sort = () => {
    const [first, ...rest] = this.toArray().sort();
    return new NonEmptyList(first, rest);
  };

  public toArray = (): T[] => [this.first, ...this.rest];

  public get length(): number {
    return this.rest.length + 1;
  }

  public *[Symbol.iterator]() {
    yield this.first;
    for (let value of this.rest) {
      yield value;
    }
  }
}

export const fromValue = <T>(value: T): NonEmptyList<T> => new NonEmptyList(value, []);

export const fromArray = <T>(values: ReadonlyArray<T>): Result<string, NonEmptyList<T>> => {
  if (values.length === 0) {
    return err('Cannot build a non-empty list from an empty array');
  }

  const [first, ...rest] = values;
  const list = new NonEmptyList(first, rest);
  return ok(list);
};

export const fromArrayMaybe = <T>(values: ReadonlyArray<T>): Maybe<NonEmptyList<T>> =>
  fromArray(values).cata({
    Err: () => nothing<NonEmptyList<T>>(),
    Ok: (l) => just(l),
  });
