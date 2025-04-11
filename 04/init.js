function listToArray(list) {
    const arr = []
    function fn(list) {
        if (list?.value == null) return;
        arr.push(list.value)
        return fn(list?.rest)
    }
    fn(list)
    return arr
}

function arrayToList(arr) {
    const list = {}
    if (!arr.length) return null
    const arrLength = arr.length;

    function fn(rest, currentIdx) {
        console.log('rest...', rest, currentIdx)
        if (currentIdx + 1 >= arrLength) return { rest: null, value: arr[currentIdx] }
        rest.value = arr[currentIdx];
        rest.rest = {};
        return { value: arr[currentIdx], rest: fn(rest.rest, currentIdx + 1) }
    }
    fn(list, 0)
    return list
}
console.log(listToArray({ value: 1, rest: { value: 2, rest: { value: 3, rest: null } } }))
console.log(arrayToList([1, 2, 3]))