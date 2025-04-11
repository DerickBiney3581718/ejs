function numberToString(n, base = 10) {
    let result = "", sign = "";
    if (n < 0) {
        sign = "-";
        n = -n;
    }
    do {
        result = String(n % base) + result;
        n /= base;
    } while (n > 0);
    return sign + result;
}
// console.log(numberToString(13, 10));

// ? What's wrong
const accounts = {
    a: 100,
    b: 0,
    c: 20
};

function getAccount() {
    let accountName = prompt("Enter an account name");
    if (!Object.hasOwn(accounts, accountName)) {
        throw new Error(`No such account: ${accountName}`);
    }
    return accountName;
}

function transfer(from, amount) {
    if (accounts[from] < amount) return;
    accounts[from] -= amount;
    accounts[getAccount()] += amount;
}

///////////////////////////////////////////
class MultiplicatorUnitFailure extends Error { }

function primitiveMultiply(a, b) {
    if (Math.random() < 0.2) {
        return a * b;
    } else {
        throw new MultiplicatorUnitFailure("Klunk");
    }
}

function reliableMultiply(a, b) {
    try {
        return primitiveMultiply(a, b)
    }
    catch (e) {
        if (e instanceof MultiplicatorUnitFailure)
            return reliableMultiply(a, b)
        throw new MultiplicatorUnitFailure
    }

}

console.log(reliableMultiply(8, 8));
///////////////////////////

const box = new class {
    locked = true;
    #content = [];

    unlock() { this.locked = false; }
    lock() { this.locked = true; }
    get content() {
        if (this.locked) throw new Error("Locked!");
        return this.#content;
    }
};

function withBoxUnlocked(body) {
    const wasLocked = box.locked
    try {

        wasLocked && box.unlock()
        body()

    } finally {
        wasLocked ? box.lock() : box.unlock()
    }
}

withBoxUnlocked(() => {
    box.content.push("gold piece");
});

try {
    withBoxUnlocked(() => {
        throw new Error("Pirates on the horizon! Abort!");
    });
} catch (e) {
    console.log("Error raised: " + e);
}
console.log(box.locked);
// → true