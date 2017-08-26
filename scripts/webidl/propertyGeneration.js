"use strict";

const properties = require("mdn-data/css/properties.json");

function getSupportedProperties() {
  return Object.keys(properties).filter(property => {
    if (properties[property].status === "standard") {
      return true;
    }
  });
}

// https://drafts.csswg.org/cssom/#css-property-to-idl-attribute
function cssPropertyToIDLAttribute(property, lowercaseFirst) {
  // Let output be the empty string.
  let output = "";

  // Let uppercase next be unset.
  let uppercaseNext = false;

  // If the lowercase first flag is set, remove the first character from property.
  if (lowercaseFirst === true) {
    property = property.substr(1);
  }

  // For each character c in property:
  [...property].forEach(c => {
    // If c is "-" (U+002D), let uppercase next be set.
    if (c === "-") {
      uppercaseNext = true;
    }

    // Otherwise, if uppercase next is set, let uppercase next be unset and append c converted to ASCII uppercase to output.
    else if (uppercaseNext === true) {
      uppercaseNext = false;

      output += c.toUpperCase();
    }

    // Otherwise, append c to output.
    else {
      output += c;
    }
  });

  // Return output.
  return output;
}

function outputIDL() {
  let output = "partial interface CSSStyleDeclaration {";

  getSupportedProperties().forEach(property => {
    // For each CSS property property that is a supported CSS property
    output += `
    [CEReactions, TreatNullAs=EmptyString] attribute CSSOMString ${cssPropertyToIDLAttribute(property, false)};`;

    // For each CSS property property that is a supported CSS property and that begins with the string -webkit-
    if (property.startsWith("-webkit-")) {
      output += `
    [CEReactions, TreatNullAs=EmptyString] attribute CSSOMString ${cssPropertyToIDLAttribute(property, true)};`;
    }

    // For each CSS property property that is a supported CSS property, except for properties that have no "-" (U+002D) in the property name
    if (property.includes("-")) {
      output += `
    [CEReactions, TreatNullAs=EmptyString] attribute CSSOMString ${property};`;
    }

  });

  output += "\n};\n";

  return output;
}

function outputGettersSetters() {
  let output = "";

  getSupportedProperties().forEach(property => {
    output += `
  get ${cssPropertyToIDLAttribute(property, false)}() {
    return this.getPropertyValue("${property}");
  }
  set ${cssPropertyToIDLAttribute(property, false)}(value) {
    this.setProperty("${property}", value);
  }\n`;

    if (property.startsWith("-webkit-")) {
      output += `
  get ${cssPropertyToIDLAttribute(property, true)}() {
    return this.getPropertyValue("${property}");
  }
  set ${cssPropertyToIDLAttribute(property, true)}(value) {
    this.setProperty("${property}", value);
  }\n`;
    }

    if (property.includes("-")) {
      output += `
  get "${property}"() {
    return this.getPropertyValue("${property}");
  }
  set "${property}"(value) {
    this.setProperty("${property}", value);
  }\n`;
    }

  });

  return output;
}
