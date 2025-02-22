/**
 * @typedef boom
 * @property {String} namnam - nom nom
 * @property {String[]} keys - the keys
 */

/**
 * A class with secrets
 * @class
 */
class AClassWithSecrets {
  name
  constructor (options = { name: 'unknown' }) {
    this._name = options.name || 'unknown'
  }

  get name () {
    return this._name
  }

  set name (value) {
    this._name = value
  }
}

/**
 * Foo test
 * @type {{boo: exports.boo, foo: exports.foo}}
 */
module.exports = {
  /**
   * foo test
   * @param {String} st - something
   * @param {boolean} end - more of something
   * @return {Promise<boolean>}
   */
  foo: async function (st,end){
    return Promise.resolve(true)
  },
  /**
   * boo test
   * @param {String} [st] - something
   * @param {boolean} [end=false] - more something
   * @return {boom}
   */
  boo: function (st,end){
    return { namnam: 'xxx', keys: ['a'] }
  },
  /**
   * return a class.
   */
  aClass: AClassWithSecrets
}
