"use strict";

const CSSRuleImpl = require("./CSSRule-impl").implementation;

// https://drafts.csswg.org/cssom/#the-cssimportrule-interface
class CSSKeyframesRuleImpl extends CSSRuleImpl {
  constructor(args, { rule, styleSheet }) {
    super(args, { rule, styleSheet, type: 7 });

    this._rule = rule;
  }

  // TODO
}

module.exports = {
  implementation: CSSKeyframesRuleImpl,
};
