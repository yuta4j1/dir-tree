import { flattenDoubleArray, sortNode } from '../src/ts/helper';
import { DirNode } from '../src/ts/types';

test('function flattenDoubleArray [[1, 2], [3, 4], [5, 6]] to [1, 2, 3, 4, 5, 6]', () => {
  expect(flattenDoubleArray<number>([[1, 2], [3, 4], [5, 6]])).toEqual(
    expect.arrayContaining([1, 2, 3, 4, 5, 6])
  );
});

test('sorting DirNode', () => {
  const nodes: DirNode[] = [
    {
      nodeName: 'a',
      absolutePath: '',
      isDirectory: false
    },
    {
      nodeName: 'b',
      absolutePath: '',
      isDirectory: true
    },
    {
      nodeName: 'a',
      absolutePath: '',
      isDirectory: true
    }
  ];
  const sortedNodes: DirNode[] = sortNode(nodes);
  expect(sortedNodes[0]).toEqual({
    nodeName: 'a',
    absolutePath: '',
    isDirectory: true
  });
  expect(sortedNodes[1]).toEqual({
    nodeName: 'b',
    absolutePath: '',
    isDirectory: true
  });
  expect(sortedNodes[2]).toEqual({
    nodeName: 'a',
    absolutePath: '',
    isDirectory: false
  });
});
