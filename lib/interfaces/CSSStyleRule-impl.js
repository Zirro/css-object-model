"use strict";

const CSSRuleImpl = require("./CSSRule-impl").implementation;
const CSSStyleDeclaration = require("../generated/CSSStyleDeclaration");

// https://drafts.csswg.org/cssom/#the-cssstylerule-interface
class CSSStyleRuleImpl extends CSSRuleImpl {
  constructor(args, { rule, styleSheet }) {
    super(args, { rule, styleSheet, type: 1 });

    this._rule = rule;
  }

  get selectorText() {
    // The selectorText attribute, on getting, must return the
    // result of serializing the associated group of selectors.
    return "div"; // TODO
  }
  set selectorText(value) {
    // Run the parse a group of selectors algorithm on the given value.
    // If the algorithm returns a non-null value replace the associated group of selectors with the returned value.
    // Otherwise, if the algorithm returns a null value, do nothing.
    // TODO
  }

  get style() {
    // The style attribute must return a CSSStyleDeclaration object for the style rule.
    return CSSStyleDeclaration.create([], {
      ownerNode: null,
      parentCSSRule: this,
      readOnly: false,
      rule: this._rule,
    });
  }
}

module.exports = {
  implementation: CSSStyleRuleImpl,
};
