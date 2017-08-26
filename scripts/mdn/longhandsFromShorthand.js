"use strict";

const properties = require("mdn-data/css/properties.json");

function getShorthandProperties() {
  return Object.keys(properties).filter(property => {
    if (properties[property].status === "standard" && Array.isArray(properties[property].initial)) {
      return true;
    }
  }).map(property => [property, properties[property]]);
}

function outputShorthandsExpansion() {
  let output = "const shorthands = {\n";

  getShorthandProperties().forEach(([shorthand, { initial, order }]) => {
    output += `
  "${shorthand}": {
    longhands: ["${initial.join("\", \"")}"],
    order: "${order}",
  },
  `;
  });

  output += "\n};";

  return output;
}

console.log(outputShorthandsExpansion());
