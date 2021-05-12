import { expect } from 'chai';
import 'mocha';
import { pipe, pipeline } from './index';

const upper = (s: string) => s.toUpperCase();
const split = (sep: string) => (s: string) => s.split(sep);
const reverse = (ss: string[]) => ss.reverse();
const join = (ss: string[]) => ss.join('');

describe('piped functions', () => {
  it('should totally work', () => {
    const doit = pipe(
      upper,
      split(''),
      reverse,
      join
    );

    expect(doit('food')).to.equal('DOOF');
  });
});

describe('function pipeline', () => {
  it('should totally work', () => {
    const doit = pipeline(upper)
      .map(split(''))
      .map(reverse)
      .map(join).fn;

    expect(doit('food')).to.equal('DOOF');
  });
});
