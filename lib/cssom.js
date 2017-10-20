"use strict";

const csstree = require("css-tree");

const CSSFontFaceRule = require("./generated/CSSFontFaceRule");
const CSSImportRule = require("./generated/CSSImportRule");
const CSSKeyframesRule = require("./generated/CSSKeyframesRule");
const CSSMediaRule = require("./generated/CSSMediaRule");
const CSSNamespaceRule = require("./generated/CSSNamespaceRule");
const CSSStyleRule = require("./generated/CSSStyleRule");
const CSSStyleSheet = require("./generated/CSSStyleSheet");
const CSSSupportsRule = require("./generated/CSSSupportsRule");

const createAtRule = {
  "font-face": CSSFontFaceRule,
  "import": CSSImportRule,
  "keyframes": CSSKeyframesRule,
  "media": CSSMediaRule,
  "namespace": CSSNamespaceRule,
  "supports": CSSSupportsRule,
};

function cssom(input, ownerNode) {
  const ast = csstree.parse(input, {
    parseAtrulePrelude: true,
    parseCustomProperty: true,
    parseRulePrelude: true,
    parseValue: true,
    tolerant: true,
  });
  const flags = {
    originClean: true, // TODO receive this from DOM implementation
  };
  const initialRules = [];

  // Go through the rules of the stylesheet
  // and store them along with their interface
  csstree.walkRules(ast, rule => {

    // At-rules have a name property
    if (createAtRule[rule.name]) {
      initialRules.push([createAtRule[rule.name], rule]);
    }

    // Look at the type property for style rules
    else if (rule.type === "Rule") {
      initialRules.push([CSSStyleRule, rule]);
    }

  });

  const styleSheet = CSSStyleSheet.create([], {
    flags,
    initialRules,
    ownerNode,
  });

  return styleSheet;
}

module.exports = cssom;
