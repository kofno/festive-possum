import Catamorphism from './Catamorphism';
import Maybe from './Maybe';

export class Just<A> extends Maybe<A> {
  constructor(private value: A) {
    super();
  }

  public getOrElse(fn: () => A) {
    return this.value;
  }

  public getOrElseValue(defaultValue: A) {
    return this.value;
  }

  public map<B>(fn: (a: A) => B): Maybe<B> {
    return new Just(fn(this.value));
  }

  public andThen<B>(fn: (a: A) => Maybe<B>): Maybe<B> {
    return fn(this.value);
  }

  public orElse(fn: () => Maybe<A>): Maybe<A> {
    return this;
  }

  public cata<B>(matcher: Catamorphism<A, B>): B {
    return matcher.Just(this.value);
  }

  public assign<K extends string, B>(
    k: K,
    other: Maybe<B> | ((a: A) => Maybe<B>)
  ): Maybe<A & { [k in K]: B }> {
    const maybe = other instanceof Maybe ? other : other(this.value);
    return maybe.map<A & { [k in K]: B }>(b => ({
      ...Object(this.value),
      [k.toString()]: b
    }));
  }

  public do(fn: (a: A) => void): Maybe<A> {
    fn(this.value);
    return new Just<A>(this.value);
  }

  public elseDo(fn: () => void): Maybe<A> {
    return this;
  }

  public isJust(): boolean {
    return true;
  }

  public isNothing(): boolean {
    return false;
  }
}

export const just = <A>(value: A): Maybe<A> => new Just<A>(value);

export default Just;
