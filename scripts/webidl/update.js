"use strict";

const { JSDOM } = require("jsdom");
const { outputFile } = require("fs-extra");

const sources = new Set([
  "https://drafts.csswg.org/cssom",
  "https://drafts.csswg.org/css-conditional-3",
  "https://drafts.csswg.org/css-fonts-4",
  "https://drafts.csswg.org/css-animations",
]);

const ignore = new Set([
  "LinkStyle",
  "ElementCSSInlineStyle",
  "_camel_cased_attribute",
  "_dashed_attribute",
  "_webkit_cased_attribute",
  "elt",
  "CSSOMString",
  "SUPPORTS_RULE",
  "KEYFRAMES_RULE",
  "onanimationstart",
  "Constructor",
]);

function writeIDL(idls) {
  return Promise.all(
    idls.map(({ name, text }) => outputFile(`./lib/interfaces/${name}.idl`, text))
  );
}

function crawlIDL(dom) {
  return new Promise((resolve, reject) => {
    const idls = dom.window.document.querySelectorAll(".idl");

    const parsed = Array.from(idls)
      .filter(idl => idl.querySelector("dfn") && idl.textContent && !ignore.has(idl.querySelector("dfn").textContent))
      .map(idl => ({
        name: idl.querySelector("dfn").textContent,
        text: idl.textContent,
      }));

    parsed ? resolve(parsed) : reject(new Error("Found no IDLs on this page"));
  }).catch(err => console.log(err));
}

JSDOM.fromURL("https://drafts.csswg.org/css-animations")
  .then(crawlIDL)
  .then(writeIDL)
  .catch(err => console.log(err));
