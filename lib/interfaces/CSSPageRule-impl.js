"use strict";

const CSSGroupingRuleImpl = require("./CSSGroupingRule-impl").implementation;
const CSSStyleDeclaration = require("../generated/CSSStyleDeclaration");

// https://drafts.csswg.org/cssom/#the-csspagerule-interface
class CSSPageRuleImpl extends CSSGroupingRuleImpl {
  constructor(args, { rule, styleSheet }) {
    super(args, { rule, styleSheet, type: 6 });

    this._rule = rule;
  }

  get selectorText() {
    // The selectorText attribute, on getting, must return the result of
    // serializing the associated list of CSS page selectors.
    // TODO
  }
  set selectorText(value) {
    // Run the parse a list of CSS page selectors algorithm on the given value.
    // If the algorithm returns a non-null value replace the associated list of
    // CSS page selectors with the returned value. Otherwise, if the algorithm
    // returns a null value, do nothing.
    // TODO
  }

  get style() {
    // The style attribute must return a CSSStyleDeclaration object for the
    // @page at-rule.
    return CSSStyleDeclaration.create([], {
      ownerNode: null,
      parentCSSRule: this,
      readOnly: false,
      rule: this._rule,
    });
  }
}

module.exports = {
  implementation: CSSPageRuleImpl,
};
