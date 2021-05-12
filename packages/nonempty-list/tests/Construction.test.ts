import test from 'tape';
import { fromArray, fromValue, NonEmptyList } from '../src/index';

test('Construction from a single value', t => {
  const singleton = fromValue('foo');

  t.equal(singleton.first, 'foo');
  t.deepEqual(singleton.rest, []);

  t.end();
});

test('Construction from an array', t => {
  const singleton = fromArray([ 'foo' ]);

  singleton.cata({
    Err: msg => t.fail(`Should not be an failed array: ${msg}`),
    Ok: list => {
      t.equal(list.first, 'foo');
      t.deepEqual(list.rest, []);
    },
  });

  const many = fromArray([ 'foo', 'bar' ]);

  many.cata({
    Err: msg => t.fail(`Should not be a failed array: ${msg}`),
    Ok: list => {
      t.equal(list.first, 'foo');
      t.deepEqual(list.rest, [ 'bar' ]);
    },
  });

  const failed = fromArray([]);

  failed.cata({
    Err: msg => t.pass(`Failed to create a list: ${msg}`),
    Ok: list => t.fail(`Should not have created this list: ${JSON.stringify(list)}`),
  });

  t.end();
});

test('concat', t => {
  const numbers = new NonEmptyList(0, [ 1, 2, 3 ]);
  const moreNumbers = new NonEmptyList(4, [ 5, 6, 7 ]);
  const concatted = numbers.concat(moreNumbers);

  t.equal(concatted.first, 0);
  t.deepEqual(concatted.rest, [ 1, 2, 3, 4, 5, 6, 7 ]);

  t.deepEqual(numbers.concat([ 4, 5, 6, 7 ]).toArray(), [ 0, 1, 2, 3, 4, 5, 6, 7 ]);

  t.end();
});
