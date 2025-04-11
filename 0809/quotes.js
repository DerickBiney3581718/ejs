// #CHANGE SINGLE QUOTES -> DOUBLE QUOTES
// let text = "'I'm the cook,' he said, 'it's my job.'";
// Change this call.
// console.log(text.replace(/A/g, "B"));
// → "I'm the cook," he said, "it's my job."
// if ' is followed immediately by \B

let text = "'I'm the cook,' he said, 'it's my job.'";
const replSingleQuotesRegexp = /^'|'$|'\B|\B'/g
console.log(text.replace(replSingleQuotesRegexp, `"`))
// console.log(//)