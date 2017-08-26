"use strict";

const MediaList = require("../generated/MediaList");

class StyleSheetImpl {
  constructor(args, { ownerNode }) {
    this._ownerNode = ownerNode;
  }

  get type() {
    return "text/css";
  }

  get href() {
    return null; // TODO
  }

  get location() {
    return null; // TODO
  }

  get ownerNode() {
    return this._ownerNode;
  }

  get parentStyleSheet() {
    return null; // TODO
  }

  get title() {
    return null; // TODO
  }

  get media() {
    return null; // TODO
  }

  get disabled() {
    return false; // TODO
  }
}

module.exports = {
  implementation: StyleSheetImpl,
};
