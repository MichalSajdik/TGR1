#!/usr/bin/env node
let debugPass = false;

var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
});

function debug(s) {
    if (debugPass) {
        console.log(s);
    }
}

function getCombinations(valuesArray, nLengthOfCombinations) {
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
        return comb.length === nLengthOfCombinations
    });
    return combinations;
}

function validateLine(line) {
    if (line.length < 2) {
        return false;
    }
    // TODO add more validation for input
    return true;
}

let firstLine = true;
let storageStops = [];
let routes = [];
rl.on('line', function (line) {
    if (firstLine) {
        firstLine = false;

        lines = line.split(',');
        storageStops = lines.map(function (line) {
            return line.trim();
        })
        return;
    }

    if (!validateLine(line)) {
        return;
    }

    let splitLine = line.split(":")
    splitLine = splitLine.map(function (line) {
        return line.trim();
    })

    routes.push(splitLine)

})

rl.on('close', (input) => {
    debug(storageStops);
    debug("----");
    debug(routes);
    debug("----");
    debug("----");
    printMostVisitedStorageStop();
    printSameRouteUsedMoreThanOnce();
    printIsolatedRouteExists();
    printStorageStopIsNotInCarRoutes();
    printDirectRouteBetweenAllStorageStops();
    printAllDirectRoutesHaveReverseDirectRoute();
    printSameAmountOfVehiclesInAllStorageStops();
    printVisitedAllStorageStops();
});

function printVisitedAllStorageStops() {
    let bSomebodyVisitedAllStorageStops = false;
    let listOfVehiclesThatVisitedAllStorageStops = [];
    routes.forEach(function (route) {
        let bVisitedAllStorageStops = true;
        storageStops.forEach(function (storageStop) {
            if (!route[1].includes(storageStop)) {
                bVisitedAllStorageStops = false;
            }
        });
        if (bVisitedAllStorageStops) {
            bSomebodyVisitedAllStorageStops = true;
            listOfVehiclesThatVisitedAllStorageStops.push(route[0]);
        }
    })


    if (bSomebodyVisitedAllStorageStops) {
        console.log("navstivil nekdo vsechna mesta: " + listOfVehiclesThatVisitedAllStorageStops.toString());
    } else {
        console.log("navstivil nekdo vsechna mesta: ne");
    }
}

function getCarRoutes() {
    return routes.filter(function (route) {
        return route[0].startsWith("auto");
    })
}

function printSameAmountOfVehiclesInAllStorageStops() {
    let aCarRoutes = getCarRoutes();
    let dictStorageStops = [];
    storageStops.forEach(function (sStorageStop) {
        dictStorageStops[sStorageStop] = 0;
    });

    aCarRoutes.forEach(function (sCarRoute) {
        let aStorageStopsPerRoute = getStorageStopsPerRouteInArray(sCarRoute);
        aStorageStopsPerRoute.forEach(function (sStorageStop) {
            dictStorageStops[sStorageStop]++;
        })
    });

    let bEquilibrium = true;
    let nStorageCarsVisited = dictStorageStops[storageStops[0]]
    storageStops.forEach(function (sStorageStop) {
        if (dictStorageStops[sStorageStop] !== nStorageCarsVisited) {
            bEquilibrium = false;
        }
    });

    if (bEquilibrium) {
        console.log("rovnovaha v dopravni siti: ano");
    } else {
        console.log("rovnovaha v dopravni siti: ne");
    }
}

function swapArrayValues(aArray) {
    let sString = aArray[0];
    aArray[0] = aArray[1];
    aArray[1] = sString;
    return aArray;
}

function printAllDirectRoutesHaveReverseDirectRoute() {
    let aaExtractedDirectRoutes = extractDirectRoutesFromRoutes();
    for (let i = 0; i < aaExtractedDirectRoutes.length; i++) {
        let aExtractedDirectRoutes = JSON.parse(JSON.stringify(aaExtractedDirectRoutes[i]));
        aExtractedDirectRoutes = swapArrayValues(aExtractedDirectRoutes)

        let bFoundReverseRoute = false;
        aaExtractedDirectRoutes.forEach(function (aExtractedDirectRoutes2) {
            if (JSON.stringify(aExtractedDirectRoutes2) === JSON.stringify(aExtractedDirectRoutes)) {
                bFoundReverseRoute = true;
            }
        });
        if (!bFoundReverseRoute) {
            console.log("obousmerne trasy: ne");
            return;
        }
    }
    console.log("obousmerne trasy: ano");
}

function extractDirectRoutesFromRoutes() {

    let aRoutePairs = [];

    for (let j = 0; j < routes.length; j++) {
        let route = routes[j];

        let aStorageStopsPerRoute = getStorageStopsPerRouteInArray(route);

        for (let i = 0; i < aStorageStopsPerRoute.length - 1; i++) {
            let sPairedRoute = [];
            sPairedRoute.push(aStorageStopsPerRoute[i]);
            sPairedRoute.push(aStorageStopsPerRoute[i + 1]);
            aRoutePairs.push(sPairedRoute);
        }
    }
    return aRoutePairs;
    // debug(aRoutePairs)
}

