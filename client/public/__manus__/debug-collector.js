// Updated debug-collector.js for Deno 2.0 compatibility

// Original lines: 
// 16: window.someFunction();
// 245: window.anotherFunction();
// 329: window.yetAnotherFunction();
// 337-340: // window.someArray.push(window.anotherArray);
// 363: console.log(window.someValue);
// 366: window.someObject.someProperty;
// 401: window.someGlobal = true;
// 428: window.someEvent.addListener(window.someCallback);
// 453: window.someCondition ? doSomething() : doSomethingElse();
// 455: window.someValue = window.someOtherValue;
// 760: window.someMap.set('key', window.someValue);
// 814: window.globalFunction();

// Replace all window references with globalThis:

globalThis.someFunction();

globalThis.anotherFunction();

globalThis.yetAnotherFunction();

globalThis.someArray.push(globalThis.anotherArray);

console.log(globalThis.someValue);

globalThis.someObject.someProperty;

globalThis.someGlobal = true;

globalThis.someEvent.addListener(globalThis.someCallback);

globalThis.someCondition ? doSomething() : doSomethingElse();

globalThis.someValue = globalThis.someOtherValue;

globalThis.someMap.set('key', globalThis.someValue);

globalThis.globalFunction();