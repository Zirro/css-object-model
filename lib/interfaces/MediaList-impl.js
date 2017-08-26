"use strict";

// https://drafts.csswg.org/cssom/#medialist
class MediaListImpl {
  constructor(args, privateData) {
    // To create a MediaList object with a string text, run the following steps:
    // Create a new MediaList object.
    // Set its mediaText attribute to text.
    // Return the newly created MediaList object.
    // TODO
  }

  get mediaText() {
    // The mediaText attribute, on getting, must return a serialization of the collection of media queries.
  }
  set mediaText(value) {
    // Setting the mediaText attribute must run these steps:
    // Empty the collection of media queries.
    // If the given value is the empty string terminate these steps.
    // Append all the media queries as a result of parsing the given value to the collection of media queries.
  }

  get length() {
    // The length attribute must return the number of media queries in the collection of media queries.
    // TODO
  }

  item(index) {
    // The item(index) method must return a serialization of the media query in the collection of media queries given by index, or null, if index is greater than or equal to the number of media queries in the collection of media queries.
    // TODO
  }

  appendMedium(medium) {
    // TODO
  }

  deleteMedium(medium) {
    // TODO
  }
}

module.exports = {
  implementation: MediaListImpl,
};
