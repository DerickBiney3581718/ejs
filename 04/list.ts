type LinkedList<T> = {
  value: T;
  rest: LinkedList<T> | null;
};
function arrayToList<T>(arr: Array<T>): LinkedList<T> | null {
  if (!arr.length) return null;
  const list: LinkedList<T> = { value: arr[0], rest: null };
  let temp = list;
  for (let i = 1; i < arr.length; i++) {
    temp.rest = { value: arr[i], rest: null };
    temp = temp["rest"];
  }
  return list;
}

function listToArray<T>(list: LinkedList<T>): T[] {
  function recListToArray(ls: LinkedList<T>): T[] {
    if (ls.rest === null) return [ls.value];
    return [ls.value].concat(recListToArray(ls.rest));
  }
  return recListToArray(list);
}
function prepend<T>(el: T, list: LinkedList<T>): LinkedList<T> {
  return { value: el, rest: list };
}

function nth<T>(list: LinkedList<T>, num: number): T | void {
  function recNth(ls: LinkedList<T>) {
    if (num == 0) return ls.value;
    if (!ls.rest) return;
    --num;
    return recNth(ls.rest);
  }
  return recNth(list);
}

// console.log(listToArray(arrayToList([1, 2, 3])));
console.log(prepend(1, { value: 2, rest: { value: 3, rest: null } }));
console.log(nth({ value: 2, rest: { value: 3, rest: null } }, 1));
