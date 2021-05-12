import Catamorphism from './Catamorphism';

/**
 * A Result represents a computation that may succeed or fail. Ok<T> represents
 * a successful computation, while Err<E> represents a failure.
 */
abstract class Result<E, A> {
  /**
   * Returns the value from a successful result. For an error, returns the
   * result of evaluating the fn
   */
  public abstract getOrElse(fn: () => A): A;

  /**
   * Returns the value from a successful result. Returns the defaultValue if
   * the result was a failure.
   */
  public abstract getOrElseValue(defaultValue: A): A;

  /**
   * Returns a new result after applying fn to the value stored in a successful
   * result. If the result was a failure, then the Err result is simply
   * returned.
   */
  public abstract map<B>(fn: (_: A) => B): Result<E, B>;

  /**
   * Returns a new result after applying fn to the error value. successful
   * results are returned unchanged.
   */
  public abstract mapError<X>(fn: (_: E) => X): Result<X, A>;

  /**
   * Chains together two computations that return results. If the result is a
   * success, then the second computation is run. Otherwise, the Err is
   * returned.
   */
  public abstract andThen<B>(fn: (_: A) => Result<E, B>): Result<E, B>;

  /**
   * Runs an alternative computation in the case that the first computation
   * resulted in an Err.
   */
  public abstract orElse<X>(fn: (_: E) => Result<X, A>): Result<X, A>;

  /**
   * Folds over types; a switch/case for success or failure.
   */
  public abstract cata<B>(matcher: Catamorphism<E, A, B>): B;

  /**
   * Encapsulates a common pattern of needing to build up an Object from
   * a series of Result values. This is often solved by nesting `andThen` calls
   * and then completing the chain with a call to `ok`.
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
    other: Result<E, B> | ((a: A) => Result<E, B>)
  ): Result<E, A & { [k in K]: B }>;

  /**
   * Inject a side-effectual operation into a chain of Result computations.
   *
   * The primary use case for `do` is to perform logging in the middle of a flow
   * of Results.
   *
   * The side effect only runs when there isn't an error (Ok).
   *
   * The value will (should) remain unchanged during the `do` operation.
   *
   *    ok({})
   *      .assign('foo', ok(42))
   *      .assign('bar', ok('hello'))
   *      .do(scope => console.log('Scope: ', JSON.stringify(scope)))
   *      .map(doSomethingElse)
   *
   */
  public abstract do(fn: (a: A) => void): Result<E, A>;

  /**
   * Inject a side-effectual operation into a chain of Result computations.
   *
   * The side effect only runs when there is an error (Err).
   *
   * The value will remain unchanged during the `elseDo` operation.
   *
   *    ok({})
   *      .assign('foo', ok(42))
   *      .assign('bar', ok('hello'))
   *      .do(scope => console.log('Scope: ', JSON.stringify(scope)))
   *      .map(doSomethingElse)
   *
   */
  public abstract elseDo(fn: (err: E) => void): Result<E, A>;
}

export default Result;
