"use strict";

// https://drafts.csswg.org/cssom/#serialize-a-css-rule

const { simpleSerializeCSSDeclarationBlock } = require("./declarations");
const { serializeASimpleSelector } = require("./selectors");
const { serializeAURL } = require("./common");

function serializeRule(rule) {
  const { prelude, block } = rule;
  let str = "";

  // The result of performing serialize a group of selectors on the rule’s associated selectors.
  str += prelude.children.head.data.children.map(s => serializeASimpleSelector(s)).join(", "); // FIXME

  // The string " { ", i.e., a single SPACE (U+0020), followed by LEFT CURLY BRACKET (U+007B), followed by a single SPACE (U+0020).
  str += " { ";

  // The result of performing serialize a CSS declaration block on the rule’s associated declarations.
  str += simpleSerializeCSSDeclarationBlock(block);

  // If the rule is associated with one or more declarations, the string " ", i.e., a single SPACE (U+0020).
  str += " "; // FIXME

  // The string "}", RIGHT CURLY BRACKET (U+007D).
  str += "}";

  return str;
}

const serializeAtrule = {
  import(rule) {
    // The string "@import" followed by a single SPACE (U+0020).
    let str = "@import ";

    // The result of performing serialize a URL on the rule’s location.
    str += serializeAURL(rule.prelude.children.head.data.value.value.replace(/["']/g, ""));

    // If the rule’s associated media list is not empty, a single SPACE (U+0020) followed by the result of performing serialize a media query list on the media list.
    // TODO

    // The string ";", i.e., SEMICOLON (U+003B).
    str += ";";

    return str;
  },
};

function serializeACSSRule({ _rule: rule }) {
  if (rule.type === "Rule") {
    return serializeRule(rule);
  }
  else if (rule.type === "Atrule") {
    return serializeAtrule[rule.name](rule);
  }

}

module.exports = {
  serializeACSSRule,
};
