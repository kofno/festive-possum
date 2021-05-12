import { just, Maybe, nothing } from 'maybeasy';

export function readVarM<T extends string = string>(key: T): Maybe<string> {
  const value = process.env[key as string];
  return typeof value === 'undefined' ? nothing() : just(value);
}
