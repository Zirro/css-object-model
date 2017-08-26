"use strict";

const csstree = require("css-tree");
const shorthands = require("./utils/shorthands.js");

function isCustomProperty(property) {
  return property.startsWith("--");
}

function isShorthandProperty(property) {
  if (shorthands[property]) {
    return true;
  }

  return false;
}

function isImportantProperty(property, context) {
  let isImportant = false;

  csstree.walkDeclarations(context, node => {
    if (node.property === property && node.important) {
      isImportant = true;
    }
  });

  return isImportant;
}

function getMatchingDeclaration(property, context) {
  let declaration = null;

  csstree.walkDeclarations(context, node => {
    if (property === node.property) {
      declaration = node;
    }
  });

  return declaration;
}

function propertiesHaveSameImportance(properties) {
  return properties.every(node => node.important);
}

// https://drafts.csswg.org/cssom/#parse-a-css-value
function parseCSSValue(property, value) {
  // Let list be the value returned by invoking parse a list of component values from value.
  const list = csstree.parse(value, { context: "value" });

  try {
    // Match list against the grammar for the property property in the CSS specification.
    if (csstree.lexer.matchProperty(property, list).matched) {
      // Return list.
      return list;
    }

    // If the above step failed, return null.
    return null;
  }
  catch (error) {
    // If the above step failed, return null.
    return null;
  }
}

function createRule() {
  return {
    type: "Rule",
    loc: null,
    block: {
      type: "Block",
      loc: null,
      children: new csstree.List(),
    },
  };
}

function createDeclaration(property, value, important) {
  return {
    type: "Declaration",
    loc: null,
    important,
    property,
    value,
  };
}

module.exports = {
  isCustomProperty,
  isShorthandProperty,
  isImportantProperty,
  getMatchingDeclaration,
  propertiesHaveSameImportance,
  parseCSSValue,
  createRule,
  createDeclaration,
};
