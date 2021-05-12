interface Catamorphism<A, B> {
  Just: (value: A) => B;
  Nothing: () => B;
}

export default Catamorphism;
