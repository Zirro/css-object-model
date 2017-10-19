"use strict";

const { serializeAnIdentifier } = require("../serializers/common");

// https://drafts.csswg.org/cssom/#css
class CSSImpl {
  static escape(ident) {
    return serializeAnIdentifier(ident);
  }
}

module.exports = {
  implementation: CSSImpl,
};
