"use strict";

// https://drafts.csswg.org/cssom/#serialize-a-simple-selector
function serializeASimpleSelector(selector) {
  let s = "";

  switch (selector.type) {
    case "TypeSelector":
    case "UniversalSelector":
      // If the namespace prefix maps to a namespace that is not the default namespace and is not the null namespace (not in a namespace) append the serialization of the namespace prefix as an identifier, followed by a "|" (U+007C) to s.
      // If the namespace prefix maps to a namespace that is the null namespace (not in a namespace) append "|" (U+007C) to s.
      // If this is a type selector append the serialization of the element name as an identifier to s.
      // If this is a universal selector append "*" (U+002A) to s.
      s += selector.name;
      break;

    case "AttributeSelector":

      break;

    case "ClassSelector":

      break;

    case "IdSelector":
      // Append a "#" (U+0023), followed by the serialization of the ID as an identifier to s.
      s += `#${selector.name}`;
      break;

    case "PseudoClass":

      break;
  }

  return s;
}

// https://drafts.csswg.org/cssom/#serialize-a-group-of-selectors
function serializeAGroupOfSelectors(value) {

}

// https://drafts.csswg.org/cssom/#serialize-a-selector
function serializeASelector(selector) {
  // To serialize a selector let s be the empty string
  let s = "";

  // Run the steps below for each part of the chain of the selector, and finally return s

  // If there is only one simple selector in the compound selectors which is a universal selector, append the result of serializing the universal selector to s.

  // Otherwise, for each simple selector in the compound selectors that is not a universal selector of which the namespace prefix maps to a namespace that is not the default namespace serialize the simple selector and append the result to s.

  // If this is not the last part of the chain of the selector append a single SPACE (U+0020), followed by the combinator ">", "+", "~", ">>", "||", as appropriate, followed by another single SPACE (U+0020) if the combinator was not whitespace, to s.

  // If this is the last part of the chain of the selector and there is a pseudo-element, append "::" followed by the name of the pseudo-element, to s.
}

module.exports = {
  serializeAGroupOfSelectors,
  serializeASelector,
  serializeASimpleSelector,
};
