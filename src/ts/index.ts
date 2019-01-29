import { createDirTree } from './dirTree';
import { consoleDisplay } from './helper';

// エントリポイント
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
  const arr: string[] = createDirTree(rootPath);
  consoleDisplay(arr);
};

entry();
