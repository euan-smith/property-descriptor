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
    return create(this)._enum(false);
  },

  get visible() {
    return create(this)._enum(true);
  },

  get constant() {
    return create(this)._writ(false);
  },

  get variable() {
    return create(this)._writ(true);
  },

  get frozen() {
    return create(this)._conf(false);
  },

  get thawed() {
    return create(this)._conf(true);
  },

  writable: true,

  enumerable: true,

  configurable: false,

  value: undefined
};

// Reduce the prototype to a property descriptor object
const propDesc = Object.keys(propProto).reduce(function(d,k){
  d[k]=Object.getOwnPropertyDescriptor(propProto,k);
  // hide all getter and function properties
  if (!d[k].hasOwnProperty('value') || typeof d[k].value === "function")
    d[k].enumerable=false;
  return d;
},{});

function create(props) {
  const prop = makeTarget();
  Object.defineProperties(prop, propDesc);
  if (props){
    prop._enum(props.enumerable);
    prop._writ(props.writable);
    prop._conf(props.configurable);
    Object.defineProperty(prop, 'value',
      Object.getOwnPropertyDescriptor(props, 'value')
    );
  }
  return prop;
}

function makeTarget() {
  const prop = function (val, isMethod) {
    var rtn = create(prop);
    if (arguments.length > 0) {
      if (typeof val === 'function' && !isMethod) {
        Object.defineProperty(rtn, 'value', {get: val});
      } else {
        Object.defineProperty(rtn, 'value', {value: val});
      }
    }
    return rtn;
  };
  return prop;
}

module.exports = create();
