// TODO テストしやすいように全体見直す
import { readdir, statSync } from 'fs';
import * as path from 'path';
import { flattenDoubleArray } from './helper';

// ファイルorディレクトリ
export interface DirNode {
  nodeName: string;
  absolutePath: string;
  isDirectory: boolean;
}

// 階層あたりのファイルorディレクトリ群
interface DirLayerNodes {
  parentDirName: string;
  nodeNames: DirNode[];
  layerNum: number;
}

// コンソール表示
const display = (strs: string[] | string) => {
  if (Array.isArray(strs)) {
    strs.forEach(str => console.log(str));
  } else {
    console.log(strs);
  }
};

// ディレクトリ > ファイルとなるようソート
// TODO ソートが効かない
export const sortNode = (nodes: DirNode[]): DirNode[] => {
  return nodes.sort((a: DirNode, b: DirNode) => {
    if (a.isDirectory && !b.isDirectory) {
      return 1;
    } else if (!a.isDirectory && a.isDirectory) {
      return -1;
    } else if (
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

// パス情報読み込み
const readDirs = (targetPath: string): Promise<DirNode[]> => {
  return new Promise(
    (resolve: (dirs: DirNode[]) => void, reject: () => void) => {
      readdir(targetPath, (err: Error, dirs: string[]) => {
        if (err) throw err;
        let datas: DirNode[] = dirs.map(dir => {
          return {
            nodeName: dir,
            absolutePath: path.join(targetPath, dir),
            isDirectory: statSync(path.join(targetPath, dir)).isDirectory()
          };
        });
        // console.log(sortNode(datas))
        resolve(sortNode(datas));
      });
    }
  );
};

// ルート指定したパスからのディレクトリ階層を算出する
const calcLayerNum = (rootDir: RootDir, parentDir: string) => {
  return separatePath(parentDir).length - rootDir.layerDepthFromRoot() + 1;
};

// 階層あたりのNode情報を取得する
const createStem = async (
  targetPath: string,
  root: RootDir
): Promise<DirLayerNodes> => {
  const nodes: DirNode[] = await readDirs(targetPath);
  return {
    parentDirName: targetPath,
    nodeNames: nodes,
    layerNum: calcLayerNum(root, targetPath)
  };
};

// ルートディレクトリ情報
class RootDir {
  private _rootPath: string;
  private _dirArray: string[];

  constructor(rootPath: string, dirArray: string[]) {
    this._rootPath = rootPath;
    this._dirArray = dirArray;
  }

  get rootPath(): string {
    return this._rootPath;
  }

  get dirArray(): string[] {
    return this._dirArray;
  }

  layerDepthFromRoot(): number {
    return this._dirArray && this._dirArray.length > 0
      ? this._dirArray.length
      : 0;
  }
}

// パスのセパレータ
const pathSeparator = process.platform === 'linux' ? '/' : '\\';

//
const separatePath = (targetPath: string): string[] => {
  return targetPath.split(pathSeparator);
};

// ディレクトリ情報のみを取り出す
const extractDir = (nodes: DirNode[], parentPath: string): string[] => {
  return nodes
    .filter(node => node.isDirectory)
    .map(node => path.join(parentPath, node.nodeName));
};

class DirTree {
  private _layerNodes: DirLayerNodes[];
  constructor(layerNodes: DirLayerNodes[]) {
    this._layerNodes = layerNodes;
  }
  get layerNodes(): DirLayerNodes[] {
    return this._layerNodes;
  }
}

class DirCache {
  private _cache: string[];
  constructor() {
    this._cache = [];
  }
  addAll(dirs: string[]): void {
    dirs.forEach(dir => this._cache.push(dir));
  }
  dequeue(): string {
    return this._cache.shift();
  }
  isNotEmpty(): boolean {
    return this._cache.length >= 1;
  }
}

const branchExp = (layerNum: number) => {
  let prefix = '';
  for (let i = 1; i < layerNum; i++) {
    prefix += '  |';
  }
  return prefix + '  |--';
};

interface ALine {
  index: number;
  path: string;
  displayStr: string;
  isDirectory: boolean;
}

const indexNumbering = (drawLines: ALine[]) => {
  for (let i = 1, len = drawLines.length; i < len; i++) {
    drawLines[i].index = i;
  }
};

const renderTree = (root: RootDir, dirTree: DirTree) => {
  display(root.rootPath);
  let treeCache: ALine[] = [];
  let layerNum = 1;
  const layerNodes: DirLayerNodes[] = dirTree.layerNodes;

  while (true) {
    let specifiedLayerNodes: DirLayerNodes[] = layerNodes.filter(
      (node: DirLayerNodes) => node.layerNum === layerNum
    );
    if (specifiedLayerNodes.length === 0) break;
    if (layerNum === 1) {
      let nodes: DirNode[] = flattenDoubleArray(
        specifiedLayerNodes.map((nodes: DirLayerNodes) => nodes.nodeNames)
      );
      nodes.forEach((node: DirNode) =>
        treeCache.push({
          index: treeCache.length,
          path: node.absolutePath,
          displayStr: branchExp(layerNum) + node.nodeName,
          isDirectory: node.isDirectory
        })
      );
    } else {
      specifiedLayerNodes.forEach((layerNodes: DirLayerNodes) => {
        let parentIndex: number = treeCache
          .filter((drawLine: ALine) =>
            drawLine.path.includes(layerNodes.parentDirName)
          )
          .map(drawLine => drawLine.index)[0];
        let lines: ALine[] = layerNodes.nodeNames.map((node: DirNode) => {
          return {
            index: 0,
            path: node.absolutePath,
            displayStr: branchExp(layerNum) + node.nodeName,
            isDirectory: node.isDirectory
          };
        });
        treeCache.splice(parentIndex + 1, 0, ...lines);
        indexNumbering(treeCache);
      });
    }
    layerNum++;
  }

  display(treeCache.map((line: ALine) => line.displayStr));
};

const start = async (root: RootDir) => {
  let stemCache: DirLayerNodes[] = [];
  let dirCache = new DirCache();
  const firstStem: DirLayerNodes = {
    parentDirName: root.rootPath,
    nodeNames: await readDirs(root.rootPath),
    layerNum: 1
  };
  // cache directory info only
  dirCache.addAll(extractDir(firstStem.nodeNames, firstStem.parentDirName));
  stemCache.push(firstStem);

  while (dirCache.isNotEmpty()) {
    let targetPath: string = dirCache.dequeue();
    const stemInfo: DirLayerNodes = await createStem(targetPath, root);
    dirCache.addAll(extractDir(stemInfo.nodeNames, stemInfo.parentDirName));
    stemCache.push(stemInfo);
  }

  const dirStem = new DirTree(stemCache);
  // console.log(JSON.stringify(dirStem, null, ' '))

  renderTree(root, dirStem);
};

// ルートディレクトリ

const entry = (): void => {
  var program = require('commander');
  program
    .option('-P, --path [path]', 'Add path')
    .option('-L, --log [logPath]', 'Add logfile path')
    .parse(process.argv);
  if (!program.path) {
    throw new Error('Illegal arguments.');
  }
  const rootPath = program.path;
  start(new RootDir(rootPath, separatePath(rootPath)));
};

entry();
