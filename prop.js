/**
 * @module prop
 */

/**
 * @name PropD
 * @function
 * @param {*|function} Value A value to be assigned or a factory function to generate a value 
 * @param {boolean} isMethod If Value is a function then it is taken as a factory function unless isMethod is true.
 * @returns {PropD}
 * @property {PropD} hidden Returns a descriptor with ennumerable = false
 * @property {PropD} visible Returns a descriptor with ennumerable = true
 * @property {PropD} constant Returns a descriptor with writable = false
 * @property {PropD} variable Returns a descriptor with writable = true
 * @property {PropD} frozen Returns a descriptor with configurable = false
 * @property {PropD} thawed Returns a descriptor with configurable = true
 */

/**
 *
 * The prototype for the prop object
 * all methods are chainable
 */
const propProto = {
  _enum: function(v){
    this.enumerable=v;
    return this;
  },

  _writ: function(v){
    this.writable=v;
    return this;
  },

  _conf: function(v){
    this.configurable=v;
    return this;
  },

  get hidden() {
    return clone(this)._enum(false);
  },

  get visible() {
    return clone(this)._enum(true);
  },

  get constant() {
    return clone(this)._writ(false);
  },

  get variable() {
    return clone(this)._writ(true);
  },

  get frozen() {
    return clone(this)._conf(false);
  },

  get thawed() {
    return clone(this)._conf(true);
  }
};

//The default descriptor properties
const defaults = {
  writable: true,
  enumerable: true,
  configurable: false,
  value: undefined
};

// Reduce the prototype to a property descriptor object
// This enables the methods to be added to an object with a single call to defineProperties
const propDesc = Object.keys(propProto).reduce(function(d,k){
  //for each prototype property get the descriptor and add it to the descriptor object
  d[k]=Object.getOwnPropertyDescriptor(propProto,k);
  //hide all inherited properties
  d[k].enumerable=false;
  return d;
},{});

/**
 * The next two methods enable the core functionality by creating new instances of the prop object
 * As new prop instances are created through chaining an existing instance, this inevitably means
 * that they call each other.
 */



/**
 * Make a clone of a prop object
 * @function
 * @param {PropD} source A prop object to clone
 * @returns {PropD}
 */
function clone(source) {
  //Get a new base PropD function instance
  const target = makeTarget();
  //Compose the PropD methods onto the function using the property descriptor generated above
  Object.defineProperties(target, propDesc);
  //Copy the properties from the source prop object to the target
  target._enum(source.enumerable);
  target._writ(source.writable);
  target._conf(source.configurable);
  //The value property needs to be copied as a descriptor (as it might be a factory function)
  Object.defineProperty(target, 'value',
    Object.getOwnPropertyDescriptor(source, 'value')
  );
  //done. Return the new PropD instance.
  return target;
}

/**
 * Make a new base prop function
 * @function
 * @returns {PropD}
 */
function makeTarget() {
  //Return a new prop function instance
  //This function provides the core PropD functionality
  //Calling it creates a new PropD instance with the value set
  return function prop (val, isMethod) {
    //get a new PropD instance to return which is a clone of this one
    var newProp = clone(prop);
	//Check if the val is a factory function
    const isFactory = typeof val === 'function' && !isMethod;
	//define the value property - a getter if it is a factory function, a plane value if not
    Object.defineProperty(newProp, 'value', isFactory ? {get: val} : {value: val});
	//done. Return the new PropD instance.
    return newProp;
  };
}

//Export the default PropD instance, based on the defaults object.
module.exports = clone(defaults);
