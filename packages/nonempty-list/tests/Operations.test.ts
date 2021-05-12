import test from 'tape';
import { NonEmptyList } from '../src';

const isOdd = (n: number) => n % 2 === 1;

test('map', t => {
  const numbers = new NonEmptyList(0, [ 1, 2, 3 ]);
  const doubled = numbers.map(n => n * 2);

  t.equal(doubled.first, 0);
  t.deepEqual(doubled.rest, [ 2, 4, 6 ]);

  t.end();
});

test('reduce (using sum)', t => {
  const numbers = new NonEmptyList(0, [ 1, 2, 3 ]);

  const sum = numbers.reduce<number>((v, n) => (v || 0) + n, 0);

  t.equal(sum, 6);

  t.end();
});

test('filter', t => {
  const numbers = new NonEmptyList(0, [ 1, 2, 3, 4 ]);

  const filtered = numbers.filter(isOdd);

  t.deepEqual([ 1, 3 ], filtered);

  t.end();
});

test('sort', t => {
  const numbers = new NonEmptyList(3, [ 0, 4, 5, 1, 2 ]);
  const sorted = numbers.sort();

  t.equals(sorted.first, 0);
  t.deepEqual(sorted.rest, [ 1, 2, 3, 4, 5 ]);

  t.end();
});

test('some and every', t => {
  const evens = new NonEmptyList(2, [ 4, 6, 8 ]);
  const odds = new NonEmptyList(1, [ 3, 5, 7 ]);
  const mixed = new NonEmptyList(1, [ 2, 3, 5, 7 ]);

  t.assert(!evens.every(isOdd));
  t.assert(odds.every(isOdd));
  t.assert(!mixed.every(isOdd));

  t.assert(!evens.some(isOdd));
  t.assert(odds.some(isOdd));
  t.assert(mixed.some(isOdd));

  t.end();
});

test('take and drop', t => {
  const numbers = new NonEmptyList(0, [ 1, 2, 3 ]);

  t.deepEqual(numbers.take(2), [ 0, 1 ]);
  t.deepEqual(numbers.drop(2), [ 2, 3 ]);

  t.end();
});

test('includes', t => {
  const numbers = new NonEmptyList(0, [ 1, 2, 3 ]);

  t.assert(numbers.includes(0), 'zero should be in the list');
  t.assert(numbers.includes(2), '2 should be in the list');
  t.isNot(numbers.includes(5), '5 should NOT be in the list');

  t.end();
});

test('reverse', t => {
  const numbers = new NonEmptyList(0, [ 1, 2, 3 ]);
  const reversed = numbers.reverse();

  t.equal(reversed.first, 3);
  t.deepEqual(reversed.rest, [ 2, 1, 0 ]);

  t.end();
});

test('find', t => {
  const numbers = new NonEmptyList(1, [ 2, 3, 4, 5 ]);

  numbers.find(isOdd).cata({
    Nothing: () => t.fail('Should have found an odd number'),
    Just: v => t.equals(v, 1),
  });

  numbers.find(n => n === 4).cata({
    Nothing: () => t.fail('Should have found the number 4'),
    Just: v => t.equals(v, 4),
  });

  numbers.find(n => n === 100).cata({
    Nothing: () => t.pass('Should NOT have found the number 100'),
    Just: v => t.fail(`Should not have found the number 100: ${v}`),
  });

  t.end();
});
