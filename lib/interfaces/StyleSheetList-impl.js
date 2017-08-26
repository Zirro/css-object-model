"use strict";

const idlUtils = require("../generated/utils.js");

class StyleSheetListImpl {
  constructor(args, privateData) {
    this._list = [];
  }

  item(index) {
    // The item(index) method must return the indexth CSS style sheet in the collection.
    if (this._list[index]) {
      return this._list[index];
    }

    // If there is no indexth object in the collection, then the method must return null.
    return null;
  }

  get length() {
    // The length attribute must return the number of CSS style sheets represented by the collection.
    return this._list.length;
  }

  get [idlUtils.supportedPropertyIndices]() {
    return this._list.keys();
  }
}

module.exports = {
  implementation: StyleSheetListImpl,
};
