"use strict";

const idlUtils = require("../generated/utils.js");

class CSSRuleListImpl {
  constructor(args, { createdRules }) {
    this._list = createdRules;
  }

  item(index) {
    // The item(index) method must return the indexth CSSRule object in the collection.
    if (this._list[index]) {
      return this._list[index];
    }

    // If there is no indexth object in the collection, then the method must return null.
    return null;
  }

  get length() {
    return this._list.length;
  }

  get [idlUtils.supportedPropertyIndices]() {
    return this._list.keys();
  }
}

module.exports = {
  implementation: CSSRuleListImpl,
};
