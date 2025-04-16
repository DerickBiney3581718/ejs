function parseAtom(program) {
   program = skipSpace(program);      // remove whitespace
   // atomic expr: string, number, word and application(apply)
   let match, expr;
   if (match = /^"([^"]+)"/.exec(program))
      expr = { type: "value", value: match[1] }
   else if (match = /^\d+/.exec(program))
      expr = { type: "value", value: match[0] }
   else if (match = /^[^\s()]+/.exec(program))
      expr = { type: "word", name: match[0] }
   else throw new SyntaxError('Expression is invalid')
   return parseApply(expr, program.slice(match[0].length))
}

function skipSpace(string) {
   const firstLetter = string.search(/\S/)  //matching the first non-space
   if (firstLetter == -1) return ""
   return string.slice(firstLetter)
}

// do(define(x, 10),
//    if(>(x, 5),
//       print("large"),
//       print("small")))
// {
//     type: "apply",
//     operator: {type: "word", name: ">"},
//     args: [
//       {type: "word", name: "x"},
//       {type: "value", value: 5}
//     ]
//   }
function parseApply(expr, program) {
   program = skipSpace(program)
   if (program[0] != '(') return { expr, program }

   expr = { type: 'apply', args: [], operator: expr }
   program = skipSpace(program.slice(1))
   while (program[0] != ')') {
      const arg = parseAtom(program)
      expr.args.push(arg.expr)

      program = skipSpace(arg.program)
      if (program[0] == ',') program = skipSpace(program.slice(1))
      else if (program[0] == ')') { program = skipSpace(program.slice(1)); break; }
   }
   return { expr, program }
}

function parse(program) {
   const { expr, program: remnant } = parseAtom(program)
   if (remnant.length) throw new SyntaxError('Remaining program cannot be parsed')
   return expr
}

console.log(parse("+(a, 10)"));
// → {type: "apply",
//    operator: {type: "word", name: "+"},
//    args: [{type: "word", name: "a"},
//           {type: "value", value: 10}]}
console.log(parse(`do(define(x, 10),
   if(>(x, 5),
      print("large"),
      print("small")))`))