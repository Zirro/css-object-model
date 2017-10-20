"use strict";

const CSSRuleImpl = require("./CSSRule-impl").implementation;
const CSSKeyframeRule = require("../generated/CSSKeyframeRule");
const CSSRuleList = require("../generated/CSSRuleList");

// https://drafts.csswg.org/cssom/#the-cssimportrule-interface
class CSSKeyframesRuleImpl extends CSSRuleImpl {
  constructor(args, { rule, styleSheet }) {
    super(args, { rule, styleSheet, type: 7 });

    this._rule = rule;

    const createdRules = rule.block.rules &&
      rule.block.rules.map(keyFrameRule => {
        return CSSKeyframeRule.create([], { keyFrameRule, styleSheet });
      });

    this._cssRules = CSSRuleList.create([], { createdRules });
  }

  get name() {

  }
  set name(value) {

  }

  get cssRules() {
    return this._cssRules;
  }
}

module.exports = {
  implementation: CSSKeyframesRuleImpl,
};
