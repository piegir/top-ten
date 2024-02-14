import React from "react";
import {currentUser} from "../authentication/authentication.js";

export function wait(delayMilliSeconds) {
    let start = Date.now();
    let now = start;
    while (now - start < delayMilliSeconds) {
        now = Date.now();
    }
}

let restApiIp = "https://top-ten-rest-api.onrender.com";
// let restApiIp = "http://0.0.0.0:80"; // For local testing

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
        .catch((error) => alert(error));
}

export function makeGetCall(endpoint) {
    return makeRestApiCall(endpoint, endpointTypes.GET);
}

export function makePostCall(endpoint, inputData = null) {
    return makeRestApiCall(endpoint, endpointTypes.POST, inputData);
}
