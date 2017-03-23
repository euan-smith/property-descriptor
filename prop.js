/**
 * @module prop
 */


/**
 *
 * The default properties
 */
const defaultProp = {
  writable: true,
  enumerable: true,
  configurable: false,
  value: undefined
};


/**
 *
 * The prototype for the prop object
 * all methods are chainable
 */
const propProto = {
  _enum(v){
    this.enumerable=v;
    return this;
  },

  _writ(v){
    this.writable=v;
    return this;
  },

  _conf(v){
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
  }
};

function create(props) {
  const prop = makeTarget();
  Object.setPrototypeOf(prop, propProto);
  prop._enum(props.enumerable);
  prop._writ(props.writable);
  prop._conf(props.configurable);
  Object.defineProperty(prop, 'value',
    Object.getOwnPropertyDescriptor(props, 'value')
  );
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

module.exports = create(defaultProp);

// Include a polyfill for setPrototypeOf - taken from MDN
// Only works in Chrome and FireFox, does not work in IE:
Object.setPrototypeOf = Object.setPrototypeOf || function (obj, proto) {
    obj.__proto__ = proto;
    return obj;
  };
