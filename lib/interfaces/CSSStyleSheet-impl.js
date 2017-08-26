"use strict";

const csstree = require("css-tree");
const DOMException = require("domexception");

const CSSRuleList = require("../generated/CSSRuleList");
const CSSStyleRule = require("../generated/CSSStyleRule");
const StyleSheetImpl = require("./StyleSheet-impl").implementation;
const idlUtils = require("../generated/utils.js");

// https://drafts.csswg.org/cssom/#cssstylesheet
class CSSStyleSheetImpl extends StyleSheetImpl {
  constructor(args, privateData) {
    super(args, privateData);

    const { flags, initialRules } = privateData;
    this._flags = flags;

    const createdRules = initialRules.map(([ styleClass, rule ]) => styleClass.create(null, { rule, styleSheet: this }));

    this._cssRules = CSSRuleList.create(null, { createdRules });
  }

  get cssRules() {
    // If the origin-clean flag is unset, throw a SecurityError exception.
    if (!this._flags.originClean) {
      throw new DOMException("Origin not clean", "SecurityError");
    }

    // Return a read-only, live CSSRuleList object representing the CSS rules.
    return this._cssRules;
  }

  insertRule(rule, index) {
    // If the origin-clean flag is unset, throw a SecurityError exception.
    if (!this._flags.originClean) {
      throw new DOMException("Origin not clean", "SecurityError");
    }

    // Set length to the number of items in list.
    const { length } = this._cssRules;

    // If index is greater than length, then throw an IndexSizeError exception (deprecated, use RangeError instead).
    if (index > length) {
      throw new DOMException("Index was greater than length", "RangeError");
    }

    let newRule;
    try {
      // Set new rule to the results of performing parse a CSS rule on argument rule.
      newRule = csstree.parse(rule);
    }
    catch (err) {
      // If new rule is a syntax error, throw a SyntaxError exception.
      if (err.name === "CssSyntaxError") {
        throw new SyntaxError(err);
      }
    }

    // If new rule cannot be inserted into list at the zero-index position index due
    // to constraints specified by CSS, then throw a HierarchyRequestError exception.
    // TODO properly
    // const test = idlUtils.implForWrapper(this._cssRulesAsArray[index])

    // if (test._rule.name === "import") {
    //   throw new HierarchyRequestError("A CSS style sheet cannot contain an @import at-rule after a style rule");
    // }

    // If new rule is an @namespace at-rule, and list contains anything other than
    // @import at-rules, and @namespace at-rules, throw an InvalidStateError exception.
    // TODO

    // Insert new rule into list at the zero-indexed position index.
    idlUtils.implForWrapper(this._cssRules)._list.splice(index, 0, CSSStyleRule.create(null, { rule: newRule, styleSheet: this }));

    // Return index.
    return index;
  }

  deleteRule(index) {
    // If the origin-clean flag is unset, throw a SecurityError exception.
    // TODO

    // Set length to the number of items in list.
    const { length } = this._cssRules;

    // If index is greater than or equal to length, then throw an IndexSizeError exception (deprecated, use RangeError instead).
    if (index >= length) {
      throw new RangeError("Index was greater than or equal to length");
    }

    // Set old rule to the indexth item in list.
    const oldRule = this._cssRules[index];

    // If old rule is an @namespace at-rule, and list contains anything other than @import at-rules, and @namespace at-rules, throw an InvalidStateError exception.
    // TODO

    // Remove rule old rule from list at the zero-indexed position index.
    idlUtils.implForWrapper(this._cssRules)._list.splice(index, 1);

    // Set old rule’s parent CSS rule and parent CSS style sheet to null.
    oldRule._parentRule = null;
    oldRule._parentStyleSheet = null;
  }
}

module.exports = {
  implementation: CSSStyleSheetImpl,
};
