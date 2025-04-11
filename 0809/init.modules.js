// CommonJS is implemented with a module loader that, when loading a module,
// wraps its code in a function (giving it its own local scope) and
// passes the require and exports bindings to that function as arguments.
// If we assume we have access to a readFile function that reads a file by name
//  and gives us its content, we can define a simplified form of require like this:
// # Write require pseudo function


// # why transpile,bundle, minify? especially over a network


// CommonJS modules allow a limited form of cyclic dependencies.
//  As long as the modules don’t access each other’s interface until after they finish loading,
//  cyclic dependencies are okay.

// The require function given earlier in this chapter supports this type of dependency cycle.
// ? Can you see how it handles cycles?