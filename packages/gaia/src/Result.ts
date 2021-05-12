import { err, ok, Result } from 'resulty';
import { readVarM } from './Maybe';
import { MissingEnvironmentVar, missingEnvironmentVar } from './Types';

export function readVarR<T extends string = string>(
  key: T
): Result<MissingEnvironmentVar<T>, string> {
  return readVarM(key).cata({
    Just: ok,
    Nothing: () => err(missingEnvironmentVar(key)),
  }) as Result<MissingEnvironmentVar<T>, string>;
}
