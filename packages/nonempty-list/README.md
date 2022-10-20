# NonEmpty List

An immutable data structure that acts like a list but guarantees that the list always has at least 
one item.

## Constructor

Because a `NonEmptyList<T>` guarantees the presence of at least one `T`, the constructor requires
a `T` object.

```typescript
const strings = new NonEmptyList('hello', ['world'])
const numbers = new NonEmptyList(1, [2, 3, 4])
```

## Other Construction Functions

### `fromValue`

Create a `NonEmptyList<T>` from a single `T`.

```typescript
const numbers = fromValue(1); // Equivalent to new NonEmptyList(1, [])
```

### `fromArray`

Create a `NonEmptyList<T>` from an `Array<T>`, returning a [`Result<string, NonEmptyList<T>>`]. If 
the array is empty return an error result, otherwise return a new non-empty list in an okay result.

Useful when the array is not known statically.

```typescript
const someArrayOfNumbers: Array<number> = calculateOrFetchTheArray();
const numbers: Result<string, NonEmptyList<number>> = fromArray(someArrayOfNumbers)
```

[`Result<string, NonEmptyList<T>>`]: https://github.com/kofno/festive-possum/tree/main/packages/resulty

### `fromArrayMaybe`

Similar to `fromArray`, but return a [`Maybe<NonEmptyList<T>>`]. Useful when the array is not known
statically.

```typescript
const someArrayOfNumbers: Array<number> = calculateOrFetchTheArray();
const numbers: Maybe<NonEmptyList<number>> = fromArrayMaybe(someArrayOfNumbers)
```

[`Maybe<NonEmptyList<T>>`]: https://github.com/kofno/festive-possum/tree/main/packages/maybeasy

## Attributes

### `first`

The first element in the list, guaranteed to exist.

```typescript
const numbers = new NonEmptyList(1, [2, 3, 4])
numbers.first // 1
```

### `rest`

An array of the rest of the elements in the list. May be empty.

```typescript
const numbers = new NonEmptyList(1, [2, 3, 4])
numbers.rest // [2, 3, 4]

const strings = new NonEmptyList('hello world', [])
strings.rest // []
```

### `length`

The number of elements in the list.

```typescript
const numbers = new NonEmptyList(1, [2, 3, 4])
numbers.length // 4
```

## Methods

### `reverse`

Returns a new `NonEmptyList` with the items reversed.

```typescript
const numbers = new NonEmptyList(1, [2, 3, 4])
const reversed = numbers.reverse()
numbers.first // 1
reversed.first // 4
```

### `includes`

Indicate whether the list includes some value.

```typescript
const numbers = new NonEmptyList(1, [2, 3, 4])
numbers.includes(2) // true
numbers.includes(8) // false
```

### `take`

Return an array of the first `count` elements.

```typescript
const numbers = new NonEmptyList(1, [2, 3, 4])
numbers.take(2) // [1, 2]
```

### `drop`

Return an array after dropping the first `count` elements.

```typescript
const numbers = new NonEmptyList(1, [2, 3, 4])
numbers.drop(2) // [3, 4]
```

### `concat`

Takes either an `Array` or another `NonEmptyList`, and returns a new `NonEmptyList` with the current
and given lists concatenated.


```typescript
const firstTwo = new NonEmptyList(1, [2])
const numbers = firstTwo.concat([3, 4])
numbers.first // 1
numbers.rest // [2, 3, 4]
```

### `every`

Similar to [`Array.prototype.every()`]: for some predicate, does every element in the list return
`true`?

```typescript
const numbers = new NonEmptyList(1, [2, 3, 4])
numbers.every(n => n < 5) // true
numbers.every(n => n < 4) // false
```

[`Array.prototype.every()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every

### `some`

Similar to [`Array.prototype.some()`]: for some predicate, does some element in the list return 
`true`?

```typescript
const numbers = new NonEmptyList(1, [2, 3, 4])
numbers.some(n => n < 4) // true
numbers.some(n => n > 4) // false
```

[`Array.prototype.some()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some

### `find`

Attempt to find an element where the given predicate returns `true`. Return [`Maybe<T>`].

```typescript
const numbers = new NonEmptyList(1, [2, 3, 4])
numbers.find(n => n < 4) // just(1)
numbers.find(n => n > 4) // nothing()
```

[`Maybe<T>`]: https://github.com/kofno/festive-possum/tree/main/packages/maybeasy

### `map`

Similar to [`Array.prototype.map()`]: create a new `NonEmptyList` by evaluating the callback for
every item in the current list.

```typescript
const numbers = new NonEmptyList(1, [2, 3, 4])
const mapped = numbers.map(n => n * 2).map(String)
mapped.first // "2"
mapped.rest // ["4", "6", "8"]
```

[`Array.prototype.map()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map

### `and`

Alias of [`map`](#map).

### `andThen`

Similar to [`Array.prototype.flatMap()`]. Given a callback that returns a new `NonEmptyList<U>` when
evaluated on an item `T`, return the result of mapping over the current list, and then flattening
all the new lists into a single `NonEmptyList<U>`.

```typescript
const numbers = new NonEmptyList(1, [2, 3, 4])
const createPair = (n: number) => new NonEmptyList(n, [n])
const pairs = numbers.andThen(createPair)
pairs.first // 1
pairs.rest // [1, 2, 2, 3, 3, 4, 4]
```

[`Array.prototype.flatMap()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap

### `reduce`

Similar to [`Array.prototype.reduce()`]: "reduce" the array of values into a single value.

```typescript
const numbers = new NonEmptyList(1, [2, 3, 4])
numbers.reduce((sum, n) => sum + n) // 10
```

[`Array.prototype.reduce()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce

### `filter`

Similar to [`Array.prototype.filter()`]: return an `Array` of values for which some predicate
returns `true`.

```typescript
const numbers = new NonEmptyList(1, [2, 3, 4])
numbers.filter(n => n % 2 === 0) // [2, 4]
```

[`Array.prototype.filter()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter

### `sort`

Returns a new `NonEmptyList` with the items sorted using [`Array.prototype.sort()`].

```typescript
const scrambled = new NonEmptyList(3, [1, 4, 2])
const sorted = numbers.sort()
scrambled.first // 3
sorted.first // 1
```

[`Array.prototype.sort()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

### `join`

Equivalent to [`Array.prototype.join()`].

```typescript
const numbers = new NonEmptyList(1, [2, 3, 4])
numbers.join(', ') // "1, 2, 3, 4"
```

[`Array.prototype.join()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join

### `toArray`

Return an `Array` of the elements in the list.

```typescript
const numbers = new NonEmptyList(1, [2, 3, 4])
numbers.toArray() // [1, 2, 3, 4]
```
