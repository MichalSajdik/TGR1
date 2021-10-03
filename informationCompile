#!/usr/bin/env node

const NUMBER_OF_INFLUENCERS = 3;
let debugPass = false;

let firstLine = true;

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
        matrix[person] = {};
        dict.forEach(function (person2) {
            matrix[person][person2] = 0;
        })
    })
}


function writeEdgeToMatrix(line) {
    if (line.length === 0) {
        return;
    }

    debug("line: " + line);
    let edge = line.split("-");

    if (edge.length !== 2 || edge[0].length === 0 || edge[1].length === 0) {
        console.error("ERROR: Line is ignored because of unexpected format: " + line);
        return;
    }

    edge = edge.map(function (node) {
        return node.trim();
    })

    matrix[edge[0]][edge[1]] = 1;
    matrix[edge[1]][edge[0]] = 1;
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

rl.on('line', function (line) {
    if (firstLine) {
        firstLine = false;

        createMatrix(line);

        dict.forEach(function (person) {
            matrix[person][person] = 1;
        })

        return;
    }

    writeEdgeToMatrix(line);
})

rl.on('close', (input) => {
    debug(matrix)

    debug("Result:");
    console.log("Task 1:")
    dict.forEach(function (person) {
        // in matrix there is person itself which is always '1', so we need to start at '-1' instead of '0'
        let number = -1;

        dict.forEach(function (person2) {
            if (matrix[person][person2]) {
                number++;
            }
        })

        console.log(person + " (" + number + ")");
    })

    // TASK 2
    let mostNodes = 0;
    let firstBestNameCombination = ["default value"];

    let nameCombinations = getCombinations(dict);

    nameCombinations.forEach(function (nameCombination) {
        let mostNodesPerCombination = 0;
        dict.forEach(function (person) {
            let value = 0;
            nameCombination.forEach(function (person2) {
                value = value || matrix[person2][person];
            })
            mostNodesPerCombination += value;
        })
        debug(mostNodesPerCombination);

        if (mostNodes < mostNodesPerCombination) {
            mostNodes = mostNodesPerCombination;
            firstBestNameCombination = nameCombination;
        }
    })

    console.log();
    console.log("Task 2:");
    console.log(firstBestNameCombination[0] + ", " + firstBestNameCombination[1] + ", " + firstBestNameCombination[2] + " (" + (mostNodes - NUMBER_OF_INFLUENCERS) + ")");
});