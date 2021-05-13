import * as test from 'tape';
import { isJust, just } from './../src/index';

test('Just.getOrElse', (t) => {
  const result = just('foo');
  t.equal(
    'foo',
    result.getOrElse(() => 'bar'),
    'Returns the Just value'
  );
  t.end();
});

test('Just.map', (t) => {
  just('foo').map((s) => t.equals('foo', s, 'map fn gets value'));
  t.end();
});

test('Just.and', (t) => {
  just('foo').and((s) => t.equals('foo', s, 'and fn gets value'));
  t.end();
});

test('Just.andThen', (t) => {
  just('foo').andThen((v) => just(t.pass('andThen runs')));
  t.end();
});

test('Just.cata', (t) => {
  just('foo').cata({
    Just: (v) => t.pass('Just matcher ran as expected.'),
    Nothing: () => t.fail('Nothing matcher should not run'),
  });
  t.end();
});

test('isJust', (t) => {
  t.assert(isJust(just('foo')), 'Expect isJust to be true');
  t.end();
});

test('Just.assign', (t) => {
  just({})
    .assign('x', just(42))
    .assign('y', just('a thing'))
    .map((v) => t.deepEqual(v, { x: 42, y: 'a thing' }));

  just(2)
    .assign('x', just(42))
    .map((v) => t.equal(v.x, 42));

  t.end();
});

test('Just.do', (t) => {
  just({})
    .assign('foo', just(42))
    .assign('bar', just('hello'))
    .do((scope) => t.deepEqual({ foo: 42, bar: 'hello' }, scope))
    .cata({
      Just: (v) => t.pass(`All is well! ${JSON.stringify(v)}`),
      Nothing: () => t.fail('Should not be Nothing'),
    });

  t.end();
});

test('Just.elseDo', (t) => {
  just('foo')
    .elseDo(() => t.fail(`'elseDo' should not run on just`))
    .cata({
      Just: (x) => t.pass(`All is well: ${JSON.stringify(x)}`),
      Nothing: () => t.fail('Should have a value'),
    });

  t.end();
});
