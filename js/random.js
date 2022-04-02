function randomChance(p) {
    return random() < p;
}

function randInt(min, max) {
    return Math.floor((max - min) * random()) + min;
}

function randFloat(min, max) {
    return (max - min) * random() + min;
}

function permute(list) {
    list.sort(function(a,b) {return random()-0.5});
}

function sampleNoReplace(list) {
    let i = randInt(0,list.length);
    let temp = list[i];
    list[i] = list[list.length-1];
    list.pop();
    return temp;
}

var seed;

function random() {
    if (DEBUG_RNG_SEED) {
        if (seed == undefined) seed = DEBUG_RNG_SEED;
        seed = (seed * 674829 + 587134) % 1048576;
        return seed/1048576;
    } else {
        return Math.random();
    }
}

const hexDigits = ['0', '1', '2', '3', 'c', 'd', 'e', 'f'];
const redHexDigits = ['3', '4', '5'];
const greenHexDigits = ['3', '4', '5', '6'];
const blueHexDigits = ['c', 'd', 'e', 'f'];

function randColor() {
    return "#" + redHexDigits[randInt(0, redHexDigits.length)] + greenHexDigits[randInt(0, greenHexDigits.length)] + blueHexDigits[randInt(0, blueHexDigits.length)];
}