class List {
  constructor(public value: number | null, public rest: List | null) {}

  public get length(): number {
    return 1 + (this.rest ? this.rest.length : 0);
  }

  static fromArray(arr: number[]): List {
    let result = null;
    for (let i = arr.length - 1; i >= 0; i--) {
      result = new this(arr[i], result);
    }

    return result ?? new this(null, null);
  }

  [Symbol.iterator]() {
    return new ListIter(this);
  }
}

class ListIter {
  constructor(private actualList: List | null) {}

  next() {
    if (this.actualList === null) return { done: true };
    const value = this.actualList.value;
    const rest = this.actualList.rest;
    this.actualList = rest;
    return { value, done: false };
  }
}
// List.[Symbol.iterator]=

const list1 = List.fromArray([1, 2, 3]);
console.log(list1.length);
for (const link of list1) console.log("this is link: ", link);
console.log(...list1);