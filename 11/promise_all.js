function Promise_all(promises) {
    return new Promise((resolve, reject) => {
        const resolvedPromises = []
        console.log(promises)
        for (let i = 0; i < promises.length; i++)
            try {
                console.log('first loop', promises[i])
                const rp = promises[i]
                console.log(rp)
                resolvedPromises.push(rp);
                console.log(resolvedPromises)
            } catch (error) {
                console.error(`some err: ${error?.message}`)
                reject(error)
            }

        resolve(resolvedPromises)
    });
}

function Promise_all(promises) {
    return new Promise((res, rej) => {
        const resolvedPromises = []
        let len = promises.length
        if (!len) res(resolvedPromises)
        promises.map((p, i) => p.then(value => {
            len -= 1;
            resolvedPromises[i] = value; if (!len) res(resolvedPromises)
        }).catch(e => rej(e)))
    })
}

// Test code.
Promise_all([]).then(array => {
    console.log("This should be []:", array);
});
function soon(val) {
    return new Promise(resolve => {
        setTimeout(() => resolve(val), Math.random() * 500);
    });
}
Promise_all([soon(1), soon(2), soon(3)]).then(array => {
    console.log("This should be [1, 2, 3]:", array);
});
Promise_all([soon(1), Promise.reject("X"), soon(3)])
    .then(array => {
        console.log("We should not get here");
    })
    .catch(error => {
        if (error != "X") {
            console.log("Unexpected failure:", error);
        }
    });