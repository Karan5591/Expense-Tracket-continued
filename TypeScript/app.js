"use strict";
const num1Ele = document.getElementById("num1");
const num2Ele = document.getElementById("num2");
const buttonElement = document.querySelector('button');
const numResults = [];
const textResult = [];
function add(num1, num2) {
    if (typeof num1 === 'number' && typeof num2 === 'number') {
        return num1 + num2;
    }
    if (typeof num1 === 'string' && typeof num2 === 'string') {
        return num1 + '' + num2;
    }
}
function printResult(resultObj) {
    console.log(resultObj.val);
}
buttonElement.addEventListener('click', () => {
    const num1 = num1Ele.value;
    const num2 = num2Ele.value;
    const result = add(+num1, +num2);
    const stringResult = add(num1, num2);
    numResults.push(result);
    textResult.push(stringResult);
    printResult({ val: result, timestamp: new Date() });
    console.log(numResults, textResult);
});
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("It worked");
    }, 1000);
});
myPromise.then((result) => {
    console.log(result.split('w'));
});
