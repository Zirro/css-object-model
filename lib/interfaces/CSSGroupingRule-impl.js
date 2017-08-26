"use strict";

const CSSRuleImpl = require("./CSSRule-impl").implementation;

// https://drafts.csswg.org/css-conditional-3/#the-cssgroupingrule-interface
class CSSGroupingRuleImpl extends CSSRuleImpl {
  constructor(args, { rule, styleSheet }) {
    super(args, { rule, styleSheet }); // TODO add type?

    this._rule = rule;
  }

  // TODO
}

module.exports = {
  implementation: CSSGroupingRuleImpl,
};
