import { createDirTree } from '../src/ts/dirTree';

test('createDirTree', () => {
  const dispArray: string[] = createDirTree(
    'C:\\Users\\ozaki\\Documents\\sandbox-JavaScript\\dir-tree\\testfiles'
  );
  const testArray = [
    'C:\\Users\\ozaki\\Documents\\sandbox-JavaScript\\dir-tree\\testfiles',
    '  |--dir1',
    '  |  |--dir1-child',
    '  |  |  |--fugafuga.txt',
    '  |  |--hogehoge.txt',
    '  |--dir2',
    '  |  |--bar.txt',
    '  |  |--foo.txt',
    '  |--fuga.txt',
    '  |--hoge.txt'
  ];
  expect(
    dispArray.every((val, idx) => {
      return val === testArray[idx];
    })
  ).toBeTruthy();
});
