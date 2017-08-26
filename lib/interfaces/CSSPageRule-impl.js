"use strict";

const CSSGroupingRuleImpl = require("./CSSGroupingRule-impl").implementation;

// https://drafts.csswg.org/cssom/#the-csspagerule-interface
class CSSPageRuleImpl extends CSSGroupingRuleImpl {
  constructor(args, { rule, styleSheet }) {
    super(args, { rule, styleSheet, type: 6 });

    this._rule = rule;
  }

  // TODO
}

module.exports = {
  implementation: CSSPageRuleImpl,
};
