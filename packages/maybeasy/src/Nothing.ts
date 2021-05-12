import Catamorphism from './Catamorphism';
import Maybe from './Maybe';

export class Nothing<A> extends Maybe<A> {
  public getOrElse(fn: () => A) {
    return fn();
  }

  public getOrElseValue(defaultValue: A) {
    return defaultValue;
  }

  public map<B>(fn: (a: A) => B): Maybe<B> {
    return new Nothing<B>();
  }

  public andThen<B>(fn: (a: A) => Maybe<B>): Maybe<B> {
    return new Nothing<B>();
  }

  public orElse(fn: () => Maybe<A>): Maybe<A> {
    return fn();
  }

  public cata<B>(matcher: Catamorphism<any, B>): B {
    return matcher.Nothing();
  }

  public assign<K extends string, B>(
    k: K,
    other: Maybe<B> | ((a: A) => Maybe<B>)
  ): Maybe<A & { [k in K]: B }> {
    return new Nothing<A & { [k in K]: B }>();
  }

  public do(fn: (a: A) => void): Maybe<A> {
    return new Nothing<A>();
  }

  public elseDo(fn: () => void): Maybe<A> {
    fn();
    return this;
  }
}

export const nothing = <A>(): Maybe<A> => new Nothing<A>();

export default Nothing;
