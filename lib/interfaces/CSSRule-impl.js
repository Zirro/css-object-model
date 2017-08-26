"use strict";

const csstree = require("css-tree");

// https://drafts.csswg.org/cssom/#cssrule
class CSSRuleImpl {
  constructor(args, { rule, styleSheet, type }) {
    this._rule = rule;
    this._parentRule = null; // TODO
    this._parentStyleSheet = styleSheet;

    this._type = type;
  }

  get type() {
    // The type attribute must return the CSS rule type
    return this._type;
  }

  get cssText() {
    // The cssText attribute must return a serialization of the CSS rule.
    return csstree.translate(this._rule);
  }
  set cssText(value) {
    // On setting the cssText attribute must do nothing.
  }

  get parentRule() {
    // A reference to an enclosing CSS rule or null. If the rule has an enclosing rule when it is created, then this item is initialized to the enclosing rule; otherwise it is null.
    // TODO-check - is it null when there is no enclosing rule?
    return this._parentRule;
  }
  set parentRule(value) {
    // It can be changed to null.
    if (value === null) {
      this._parentRule = null;
    }
  }

  get parentStyleSheet() {
    // A reference to a parent CSS style sheet or null. This item is initialized to reference an associated style sheet when the rule is created.
    return this._parentStyleSheet;
  }
  set parentStyleSheet(value) {
    // It can be changed to null.
    if (value === null) {
      this._parentStyleSheet = null;
    }
  }
}

module.exports = {
  implementation: CSSRuleImpl,
};
