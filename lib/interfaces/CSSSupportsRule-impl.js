"use strict";

const CSSConditionRuleImpl = require("./CSSConditionRule-impl").implementation;

// https://drafts.csswg.org/css-conditional-3/#the-csssupportsrule-interface
class CSSSupportsRuleImpl extends CSSConditionRuleImpl {
  constructor(args, { rule, styleSheet }) {
    super(args, { rule, styleSheet }); // TODO add type

    this._rule = rule;
  }

  // TODO
}

module.exports = {
  implementation: CSSSupportsRuleImpl,
};
