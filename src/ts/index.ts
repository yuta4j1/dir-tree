import { createDirTree } from './dirTree';

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
  createDirTree(rootPath);
};

entry();