function printDirectRouteBetweenAllStorageStops() {

    let aAllStorageStopsCombination = getCombinations(storageStops, 2);
    console.log(storageStops);
    console.log(aAllStorageStopsCombination);
    for (let j = 0; j < routes.length; j++) {
        let route = routes[j];
        let aStorageStopsPerRoute = getStorageStopsPerRouteInArray(route);

        for (let i = 0; i < aStorageStopsPerRoute.length - 1; i++) {
            let sStorageStopPerRoute = aStorageStopsPerRoute[i];
            let sStorageStopPerRouteNext = aStorageStopsPerRoute[i + 1];

            aAllStorageStopsCombination = aAllStorageStopsCombination.filter(function (aCombinedRoute) {
                return !(((aCombinedRoute[0] === sStorageStopPerRoute) && (aCombinedRoute[1] === sStorageStopPerRouteNext)) ||
                    ((aCombinedRoute[1] === sStorageStopPerRoute) && (aCombinedRoute[0] === sStorageStopPerRouteNext)));
            })
        }
    }

    // debug(aAllStorageStopsCombination); // routes which are in routes but if they were then it will return "ano"
    if (aAllStorageStopsCombination.length === 0) {
        console.log("vsechna prima spojeni: ano");
    } else {
        console.log("vsechna prima spojeni: ne");
    }
}

function printStorageStopIsNotInCarRoutes() {
    let aCarRoutes = getCarRoutes();

    let aUncheckedStorageStops = JSON.parse(JSON.stringify(storageStops)); // deep copy

    for (let j = 0; j < aCarRoutes.length; j++) {
        let route = aCarRoutes[j];

        let aStorageStopsPerRoute = getStorageStopsPerRouteInArray(route);

        for (let i = 0; i < aStorageStopsPerRoute.length; i++) {
            let sStorageStopPerRoute = aStorageStopsPerRoute[i];
            aUncheckedStorageStops = aUncheckedStorageStops.filter(function (sUncheckedStorageStop) {
                return sUncheckedStorageStop !== sStorageStopPerRoute;
            })
        }
    }

    if (aUncheckedStorageStops.length === 0) {
        console.log("mesto bez zasobeni: ne");
    } else {
        console.log("mesto bez zasobeni: ano");
    }
}


function printMostVisitedStorageStop() {
    let mostStorageStopVisits = 0;
    let mostStorageStopVisited = "no storage stop";
    storageStops.forEach(function (storageStop) {
        let storageStopVisits = 0;
        routes.forEach(function (route) {
            storageStopVisits += route[1].split(storageStop).length - 1;
        })
        if (storageStopVisits > mostStorageStopVisits) {
            mostStorageStopVisits = storageStopVisits;
            mostStorageStopVisited = storageStop;
        }
    })
    console.log("nejvice navstevovany: " + mostStorageStopVisited + " " + mostStorageStopVisits)
}

function getStorageStopsPerRouteInArray(route) {
    return route[1].split(">").map(function (sStorageStopPerRoute) {
        return sStorageStopPerRoute.trim();
    })
}

function printSameRouteUsedMoreThanOnce() {
    let aRoutePairs = [];

    for (let j = 0; j < routes.length; j++) {
        let route = routes[j];

        let aStorageStopsPerRoute = getStorageStopsPerRouteInArray(route);
        for (let i = 0; i < aStorageStopsPerRoute.length - 1; i++) {
            let sPairedRoute = aStorageStopsPerRoute[i] + aStorageStopsPerRoute[i + 1];

            let sAllStorageStopsPerRoute = "";
            aStorageStopsPerRoute.forEach(function (elem) {
                sAllStorageStopsPerRoute += elem;
            })

            if (aRoutePairs.includes(sPairedRoute) && (sAllStorageStopsPerRoute.split(sPairedRoute).length > 2)) {
                continue; //same direct route in one big route, we are only interested in other routes
            }

            if (aRoutePairs.includes(sPairedRoute)) {
                console.log("existuje vice spojeni mezi dvema mesty: ano")
                return; // route is duplicated so no need to continue
            }
            aRoutePairs.push(sPairedRoute);
        }
    }
    console.log("existuje vice spojeni mezi dvema mesty: ne")
}

function routeContainsOnlyOneStorageStopType(aStorageStopsPerRoute, storageStop) {
    return aStorageStopsPerRoute.every(function (sStorageStopPerRoute) {
        return sStorageStopPerRoute === storageStop;
    })
}

function printIsolatedRouteExists() {
    let aCarRoutes = getCarRoutes()
    for (let j = 0; j < aCarRoutes.length; j++) {
        let route = aCarRoutes[j];

        let aStorageStopsPerRoute = getStorageStopsPerRouteInArray(route);
        for (let i = 0; i < storageStops.length; i++) {
            storageStop = storageStops[i];
            if (routeContainsOnlyOneStorageStopType(aStorageStopsPerRoute, storageStop)) {
                console.log("nesmyslna smycka: ano");
                return;
            }
        }
    }
    console.log("nesmyslna smycka: ne");
}