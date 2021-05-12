import * as test from 'tape';
import { ok } from './../src/index';

test('Ok.getOrElse', t => {
  const result = ok<string, string>('foo');
  t.equal(
    'foo',
    result.getOrElse(() => 'bar')
  );
  t.end();
});

test('OK.map', t => {
  const result = ok<string, string>('foo');
  t.equal(
    'FOO',
    result.map(s => s.toUpperCase()).getOrElse(() => '')
  );
  t.end();
});

test('OK.andThen', t => {
  const result = ok<string, string>('foo').andThen(v => ok(v.toUpperCase()));
  t.equal('FOO', result.getOrElseValue(''));
  t.end();
});

test('OK.orElse', t => {
  const result = ok<string, string>('foo').orElse(err => ok(err));
  t.equal('foo', result.getOrElseValue(''));
  t.end();
});

test('Ok.cata', t => {
  const result = ok('foo').cata({
    Err: err => err,
    Ok: v => v,
  });
  t.equals('foo', result);
  t.end();
});

test('Ok.mapError', t => {
  ok<string, string>('foo')
    .mapError(m => m.toUpperCase())
    .cata({
      Err: err => t.fail('should have passed'),
      Ok: v => t.pass('Worked!'),
    });

  t.end();
});

test('Ok.assign', t => {
  ok({})
    .assign('x', ok(42))
    .assign('y', v => ok(String(v.x + 8)))
    .cata({
      Err: m => t.fail(`Should have succeeded: ${m}`),
      Ok: v => t.deepEqual(v, { x: 42, y: '50' }),
    });
  t.end();
});

test('Ok.do', t => {
  ok({})
    .assign('x', ok(42))
    .do(scope => t.pass(`'do' should run: ${JSON.stringify(scope)}`))
    .cata({
      Err: m => t.fail(`Should have succeeded: ${m}`),
      Ok: v => t.deepEqual(v, { x: 42 }),
    });

  t.end();
});

test('Ok.elseDo', t => {
  ok({ x: 42 })
    .elseDo(err => t.fail(`Error side effect should not run: ${err}`))
    .cata({
      Err: m => t.fail(`Should have succeeded: ${m}`),
      Ok: v => t.deepEqual(v, { x: 42 }),
    });

  t.end();
});
