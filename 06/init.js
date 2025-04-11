
function speak(line) {
    console.log(`All we do is ${line}! cos we are ${this.name}s!`);
}

const whiteRabbit = {
    name: 'White Rabbit',
}
speak.call(whiteRabbit, 'hop')

// *Object.prototype
console.log(Object.getPrototypeOf(whiteRabbit) == Object.prototype, 'white rabbit is from Obj proto')
// console.log(// *Function.prototype)
console.log(Object.getPrototypeOf(speak) == Function.prototype, 'speak function from func proto')
// console.log(// *Array.prototype)
console.log(Object.getPrototypeOf([]) == Array.prototype, '[] from arr proto')

// * constructor function | factory that returns an object of some proto | producing different instances of the same object\class\prototype
function MakeRabbit(type) //adding instance params
{
    let someNewRabbit = Object.create(whiteRabbit)
    someNewRabbit.type = type;
    someNewRabbit.gestationMonths = 12
    return someNewRabbit;
}

class Rabbit {
    gestationMonths = 12
    #secretWeapon = 'cuteness'
    constructor(type) {
        this.type = type
    }
    // TODO: speak method
    speak() {
        console.log('Our type just beat it🕺')
    }
    // ? creates a binding <<MakeRabbit>> , when called with the new syntax, runs code in constructor & prototype property that holds tthe speak method
}

const blackRabbit = new Rabbit('black')
console.log(Object.getPrototypeOf(blackRabbit) == Rabbit.prototype, 'protos match')

// * Try these
let ages = {
    'Jack': 29, 'Ama': 18, 'Addo': 30
}
console.log('Jack is in here? ', 'Jack' in ages)
console.log('And so is toString? ', 'toString' in ages)
// ! object has to be stringg or symbol, no other types
// Object.hasOwn

const polymorph = {
    "polymorphism_types": [
        {
            "type": "Subtype Polymorphism",
            "description": "Occurs when a class inherits from another class and overrides or extends its methods, allowing for objects of the derived class to be used where the base class is expected."
        },
        {
            "type": "Parametric Polymorphism",
            "description": "Involves writing functions or methods that can operate on any data type, often implemented through generics or templates. The specific type is provided at runtime or compile-time."
        },
        {
            "type": "Ad-hoc Polymorphism",
            "description": "Refers to function overloading or operator overloading, where a single function or operator works with different types or arguments, depending on the context."
        },
        {
            "type": "Coercion Polymorphism",
            "description": "Occurs when an operation automatically converts one data type into another. For example, adding an integer to a float might coerce the integer to a float before performing the addition."
        },
        {
            "type": "Inheritance Polymorphism",
            "description": "Occurs when a subclass can inherit methods from a superclass and can override or extend them, allowing for behavior specific to the subclass."
        },
        {
            "type": "Interface Polymorphism",
            "description": "Refers to different classes implementing the same interface, allowing objects of different types to be treated uniformly through the shared interface methods."
        }
    ]
}
// * replaceability and overrides 
//* inheritance polymorphism, interface polymorphism, Parametric polymorphism

Array.prototype.forEach.call({
    length: 2,
    0: "A",
    1: "B"
}, elt => console.log(elt));


// * getters, setters, static
// ?hmm symbol. ok, use square brackets to eval
const length = Symbol('some len')
// Array.prototype[length] = 0;

let myTrip = {
    length: 2,
    0: "Lankwitz",
    1: "Babelsberg",
    [length]: 21500
};
console.log(myTrip[length], myTrip.length);
// → 21500 2

// ?inheritance comes last