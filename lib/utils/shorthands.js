"use strict";

const csstree = require("css-tree");

const shorthands = require("../data/shorthands");

const {
  appearanceExpansion,
  boxExpansion,
} = require("../utils/shorthandExpansion");

function expandShorthand(declaration) {
  const { property, value, important } = declaration;
  const longhands = [ declaration ];

  // TODO determine expansion type by property name
  if (shorthands[property]) {
    longhands.push(
      ...boxExpansion(shorthands[property].longhands, value.children.toArray().filter(item => item.type !== "WhiteSpace"), value)
    );
  }

  return new csstree.List().fromArray(longhands);
}

module.exports = {
  expandShorthand,
};
