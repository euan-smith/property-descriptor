/**
 * @module prop
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
const propDesc = Object.keys(propProto).reduce(function(d,k){
  //for each prototype property get the descriptor and add it to the descriptor object
  d[k]=Object.getOwnPropertyDescriptor(propProto,k);
  //hide all inherited properties
  d[k].enumerable=false;
  return d;
},{});

// Make a clone of a prop object
function clone(source) {
  const target = makeTarget();
  Object.defineProperties(target, propDesc);
  target._enum(source.enumerable);
  target._writ(source.writable);
  target._conf(source.configurable);
  Object.defineProperty(target, 'value',
    Object.getOwnPropertyDescriptor(source, 'value')
  );
  return target;
}

// Make a new base prop object
function makeTarget() {
  return function prop (val, isMethod) {
    var newProp = clone(prop);
    const isFactory = typeof val === 'function' && !isMethod;
    Object.defineProperty(newProp, 'value', isFactory ? {get: val} : {value: val});
    return newProp;
  };
}

module.exports = clone(defaults);
