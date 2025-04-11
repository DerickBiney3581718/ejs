"use strict";
function arrayToList(arr) {
    if (!arr.length)
        return null;
    const list = { value: arr[0], rest: null };
    let temp = list;
    for (let i = 1; i < arr.length; i++) {
        temp.rest = { value: arr[i], rest: null };
        temp = temp["rest"];
    }
    return list;
}
function listToArray(list) {
    function recListToArray(ls) {
        if (ls.rest === null)
            return [ls.value];
        return [ls.value].concat(recListToArray(ls.rest));
    }
    return recListToArray(list);
}
function prepend(el, list) {
    return { value: el, rest: list };
}
function nth(list, num) {
    function recNth(ls) {
        if (num == 0)
            return ls.value;
        if (!ls.rest)
            return;
        --num;
        return recNth(ls.rest);
    }
    return recNth(list);
}
// console.log(listToArray(arrayToList([1, 2, 3])));
console.log(prepend(1, { value: 2, rest: { value: 3, rest: null } }));
console.log(nth({ value: 2, rest: { value: 3, rest: null } }, 1));
