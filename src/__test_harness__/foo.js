/**
 * @typedef boom
 * @property {String} namnam - nom nom
 * @property {String[]} keys - the keys
 */

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
  foo : async function (st,end){
    return Promise.resolve(true)
  },
  /**
   * boo test
   * @param {String} [st] - something
   * @param {boolean} [end=false] - more something
   * @return {boom}
   */
  boo : function (st,end){
    return { namnam: 'xxx', keys: ['a'] }
  }
}
