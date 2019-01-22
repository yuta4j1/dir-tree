import { flattenDoubleArray } from '../src/ts/helper';

test('function flattenDoubleArray [[1, 2], [3, 4], [5, 6]] to [1, 2, 3, 4, 5, 6]', () => {
  expect(flattenDoubleArray<number>([[1, 2], [3, 4], [5, 6]])).toEqual(
    expect.arrayContaining([1, 2, 3, 4, 5, 6])
  );
});
