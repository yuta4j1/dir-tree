import { statSync, readdirSync } from 'fs';
import * as path from 'path';
import { sortNode, flattenDoubleArray } from './helper';
import { DirNode, DirLayerNodes, ALine } from './types';

// パス情報読み込み
const readDirs = (targetPath: string): DirNode[] => {
  const dirs: string[] = readdirSync(targetPath);
  let datas: DirNode[] = dirs.map(dir => {
    return {
      nodeName: dir,
      absolutePath: path.join(targetPath, dir),
      isDirectory: statSync(path.join(targetPath, dir)).isDirectory()
    };
  });
  return sortNode(datas);
};

// ルート指定したパスからのディレクトリ階層を算出する
const calcLayerNum = (rootDir: RootDir, parentDir: string) => {
  return separatePath(parentDir).length - rootDir.layerDepthFromRoot() + 1;
};

// 階層あたりのNode情報を取得する
const createStem = (targetPath: string, root: RootDir): DirLayerNodes => {
  const nodes: DirNode[] = readDirs(targetPath);
  return {
    parentDirName: targetPath,
    nodes: nodes,
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

const pathSeparator = process.platform === 'linux' ? '/' : '\\';

const separatePath = (targetPath: string): string[] => {
  return targetPath.split(pathSeparator);
};

// DirNodeが保持するパス情報（絶対パス）の配列を返す
const dirNodes2dirPaths = (nodes: DirNode[], parentPath: string): string[] => {
  return nodes
    .filter(node => node.isDirectory)
    .map(node => path.join(parentPath, node.nodeName));
};

class DirTree {
  private _layerNodes: DirLayerNodes[];
  constructor(layerNodes: DirLayerNodes[]) {
    this._layerNodes = layerNodes;
  }
  extractLayerNodes(layerNum: number): DirLayerNodes[] {
    return this._layerNodes.filter((node: DirLayerNodes) => {
      return node.layerNum === layerNum;
    });
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

const indexNumbering = (drawLines: ALine[]) => {
  for (let i = 1, len = drawLines.length; i < len; i++) {
    drawLines[i].index = i;
  }
};

// DirTreeオブジェクトを表示用のツリーデータに変換する
const dirTree2StringTree = (dirTree: DirTree): ALine[] => {
  let treeCache: ALine[] = [];
  let layerNum = 1;

  while (true) {
    let specifiedLayerNodes: DirLayerNodes[] = dirTree.extractLayerNodes(
      layerNum
    );
    // 該当する階層のLayerNode情報が存在しない、ループを抜ける
    if (specifiedLayerNodes.length === 0) break;

    if (layerNum === 1) {
      let nodes: DirNode[] = flattenDoubleArray(
        specifiedLayerNodes.map((nodes: DirLayerNodes) => nodes.nodes)
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
        // 親ディレクトリの位置情報を取得する
        let parentIndex: number = treeCache
          .filter((drawLine: ALine) =>
            drawLine.path.includes(layerNodes.parentDirName)
          )
          .map(drawLine => drawLine.index)[0];
        let lines: ALine[] = layerNodes.nodes.map((node: DirNode) => {
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

  return treeCache;
};

// ルートパスから、ディレクトリのツリーを描画する配列を取得する
export const createDirTree = (rootPath: string): string[] => {
  // ディレクトリ情報をオブジェクトに変換する
  const root: RootDir = new RootDir(rootPath, separatePath(rootPath));
  let dirNodesCache: DirLayerNodes[] = [];
  let dirPathCache = new DirCache();
  const firstLayerNodes: DirLayerNodes = {
    parentDirName: root.rootPath,
    nodes: readDirs(root.rootPath),
    layerNum: 1
  };
  // cache directory path
  dirPathCache.addAll(
    dirNodes2dirPaths(firstLayerNodes.nodes, firstLayerNodes.parentDirName)
  );
  dirNodesCache.push(firstLayerNodes);

  while (dirPathCache.isNotEmpty()) {
    let targetPath: string = dirPathCache.dequeue();
    const dirNodes: DirLayerNodes = createStem(targetPath, root);
    dirPathCache.addAll(
      dirNodes2dirPaths(dirNodes.nodes, dirNodes.parentDirName)
    );
    dirNodesCache.push(dirNodes);
  }

  const dirTree = new DirTree(dirNodesCache);
  const dirLines: ALine[] = dirTree2StringTree(dirTree);
  const dispArray: string[] = [];
  dispArray.push(root.rootPath);
  for (let i = 0, len = dirLines.length; i < len; i++) {
    dispArray.push(dirLines[i].displayStr);
  }

  return dispArray;
};
