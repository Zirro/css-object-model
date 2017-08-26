"use strict";

const CSSGroupingRuleImpl = require("./CSSGroupingRule-impl").implementation;

// https://drafts.csswg.org/css-conditional-3/#the-cssconditionrule-interface
class CSSConditionRuleImpl extends CSSGroupingRuleImpl {
  constructor(args, { rule, styleSheet }) {
    super(args, { rule, styleSheet }); // TODO add type?

    this._rule = rule;
  }

  // TODO
}

module.exports = {
  implementation: CSSConditionRuleImpl,
};
