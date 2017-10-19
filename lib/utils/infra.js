"use strict";

// https://infra.spec.whatwg.org/#ascii-case-insensitive
function asciiCaseInsensitiveMatch(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; ++i) {
    if ((a.charCodeAt(i) | 32) !== (b.charCodeAt(i) | 32)) {
      return false;
    }
  }

  return true;
}

module.exports = {
  asciiCaseInsensitiveMatch,
};
