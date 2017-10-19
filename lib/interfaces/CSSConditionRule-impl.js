"use strict";

const CSSGroupingRuleImpl = require("./CSSGroupingRule-impl").implementation;

// https://drafts.csswg.org/css-conditional-3/#the-cssconditionrule-interface
class CSSConditionRuleImpl extends CSSGroupingRuleImpl {
  constructor(args, { rule, styleSheet }) {
    super(args, { rule, styleSheet }); // TODO add type?

    this._rule = rule;
  }

  get conditionText() {
    // The conditionText attribute, on getting, must return
    // the result of serializing the associated condition.

  }
  set conditionText(value) {
    // Trim the given value of white space.
    value = value.trim();

    // If the given value matches the grammar of the
    // appropriate condition production for the given rule,
    // replace the associated CSS condition with the given value.

    // Otherwise, do nothing.
  }
}

module.exports = {
  implementation: CSSConditionRuleImpl,
};
