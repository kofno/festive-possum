# Piper

Functional composition in Typescript. This library is named after @kofno's cat. She is glorious.

# install

> npm install --save @kofno/piper

> yarn add @kofno/piper

## functions

### `pipe`

pipe takes in a sequence of functions which process an input parameter and return a output which
will be used as the input for the next function in the sequence. _pipe_ is copied almost
line-for-line from
[RxJS](https://github.com/ReactiveX/rxjs/blob/f8a9d6e52f6ab151d08da0e7424f64f70763c830/src/internal/util/pipe.ts).


```ts
    import { pipe } from '@kofno/piper';

    const add1 = n => n + 1;
    const double = n => n * 2;

    const doubleThenAdd1 = pipe(
      double,
      add1
    );

    doubleThenAdd1(2); // 5
```

### `pipeline`

pipeline wraps unary functions with a functor implementation so that functions can be composed using map.

```ts
      import { pipeline } from './index';

      const upper = (s: string) => s.toUpperCase();
      const split = (sep: string) => (s: string) => s.split(sep);
      const reverse = (ss: string[]) => ss.reverse();
      const join = (ss: string[]) => ss.join('');

      const doit = pipeline(upper)
        .map(split(''))
        .map(reverse)
        .map(join).fn;

      doit('food') // 'DOOF'
```

### `pick`

pick creates a function that pulls a particular value from an object which is useful for accessing objects in a functor chain.

```ts
    import { pick } from '@kofno/piper';

    const f = {
      a: 2,
      b: 'two',
      c: true,
    };

    pick('a', f) // 2
```
