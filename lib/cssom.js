"use strict";

const csstree = require("css-tree");
const CSSFontFaceRule = require("./generated/CSSFontFaceRule");
const CSSImportRule = require("./generated/CSSImportRule");
const CSSMediaRule = require("./generated/CSSMediaRule");
const CSSNamespaceRule = require("./generated/CSSNamespaceRule");
const CSSStyleRule = require("./generated/CSSStyleRule");
const CSSStyleSheet = require("./generated/CSSStyleSheet");

function cssom(input, ownerNode) {
  const ast = csstree.parse(input);
  const initialRules = [];

  const flags = {
    originClean: true, // TODO
  };

  const create = {
    "font-face": CSSFontFaceRule,
    "import": CSSImportRule,
    "media": CSSMediaRule,
    "namespace": CSSNamespaceRule,
  };

  csstree.walkRules(ast, rule => {
    if (create[rule.name]) {
      initialRules.push([create[rule.name], rule]);
    }
    else if (rule.type === "Rule") {
      initialRules.push([CSSStyleRule, rule]);
    }
  });

  const styleSheet = CSSStyleSheet.create(null, {
    flags,
    initialRules,
    ownerNode,
  });

  return styleSheet;
}

module.exports = cssom;
