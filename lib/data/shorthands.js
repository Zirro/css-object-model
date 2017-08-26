"use strict";

module.exports = {

  // https://drafts.csswg.org/css-backgrounds/#the-background
  "background": {
    longhands: ["background-image", "background-position", "background-size", "background-repeat", "background-origin", "background-clip", "background-attachment", "background-color"],
    initial: ["none", "0% 0%", "auto auto", "repeat", "padding-box", "border-box", "scroll", "transparent"],
    additionalResets: [],
    order: "orderOfAppearance",
  },

  "border": {
    longhands: ["border-width", "border-style", "border-color"],
    order: "orderOfAppearance",
  },

  "border-bottom": {
    longhands: ["border-bottom-width", "border-bottom-style", "border-bottom-color"],
    order: "orderOfAppearance",
  },

  "border-color": {
    longhands: ["border-top-color", "border-right-color", "border-bottom-color", "border-left-color"],
  },

  "border-left": {
    longhands: ["border-left-width", "border-left-style", "border-left-color"],
    order: "orderOfAppearance",
  },

  "border-right": {
    longhands: ["border-right-width", "border-right-style", "border-right-color"],
    order: "orderOfAppearance",
  },

  "border-style": {
    longhands: ["border-top-style", "border-right-style", "border-bottom-style", "border-left-style"],
  },

  "border-top": {
    longhands: ["border-top-width", "border-top-style", "border-top-color"],
    order: "orderOfAppearance",
  },

  "border-width": {
    longhands: ["border-top-width", "border-right-width", "border-bottom-width", "border-left-width"],
  },

  "font": {
    longhands: ["font-style", "font-variant", "font-weight", "font-stretch", "font-size", "line-height", "font-family"],
    order: "orderOfAppearance",
  },

  "margin": {
    longhands: ["margin-top", "margin-right", "margin-bottom", "margin-left"],
  },

  "outline": {
    longhands: ["outline-color", "outline-style", "outline-width"],
  },

  "padding": {
    longhands: ["padding-top", "padding-right", "padding-bottom", "padding-left"],
  },

};
