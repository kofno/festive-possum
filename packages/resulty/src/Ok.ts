import Catamorphism from './Catamorphism';
import Result from './Result';

class Ok<E, A> extends Result<E, A> {
  constructor(private value: A) {
    super();
  }

  public getOrElse(fn: () => A): A {
    return this.value;
  }

  public getOrElseValue(_: A): A {
    return this.value;
  }

  public map<B>(fn: (a: A) => B): Result<E, B> {
    return new Ok(fn(this.value));
  }

  public mapError<X>(fn: (e: E) => X): Result<X, A> {
    return new Ok<X, A>(this.value);
  }

  public andThen<B>(fn: (a: A) => Result<E, B>): Result<E, B> {
    return fn(this.value);
  }

  public orElse(fn: (_: any) => Result<any, A>): Result<any, A> {
    return this as Result<any, A>;
  }

  public cata<B>(matcher: Catamorphism<E, A, B>): B {
    return matcher.Ok(this.value);
  }

  public assign<K extends string, B>(
    k: K,
    other: Result<E, B> | ((a: A) => Result<E, B>)
  ): Result<E, A & { [k in K]: B }> {
    const result = other instanceof Result ? other : other(this.value);
    return result.map<A & { [k in K]: B }>(b => ({
      ...Object(this.value),
      [k.toString()]: b,
    }));
  }

  public do(fn: (a: A) => void): Result<E, A> {
    fn(this.value);
    return new Ok<E, A>(this.value);
  }

  public elseDo(fn: (err: E) => void): Result<E, A> {
    return this;
  }
}

/**
 * A convenience function for create a new Ok.
 */
const ok = <E, T>(v: T): Result<E, T> => new Ok(v);

export default Ok;
export { ok };
