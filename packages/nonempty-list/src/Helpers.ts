import { just, Maybe, nothing } from 'maybeasy';

type TesterFn<T> = (t: T) => boolean;

export const find = <T>(fn: TesterFn<T>, ts: ReadonlyArray<T>): Maybe<T> => {
  for (const t of ts) {
    if (fn(t)) {
      return just(t);
    }
  }
  return nothing<T>();
};
