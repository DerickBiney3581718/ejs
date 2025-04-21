import { globalScope, evaluate, specialForms } from "./specialForms.js";
// expressions parser
// 1. literals : {type: 'value', value: 5}
// 2. word/binding : {type:'word', name:"someVar"}
// 3. application/function: {type:'apply', operator: "someFn"}
function parseAtom(program) {
   program = skipSpace(program)
   let match, expObj;
   if (match = /^"([^"]+)"/.exec(program))
      expObj = { type: 'value', value: match[1] }
   else if (match = /^\d+/.exec(program))
      expObj = { type: 'value', value: match[0] }
   else if (match = /^[^\s"()#,]+/.exec(program))
      expObj = { type: 'word', name: match[0] }
   else throw new SyntaxError('Expected a string, number, or binding')
   program = program.slice(match[0].length)
   return parseApply(expObj, program)
}

function skipSpace(text) {
   text = text.replace(/\s*#+.*\n/gm, '')
   const first = text.search(/\S/)  // first non-whitespace

   if (first === -1) return ''
   return text.slice(first)
}

function parseApply(expr, program) {
   program = skipSpace(program)
   if (expr.type !== 'word' || program[0] !== '(') return { expr, program }
   expr = { type: 'apply', args: [], operator: { ...expr } }

   program = skipSpace(program.slice(1))
   while (program[0] !== ')') {
      const parsedAtom = parseAtom(program)
      expr.args.push(parsedAtom.expr)
      program = skipSpace(parsedAtom.program)
      if (program[0] === ',') program = skipSpace(program.slice(1))
   }
   if (program[0] === ')') program = skipSpace(program.slice(1));

   return { expr, program }
}

function parse(program) {
   const out = parseAtom(program)

   if (out.program.length !== 0) throw new SyntaxError(`Cannot parse unexpected expression ${out.program}`)
   return out.expr
}

// console.log(parse("+(a, 10)"));
// → {type: "apply",
//    operator: {type: "word", name: "+"},
//    args: [{type: "word", name: "a"},
//           {type: "value", value: 10}]}
// console.log(parse(`do(define(x, 10),
//    if(>(x, 5),
//       print("large"),
//       print("small")))`))

// {
//     type: "apply",
//     operator: {type: "word", name: ">"},
//     args: [
//       {type: "word", name: "x"},
//       {type: "value", value: 5}
//     ]
//   }


function run(program) {
   return evaluate(parse(program), Object.create(globalScope));
}

console.log(run(`if(true, false, true)`));
console.log(run(`+(4,3)`))
console.log(run(`
   do(define(total, 0),
      define(count, 1),
      while(<(count, 11),
            do(define(total, +(total, count)),
               define(count, +(count, 1)))),
      print(total))
   `))
run(`
      do(define(plusOne, fun(a, +(a, 1))),
         print(plusOne(10)))
      `);
// → 11

run(`
      do(define(pow, fun(base, exp,
           if(==(exp, 0),
              1,
              *(base, pow(base, -(exp, 1)))))),
         print(pow(2, 10)))
      `);
// → 1024

// Modify these definitions...



run(`
   do(define(sum, fun(array,
        do(define(i, 0),
           define(sum, 0),
           while(<(i, length(array)),
             do(define(sum, +(sum, element(array, i))),
                define(i, +(i, 1)))),
           sum))),
      print(sum(array(1, 2, 3))))
   `);
// → 6

console.log(parse("# hello\nx"));
// → {type: "word", name: "x"}

console.log(parse("a # one\n   # two\n()"));
// → {type: "apply",
//    operator: {type: "word", name: "a"},
//    args: []}

console.log(run(`
   do(define(x, 4),
      define(setx, fun(val, set(x, val))),
      setx(50),
      print(x))
   `))
// → 50

console.log(run(`set(quux, true)`))