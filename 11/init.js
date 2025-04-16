//? Easiest waay to create a promise
// Promises return object(receipt) to show the availability of the function's outcome
// use .then to register a function to be called when the promise is resolved
// promise resolving means that the promise has returned a value
Promise.resolve(150).then(console.log)
Promise.resolve(new Promise((resolve) => resolve('apathy|empathy'))).then((value) => { console.log(value); return `What's up bitches` })
    .then(console.log)

// thread is another running program that does not block the main thread
console.log('Starting shit up')
// # PASSING CALLBACKS 
// ?change from callbacks to promises
function compareFiles(fileA, fileB, callback) {
    readTextFile(fileA, contentA => {
        readTextFile(fileB, contentB => {
            callback(contentA == contentB);
        });
    });
}
async function compareFilesPr(fileA, fileB) {
    return new Promise(resolve => { const content = readTextFile(fileA); resolve(content) })
        .then((cA) => { const cB = readTextFile(fileB); return (cA === cB) })
        .then((isSame) => callback(isSame))

}
// ? thens can be chained because
// ? what happens
new Promise((_, reject) => reject(new Error("Fail")))
    .then(value => console.log("Handler 1:", value))
    .catch(reason => {
        console.log("Caught failure " + reason);
        return "nothing";
    })
    .then(value => console.log("Handler 2:", value));

// ?what happens
function withTimeout(promise, time) {
    return new Promise((resolve, reject) => {
        promise.then(resolve, reject);
        setTimeout(() => reject("Timed out"), time);
    });
}
// ? what happens: Because you cannot wait for a promise inside a for loop 
for (let i of '123456') {
    console.log('in loop', i)
    withTimeout(new Promise(res => setTimeout(() => res(`${i} donee!`), 500)), 1000)
        .then(console.log)
        .catch(console.error); // → logs: Done!
}
console.log('just ended')

// ? how should you wait out a promise

// ?rewrite to async
function crackPasscode(networkID) {
    function nextDigit(code, digit) {
        let newCode = code + digit;
        return withTimeout(joinWifi(networkID, newCode), 50)
            .then(() => newCode)
            .catch(failure => {
                if (failure == "Timed out") {
                    return nextDigit(newCode, 0);
                } else if (digit < 9) {
                    return nextDigit(code, digit + 1);
                } else {
                    throw failure;
                }
            });
    }
    return nextDigit("", 0);
}


// !generators* are special functions that returns iterators
// it automatically holds it's own state, no longer write an iter object to hold the curr state
Group.prototype[Symbol.iterator] = function* () { for (; ;) yield 'something' }


// promise.all returns
async function fileSizes(files) {
    let list = "";
    await Promise.all(files.map(async fileName => {
        list += fileName + ": " +
            (await textFile(fileName)).length + "\n";
    }));
    return list;
}
