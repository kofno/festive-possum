import Catamorphism from './Catamorphism';

/**
 * Maybe describes a value that is optional. It is safer to use then null and
 * undefined.
 */
abstract class Maybe<A> {
  /**
   * Returns the maybe value if it is nonempty. Otherwise returns the result
   * of evaluating fn.
   */
  public abstract getOrElse(fn: () => A): A;

  /**
   * Returns the maybe value if it is nonempty. Otherwise returns the
   * defaultValue.
   */
  public abstract getOrElseValue(defaultValue: A): A;

  /**
   * If there's a value, apply the function and return a new Maybe. Mapping
   * over Nothing returns Nothing.
   */
  public abstract map<B>(fn: (a: A) => B): Maybe<B>;

  /**
   * Chain Maybe computations together. If any computation returns a Nothing,
   * then Nothing is the result of the computation.
   */
  public abstract andThen<B>(fn: (a: A) => Maybe<B>): Maybe<B>;

  /**
   * Like a boolean OR. Returns the dereferenced Maybe if it is `Just`. Otherwise
   * it returns the Maybe from the evaluated function.
   */
  public abstract orElse(fn: () => Maybe<A>): Maybe<A>;

  /**
   * Folds over types; a switch/case for Just<A>/Nothing.
   */
  public abstract cata<B>(matcher: Catamorphism<A, B>): B;

  /**
   * Encapsulates a common pattern of needing to build up an Object from
   * a series of Maybe values. This is often solved by nesting `andThen` calls
   * and then completing the chain with a call to `success`.
   *
   * This feature was inspired (and the code lifted from) this article:
   * https://medium.com/@dhruvrajvanshi/simulating-haskells-do-notation-in-typescript-e48a9501751c
   *
   * Wrapped values are converted to an Object using the Object constructor
   * before assigning. Primitives won't fail at runtime, but results may
   * be unexpected.
   */
  public abstract assign<K extends string, B>(
    k: K,
    other: Maybe<B> | ((a: A) => Maybe<B>)
  ): Maybe<A & { [k in K]: B }>;

  /**
   * Inject a side-effectual operation into a chain of maybe operations.
   *
   * The primary use case for `do` is to perform logging in the middle of a flow
   * of Maybe computations.
   *
   * The side effect only runs when there is a value (Just).
   *
   * The value will (should) remain unchanged during the `do` operation.
   *
   *    just({})
   *      .assign('foo', just(42))
   *      .assign('bar', just('hello'))
   *      .do(scope => console.log('Scope: ', JSON.stringify(scope)))
   *      .map(doSomethingElse)
   *
   */
  public abstract do(fn: (a: A) => void): Maybe<A>;

  /**
   * Inject a side-effectual operation into a chain of maybe operations.
   *
   * The side effect only runs when there is not a value (Nothing).
   *
   * Otherwise, `elseDo` passes the Nothing state along the call chain.
   *
   *    nothing()
   *      .elseDo(() => console.log("There is nothing here"));
   *
   */
  public abstract elseDo(fn: () => void): Maybe<A>;
}

export default Maybe;
