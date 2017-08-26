"use strict";

// https://drafts.csswg.org/cssom/#serialize-a-css-value
function serializeACSSValue(declaration) {
  // If this algorithm is invoked with a list list, follow these substeps:
  //     Let shorthand be the shorthand property that exactly maps to all the longhand properties in list. If there are multiple such shorthand properties, use the first in preferred order.
  //     If shorthand cannot represent the values of list in its grammar, return the empty string and terminate these steps.
  //     Let trimmed list be a new empty array.
  //     For each CSS declaration declaration in list, if declaration’s value is not the initial value, or if declaration is a required component of the shorthand property, append declaration to trimmed list.
  //     If trimmed list is empty, append the value of the first item in list to trimmed list.
  //     Let values be a new empty array.
  //     For each CSS declaration declaration in trimmed list, invoke serialize a CSS value of declaration, and append the result to values.
  //     Return the result of joining values as appropriate according to the grammar of shorthand and terminate these steps.

  // Let values be a new empty array.
  const values = [];

  // Append the result of invoking serialize a CSS component value of declaration’s value to values.
  values.push(serializeACSSComponentValue(value));

  // If the grammar of the property name of declaration is defined to be whitespace-separated, return the result of invoking serialize a whitespace-separated list of values and terminate these steps.


  // If the grammar of the property name of declaration is defined to be comma-separated, return the result of invoking serialize a comma-separated list of values.
}

// https://drafts.csswg.org/cssom/#serialize-a-css-component-value
function serializeACSSComponentValue(value) {

}

module.exports = {
  serializeACSSValue,
};
