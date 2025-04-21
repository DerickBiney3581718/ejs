
export const specialForms = Object.create(null);
export const globalScope = Object.create(null)

export function evaluate(expr, scope) {
    if (expr.type == "value") {
        return expr.value;
    } else if (expr.type == "word") {
        if (expr.name in scope) {
            return scope[expr.name];
        } else {
            throw new ReferenceError(
                `Undefined binding: ${expr.name}`);
        }
    } else if (expr.type == "apply") {
        let { operator, args } = expr;
        if (operator.type == "word" &&
            operator.name in specialForms) {
            return specialForms[operator.name](expr.args, scope);
        } else {
            let op = evaluate(operator, scope);
            if (typeof op == "function") {
                return op(...args.map(arg => evaluate(arg, scope)));
            } else {
                throw new TypeError("Applying a non-function.");
            }
        }
    }
}

// special forms
specialForms.if = (args, scope) => {
    if (args.length != 3) throw new SyntaxError('if needs exactly arguments')
    else if (evaluate(args[0], scope) === false) return evaluate(args[2], scope)
    else return evaluate(args[1], scope)
}

specialForms.while = (args, scope) => {
    if (args.length < 2) throw new SyntaxError('while needs at least two arguments')
    const [cond, ...body] = args
    while (evaluate(cond, scope) !== false) {
        for (let expr of body) evaluate(expr, scope)
    }
    return false
}

specialForms.do = (args, scope) => {
    let value = false;
    for (let expr of args) value = evaluate(expr, scope)
    return value
}

specialForms.define = (args, scope) => {
    if (args.length != 2 && args[0].type !== 'word') throw new SyntaxError('define must have two arguments, first arg must be of type word')
    const value = evaluate(args[1], scope)
    scope[args[0].name] = value
    return value
}
// fun declaration would be more of a fun expression using define
// run(`
// do(define(plusOne, fun(a, +(a, 1))),
// print(plusOne(10)))
// `);
// // → 11
specialForms.fun = (args, scope) => {
    if (args.length === 0) throw new SyntaxError('Function should have at least one arg')
    const bodyIdx = args.length - 1
    const body = args[bodyIdx]
    const params = args.slice(0, bodyIdx).map(expr => {
        if (expr.type != "word") {
            throw new SyntaxError("Parameter names must be words");
        }
        return expr.name;
    });

    return function (...args) {
        if (args.length !== params.length) throw new SyntaxError('Arguments do not match function signature')
        const localScope = Object.create(scope)
        for (let i = 0; i < bodyIdx; i++)
            localScope[params[i]] = args[i]

        return evaluate(body, localScope)
    }

}

specialForms.set = (args, scope) => {
    let [binding, value] = args
    let bindingValue;
    if (binding.type !== 'word') throw new SyntaxError('set variable should be a word')
    if (value.type === 'word') bindingValue = scope[value.name]
    else if (value.type === 'value') bindingValue = value.value
    else throw SyntaxError('binding value is invalid')

    binding = binding.name
    console.log(`setting ${binding} to value ${bindingValue}}`)

    if (Object.hasOwn(scope, binding)) scope[binding] = bindingValue
    else {
        const OuterScope = Object.getPrototypeOf(scope)
        if (Object.hasOwn(OuterScope, binding)) OuterScope[binding] = bindingValue
        else throw new ReferenceError(`Property ${binding} is not defined`)
    }
    return bindingValue
}
// global scope
globalScope.true = true
globalScope.false = false
globalScope.print = (...args) => {
    return args.toString()
}

globalScope.array = (...args) => args.map(arg => arg)

globalScope.length = (arr) => arr.length;

globalScope.element = (arr, i) => arr[i];

for (let op of ['-', '+', '*', '/', '==', '>', '<']) globalScope[op] = Function("...args", `return args.reduce((prev, curr)=>  Number.parseInt(prev) ${op} Number.parseInt(curr) )`)