"use strict";

const CSSRuleImpl = require("./CSSRule-impl").implementation;

// https://drafts.csswg.org/cssom/#the-cssnamespacerule-interface
class CSSNamespaceRuleImpl extends CSSRuleImpl {
  constructor(args, { rule, styleSheet }) {
    super(args, { rule, styleSheet, type: 10 });

    this._rule = rule;
  }

  get namespaceURI() {
    // The namespaceURI attribute must return the namespace of the @namespace at-rule.
    return this._rule.prelude.children.tail.data.value.value.replace(/["']/g, "");
  }

  get prefix() {
    // The prefix attribute must return the prefix of the @namespace at-rule or the empty string if there is no prefix.
    return this._rule.prelude.children.head.data.name || "";
  }
}

module.exports = {
  implementation: CSSNamespaceRuleImpl,
};
