// TODO もう少し汎用的なflatmapにする
exports.double2SingleArray = (doubleArray: any[][]) => {
  let result = [];
  for (let i = 0, len = doubleArray.length; i < len; i++) {
    for (let j = 0, len = doubleArray[i].length; j < len; j++) {
      result.push(doubleArray[i][j]);
    }
  }
  return result;
};
