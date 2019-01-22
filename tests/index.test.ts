import { sortNode, DirNode } from '../src/ts/index';

describe('function sortNode', () => {
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
  expect(sortNode(nodes)).toEqual(
    expect.arrayContaining([
      {
        nodeName: 'a',
        absolutePath: '',
        isDirectory: true
      },
      {
        nodeName: 'b',
        absolutePath: '',
        isDirectory: true
      },
      {
        nodeName: 'a',
        absolutePath: '',
        isDirectory: false
      }
    ])
  );
});
