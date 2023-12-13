export type UnaryFunction<T, R> = (t: T) => R;

export function noop() {}

export function identity<A>(a: A): A {
  return a;
}

export function always<A>(a: A): (x?: unknown) => A {
  return (_) => a;
}

export function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${x}`);
}

export function pipe<T>(): UnaryFunction<T, T>;
export function pipe<T, A>(fn1: UnaryFunction<T, A>): UnaryFunction<T, A>;
export function pipe<T, A, B>(
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>
): UnaryFunction<T, B>;
export function pipe<T, A, B, C>(
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>,
  fn3: UnaryFunction<B, C>
): UnaryFunction<T, C>;
export function pipe<T, A, B, C, D>(
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>,
  fn3: UnaryFunction<B, C>,
  fn4: UnaryFunction<C, D>
): UnaryFunction<T, D>;
export function pipe<T, A, B, C, D, E>(
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>,
  fn3: UnaryFunction<B, C>,
  fn4: UnaryFunction<C, D>,
  fn5: UnaryFunction<D, E>
): UnaryFunction<T, E>;
export function pipe<T, A, B, C, D, E, F>(
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>,
  fn3: UnaryFunction<B, C>,
  fn4: UnaryFunction<C, D>,
  fn5: UnaryFunction<D, E>,
  fn6: UnaryFunction<E, F>
): UnaryFunction<T, F>;
export function pipe<T, A, B, C, D, E, F, G>(
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>,
  fn3: UnaryFunction<B, C>,
  fn4: UnaryFunction<C, D>,
  fn5: UnaryFunction<D, E>,
  fn6: UnaryFunction<E, F>,
  fn7: UnaryFunction<F, G>
): UnaryFunction<T, G>;
export function pipe<T, A, B, C, D, E, F, G, H>(
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>,
  fn3: UnaryFunction<B, C>,
  fn4: UnaryFunction<C, D>,
  fn5: UnaryFunction<D, E>,
  fn6: UnaryFunction<E, F>,
  fn7: UnaryFunction<F, G>,
  fn8: UnaryFunction<G, H>
): UnaryFunction<T, H>;
export function pipe<T, R>(...fns: UnaryFunction<T, R>[]): UnaryFunction<T, R> {
  if (!fns) {
    return identity as UnaryFunction<T, R>;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  return (t: T): R => {
    // deno-lint-ignore no-explicit-any
    return fns.reduce((prev, fn) => fn(prev), t as any);
  };
}

export class Pipeline<A, B> {
  constructor(public fn: UnaryFunction<A, B>) {}

  public map<C>(callback: UnaryFunction<B, C>): Pipeline<A, C> {
    return new Pipeline((a: A) => {
      const internalValue = this.fn(a);
      return callback(internalValue);
    });
  }
}

export function pipeline<A, B>(fn: UnaryFunction<A, B>): Pipeline<A, B> {
  return new Pipeline(fn);
}

export function pick<Type, K extends keyof Type>(key: K, obj: Type): Type[K];
export function pick<Type, K extends keyof Type>(key: K): (obj: Type) => Type[K];
export function pick<T>(key: keyof T, obj?: T) {
  const doit = (obj: T) => obj[key];

  return typeof obj === 'undefined' ? doit : doit(obj);
}
