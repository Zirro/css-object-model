"use strict";

const csstree = require("css-tree");

// TODO move to utils
function cDecl(longhands, values) {
  return values.map((value, index) => ({
    type: "Declaration",
    loc: null,
    important: null, // TODO add important
    property: longhands[index],
    value,
  }));
}

function cValue(value) {
  return {
    type: "Value",
    loc: null,
    children: new csstree.List().prependData(value),
  };
}

// The box expansion applies to shorthands like "margin",
// where the longhands represent to the four sides of a box
function boxExpansion(longhands, values) {
  const sides = [
    ,
    // One value expands to all sides
    [values[0], values[0], values[0], values[0]],

    // Two values expand first to top and
    // bottom, second to left and right
    [values[0], values[1], values[0], values[1]],

    // Three values expand first to top,
    // second to left and right and third to bottom
    [values[0], values[1], values[2], values[1]],

    // Four values expand to each side in clockwise order
    [values[0], values[1], values[2], values[3]],
  ];

  return cDecl(longhands, sides[values.length]);
}

// The appearance expansion applies to properties where
// the order of value appearance determines assignment
function appearanceExpansion(longhands, values, value) {
  const matchingLonghands = value.children.map(v => {
    return longhands.find(longhand =>
      csstree.lexer.matchProperty(longhand, cValue(v)).matched
    );
  });

  // TODO needs fix for repeated values of same type
  return cDecl(matchingLonghands.filter(l => l !== undefined), value.children.toArray().filter(({ type }) => type !== "Operator" && type !== "WhiteSpace"));
}

module.exports = {
  appearanceExpansion,
  boxExpansion,
};
