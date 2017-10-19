"use strict";

const CSSRuleImpl = require("./CSSRule-impl").implementation;
const CSSStyleDeclaration = require("../generated/CSSStyleDeclaration");

// https://drafts.csswg.org/cssom/#the-cssmarginrule-interface
class CSSMarginRuleImpl extends CSSRuleImpl {
  constructor(args, { rule, styleSheet }) {
    super(args, { rule, styleSheet, type: 9 });

    this._rule = rule;
  }

  get name() {
    // The name attribute must return the name of the margin at-rule.
    // The @ character is not included in the name.
    // TODO
  }

  get style() {
    // The style attribute must return a CSSStyleDeclaration object for the margin at-rule.
    return CSSStyleDeclaration.create([], {
      ownerNode: null,
      parentCSSRule: this,
      readOnly: false,
      rule: this._rule,
    });
  }
}

module.exports = {
  implementation: CSSMarginRuleImpl,
};
