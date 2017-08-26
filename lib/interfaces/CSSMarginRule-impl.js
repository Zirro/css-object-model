"use strict";

const CSSRuleImpl = require("./CSSRule-impl").implementation;

// https://drafts.csswg.org/cssom/#the-cssmarginrule-interface
class CSSMarginRuleImpl extends CSSRuleImpl {
  constructor(args, { rule, styleSheet }) {
    super(args, { rule, styleSheet, type: 9 });

    this._rule = rule;
  }

  // TODO
}

module.exports = {
  implementation: CSSMarginRuleImpl,
};
