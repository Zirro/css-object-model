"use strict";

const CSSRuleImpl = require("./CSSRule-impl").implementation;
const CSSStyleDeclaration = require("../generated/CSSStyleDeclaration");

// https://drafts.csswg.org/css-fonts-4/#om-fontface
class CSSFontFaceRuleImpl extends CSSRuleImpl {
  constructor(args, { rule, styleSheet }) {
    super(args, { rule, styleSheet, type: 5 });

    this._rule = rule;
  }

  get style() {
    return CSSStyleDeclaration.create([], {
      ownerNode: null,
      parentCSSRule: this,
      readOnly: false,
      rule: this._rule,
    });
  }
}

module.exports = {
  implementation: CSSFontFaceRuleImpl,
};
