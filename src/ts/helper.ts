// export const flattenArray = <T> (array: any): T[] => {

//   if (Array.isArray(array)) {
//     return array.reduce((accumulator: [], val: any) => {
//       if (Array.isArray(val)) {
//         const arr: T[] = flattenArray(val)
//         accumulator.concat(arr);
//       } else {
//         accumulator.push(val);
//       }
//     }, []);
//   } else {
//     return array;
//   }
// }

export const flattenDoubleArray = <T>(array: T[][]): T[] => {
  return array.reduce((accumulator: T[], val: T[]) => {
    return accumulator.concat(val);
  }, []);
};
