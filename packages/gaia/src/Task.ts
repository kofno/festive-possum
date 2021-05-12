import Task from 'taskarian';
import { readVarR } from './Result';
import { MissingEnvironmentVar } from './Types';

export function readVarT<T extends string = string>(
  key: T
): Task<MissingEnvironmentVar<T>, string> {
  return new Task((reject, resolve) => {
    readVarR(key).cata({
      Ok: resolve,
      Err: reject,
    });
    return () => {};
  });
}
