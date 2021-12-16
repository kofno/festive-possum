import Catamorphism from './Catamorphism';
import Err, { err } from './Err';
import Ok, { ok } from './Ok';
import Result from './Result';

type Nullable = null | undefined;
type Emptyable = { length: number };

/**
 * Converts a value that _may_ be null or undefined to a result.
 * If the value is null or undefined, then the errorCase is returned.
 * If the value is anything else, it is returned wrapped in an Ok.
 */
const fromNullable = <Err, T>(errorCase: Err, x: T | Nullable): Result<Err, T> =>
  x ? ok(x) : err(errorCase);

/**
 * Converts a value that _may_ be empty, such as a string or an array, to a
 * result. It will accept anything that responds to length.
 * If the value is has a length of 0, then the errorCase is returned.
 * If the value is anything else, it is returned wrapped in an Ok.
 */
const fromEmpy = <Err, T extends Emptyable>(errorCase: Err, xs: T): Result<Err, T> =>
  xs.length === 0 ? err(errorCase) : ok(xs);

export { Catamorphism, Err, err, Ok, ok, Result, fromNullable, fromEmpy };
