"use strict";

const CSSConditionRuleImpl = require("./CSSConditionRule-impl").implementation;

// https://drafts.csswg.org/css-conditional-3/#the-cssmediarule-interface
class CSSMediaRuleImpl extends CSSConditionRuleImpl {
  constructor(args, { rule, styleSheet }) {
    super(args, { rule, styleSheet, type: 4 });

    this._rule = rule;
  }

  // TODO
}

module.exports = {
  implementation: CSSMediaRuleImpl,
};
