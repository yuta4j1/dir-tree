// ファイルorディレクトリ
export interface DirNode {
  nodeName: string;
  absolutePath: string;
  isDirectory: boolean;
}

// 階層あたりのファイルorディレクトリ群
export interface DirLayerNodes {
  parentDirName: string;
  nodes: DirNode[];
  layerNum: number;
}

// 表示用ファイル情報
export interface ALine {
  index: number;
  path: string;
  displayStr: string;
  isDirectory: boolean;
}
