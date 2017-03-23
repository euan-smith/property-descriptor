# prop-d
An ES-5 object property descriptor factory.

![tests](https://travis-ci.org/zakalwe314/property-descriptor.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/zakalwe314/property-descriptor/badge.svg?branch=master)](https://coveralls.io/r/zakalwe314/property-descriptor?branch=master)

## Description

Writing out object descriptors is tedius and not very DRY, however they can be very useful.  
This is a tiny (1k minified, <0.5k gzipped) library to take away the tedium and make your code more readable.

## Install
```bash
$ npm install prop-d --save-dev
```
##Usage
Require it and define a property on an object:
```javascript
const prop = require('prop-d');

const o = Object.defineProperty({},'p',prop(5));
// o = {"p":5}
```
OK, so that's not so interesting, an object literal would be simpler.  How about non-enumerable properties?
```javascript
const o = Object.defineProperty({public:5},'_private',prop(42).hidden);

Object.keys(o).forEach(k=>console.log(k));
// only 'public' is listed
```

Or how about defining a load of properties of different kinds and using Object.create in a factory function.
```javaScript
const myProperties = {
  generalProperty: prop(),
  initialisedProp: prop(42),
  alwaysTrue: prop(true).constant,
  _private: prop().hidden,
  _arrayInstance: prop(()=>[]).hidden.constant,
  squareIt: prop(x=>x*x, true)
};

//the resultant descriptors can be used in an object factory 
function myObjectFactory(){
  return Object.create(null, myProperties);
}

var myNewObject = myObjectFactory();
```
## API

### `prop ([value, [isMethod]])`
returns a Prop object which has all the properties of a _data_ descriptor with the following defaults:

|     property | initial value |
| -----------: | :------------ |
|   enumerable | true          |
|     writable | true          |
| configurable | false         |
|        value | _value_       |

If the supplied value _is not_ a function then it is assigned to the `value` property.

If the supplied value _is_ a function and isMethod is false or missing, then the function will be used as a factory function
for the descriptor value.

If the supplied value _is_ a function and isMethod is true then the function is directly assigned as thedescriptor value.

#### example
```
const props={
  a:prop(5),
  b:prop({}),
  c:prop(function(){return {}}),
  d:prop(x=>x+1,true)
};

const o1 = Object.create(null, props);
const o2 = Object.create(null, props);

console.log(o1);
// { a: 5, b: {}, c: {}, d: [Function] }

//o1.b and o2.b are pointing at the SAME object
o1.b === o2.b; //true
o1.b.theSame=true;
console.log(o2);
//{ a: 5, b: { theSame: true }, c: {}, d: [Function] }

//o1.c and o2.c are pointing at their own instances
o1.c === o2.c; //false

//o1.d and o2.d are pointing at the same method
o1.d === o2.d; //true
o1.d(4);// returns 5;

```

### Methods of the prop object
There are six chainable properties of the object returned by `prop()` which modify the descriptor, two for each of the 
three boolean descriptor properties: 

| descriptor property | property to set to true | property to set to false
| --- | --- | --- |
| enumerable | .visible | .hidden |
| writable | .variable | .constant |
| configurable | .thawed | .frozen |


### Making a new root object

If you are making a lot of constant or hidden variables, it can be tedius to write them out all the time (and not as DRY as we would like), so there is one other trick up `prop`'s sleeve.  Every prop object can act as a root method exacly as the `prop` object itself.

```
const privateProp = prop().hidden;
const fooProps = {
  _a: privateProp(5),
  _b: privateProp(()=>[]).constant
}

//or even
const privateArray = prop(()=>{}).hidden.constant;
const barProps = {
  _a1: privateArray,
  _a2: privateArray
}
```

# Testing
```
npm test
```

# Contributing
In lieu of a coding style, please use the style of the existing code as an example.

# Release History
- 1.0.0 
  - Initial release, all test passing
- 1.0.1
  - Added coveralls, 100% coverage
- 1.1.0
  - Made the chainable methods return new objects, no longer possible to accidentally modify a reference to a prop object - warning also removed from doc.
  - Removed some code that had become unessesary due to the above change.
  - Reduced the code size a little
  - Added a restriction on node version to package.json
- 1.2.0
  - Added a babel build process to remove ES6 requirement

#License

Copyright (c) 2017 Euan Smith

MIT License