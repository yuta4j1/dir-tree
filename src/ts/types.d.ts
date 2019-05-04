// ファイルorディレクトリ
export type DirNode = {
  nodeName: string;
  absolutePath: string;
  isDirectory: boolean;
};

// 階層あたりのファイルorディレクトリ群
export type DirLayerNodes = {
  parentDirName: string;
  nodes: DirNode[];
  layerNum: number;
};

// 表示用ファイル情報
export type ALine = {
  index: number;
  path: string;
  displayStr: string;
  isDirectory: boolean;
};

// オプション
export type Option = {
  directoryOnly?: boolean;
  pattern?: string | undefined;
};

// ディレクトリ情報読み出し時にfilterする用の型
type DirNodeSrc = {
  p: string;
  n: string;
};

// ディレクトリ読み出し時のfilter関数
export type ReadDirsFilter = (src: DirNodeSrc) => boolean;
