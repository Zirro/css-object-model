"use strict";

const { serializeACSSComponentValue } = require("./values");

function simpleSerializeCSSDeclarationBlock(declarationBlock) {
  return declarationBlock.children
    .map(({ property, value }) => `${property}: ${serializeACSSComponentValue(value)};`)
    .join(" ");
}

// https://drafts.csswg.org/cssom/#serialize-a-css-declaration
function serializeACSSDeclaration(property, value, important = false) {
  // Let s be the empty string.
  let s = "";

  // Append property to s.
  s += property;

  // Append ": " (U+003A U+0020) to s.
  s += ": ";

  // Append value to s.
  s += value;

  // If the important flag is set, append " !important" (U+0020 U+0021 U+0069 U+006D U+0070 U+006F U+0072 U+0074 U+0061 U+006E U+0074) to s.
  if (important) {
    s += " !important";
  }

  // Append ";" (U+003B) to s.
  s += ";";

  // Return s.
  return s;
}

// // https://drafts.csswg.org/cssom/#serialize-a-css-declaration-block
// function serializeACSSDeclarationBlock(declarationBlock) {
//   // Let list be an empty array.
//   const list = [];

//   // Let already serialized be an empty array.
//   const alreadySerialized = [];

//   // Declaration loop: For each CSS declaration declaration in declaration block’s declarations, follow these substeps:
//   walkDeclarations(declarationBlock, declaration => {
//     // Let property be declaration’s property name.
//     const property = declaration.property;

//     // If property is in already serialized, continue with the steps labeled declaration loop.
//     if (alreadySerialized.includes(property)) {
//       // If property maps to one or more shorthand properties, let shorthands be an array of those shorthand properties, in preferred order, and follow these substeps:
//       const shorthands = []; // TODO

//       // Let longhands be an array consisting of all CSS declarations in declaration block’s declarations that that are not in already serialized and have a property name that maps to one of the shorthand properties in shorthands.
//       const longhands = [];

//       // Shorthand loop: For each shorthand in shorthands, follow these substeps:
//       shorthands.forEach(shorthand => {
//         // If all properties that map to shorthand are not present in longhands, continue with the steps labeled shorthand loop.
//         if (longhands.filter(longhand => longhand.includes(shorthand))) {

//         // Let current longhands be an empty array.
//         const currentLonghands = [];

//         // Append all CSS declarations in longhands have a property name that maps to shorthand to current longhands.
//         currentLonghands.push(longhand);

//         // If there is one or more CSS declarations in current longhands have their important flag set and one or more with it unset, continue with the steps labeled shorthand loop.

//         // Let value be the result of invoking serialize a CSS value of current longhands.

//         // If value is the empty string, continue with the steps labeled shorthand loop.

//         // Let serialized declaration be the result of invoking serialize a CSS declaration with property name shorthand, value value, and the important flag set if the CSS declarations in current longhands have their important flag set.
//         // Append serialized declaration to list.
//         // Append the property names of all items of current longhands to already serialized.
//         // Remove the items present in current longhands from longhands.
//       }

//       //     If property is in already serialized, continue with the steps labeled declaration loop.
//       //     Let value be the result of invoking serialize a CSS value of declaration.
//       //     Let serialized declaration be the result of invoking serialize a CSS declaration with property name property, value value, and the important flag set if declaration has its important flag set.
//       //     Append serialized declaration to list.
//       //     Append property to already serialized.
//     }
//   });
//   // Return list joined with " " (U+0020).
// }

module.exports = {
  simpleSerializeCSSDeclarationBlock,
  // serializeACSSDeclaration,
  // serializeACSSDeclarationBlock,
};
