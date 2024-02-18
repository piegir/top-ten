import React from "react";
import {currentUser} from "../authentication/authentication.js";

export const colors = {
    white: [255, 255, 255],
    red: [255, 0, 0],
    green: [0, 255, 0],
    blue: [0, 0, 255],
    darkRed: [127, 0, 0],
    darkGreen: [0, 127, 0],
    darkBlue: [0, 0, 127],
    yellow: [255, 255, 0],
    nicerYellow: [230, 230, 0],
    gold: [255, 192, 0],
    magenta: [255, 0, 255],
    cyan: [0, 255, 255],
    gray: [127, 127, 127],
    orange: [255, 127, 0],
    grassGreen: [127, 255, 0],
    pink: [255, 0, 127],
    purple: [127, 0, 255],
    springGreen: [0, 255, 127],
    brightBlue: [0, 127, 255],
    black: [0, 0, 0],
}

let interpolateColor = (position, firstColor, lastColor) => {
    return firstColor.map((colorComponent, index) => {
        return (1-position) * colorComponent + position * lastColor[index];
    })
}

export function getColorFromScale({value, minValue = 0, maxValue = 100, beginColor = colors.darkGreen, endColor = colors.red, middleColor = colors.nicerYellow, opacity = 1}) {
    return getColorFromScaleValues(value, minValue, maxValue, beginColor, endColor, middleColor, opacity);
}

let getColorFromScaleValues = (value, minValue, maxValue, beginColor, endColor, middleColor, opacity) => {
    let middleValue = (maxValue - minValue) / 2;
    let arrayColor;
    if (value < middleValue) {
        arrayColor = interpolateColor((value - minValue) / (middleValue - minValue), beginColor, middleColor);
    }
    else {
        arrayColor = interpolateColor((value - middleValue) / (maxValue - middleValue), middleColor, endColor);
    }
    return `rgba(${arrayColor[0]}, ${arrayColor[1]}, ${arrayColor[2]}, ${opacity})`;
}

export function wait(delayMilliSeconds) {
    let start = Date.now();
    let now = start;
    while (now - start < delayMilliSeconds) {
        now = Date.now();
    }
}

export function repeat(handler, timeout) {
    if (currentUser.loggedIn) {
        return setTimeout(handler, timeout);
    }
    else {
        console.error("Method Not Allowed. User not logged in.");
    }
}

let restApiIp = "https://top-ten-rest-api.onrender.com";
//let restApiIp = "http://0.0.0.0:80"; // For local testing

let endpointTypes = {
    GET: 0,
    POST: 1,
}

function makeRestApiCall(endpoint, endpointType, inputData = null) {
    let requestOptions;

    switch (endpointType) {
        case endpointTypes.POST:
            requestOptions = {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${currentUser.username}`,
                    "Content-Type": "application/json",
                },
                body: inputData !== null ? JSON.stringify(inputData) : "",
            }
            break;
        case endpointTypes.GET:
            requestOptions = {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${currentUser.username}`,
                },
            }
            break;
        default:
            throw new SyntaxError("Wrong endpoint type provided.");
    }

    return fetch(`${restApiIp}${endpoint}`, requestOptions)
        .then((response) => response.json())
        .catch((error) => {
            alert(`${error}\n
            From call: ${restApiIp}${endpoint}\n
            With options: ${JSON.stringify(requestOptions)}`);
        });
}

export function makeGetCall(endpoint) {
    return makeRestApiCall(endpoint, endpointTypes.GET);
}

export function makePostCall(endpoint, inputData = null) {
    return makeRestApiCall(endpoint, endpointTypes.POST, inputData);
}
