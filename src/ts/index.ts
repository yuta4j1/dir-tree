import { createDirTree } from './dirTree';
import { consoleDisplay } from './helper';
import { Option } from './types';

// エントリポイント
const entry = (): void => {
  var program = require('commander');
  program
    .option('-P, --path [path]', 'target root path')
    .option('-L, --log [logPath]', 'logfile path to output directory tree')
    .option('-d --directory', 'directory only')
    .option('-E --exp [exp]', 'pattern match')
    .parse(process.argv);
  // ルートパスの必須チェック
  if (!program.path) {
    throw new Error('Illegal arguments.');
  }
  const rootPath = program.path;
  // オプション
  const option: Option = {
    directoryOnly: program.directory || false,
    pattern: program.exp || undefined
  };
  // 出力できるよう、ディレクトリ情報を読み出し、ツリー形式へパース
  const arr: string[] = createDirTree(rootPath, option);
  // ディレクトリツリー出力
  consoleDisplay(arr);
};

entry();
