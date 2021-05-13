import * as test from 'tape';
import { isNothing, just, nothing } from './../src/index';

test('Nothing.getOrElse', (t) => {
  const result = nothing<string>().getOrElse(() => 'foo');
  t.equal('foo', result, 'getOrElse returns orElse value');
  t.end();
});

test('Nothing.map', (t) => {
  nothing<string>().map((_) => t.fail("map shouldn't run"));
  t.end();
});

test('Nothing.and', (t) => {
  nothing<string>().and((_) => t.fail("map shouldn't run"));
  t.end();
});

test('Nothing.andThen', (t) => {
  nothing<string>().andThen((_) => just(t.fail('andThen should not run')));
  t.end();
});

test('Nothing.cata', (t) => {
  nothing<string>().cata({
    Just: (_) => t.fail('Just branch should never run'),
    Nothing: () => t.pass('Nothing branch executed as expected'),
  });
  t.end();
});

test('isNothing', (t) => {
  t.assert(isNothing(nothing<string>()), 'Expected isNothing to be true');
  t.end();
});

test('Nothing.assign', (t) => {
  const assigned = nothing().assign('x', just('foo'));
  t.assert(isNothing(assigned));
  t.end();
});

test('Nothing.do', (t) => {
  nothing()
    .do((x) => t.fail(`'do' should not run on nothing: ${JSON.stringify(x)}`))
    .cata({
      Just: (x) => t.fail(`Should not have a value: ${JSON.stringify(x)}`),
      Nothing: () => t.pass('Nothing, as expected'),
    });

  t.end();
});

test('Nothing.elseDo', (t) => {
  nothing()
    .elseDo(() => t.pass('elseDo happened'))
    .cata({
      Just: (x) => t.fail(`Should not have a value: ${JSON.stringify(x)}`),
      Nothing: () => t.pass('Nothing, as expected'),
    });

  t.end();
});
