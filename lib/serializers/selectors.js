"use strict";

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

// https://drafts.csswg.org/cssom/#serialize-a-simple-selector
function serializeASimpleSelector() {

}

module.exports = {
  serializeAGroupOfSelectors,
  serializeASelector,
  serializeASimpleSelector,
};
