import { expect } from 'chai';
import 'mocha';
import { pick, pipe, pipeline } from './index';

const upper = (s: string) => s.toUpperCase();
const split = (sep: string) => (s: string) => s.split(sep);
const reverse = (ss: string[]) => ss.reverse();
const join = (ss: string[]) => ss.join('');

interface F {
  a: number;
  b: string;
  c: boolean;
}

describe('piped functions', () => {
  it('should totally work', () => {
    const doit = pipe(upper, split(''), reverse, join);

    expect(doit('food')).to.equal('DOOF');
  });
});

describe('function pipeline', () => {
  it('should totally work', () => {
    const doit = pipeline(upper).map(split('')).map(reverse).map(join).fn;

    expect(doit('food')).to.equal('DOOF');
  });
});

describe('function pick', () => {
  it('should pick a value by key', () => {
    const f: F = {
      a: 2,
      b: 'two',
      c: true,
    };
    expect(pick('a', f)).to.equal(2);
    expect(pick<'b', string>('b')(f)).to.equal('two');
    expect(pick<'a', number>('a')(f)).to.equal(2);

    expect([f].map<number>(pick('a'))).to.deep.equal([2]);
  });
});
