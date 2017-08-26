"use strict";

const CSSRuleImpl = require("./CSSRule-impl").implementation;

// https://drafts.csswg.org/cssom/#the-cssimportrule-interface
class CSSImportRuleImpl extends CSSRuleImpl {
  constructor(args, { rule, styleSheet }) {
    super(args, { rule, styleSheet, type: 3 });

    this._rule = rule;
  }

  get href() {

  }

  get media() {

  }

  get styleSheet() {

  }
}

module.exports = {
  implementation: CSSImportRuleImpl,
};
