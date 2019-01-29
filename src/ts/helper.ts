import { DirNode } from './types';

export const flattenDoubleArray = <T>(array: T[][]): T[] => {
  return array.reduce((accumulator: T[], val: T[]) => {
    return accumulator.concat(val);
  }, []);
};

// ディレクトリ > ファイルとなるようソート
export const sortNode = (nodes: DirNode[]): DirNode[] => {
  return nodes.sort((a: DirNode, b: DirNode) => {
    if (a.isDirectory && !b.isDirectory) {
      return -1;
    }
    if (!a.isDirectory && b.isDirectory) {
      return 1;
    }
    if (
      (a.isDirectory && b.isDirectory) ||
      (!a.isDirectory && !b.isDirectory)
    ) {
      if (a.nodeName > b.nodeName) {
        return 1;
      } else {
        return -1;
      }
    } else {
      return 0;
    }
  });
};

// コンソール表示
export const consoleDisplay = (strs: string[] | string) => {
  if (Array.isArray(strs)) {
    strs.forEach(str => console.log(str));
  } else {
    console.log(strs);
  }
};
