// ファイルorディレクトリ
export interface DirNode {
  nodeName: string;
  absolutePath: string;
  isDirectory: boolean;
}

// 階層あたりのファイルorディレクトリ群
export interface DirLayerNodes {
  parentDirName: string;
  nodeNames: DirNode[];
  layerNum: number;
}

export interface ALine {
  index: number;
  path: string;
  displayStr: string;
  isDirectory: boolean;
}
