// ? using exec() & match() methods

let match = /\d+/.exec("one two 100");
console.log(match);
// → ["100"]
console.log(match.index);
// → 8

console.log("one two 100".match(/\d+/));
// → ["100"]

//? using exec, rejecting group
console.log(/ba+(?:na)+/.exec("banana"));
console.log(/(na)+/.exec("faanana"));

// dates
console.log(new Date(1387407600000));
function getDate(string) {
    let [_, month, day, year] =
        /(\d{1,2})-(\d{1,2})-(\d{4})/.exec(string);
    return new Date(year, month - 1, day);
}
console.log(getDate("1-30-2003"));
// → Thu Jan 30 2003 00:00:00 GMT+0100 (CET)

//#BOUNDARIES here. word | non-word
// ? how many
console.log('boundaries', /\b/.exec("word word"));
console.log('all boundaries');
const matchedBoundaries = "word word".matchAll(/\b/g).forEach(m => console.log(m.index));

// # LOOKAHEAD OPERATOR
const names = "r.hendricks j.hendrix j.butler h.hendrix"
const initials = names.matchAll(/\w+(?=.\bhendrix)/ig)
for (let n of initials)
    console.log('Matching Hendrix: ', n)
// #LOOKBEHIND OPERATOR
const aaaaaaae = 'aaaaaaae'
const aaaaaaaeA = 'aaaaaaaea'
// console.log(`A not after e in ${aaaaaaae} :  ${/a(?<!e)/gi.test(aaaaaaae)}`)
console.log(`A after e in ${aaaaaaaeA} :  ${/a(?<=e)/g.test(aaaaaaaeA)}`)





// # REPLACE USING $& placeholders in new change
console.log(
    "Liskov, Barbara\nMcCarthy, John\nMilner, Robin"
        .replace(/(\p{L}+), (\p{L}+)/gu, "$2 $1"));


// #QUANTIFIERS ARE GREEDY BY DEFAULT
// ? How do you change to non-greedy quantifiers
function removeComments(testString) {
    //! .* DOESN'T MATCH A NEW LINE 
    const singleLine = /(\/\/).*$/gm
    const multiLine = /(\/\*)[^*/]*(\*\/)/g
    const multiLine2 = /(\/\*)[\w\W]*?(\*\/)/g //!CHANGE TO NONGREEDY QUANTIFIER

    return testString.replace(singleLine, "").replace(multiLine2, "")
}


console.log(removeComments("1 + /* 2 */3"))
console.log(removeComments("x = 10;// ten!"))
console.log(removeComments("1 /* a */+/* b */ 1"))


// #DYNAMICALLY CREATING REGEXP OBJS
// ? Dynamic regexp obj to match "dea+hl[]rd" in "This dea+hl[]rd guy is super annoying."
const username = "dea+hl[]rd";
const specialRegexChars = ``
const escapedUsername = username.replace(/[*\[\]\{\}?.+$^]/g, "\\$&");
const text = "This dea+hl[]rd guy is super annoying."
const regexp = new RegExp(`\\s?${escapedUsername}`, 'gi')
console.log('has username: ', escapedUsername, ' in text: ', text, " -> ", regexp.test(text))

// # THE SEARCH METHOD vs indexOf
console.log(" word in the text".search(/word/))  //? returns
// "".match

// properties of regex obj : lastIndex
// ? how to use exec regex starting from defined point/index
// ! globals exec updates lastIndex, any execs on that pattern afterwards would have their lastIndex shifted

// #PARSE AN INI FILE like php.ini
// The exact rules for this format—which is a widely used file format, usually called an INI file—are as follows:
//     Blank lines and lines starting with semicolons are ignored.
//     Lines wrapped in [and] start a new section.
//     Lines containing an alphanumeric identifier followed by an = character add a setting to the current section.
//     Anything else is invalid.

const iniText = `searchengine=https://duckduckgo.com/?q=$1
spitefulness=9.7

; comments are preceded by a semicolon...
; each section concerns an individual enemy
[larry]
fullname=Larry Doe
type=kindergarten bully
website=http://www.geocities.com/CapeCanaveral/11451

[davaeorn]
fullname=Davaeorn
type=evil wizard
outputdir=/home/marijn/enemies/davaeorn`
function parseIni(iniFile) {
    const lines = iniFile.split(/\r?\n/)
    let currentSection = null;
    const sectionRegex = /^\[(?<section>.*)\]/
    const keyValueRegex = /^(?<key>[\p{L}\p{N}]*)=(?<val>.*)/u
    const result = {}
    lines.forEach(line => {
        const match = sectionRegex.exec(line)?.groups

        if (match?.section) { currentSection = match.section; result[currentSection] = {}; }
        else {
            const match = keyValueRegex.exec(line)?.groups
            if (match?.key && match?.val) {
                const { key, val } = match
                if (currentSection) result[currentSection][key] = val
                else result[key] = val
            }
        }
    })
    return result
}
console.log('parse ini file: ', parseIni(iniText))
