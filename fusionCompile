#!/usr/bin/env node

const NUMBER_OF_INFLUENCERS = 3;
const NUMBER_OF_MATRIXES_TO_BE_MERGED = 2;
let numberOfMatrixis = 0;
let debugPass = false;

var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
});

var dict = [];
var matrix = {};

function debug(s) {
    if (debugPass) {
        console.log(s);
    }
}

function createMatrix(line) {
    var i = 0;

    lines = line.split(',');
    lines.forEach(function (line) {
        dict[i] = line.trim();
        i++;
    })

    dict.forEach(function (person) {
        matrix[person.toLowerCase()] = {};
        dict.forEach(function (person2) {
            matrix[person.toLowerCase()][person2.toLowerCase()] = 0;
        })
    })
}


function writeEdgeToMatrix(line) {
    if (line.length === 0) {
        return;
    }

    debug("line: " + line);
    let edge = line.split("->");

    if (edge.length !== 2 || edge[0].length === 0 || edge[1].length === 0) {
        console.error("ERROR: Line is ignored because of unexpected format: " + line);
        return;
    }

    edge = edge.map(function (node) {
        return node.trim().toLowerCase();
    })

    if (!matrix[edge[0]][edge[1]]) {
        matrix[edge[0]][edge[1]] = 1;
        return true; // It is not yet in
    }
    return false;
}

function getCombinations(valuesArray) {
    let combinations = [];
    let length = valuesArray.length;
    for (let i = 0; i < Math.pow(2, length); i++) {
        let tmp = [];
        for (let j = 0; j < length; j++) {
            if ((i & Math.pow(2, j))) {
                tmp.push(valuesArray[j]);
            }
        }
        if (tmp.length > 0) {
            combinations.push(tmp);
        }
    }
    combinations = combinations.filter(function (comb) {
        return comb.length === NUMBER_OF_INFLUENCERS
    });
    return combinations;
}

let loadingMatrixisFinished = false;
let allMatrixisInOneLine = "";
let mergedRoutes = [];
let canceledRoutes = [];

rl.on('line', function (line) {
    if (numberOfMatrixis < NUMBER_OF_MATRIXES_TO_BE_MERGED) {
        numberOfMatrixis++;

        if (allMatrixisInOneLine.length === 0) {
            allMatrixisInOneLine = line;
            return;
        }
        allMatrixisInOneLine += ", " + line;
        return;
    }
    if (!loadingMatrixisFinished) {
        loadingMatrixisFinished = true;
        createMatrix(allMatrixisInOneLine);

    }
    if (writeEdgeToMatrix(line)) {
        mergedRoutes.push(line);
    } else {
        canceledRoutes.push(line);
    }

})

rl.on('close', (input) => {
    mergedRoutes.forEach(function (route) {
        console.log(route);
    })

    console.log("----");

    canceledRoutes.forEach(function (route) {
        console.log(route);
    })
});