export interface MissingEnvironmentVar<T extends string> {
  kind: 'missing-environment-var';
  key: T;
}

export const missingEnvironmentVar = <T extends string>(key: T): MissingEnvironmentVar<T> => ({
  kind: 'missing-environment-var',
  key,
});
