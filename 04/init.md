collection of properties
listToArray {value : 1, rest : {value: 2 , rest: null}}

function listToArray(){
const arr = []
fn({value, rest})
  {  if(value == null) return;
    arr.push(value)
    return fn(rest)}
return arr
}
