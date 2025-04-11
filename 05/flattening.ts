// Use the reduce method in combination with the concat method to “flatten” an array of arrays
// into a single array that has all the elements of the original arrays.

let arrays = [[1, 2, 3], [4, 5], [6]];
function flattening(arr: any[]): any[] {
  return arr.reduce((p: any[], c: any[]) => p.concat(c));
}
console.log(flattening(arrays));
