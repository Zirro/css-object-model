"use strict";

// https://drafts.csswg.org/cssom/#common-serializing-idioms

function escapeACharacter(char) {
  // To escape a character means to create a string of "\" (U+005C), followed by
  // the character.
  return "\\" + char;
}

function escapeACharacterAsCodePoint(char) {
  // To escape a character as code point means to create a string of "\"
  // (U+005C), followed by the Unicode code point as the smallest possible
  // number of hexadecimal digits in the range 0-9 a-f (U+0030 to U+0039 and
  // U+0061 to U+0066) to represent the code point in base 16, followed by a
  // single SPACE (U+0020).
  return "\\" + char.codePointAt(0).toString(16) + " ";
}

function serializeAnIdentifier(input) {
  // To serialize an identifier means to create a string represented by the
  // concatenation of, for each character of the identifier:
  let str = "";

  [...input].forEach((char, index) => {
    const charCode = char.charCodeAt(0);
    let charHandled = false;

    // If the character is NULL (U+0000), then the REPLACEMENT CHARACTER
    // (U+FFFD).
    if (charCode === 0x0000) {
      str += "\uFFFD";
      charHandled = true;
    }

    // If the character is in the range [\1-\1f] (U+0001 to U+001F) or is
    // U+007F, the character escaped as code point.
    if (charCode >= 0x0001 && charCode <= 0x001F || charCode === 0x007F) {
      str += escapeACharacterAsCodePoint(char);
      charHandled = true;
    }

    // If the character is the first character and is in the range [0-9] (U+0030
    // to U+0039), then the character escaped as code point.
    if (index === 0 && charCode >= 0x0030 && charCode <= 0x0039) {
      str += escapeACharacterAsCodePoint(char);
      charHandled = true;
    }

    // If the character is the second character and is in the range [0-9]
    // (U+0030 to U+0039) and the first character is a "-" (U+002D), then the
    // character escaped as code point.
    if (index === 1 &&
             charCode >= 0x0030 && charCode <= 0x0039 &&
             input[0] === "-") {
      str += escapeACharacterAsCodePoint(char);
      charHandled = true;
    }

    // If the character is the first character and is a "-" (U+002D), and there
    // is no second character, then the escaped character.
    if (index === 0 && char === "-" && input.length === 1) {
      str += escapeACharacter(char);
      charHandled = true;
    }

    // If the character is not handled by one of the above rules and is greater
    // than or equal to U+0080, is "-" (U+002D) or "_" (U+005F), or is in one of
    // the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to U+005A), or \[a-z]
    // (U+0061 to U+007A), then the character itself.
    if (charHandled === false) {
      if (charCode >= 0x0080 || char === "-" || char === "_" ||
          charCode >= 0x0030 && charCode <= 0x0039 ||
          charCode >= 0x0041 && charCode <= 0x005A ||
          charCode >= 0x0061 && charCode <= 0x007A) {
        str += char;
      }
      // Otherwise, the escaped character.
      else {
        str += escapeACharacter(char);
      }
    }
  });

  return str;
}

function serializeAString(input) {
  // To serialize a string means to create a string represented by '"'
  // (U+0022)...
  let str = "\"";

  // ...followed by the result of applying the rules below to each character of
  // the given string...
  for (const char of input) {
    const charCode = char.charCodeAt(0);

    // If the character is NULL (U+0000), then the REPLACEMENT CHARACTER
    // (U+FFFD).
    if (char === "\u0000") {
      str += "\uFFFD";
    }

    // If the character is in the range [\1-\1f] (U+0001 to U+001F) or is
    // U+007F, the character escaped as code point.
    if (charCode >= 0x0001 && charCode <= 0x001F || charCode === 0x007F) {
      str += escapeACharacterAsCodePoint(char);
    }

    // If the character is '"' (U+0022) or "\" (U+005C), the escaped character.
    if (char === "\"" || char === "\\") {
      str += escapeACharacter(char);
    }

    // Otherwise, the character itself.
    str += char;
  }

  // ...followed by '"' (U+0022):
  str += "\"";

  return str;
}

function serializeAURL(input) {
  // To serialize a URL means to create a string represented by "url(", followed
  // by the serialization of the URL as a string, followed by ")".
  return `url(${serializeAString(input)})`;
}

function serializeALocal(input) {
  // To serialize a LOCAL means to create a string represented by "url(",
  // followed by the serialization of the URL as a string, followed by ")".
  return `url(${serializeAURL(input)})`;
}

function serializeACommaSeparatedList(list) {
  // To serialize a comma-separated list concatenate all items of the list in
  // list order while separating them by ", ", i.e., COMMA (U+002C) followed by
  // a single SPACE (U+0020).
  return list.join(", ");
}

function serializeAWhitespaceSeparatedList(list) {
  // To serialize a whitespace-separated list concatenate all items of the list
  // in list order while separating them by " ", i.e., a single SPACE (U+0020).
  return list.join(" ");
}

module.exports = {
  escapeACharacter,
  escapeACharacterAsCodePoint,
  serializeAnIdentifier,
  serializeAString,
  serializeAURL,
  serializeALocal,
  serializeACommaSeparatedList,
  serializeAWhitespaceSeparatedList,
};
