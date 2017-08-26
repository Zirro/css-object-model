"use strict";

const idlUtils = require("../generated/utils");

const {
  translate,
  parse,
  walkDeclarations,
} = require("css-tree");

const {
  isCustomProperty,
  isShorthandProperty,
  isImportantProperty,
  propertiesHaveSameImportance,
  parseCSSValue,
  createRule,
  createDeclaration,
} = require("../utils");

const {
  expandShorthand,
} = require("../utils/shorthands");

// https://drafts.csswg.org/cssom/#cssstyledeclaration
class CSSStyleDeclarationImpl {
  constructor({ rule = createRule() } = {}) {
    this._rule = rule;
  }

  get [idlUtils.supportedPropertyNames]() {
    return this._rule.block.children.toArray().keys();
  }

  [idlUtils.supportsPropertyName](name) {
    return true; // TODO
  }

  get [idlUtils.supportedPropertyIndices]() {
    return this._rule.block.children.toArray().keys();
  }

  [idlUtils.supportsPropertyIndex](name) {
    return true; // TODO
  }

  get cssText() {
    // TODO
    return translate(this._rule.block).slice(2).slice(0, -2);
  }
  set cssText(value) {
    // If the readonly flag is set, throw a NoModificationAllowedError exception and terminate these steps.
    // TODO

    // Empty the declarations.
    this._rule.block.children.clear();

    // Parse the given value and, if the return value is not the empty list, insert the items in the list into the declarations, in specified order.
    const parsedDeclarationList = parse(value, { context: "declarationList" });

    // TODO check if is empty list

    //! Specified order means to expand shorthand properties in canonical order
    parsedDeclarationList.children.each(declaration => this._rule.block.children.appendList(expandShorthand(declaration)));
  }

  get length() {
    // The length attribute must return the number of CSS declarations in the declarations.
    return this._rule.block.children.getSize();
  }

  item(index) {
    // The item(index) method must return the property name of the CSS declaration at position index.
    const list = this._rule.block.children.toArray()[index];

    if (list) {
      return list.property;
    }
  }

  getPropertyValue(property) {
    // If property is not a custom property, follow these substeps:
    if (!isCustomProperty(property)) {

      // Let property be property converted to ASCII lowercase.
      property = property.toLowerCase();

      // If property is a shorthand property, then follow these substeps:
      if (isShorthandProperty(property)) {
        // Let list be a new empty array.
        const list = [];

        // For each longhand property longhand that property maps to, in canonical order, follow these substeps:
        // TODO

        // If longhand is a case-sensitive match for a property name of a CSS declaration in the declarations, let declaration be that CSS declaration, or null otherwise.
        let declaration = null;

        walkDeclarations(this._rule, node => {
          if (property === node.property) {
            declaration = node;
          }
        });

        // If declaration is null, return the empty string and terminate these steps.
        if (declaration === null) {
          return "";
        }

        // Append the declaration to list.
        list.push(declaration);

        // If important flags of all declarations in list are same, return the serialization of list and terminate these steps.
        if (propertiesHaveSameImportance(list)) {
          return translate(list[0].value); // TODO include all
        }

        // Return the empty string.
        return "";
      }
    }

    // If property is a case-sensitive match for a property name of a CSS declaration in the declarations, return the result of invoking serialize a CSS value of that declaration and terminate these steps.
    let matchingDeclaration;

    walkDeclarations(this._rule, (node, item) => {
      if (property === node.property) {
        matchingDeclaration = translate(item.data.value);
      }
    });

    if (matchingDeclaration) {
      return matchingDeclaration;
    }

    // Return the empty string.
    return "";
  }

  getPropertyPriority(property) {
    // If property is not a custom property, follow these substeps:
    if (!isCustomProperty(property)) {

      // Let property be property converted to ASCII lowercase.
      property = property.toLowerCase();

      // If property is a shorthand property, then follow these substeps:
      if (isShorthandProperty(property)) {
        // Let list be a new empty array.
        const list = [];

        // For each longhand property longhand that property maps to, append the result of invoking getPropertyPriority() with longhand as argument to list.
        // TODO

        // If all items in list are the string "important", return the string "important" and terminate these steps.
        // TODO
      }
    }

    // If property is a case-sensitive match for a property name of a CSS declaration in the declarations that has the important flag set, return the string "important".
    if (isImportantProperty(property, this._rule)) {
      return "important";
    }

    // Return the empty string.
    return "";
  }

  setProperty(property, value, priority) {
    // If the readonly flag is set, throw a NoModificationAllowedError exception and terminate these steps.
    // TODO

    // If property is not a custom property, follow these substeps:
    if (!isCustomProperty(property)) {

      // Let property be property converted to ASCII lowercase.
      property = property.toLowerCase();

      // If property is not a case-sensitive match for a supported CSS property, terminate this algorithm.
      // TODO define supported properties
    }

    // If value is the empty string, invoke removeProperty() with property as argument and terminate this algorithm.
    if (value === "") {
      this.removeProperty(property);
    }

    // If priority is not the empty string and is not an ASCII case-insensitive match for the string "important", terminate this algorithm.
    if (priority && priority !== "" && priority.toLowerCase() !== "important") {
      return;
    }

    // Let component value list be the result of parsing value for property property.
    const componentValueList = parseCSSValue(property, value);

    // If component value list is null terminate these steps.
    if (componentValueList === null) {
      return;
    }

    // If property is a shorthand property, then for each longhand property longhand that property maps to, in canonical order, set the CSS declaration longhand with the appropriate value(s) from component value list, with the important flag set if priority is not the empty string, and unset otherwise, and with the list of declarations being the declarations.
    const withExpandedShorthands = expandShorthand(createDeclaration(property, componentValueList, priority));

    // this._rule.block.children.appendList(withExpandedShorthand);

    // Otherwise, set the CSS declaration property with value component value list, with the important flag set if priority is not the empty string, and unset otherwise, and with the list of declarations being the declarations.

    // If property is a case-sensitive match for a property name of a CSS declaration in declarations, let declaration be that CSS declaration.


    this._rule.block.children.insertList(withExpandedShorthands);
  }

  setPropertyValue(property, value) {
    // TODO
  }

  setPropertyPriority(property, priority) {
    // TODO
  }

  removeProperty(property) {
    // If the readonly flag is set, throw a NoModificationAllowedError exception and terminate these steps.
    // TODO

    // If property is not a custom property, let property be property converted to ASCII lowercase.
    if (!isCustomProperty(property)) {
      property = property.toLowerCase();
    }

    // Let value be the return value of invoking getPropertyValue() with property as argument.
    const value = this.getPropertyValue(property);

    // If property is a shorthand property, for each longhand property longhand that property maps to, invoke removeProperty() with longhand as argument.
    // TODO

    // Otherwise, if property is a case-sensitive match for a property name of a CSS declaration in the declarations, remove that CSS declaration.
    walkDeclarations(this._rule, (node, item, list) => {
      if (property === node.property) {
        list.remove(item);
      }
    });

    // Return value.
    return value;
  }

  get parentRule() {
    // TODO
  }

  get cssFloat() {
    return this.getPropertyValue("float");
  }
  set cssFloat(value) {
    this.setProperty("float", value);
  }

  // Generated list of attributes start here

  get alignContent() {
    return this.getPropertyValue("align-content");
  }
  set alignContent(value) {
    this.setProperty("align-content", value);
  }

  get "align-content"() {
    return this.getPropertyValue("align-content");
  }
  set "align-content"(value) {
    this.setProperty("align-content", value);
  }

  get alignItems() {
    return this.getPropertyValue("align-items");
  }
  set alignItems(value) {
    this.setProperty("align-items", value);
  }

  get "align-items"() {
    return this.getPropertyValue("align-items");
  }
  set "align-items"(value) {
    this.setProperty("align-items", value);
  }

  get alignSelf() {
    return this.getPropertyValue("align-self");
  }
  set alignSelf(value) {
    this.setProperty("align-self", value);
  }

  get "align-self"() {
    return this.getPropertyValue("align-self");
  }
  set "align-self"(value) {
    this.setProperty("align-self", value);
  }

  get all() {
    return this.getPropertyValue("all");
  }
  set all(value) {
    this.setProperty("all", value);
  }

  get animation() {
    return this.getPropertyValue("animation");
  }
  set animation(value) {
    this.setProperty("animation", value);
  }

  get animationDelay() {
    return this.getPropertyValue("animation-delay");
  }
  set animationDelay(value) {
    this.setProperty("animation-delay", value);
  }

  get "animation-delay"() {
    return this.getPropertyValue("animation-delay");
  }
  set "animation-delay"(value) {
    this.setProperty("animation-delay", value);
  }

  get animationDirection() {
    return this.getPropertyValue("animation-direction");
  }
  set animationDirection(value) {
    this.setProperty("animation-direction", value);
  }

  get "animation-direction"() {
    return this.getPropertyValue("animation-direction");
  }
  set "animation-direction"(value) {
    this.setProperty("animation-direction", value);
  }

  get animationDuration() {
    return this.getPropertyValue("animation-duration");
  }
  set animationDuration(value) {
    this.setProperty("animation-duration", value);
  }

  get "animation-duration"() {
    return this.getPropertyValue("animation-duration");
  }
  set "animation-duration"(value) {
    this.setProperty("animation-duration", value);
  }

  get animationFillMode() {
    return this.getPropertyValue("animation-fill-mode");
  }
  set animationFillMode(value) {
    this.setProperty("animation-fill-mode", value);
  }

  get "animation-fill-mode"() {
    return this.getPropertyValue("animation-fill-mode");
  }
  set "animation-fill-mode"(value) {
    this.setProperty("animation-fill-mode", value);
  }

  get animationIterationCount() {
    return this.getPropertyValue("animation-iteration-count");
  }
  set animationIterationCount(value) {
    this.setProperty("animation-iteration-count", value);
  }

  get "animation-iteration-count"() {
    return this.getPropertyValue("animation-iteration-count");
  }
  set "animation-iteration-count"(value) {
    this.setProperty("animation-iteration-count", value);
  }

  get animationName() {
    return this.getPropertyValue("animation-name");
  }
  set animationName(value) {
    this.setProperty("animation-name", value);
  }

  get "animation-name"() {
    return this.getPropertyValue("animation-name");
  }
  set "animation-name"(value) {
    this.setProperty("animation-name", value);
  }

  get animationPlayState() {
    return this.getPropertyValue("animation-play-state");
  }
  set animationPlayState(value) {
    this.setProperty("animation-play-state", value);
  }

  get "animation-play-state"() {
    return this.getPropertyValue("animation-play-state");
  }
  set "animation-play-state"(value) {
    this.setProperty("animation-play-state", value);
  }

  get animationTimingFunction() {
    return this.getPropertyValue("animation-timing-function");
  }
  set animationTimingFunction(value) {
    this.setProperty("animation-timing-function", value);
  }

  get "animation-timing-function"() {
    return this.getPropertyValue("animation-timing-function");
  }
  set "animation-timing-function"(value) {
    this.setProperty("animation-timing-function", value);
  }

  get backfaceVisibility() {
    return this.getPropertyValue("backface-visibility");
  }
  set backfaceVisibility(value) {
    this.setProperty("backface-visibility", value);
  }

  get "backface-visibility"() {
    return this.getPropertyValue("backface-visibility");
  }
  set "backface-visibility"(value) {
    this.setProperty("backface-visibility", value);
  }

  get background() {
    return this.getPropertyValue("background");
  }
  set background(value) {
    this.setProperty("background", value);
  }

  get backgroundAttachment() {
    return this.getPropertyValue("background-attachment");
  }
  set backgroundAttachment(value) {
    this.setProperty("background-attachment", value);
  }

  get "background-attachment"() {
    return this.getPropertyValue("background-attachment");
  }
  set "background-attachment"(value) {
    this.setProperty("background-attachment", value);
  }

  get backgroundBlendMode() {
    return this.getPropertyValue("background-blend-mode");
  }
  set backgroundBlendMode(value) {
    this.setProperty("background-blend-mode", value);
  }

  get "background-blend-mode"() {
    return this.getPropertyValue("background-blend-mode");
  }
  set "background-blend-mode"(value) {
    this.setProperty("background-blend-mode", value);
  }

  get backgroundClip() {
    return this.getPropertyValue("background-clip");
  }
  set backgroundClip(value) {
    this.setProperty("background-clip", value);
  }

  get "background-clip"() {
    return this.getPropertyValue("background-clip");
  }
  set "background-clip"(value) {
    this.setProperty("background-clip", value);
  }

  get backgroundColor() {
    return this.getPropertyValue("background-color");
  }
  set backgroundColor(value) {
    this.setProperty("background-color", value);
  }

  get "background-color"() {
    return this.getPropertyValue("background-color");
  }
  set "background-color"(value) {
    this.setProperty("background-color", value);
  }

  get backgroundImage() {
    return this.getPropertyValue("background-image");
  }
  set backgroundImage(value) {
    this.setProperty("background-image", value);
  }

  get "background-image"() {
    return this.getPropertyValue("background-image");
  }
  set "background-image"(value) {
    this.setProperty("background-image", value);
  }

  get backgroundOrigin() {
    return this.getPropertyValue("background-origin");
  }
  set backgroundOrigin(value) {
    this.setProperty("background-origin", value);
  }

  get "background-origin"() {
    return this.getPropertyValue("background-origin");
  }
  set "background-origin"(value) {
    this.setProperty("background-origin", value);
  }

  get backgroundPosition() {
    return this.getPropertyValue("background-position");
  }
  set backgroundPosition(value) {
    this.setProperty("background-position", value);
  }

  get "background-position"() {
    return this.getPropertyValue("background-position");
  }
  set "background-position"(value) {
    this.setProperty("background-position", value);
  }

  get backgroundRepeat() {
    return this.getPropertyValue("background-repeat");
  }
  set backgroundRepeat(value) {
    this.setProperty("background-repeat", value);
  }

  get "background-repeat"() {
    return this.getPropertyValue("background-repeat");
  }
  set "background-repeat"(value) {
    this.setProperty("background-repeat", value);
  }

  get backgroundSize() {
    return this.getPropertyValue("background-size");
  }
  set backgroundSize(value) {
    this.setProperty("background-size", value);
  }

  get "background-size"() {
    return this.getPropertyValue("background-size");
  }
  set "background-size"(value) {
    this.setProperty("background-size", value);
  }

  get blockSize() {
    return this.getPropertyValue("block-size");
  }
  set blockSize(value) {
    this.setProperty("block-size", value);
  }

  get "block-size"() {
    return this.getPropertyValue("block-size");
  }
  set "block-size"(value) {
    this.setProperty("block-size", value);
  }

  get border() {
    return this.getPropertyValue("border");
  }
  set border(value) {
    this.setProperty("border", value);
  }

  get borderBlockEnd() {
    return this.getPropertyValue("border-block-end");
  }
  set borderBlockEnd(value) {
    this.setProperty("border-block-end", value);
  }

  get "border-block-end"() {
    return this.getPropertyValue("border-block-end");
  }
  set "border-block-end"(value) {
    this.setProperty("border-block-end", value);
  }

  get borderBlockEndColor() {
    return this.getPropertyValue("border-block-end-color");
  }
  set borderBlockEndColor(value) {
    this.setProperty("border-block-end-color", value);
  }

  get "border-block-end-color"() {
    return this.getPropertyValue("border-block-end-color");
  }
  set "border-block-end-color"(value) {
    this.setProperty("border-block-end-color", value);
  }

  get borderBlockEndStyle() {
    return this.getPropertyValue("border-block-end-style");
  }
  set borderBlockEndStyle(value) {
    this.setProperty("border-block-end-style", value);
  }

  get "border-block-end-style"() {
    return this.getPropertyValue("border-block-end-style");
  }
  set "border-block-end-style"(value) {
    this.setProperty("border-block-end-style", value);
  }

  get borderBlockEndWidth() {
    return this.getPropertyValue("border-block-end-width");
  }
  set borderBlockEndWidth(value) {
    this.setProperty("border-block-end-width", value);
  }

  get "border-block-end-width"() {
    return this.getPropertyValue("border-block-end-width");
  }
  set "border-block-end-width"(value) {
    this.setProperty("border-block-end-width", value);
  }

  get borderBlockStart() {
    return this.getPropertyValue("border-block-start");
  }
  set borderBlockStart(value) {
    this.setProperty("border-block-start", value);
  }

  get "border-block-start"() {
    return this.getPropertyValue("border-block-start");
  }
  set "border-block-start"(value) {
    this.setProperty("border-block-start", value);
  }

  get borderBlockStartColor() {
    return this.getPropertyValue("border-block-start-color");
  }
  set borderBlockStartColor(value) {
    this.setProperty("border-block-start-color", value);
  }

  get "border-block-start-color"() {
    return this.getPropertyValue("border-block-start-color");
  }
  set "border-block-start-color"(value) {
    this.setProperty("border-block-start-color", value);
  }

  get borderBlockStartStyle() {
    return this.getPropertyValue("border-block-start-style");
  }
  set borderBlockStartStyle(value) {
    this.setProperty("border-block-start-style", value);
  }

  get "border-block-start-style"() {
    return this.getPropertyValue("border-block-start-style");
  }
  set "border-block-start-style"(value) {
    this.setProperty("border-block-start-style", value);
  }

  get borderBlockStartWidth() {
    return this.getPropertyValue("border-block-start-width");
  }
  set borderBlockStartWidth(value) {
    this.setProperty("border-block-start-width", value);
  }

  get "border-block-start-width"() {
    return this.getPropertyValue("border-block-start-width");
  }
  set "border-block-start-width"(value) {
    this.setProperty("border-block-start-width", value);
  }

  get borderBottom() {
    return this.getPropertyValue("border-bottom");
  }
  set borderBottom(value) {
    this.setProperty("border-bottom", value);
  }

  get "border-bottom"() {
    return this.getPropertyValue("border-bottom");
  }
  set "border-bottom"(value) {
    this.setProperty("border-bottom", value);
  }

  get borderBottomColor() {
    return this.getPropertyValue("border-bottom-color");
  }
  set borderBottomColor(value) {
    this.setProperty("border-bottom-color", value);
  }

  get "border-bottom-color"() {
    return this.getPropertyValue("border-bottom-color");
  }
  set "border-bottom-color"(value) {
    this.setProperty("border-bottom-color", value);
  }

  get borderBottomLeftRadius() {
    return this.getPropertyValue("border-bottom-left-radius");
  }
  set borderBottomLeftRadius(value) {
    this.setProperty("border-bottom-left-radius", value);
  }

  get "border-bottom-left-radius"() {
    return this.getPropertyValue("border-bottom-left-radius");
  }
  set "border-bottom-left-radius"(value) {
    this.setProperty("border-bottom-left-radius", value);
  }

  get borderBottomRightRadius() {
    return this.getPropertyValue("border-bottom-right-radius");
  }
  set borderBottomRightRadius(value) {
    this.setProperty("border-bottom-right-radius", value);
  }

  get "border-bottom-right-radius"() {
    return this.getPropertyValue("border-bottom-right-radius");
  }
  set "border-bottom-right-radius"(value) {
    this.setProperty("border-bottom-right-radius", value);
  }

  get borderBottomStyle() {
    return this.getPropertyValue("border-bottom-style");
  }
  set borderBottomStyle(value) {
    this.setProperty("border-bottom-style", value);
  }

  get "border-bottom-style"() {
    return this.getPropertyValue("border-bottom-style");
  }
  set "border-bottom-style"(value) {
    this.setProperty("border-bottom-style", value);
  }

  get borderBottomWidth() {
    return this.getPropertyValue("border-bottom-width");
  }
  set borderBottomWidth(value) {
    this.setProperty("border-bottom-width", value);
  }

  get "border-bottom-width"() {
    return this.getPropertyValue("border-bottom-width");
  }
  set "border-bottom-width"(value) {
    this.setProperty("border-bottom-width", value);
  }

  get borderCollapse() {
    return this.getPropertyValue("border-collapse");
  }
  set borderCollapse(value) {
    this.setProperty("border-collapse", value);
  }

  get "border-collapse"() {
    return this.getPropertyValue("border-collapse");
  }
  set "border-collapse"(value) {
    this.setProperty("border-collapse", value);
  }

  get borderColor() {
    return this.getPropertyValue("border-color");
  }
  set borderColor(value) {
    this.setProperty("border-color", value);
  }

  get "border-color"() {
    return this.getPropertyValue("border-color");
  }
  set "border-color"(value) {
    this.setProperty("border-color", value);
  }

  get borderImage() {
    return this.getPropertyValue("border-image");
  }
  set borderImage(value) {
    this.setProperty("border-image", value);
  }

  get "border-image"() {
    return this.getPropertyValue("border-image");
  }
  set "border-image"(value) {
    this.setProperty("border-image", value);
  }

  get borderImageOutset() {
    return this.getPropertyValue("border-image-outset");
  }
  set borderImageOutset(value) {
    this.setProperty("border-image-outset", value);
  }

  get "border-image-outset"() {
    return this.getPropertyValue("border-image-outset");
  }
  set "border-image-outset"(value) {
    this.setProperty("border-image-outset", value);
  }

  get borderImageRepeat() {
    return this.getPropertyValue("border-image-repeat");
  }
  set borderImageRepeat(value) {
    this.setProperty("border-image-repeat", value);
  }

  get "border-image-repeat"() {
    return this.getPropertyValue("border-image-repeat");
  }
  set "border-image-repeat"(value) {
    this.setProperty("border-image-repeat", value);
  }

  get borderImageSlice() {
    return this.getPropertyValue("border-image-slice");
  }
  set borderImageSlice(value) {
    this.setProperty("border-image-slice", value);
  }

  get "border-image-slice"() {
    return this.getPropertyValue("border-image-slice");
  }
  set "border-image-slice"(value) {
    this.setProperty("border-image-slice", value);
  }

  get borderImageSource() {
    return this.getPropertyValue("border-image-source");
  }
  set borderImageSource(value) {
    this.setProperty("border-image-source", value);
  }

  get "border-image-source"() {
    return this.getPropertyValue("border-image-source");
  }
  set "border-image-source"(value) {
    this.setProperty("border-image-source", value);
  }

  get borderImageWidth() {
    return this.getPropertyValue("border-image-width");
  }
  set borderImageWidth(value) {
    this.setProperty("border-image-width", value);
  }

  get "border-image-width"() {
    return this.getPropertyValue("border-image-width");
  }
  set "border-image-width"(value) {
    this.setProperty("border-image-width", value);
  }

  get borderInlineEnd() {
    return this.getPropertyValue("border-inline-end");
  }
  set borderInlineEnd(value) {
    this.setProperty("border-inline-end", value);
  }

  get "border-inline-end"() {
    return this.getPropertyValue("border-inline-end");
  }
  set "border-inline-end"(value) {
    this.setProperty("border-inline-end", value);
  }

  get borderInlineEndColor() {
    return this.getPropertyValue("border-inline-end-color");
  }
  set borderInlineEndColor(value) {
    this.setProperty("border-inline-end-color", value);
  }

  get "border-inline-end-color"() {
    return this.getPropertyValue("border-inline-end-color");
  }
  set "border-inline-end-color"(value) {
    this.setProperty("border-inline-end-color", value);
  }

  get borderInlineEndStyle() {
    return this.getPropertyValue("border-inline-end-style");
  }
  set borderInlineEndStyle(value) {
    this.setProperty("border-inline-end-style", value);
  }

  get "border-inline-end-style"() {
    return this.getPropertyValue("border-inline-end-style");
  }
  set "border-inline-end-style"(value) {
    this.setProperty("border-inline-end-style", value);
  }

  get borderInlineEndWidth() {
    return this.getPropertyValue("border-inline-end-width");
  }
  set borderInlineEndWidth(value) {
    this.setProperty("border-inline-end-width", value);
  }

  get "border-inline-end-width"() {
    return this.getPropertyValue("border-inline-end-width");
  }
  set "border-inline-end-width"(value) {
    this.setProperty("border-inline-end-width", value);
  }

  get borderInlineStart() {
    return this.getPropertyValue("border-inline-start");
  }
  set borderInlineStart(value) {
    this.setProperty("border-inline-start", value);
  }

  get "border-inline-start"() {
    return this.getPropertyValue("border-inline-start");
  }
  set "border-inline-start"(value) {
    this.setProperty("border-inline-start", value);
  }

  get borderInlineStartColor() {
    return this.getPropertyValue("border-inline-start-color");
  }
  set borderInlineStartColor(value) {
    this.setProperty("border-inline-start-color", value);
  }

  get "border-inline-start-color"() {
    return this.getPropertyValue("border-inline-start-color");
  }
  set "border-inline-start-color"(value) {
    this.setProperty("border-inline-start-color", value);
  }

  get borderInlineStartStyle() {
    return this.getPropertyValue("border-inline-start-style");
  }
  set borderInlineStartStyle(value) {
    this.setProperty("border-inline-start-style", value);
  }

  get "border-inline-start-style"() {
    return this.getPropertyValue("border-inline-start-style");
  }
  set "border-inline-start-style"(value) {
    this.setProperty("border-inline-start-style", value);
  }

  get borderInlineStartWidth() {
    return this.getPropertyValue("border-inline-start-width");
  }
  set borderInlineStartWidth(value) {
    this.setProperty("border-inline-start-width", value);
  }

  get "border-inline-start-width"() {
    return this.getPropertyValue("border-inline-start-width");
  }
  set "border-inline-start-width"(value) {
    this.setProperty("border-inline-start-width", value);
  }

  get borderLeft() {
    return this.getPropertyValue("border-left");
  }
  set borderLeft(value) {
    this.setProperty("border-left", value);
  }

  get "border-left"() {
    return this.getPropertyValue("border-left");
  }
  set "border-left"(value) {
    this.setProperty("border-left", value);
  }

  get borderLeftColor() {
    return this.getPropertyValue("border-left-color");
  }
  set borderLeftColor(value) {
    this.setProperty("border-left-color", value);
  }

  get "border-left-color"() {
    return this.getPropertyValue("border-left-color");
  }
  set "border-left-color"(value) {
    this.setProperty("border-left-color", value);
  }

  get borderLeftStyle() {
    return this.getPropertyValue("border-left-style");
  }
  set borderLeftStyle(value) {
    this.setProperty("border-left-style", value);
  }

  get "border-left-style"() {
    return this.getPropertyValue("border-left-style");
  }
  set "border-left-style"(value) {
    this.setProperty("border-left-style", value);
  }

  get borderLeftWidth() {
    return this.getPropertyValue("border-left-width");
  }
  set borderLeftWidth(value) {
    this.setProperty("border-left-width", value);
  }

  get "border-left-width"() {
    return this.getPropertyValue("border-left-width");
  }
  set "border-left-width"(value) {
    this.setProperty("border-left-width", value);
  }

  get borderRadius() {
    return this.getPropertyValue("border-radius");
  }
  set borderRadius(value) {
    this.setProperty("border-radius", value);
  }

  get "border-radius"() {
    return this.getPropertyValue("border-radius");
  }
  set "border-radius"(value) {
    this.setProperty("border-radius", value);
  }

  get borderRight() {
    return this.getPropertyValue("border-right");
  }
  set borderRight(value) {
    this.setProperty("border-right", value);
  }

  get "border-right"() {
    return this.getPropertyValue("border-right");
  }
  set "border-right"(value) {
    this.setProperty("border-right", value);
  }

  get borderRightColor() {
    return this.getPropertyValue("border-right-color");
  }
  set borderRightColor(value) {
    this.setProperty("border-right-color", value);
  }

  get "border-right-color"() {
    return this.getPropertyValue("border-right-color");
  }
  set "border-right-color"(value) {
    this.setProperty("border-right-color", value);
  }

  get borderRightStyle() {
    return this.getPropertyValue("border-right-style");
  }
  set borderRightStyle(value) {
    this.setProperty("border-right-style", value);
  }

  get "border-right-style"() {
    return this.getPropertyValue("border-right-style");
  }
  set "border-right-style"(value) {
    this.setProperty("border-right-style", value);
  }

  get borderRightWidth() {
    return this.getPropertyValue("border-right-width");
  }
  set borderRightWidth(value) {
    this.setProperty("border-right-width", value);
  }

  get "border-right-width"() {
    return this.getPropertyValue("border-right-width");
  }
  set "border-right-width"(value) {
    this.setProperty("border-right-width", value);
  }

  get borderSpacing() {
    return this.getPropertyValue("border-spacing");
  }
  set borderSpacing(value) {
    this.setProperty("border-spacing", value);
  }

  get "border-spacing"() {
    return this.getPropertyValue("border-spacing");
  }
  set "border-spacing"(value) {
    this.setProperty("border-spacing", value);
  }

  get borderStyle() {
    return this.getPropertyValue("border-style");
  }
  set borderStyle(value) {
    this.setProperty("border-style", value);
  }

  get "border-style"() {
    return this.getPropertyValue("border-style");
  }
  set "border-style"(value) {
    this.setProperty("border-style", value);
  }

  get borderTop() {
    return this.getPropertyValue("border-top");
  }
  set borderTop(value) {
    this.setProperty("border-top", value);
  }

  get "border-top"() {
    return this.getPropertyValue("border-top");
  }
  set "border-top"(value) {
    this.setProperty("border-top", value);
  }

  get borderTopColor() {
    return this.getPropertyValue("border-top-color");
  }
  set borderTopColor(value) {
    this.setProperty("border-top-color", value);
  }

  get "border-top-color"() {
    return this.getPropertyValue("border-top-color");
  }
  set "border-top-color"(value) {
    this.setProperty("border-top-color", value);
  }

  get borderTopLeftRadius() {
    return this.getPropertyValue("border-top-left-radius");
  }
  set borderTopLeftRadius(value) {
    this.setProperty("border-top-left-radius", value);
  }

  get "border-top-left-radius"() {
    return this.getPropertyValue("border-top-left-radius");
  }
  set "border-top-left-radius"(value) {
    this.setProperty("border-top-left-radius", value);
  }

  get borderTopRightRadius() {
    return this.getPropertyValue("border-top-right-radius");
  }
  set borderTopRightRadius(value) {
    this.setProperty("border-top-right-radius", value);
  }

  get "border-top-right-radius"() {
    return this.getPropertyValue("border-top-right-radius");
  }
  set "border-top-right-radius"(value) {
    this.setProperty("border-top-right-radius", value);
  }

  get borderTopStyle() {
    return this.getPropertyValue("border-top-style");
  }
  set borderTopStyle(value) {
    this.setProperty("border-top-style", value);
  }

  get "border-top-style"() {
    return this.getPropertyValue("border-top-style");
  }
  set "border-top-style"(value) {
    this.setProperty("border-top-style", value);
  }

  get borderTopWidth() {
    return this.getPropertyValue("border-top-width");
  }
  set borderTopWidth(value) {
    this.setProperty("border-top-width", value);
  }

  get "border-top-width"() {
    return this.getPropertyValue("border-top-width");
  }
  set "border-top-width"(value) {
    this.setProperty("border-top-width", value);
  }

  get borderWidth() {
    return this.getPropertyValue("border-width");
  }
  set borderWidth(value) {
    this.setProperty("border-width", value);
  }

  get "border-width"() {
    return this.getPropertyValue("border-width");
  }
  set "border-width"(value) {
    this.setProperty("border-width", value);
  }

  get bottom() {
    return this.getPropertyValue("bottom");
  }
  set bottom(value) {
    this.setProperty("bottom", value);
  }

  get boxDecorationBreak() {
    return this.getPropertyValue("box-decoration-break");
  }
  set boxDecorationBreak(value) {
    this.setProperty("box-decoration-break", value);
  }

  get "box-decoration-break"() {
    return this.getPropertyValue("box-decoration-break");
  }
  set "box-decoration-break"(value) {
    this.setProperty("box-decoration-break", value);
  }

  get boxShadow() {
    return this.getPropertyValue("box-shadow");
  }
  set boxShadow(value) {
    this.setProperty("box-shadow", value);
  }

  get "box-shadow"() {
    return this.getPropertyValue("box-shadow");
  }
  set "box-shadow"(value) {
    this.setProperty("box-shadow", value);
  }

  get boxSizing() {
    return this.getPropertyValue("box-sizing");
  }
  set boxSizing(value) {
    this.setProperty("box-sizing", value);
  }

  get "box-sizing"() {
    return this.getPropertyValue("box-sizing");
  }
  set "box-sizing"(value) {
    this.setProperty("box-sizing", value);
  }

  get breakAfter() {
    return this.getPropertyValue("break-after");
  }
  set breakAfter(value) {
    this.setProperty("break-after", value);
  }

  get "break-after"() {
    return this.getPropertyValue("break-after");
  }
  set "break-after"(value) {
    this.setProperty("break-after", value);
  }

  get breakBefore() {
    return this.getPropertyValue("break-before");
  }
  set breakBefore(value) {
    this.setProperty("break-before", value);
  }

  get "break-before"() {
    return this.getPropertyValue("break-before");
  }
  set "break-before"(value) {
    this.setProperty("break-before", value);
  }

  get breakInside() {
    return this.getPropertyValue("break-inside");
  }
  set breakInside(value) {
    this.setProperty("break-inside", value);
  }

  get "break-inside"() {
    return this.getPropertyValue("break-inside");
  }
  set "break-inside"(value) {
    this.setProperty("break-inside", value);
  }

  get captionSide() {
    return this.getPropertyValue("caption-side");
  }
  set captionSide(value) {
    this.setProperty("caption-side", value);
  }

  get "caption-side"() {
    return this.getPropertyValue("caption-side");
  }
  set "caption-side"(value) {
    this.setProperty("caption-side", value);
  }

  get caretColor() {
    return this.getPropertyValue("caret-color");
  }
  set caretColor(value) {
    this.setProperty("caret-color", value);
  }

  get "caret-color"() {
    return this.getPropertyValue("caret-color");
  }
  set "caret-color"(value) {
    this.setProperty("caret-color", value);
  }

  get clear() {
    return this.getPropertyValue("clear");
  }
  set clear(value) {
    this.setProperty("clear", value);
  }

  get clip() {
    return this.getPropertyValue("clip");
  }
  set clip(value) {
    this.setProperty("clip", value);
  }

  get clipPath() {
    return this.getPropertyValue("clip-path");
  }
  set clipPath(value) {
    this.setProperty("clip-path", value);
  }

  get "clip-path"() {
    return this.getPropertyValue("clip-path");
  }
  set "clip-path"(value) {
    this.setProperty("clip-path", value);
  }

  get color() {
    return this.getPropertyValue("color");
  }
  set color(value) {
    this.setProperty("color", value);
  }

  get columnCount() {
    return this.getPropertyValue("column-count");
  }
  set columnCount(value) {
    this.setProperty("column-count", value);
  }

  get "column-count"() {
    return this.getPropertyValue("column-count");
  }
  set "column-count"(value) {
    this.setProperty("column-count", value);
  }

  get columnFill() {
    return this.getPropertyValue("column-fill");
  }
  set columnFill(value) {
    this.setProperty("column-fill", value);
  }

  get "column-fill"() {
    return this.getPropertyValue("column-fill");
  }
  set "column-fill"(value) {
    this.setProperty("column-fill", value);
  }

  get columnGap() {
    return this.getPropertyValue("column-gap");
  }
  set columnGap(value) {
    this.setProperty("column-gap", value);
  }

  get "column-gap"() {
    return this.getPropertyValue("column-gap");
  }
  set "column-gap"(value) {
    this.setProperty("column-gap", value);
  }

  get columnRule() {
    return this.getPropertyValue("column-rule");
  }
  set columnRule(value) {
    this.setProperty("column-rule", value);
  }

  get "column-rule"() {
    return this.getPropertyValue("column-rule");
  }
  set "column-rule"(value) {
    this.setProperty("column-rule", value);
  }

  get columnRuleColor() {
    return this.getPropertyValue("column-rule-color");
  }
  set columnRuleColor(value) {
    this.setProperty("column-rule-color", value);
  }

  get "column-rule-color"() {
    return this.getPropertyValue("column-rule-color");
  }
  set "column-rule-color"(value) {
    this.setProperty("column-rule-color", value);
  }

  get columnRuleStyle() {
    return this.getPropertyValue("column-rule-style");
  }
  set columnRuleStyle(value) {
    this.setProperty("column-rule-style", value);
  }

  get "column-rule-style"() {
    return this.getPropertyValue("column-rule-style");
  }
  set "column-rule-style"(value) {
    this.setProperty("column-rule-style", value);
  }

  get columnRuleWidth() {
    return this.getPropertyValue("column-rule-width");
  }
  set columnRuleWidth(value) {
    this.setProperty("column-rule-width", value);
  }

  get "column-rule-width"() {
    return this.getPropertyValue("column-rule-width");
  }
  set "column-rule-width"(value) {
    this.setProperty("column-rule-width", value);
  }

  get columnSpan() {
    return this.getPropertyValue("column-span");
  }
  set columnSpan(value) {
    this.setProperty("column-span", value);
  }

  get "column-span"() {
    return this.getPropertyValue("column-span");
  }
  set "column-span"(value) {
    this.setProperty("column-span", value);
  }

  get columnWidth() {
    return this.getPropertyValue("column-width");
  }
  set columnWidth(value) {
    this.setProperty("column-width", value);
  }

  get "column-width"() {
    return this.getPropertyValue("column-width");
  }
  set "column-width"(value) {
    this.setProperty("column-width", value);
  }

  get columns() {
    return this.getPropertyValue("columns");
  }
  set columns(value) {
    this.setProperty("columns", value);
  }

  get content() {
    return this.getPropertyValue("content");
  }
  set content(value) {
    this.setProperty("content", value);
  }

  get counterIncrement() {
    return this.getPropertyValue("counter-increment");
  }
  set counterIncrement(value) {
    this.setProperty("counter-increment", value);
  }

  get "counter-increment"() {
    return this.getPropertyValue("counter-increment");
  }
  set "counter-increment"(value) {
    this.setProperty("counter-increment", value);
  }

  get counterReset() {
    return this.getPropertyValue("counter-reset");
  }
  set counterReset(value) {
    this.setProperty("counter-reset", value);
  }

  get "counter-reset"() {
    return this.getPropertyValue("counter-reset");
  }
  set "counter-reset"(value) {
    this.setProperty("counter-reset", value);
  }

  get cursor() {
    return this.getPropertyValue("cursor");
  }
  set cursor(value) {
    this.setProperty("cursor", value);
  }

  get direction() {
    return this.getPropertyValue("direction");
  }
  set direction(value) {
    this.setProperty("direction", value);
  }

  get display() {
    return this.getPropertyValue("display");
  }
  set display(value) {
    this.setProperty("display", value);
  }

  get emptyCells() {
    return this.getPropertyValue("empty-cells");
  }
  set emptyCells(value) {
    this.setProperty("empty-cells", value);
  }

  get "empty-cells"() {
    return this.getPropertyValue("empty-cells");
  }
  set "empty-cells"(value) {
    this.setProperty("empty-cells", value);
  }

  get filter() {
    return this.getPropertyValue("filter");
  }
  set filter(value) {
    this.setProperty("filter", value);
  }

  get flex() {
    return this.getPropertyValue("flex");
  }
  set flex(value) {
    this.setProperty("flex", value);
  }

  get flexBasis() {
    return this.getPropertyValue("flex-basis");
  }
  set flexBasis(value) {
    this.setProperty("flex-basis", value);
  }

  get "flex-basis"() {
    return this.getPropertyValue("flex-basis");
  }
  set "flex-basis"(value) {
    this.setProperty("flex-basis", value);
  }

  get flexDirection() {
    return this.getPropertyValue("flex-direction");
  }
  set flexDirection(value) {
    this.setProperty("flex-direction", value);
  }

  get "flex-direction"() {
    return this.getPropertyValue("flex-direction");
  }
  set "flex-direction"(value) {
    this.setProperty("flex-direction", value);
  }

  get flexFlow() {
    return this.getPropertyValue("flex-flow");
  }
  set flexFlow(value) {
    this.setProperty("flex-flow", value);
  }

  get "flex-flow"() {
    return this.getPropertyValue("flex-flow");
  }
  set "flex-flow"(value) {
    this.setProperty("flex-flow", value);
  }

  get flexGrow() {
    return this.getPropertyValue("flex-grow");
  }
  set flexGrow(value) {
    this.setProperty("flex-grow", value);
  }

  get "flex-grow"() {
    return this.getPropertyValue("flex-grow");
  }
  set "flex-grow"(value) {
    this.setProperty("flex-grow", value);
  }

  get flexShrink() {
    return this.getPropertyValue("flex-shrink");
  }
  set flexShrink(value) {
    this.setProperty("flex-shrink", value);
  }

  get "flex-shrink"() {
    return this.getPropertyValue("flex-shrink");
  }
  set "flex-shrink"(value) {
    this.setProperty("flex-shrink", value);
  }

  get flexWrap() {
    return this.getPropertyValue("flex-wrap");
  }
  set flexWrap(value) {
    this.setProperty("flex-wrap", value);
  }

  get "flex-wrap"() {
    return this.getPropertyValue("flex-wrap");
  }
  set "flex-wrap"(value) {
    this.setProperty("flex-wrap", value);
  }

  get float() {
    return this.getPropertyValue("float");
  }
  set float(value) {
    this.setProperty("float", value);
  }

  get font() {
    return this.getPropertyValue("font");
  }
  set font(value) {
    this.setProperty("font", value);
  }

  get fontFamily() {
    return this.getPropertyValue("font-family");
  }
  set fontFamily(value) {
    this.setProperty("font-family", value);
  }

  get "font-family"() {
    return this.getPropertyValue("font-family");
  }
  set "font-family"(value) {
    this.setProperty("font-family", value);
  }

  get fontFeatureSettings() {
    return this.getPropertyValue("font-feature-settings");
  }
  set fontFeatureSettings(value) {
    this.setProperty("font-feature-settings", value);
  }

  get "font-feature-settings"() {
    return this.getPropertyValue("font-feature-settings");
  }
  set "font-feature-settings"(value) {
    this.setProperty("font-feature-settings", value);
  }

  get fontKerning() {
    return this.getPropertyValue("font-kerning");
  }
  set fontKerning(value) {
    this.setProperty("font-kerning", value);
  }

  get "font-kerning"() {
    return this.getPropertyValue("font-kerning");
  }
  set "font-kerning"(value) {
    this.setProperty("font-kerning", value);
  }

  get fontLanguageOverride() {
    return this.getPropertyValue("font-language-override");
  }
  set fontLanguageOverride(value) {
    this.setProperty("font-language-override", value);
  }

  get "font-language-override"() {
    return this.getPropertyValue("font-language-override");
  }
  set "font-language-override"(value) {
    this.setProperty("font-language-override", value);
  }

  get fontSize() {
    return this.getPropertyValue("font-size");
  }
  set fontSize(value) {
    this.setProperty("font-size", value);
  }

  get "font-size"() {
    return this.getPropertyValue("font-size");
  }
  set "font-size"(value) {
    this.setProperty("font-size", value);
  }

  get fontSizeAdjust() {
    return this.getPropertyValue("font-size-adjust");
  }
  set fontSizeAdjust(value) {
    this.setProperty("font-size-adjust", value);
  }

  get "font-size-adjust"() {
    return this.getPropertyValue("font-size-adjust");
  }
  set "font-size-adjust"(value) {
    this.setProperty("font-size-adjust", value);
  }

  get fontStretch() {
    return this.getPropertyValue("font-stretch");
  }
  set fontStretch(value) {
    this.setProperty("font-stretch", value);
  }

  get "font-stretch"() {
    return this.getPropertyValue("font-stretch");
  }
  set "font-stretch"(value) {
    this.setProperty("font-stretch", value);
  }

  get fontStyle() {
    return this.getPropertyValue("font-style");
  }
  set fontStyle(value) {
    this.setProperty("font-style", value);
  }

  get "font-style"() {
    return this.getPropertyValue("font-style");
  }
  set "font-style"(value) {
    this.setProperty("font-style", value);
  }

  get fontSynthesis() {
    return this.getPropertyValue("font-synthesis");
  }
  set fontSynthesis(value) {
    this.setProperty("font-synthesis", value);
  }

  get "font-synthesis"() {
    return this.getPropertyValue("font-synthesis");
  }
  set "font-synthesis"(value) {
    this.setProperty("font-synthesis", value);
  }

  get fontVariant() {
    return this.getPropertyValue("font-variant");
  }
  set fontVariant(value) {
    this.setProperty("font-variant", value);
  }

  get "font-variant"() {
    return this.getPropertyValue("font-variant");
  }
  set "font-variant"(value) {
    this.setProperty("font-variant", value);
  }

  get fontVariantAlternates() {
    return this.getPropertyValue("font-variant-alternates");
  }
  set fontVariantAlternates(value) {
    this.setProperty("font-variant-alternates", value);
  }

  get "font-variant-alternates"() {
    return this.getPropertyValue("font-variant-alternates");
  }
  set "font-variant-alternates"(value) {
    this.setProperty("font-variant-alternates", value);
  }

  get fontVariantCaps() {
    return this.getPropertyValue("font-variant-caps");
  }
  set fontVariantCaps(value) {
    this.setProperty("font-variant-caps", value);
  }

  get "font-variant-caps"() {
    return this.getPropertyValue("font-variant-caps");
  }
  set "font-variant-caps"(value) {
    this.setProperty("font-variant-caps", value);
  }

  get fontVariantEastAsian() {
    return this.getPropertyValue("font-variant-east-asian");
  }
  set fontVariantEastAsian(value) {
    this.setProperty("font-variant-east-asian", value);
  }

  get "font-variant-east-asian"() {
    return this.getPropertyValue("font-variant-east-asian");
  }
  set "font-variant-east-asian"(value) {
    this.setProperty("font-variant-east-asian", value);
  }

  get fontVariantLigatures() {
    return this.getPropertyValue("font-variant-ligatures");
  }
  set fontVariantLigatures(value) {
    this.setProperty("font-variant-ligatures", value);
  }

  get "font-variant-ligatures"() {
    return this.getPropertyValue("font-variant-ligatures");
  }
  set "font-variant-ligatures"(value) {
    this.setProperty("font-variant-ligatures", value);
  }

  get fontVariantNumeric() {
    return this.getPropertyValue("font-variant-numeric");
  }
  set fontVariantNumeric(value) {
    this.setProperty("font-variant-numeric", value);
  }

  get "font-variant-numeric"() {
    return this.getPropertyValue("font-variant-numeric");
  }
  set "font-variant-numeric"(value) {
    this.setProperty("font-variant-numeric", value);
  }

  get fontVariantPosition() {
    return this.getPropertyValue("font-variant-position");
  }
  set fontVariantPosition(value) {
    this.setProperty("font-variant-position", value);
  }

  get "font-variant-position"() {
    return this.getPropertyValue("font-variant-position");
  }
  set "font-variant-position"(value) {
    this.setProperty("font-variant-position", value);
  }

  get fontWeight() {
    return this.getPropertyValue("font-weight");
  }
  set fontWeight(value) {
    this.setProperty("font-weight", value);
  }

  get "font-weight"() {
    return this.getPropertyValue("font-weight");
  }
  set "font-weight"(value) {
    this.setProperty("font-weight", value);
  }

  get grid() {
    return this.getPropertyValue("grid");
  }
  set grid(value) {
    this.setProperty("grid", value);
  }

  get gridArea() {
    return this.getPropertyValue("grid-area");
  }
  set gridArea(value) {
    this.setProperty("grid-area", value);
  }

  get "grid-area"() {
    return this.getPropertyValue("grid-area");
  }
  set "grid-area"(value) {
    this.setProperty("grid-area", value);
  }

  get gridAutoColumns() {
    return this.getPropertyValue("grid-auto-columns");
  }
  set gridAutoColumns(value) {
    this.setProperty("grid-auto-columns", value);
  }

  get "grid-auto-columns"() {
    return this.getPropertyValue("grid-auto-columns");
  }
  set "grid-auto-columns"(value) {
    this.setProperty("grid-auto-columns", value);
  }

  get gridAutoFlow() {
    return this.getPropertyValue("grid-auto-flow");
  }
  set gridAutoFlow(value) {
    this.setProperty("grid-auto-flow", value);
  }

  get "grid-auto-flow"() {
    return this.getPropertyValue("grid-auto-flow");
  }
  set "grid-auto-flow"(value) {
    this.setProperty("grid-auto-flow", value);
  }

  get gridAutoRows() {
    return this.getPropertyValue("grid-auto-rows");
  }
  set gridAutoRows(value) {
    this.setProperty("grid-auto-rows", value);
  }

  get "grid-auto-rows"() {
    return this.getPropertyValue("grid-auto-rows");
  }
  set "grid-auto-rows"(value) {
    this.setProperty("grid-auto-rows", value);
  }

  get gridColumn() {
    return this.getPropertyValue("grid-column");
  }
  set gridColumn(value) {
    this.setProperty("grid-column", value);
  }

  get "grid-column"() {
    return this.getPropertyValue("grid-column");
  }
  set "grid-column"(value) {
    this.setProperty("grid-column", value);
  }

  get gridColumnEnd() {
    return this.getPropertyValue("grid-column-end");
  }
  set gridColumnEnd(value) {
    this.setProperty("grid-column-end", value);
  }

  get "grid-column-end"() {
    return this.getPropertyValue("grid-column-end");
  }
  set "grid-column-end"(value) {
    this.setProperty("grid-column-end", value);
  }

  get gridColumnGap() {
    return this.getPropertyValue("grid-column-gap");
  }
  set gridColumnGap(value) {
    this.setProperty("grid-column-gap", value);
  }

  get "grid-column-gap"() {
    return this.getPropertyValue("grid-column-gap");
  }
  set "grid-column-gap"(value) {
    this.setProperty("grid-column-gap", value);
  }

  get gridColumnStart() {
    return this.getPropertyValue("grid-column-start");
  }
  set gridColumnStart(value) {
    this.setProperty("grid-column-start", value);
  }

  get "grid-column-start"() {
    return this.getPropertyValue("grid-column-start");
  }
  set "grid-column-start"(value) {
    this.setProperty("grid-column-start", value);
  }

  get gridGap() {
    return this.getPropertyValue("grid-gap");
  }
  set gridGap(value) {
    this.setProperty("grid-gap", value);
  }

  get "grid-gap"() {
    return this.getPropertyValue("grid-gap");
  }
  set "grid-gap"(value) {
    this.setProperty("grid-gap", value);
  }

  get gridRow() {
    return this.getPropertyValue("grid-row");
  }
  set gridRow(value) {
    this.setProperty("grid-row", value);
  }

  get "grid-row"() {
    return this.getPropertyValue("grid-row");
  }
  set "grid-row"(value) {
    this.setProperty("grid-row", value);
  }

  get gridRowEnd() {
    return this.getPropertyValue("grid-row-end");
  }
  set gridRowEnd(value) {
    this.setProperty("grid-row-end", value);
  }

  get "grid-row-end"() {
    return this.getPropertyValue("grid-row-end");
  }
  set "grid-row-end"(value) {
    this.setProperty("grid-row-end", value);
  }

  get gridRowGap() {
    return this.getPropertyValue("grid-row-gap");
  }
  set gridRowGap(value) {
    this.setProperty("grid-row-gap", value);
  }

  get "grid-row-gap"() {
    return this.getPropertyValue("grid-row-gap");
  }
  set "grid-row-gap"(value) {
    this.setProperty("grid-row-gap", value);
  }

  get gridRowStart() {
    return this.getPropertyValue("grid-row-start");
  }
  set gridRowStart(value) {
    this.setProperty("grid-row-start", value);
  }

  get "grid-row-start"() {
    return this.getPropertyValue("grid-row-start");
  }
  set "grid-row-start"(value) {
    this.setProperty("grid-row-start", value);
  }

  get gridTemplate() {
    return this.getPropertyValue("grid-template");
  }
  set gridTemplate(value) {
    this.setProperty("grid-template", value);
  }

  get "grid-template"() {
    return this.getPropertyValue("grid-template");
  }
  set "grid-template"(value) {
    this.setProperty("grid-template", value);
  }

  get gridTemplateAreas() {
    return this.getPropertyValue("grid-template-areas");
  }
  set gridTemplateAreas(value) {
    this.setProperty("grid-template-areas", value);
  }

  get "grid-template-areas"() {
    return this.getPropertyValue("grid-template-areas");
  }
  set "grid-template-areas"(value) {
    this.setProperty("grid-template-areas", value);
  }

  get gridTemplateColumns() {
    return this.getPropertyValue("grid-template-columns");
  }
  set gridTemplateColumns(value) {
    this.setProperty("grid-template-columns", value);
  }

  get "grid-template-columns"() {
    return this.getPropertyValue("grid-template-columns");
  }
  set "grid-template-columns"(value) {
    this.setProperty("grid-template-columns", value);
  }

  get gridTemplateRows() {
    return this.getPropertyValue("grid-template-rows");
  }
  set gridTemplateRows(value) {
    this.setProperty("grid-template-rows", value);
  }

  get "grid-template-rows"() {
    return this.getPropertyValue("grid-template-rows");
  }
  set "grid-template-rows"(value) {
    this.setProperty("grid-template-rows", value);
  }

  get height() {
    return this.getPropertyValue("height");
  }
  set height(value) {
    this.setProperty("height", value);
  }

  get hyphens() {
    return this.getPropertyValue("hyphens");
  }
  set hyphens(value) {
    this.setProperty("hyphens", value);
  }

  get imageOrientation() {
    return this.getPropertyValue("image-orientation");
  }
  set imageOrientation(value) {
    this.setProperty("image-orientation", value);
  }

  get "image-orientation"() {
    return this.getPropertyValue("image-orientation");
  }
  set "image-orientation"(value) {
    this.setProperty("image-orientation", value);
  }

  get imageRendering() {
    return this.getPropertyValue("image-rendering");
  }
  set imageRendering(value) {
    this.setProperty("image-rendering", value);
  }

  get "image-rendering"() {
    return this.getPropertyValue("image-rendering");
  }
  set "image-rendering"(value) {
    this.setProperty("image-rendering", value);
  }

  get imageResolution() {
    return this.getPropertyValue("image-resolution");
  }
  set imageResolution(value) {
    this.setProperty("image-resolution", value);
  }

  get "image-resolution"() {
    return this.getPropertyValue("image-resolution");
  }
  set "image-resolution"(value) {
    this.setProperty("image-resolution", value);
  }

  get imeMode() {
    return this.getPropertyValue("ime-mode");
  }
  set imeMode(value) {
    this.setProperty("ime-mode", value);
  }

  get "ime-mode"() {
    return this.getPropertyValue("ime-mode");
  }
  set "ime-mode"(value) {
    this.setProperty("ime-mode", value);
  }

  get inlineSize() {
    return this.getPropertyValue("inline-size");
  }
  set inlineSize(value) {
    this.setProperty("inline-size", value);
  }

  get "inline-size"() {
    return this.getPropertyValue("inline-size");
  }
  set "inline-size"(value) {
    this.setProperty("inline-size", value);
  }

  get isolation() {
    return this.getPropertyValue("isolation");
  }
  set isolation(value) {
    this.setProperty("isolation", value);
  }

  get justifyContent() {
    return this.getPropertyValue("justify-content");
  }
  set justifyContent(value) {
    this.setProperty("justify-content", value);
  }

  get "justify-content"() {
    return this.getPropertyValue("justify-content");
  }
  set "justify-content"(value) {
    this.setProperty("justify-content", value);
  }

  get left() {
    return this.getPropertyValue("left");
  }
  set left(value) {
    this.setProperty("left", value);
  }

  get letterSpacing() {
    return this.getPropertyValue("letter-spacing");
  }
  set letterSpacing(value) {
    this.setProperty("letter-spacing", value);
  }

  get "letter-spacing"() {
    return this.getPropertyValue("letter-spacing");
  }
  set "letter-spacing"(value) {
    this.setProperty("letter-spacing", value);
  }

  get lineBreak() {
    return this.getPropertyValue("line-break");
  }
  set lineBreak(value) {
    this.setProperty("line-break", value);
  }

  get "line-break"() {
    return this.getPropertyValue("line-break");
  }
  set "line-break"(value) {
    this.setProperty("line-break", value);
  }

  get lineHeight() {
    return this.getPropertyValue("line-height");
  }
  set lineHeight(value) {
    this.setProperty("line-height", value);
  }

  get "line-height"() {
    return this.getPropertyValue("line-height");
  }
  set "line-height"(value) {
    this.setProperty("line-height", value);
  }

  get listStyle() {
    return this.getPropertyValue("list-style");
  }
  set listStyle(value) {
    this.setProperty("list-style", value);
  }

  get "list-style"() {
    return this.getPropertyValue("list-style");
  }
  set "list-style"(value) {
    this.setProperty("list-style", value);
  }

  get listStyleImage() {
    return this.getPropertyValue("list-style-image");
  }
  set listStyleImage(value) {
    this.setProperty("list-style-image", value);
  }

  get "list-style-image"() {
    return this.getPropertyValue("list-style-image");
  }
  set "list-style-image"(value) {
    this.setProperty("list-style-image", value);
  }

  get listStylePosition() {
    return this.getPropertyValue("list-style-position");
  }
  set listStylePosition(value) {
    this.setProperty("list-style-position", value);
  }

  get "list-style-position"() {
    return this.getPropertyValue("list-style-position");
  }
  set "list-style-position"(value) {
    this.setProperty("list-style-position", value);
  }

  get listStyleType() {
    return this.getPropertyValue("list-style-type");
  }
  set listStyleType(value) {
    this.setProperty("list-style-type", value);
  }

  get "list-style-type"() {
    return this.getPropertyValue("list-style-type");
  }
  set "list-style-type"(value) {
    this.setProperty("list-style-type", value);
  }

  get margin() {
    return this.getPropertyValue("margin");
  }
  set margin(value) {
    this.setProperty("margin", value);
  }

  get marginBlockEnd() {
    return this.getPropertyValue("margin-block-end");
  }
  set marginBlockEnd(value) {
    this.setProperty("margin-block-end", value);
  }

  get "margin-block-end"() {
    return this.getPropertyValue("margin-block-end");
  }
  set "margin-block-end"(value) {
    this.setProperty("margin-block-end", value);
  }

  get marginBlockStart() {
    return this.getPropertyValue("margin-block-start");
  }
  set marginBlockStart(value) {
    this.setProperty("margin-block-start", value);
  }

  get "margin-block-start"() {
    return this.getPropertyValue("margin-block-start");
  }
  set "margin-block-start"(value) {
    this.setProperty("margin-block-start", value);
  }

  get marginBottom() {
    return this.getPropertyValue("margin-bottom");
  }
  set marginBottom(value) {
    this.setProperty("margin-bottom", value);
  }

  get "margin-bottom"() {
    return this.getPropertyValue("margin-bottom");
  }
  set "margin-bottom"(value) {
    this.setProperty("margin-bottom", value);
  }

  get marginInlineEnd() {
    return this.getPropertyValue("margin-inline-end");
  }
  set marginInlineEnd(value) {
    this.setProperty("margin-inline-end", value);
  }

  get "margin-inline-end"() {
    return this.getPropertyValue("margin-inline-end");
  }
  set "margin-inline-end"(value) {
    this.setProperty("margin-inline-end", value);
  }

  get marginInlineStart() {
    return this.getPropertyValue("margin-inline-start");
  }
  set marginInlineStart(value) {
    this.setProperty("margin-inline-start", value);
  }

  get "margin-inline-start"() {
    return this.getPropertyValue("margin-inline-start");
  }
  set "margin-inline-start"(value) {
    this.setProperty("margin-inline-start", value);
  }

  get marginLeft() {
    return this.getPropertyValue("margin-left");
  }
  set marginLeft(value) {
    this.setProperty("margin-left", value);
  }

  get "margin-left"() {
    return this.getPropertyValue("margin-left");
  }
  set "margin-left"(value) {
    this.setProperty("margin-left", value);
  }

  get marginRight() {
    return this.getPropertyValue("margin-right");
  }
  set marginRight(value) {
    this.setProperty("margin-right", value);
  }

  get "margin-right"() {
    return this.getPropertyValue("margin-right");
  }
  set "margin-right"(value) {
    this.setProperty("margin-right", value);
  }

  get marginTop() {
    return this.getPropertyValue("margin-top");
  }
  set marginTop(value) {
    this.setProperty("margin-top", value);
  }

  get "margin-top"() {
    return this.getPropertyValue("margin-top");
  }
  set "margin-top"(value) {
    this.setProperty("margin-top", value);
  }

  get mask() {
    return this.getPropertyValue("mask");
  }
  set mask(value) {
    this.setProperty("mask", value);
  }

  get maskClip() {
    return this.getPropertyValue("mask-clip");
  }
  set maskClip(value) {
    this.setProperty("mask-clip", value);
  }

  get "mask-clip"() {
    return this.getPropertyValue("mask-clip");
  }
  set "mask-clip"(value) {
    this.setProperty("mask-clip", value);
  }

  get maskComposite() {
    return this.getPropertyValue("mask-composite");
  }
  set maskComposite(value) {
    this.setProperty("mask-composite", value);
  }

  get "mask-composite"() {
    return this.getPropertyValue("mask-composite");
  }
  set "mask-composite"(value) {
    this.setProperty("mask-composite", value);
  }

  get maskImage() {
    return this.getPropertyValue("mask-image");
  }
  set maskImage(value) {
    this.setProperty("mask-image", value);
  }

  get "mask-image"() {
    return this.getPropertyValue("mask-image");
  }
  set "mask-image"(value) {
    this.setProperty("mask-image", value);
  }

  get maskMode() {
    return this.getPropertyValue("mask-mode");
  }
  set maskMode(value) {
    this.setProperty("mask-mode", value);
  }

  get "mask-mode"() {
    return this.getPropertyValue("mask-mode");
  }
  set "mask-mode"(value) {
    this.setProperty("mask-mode", value);
  }

  get maskOrigin() {
    return this.getPropertyValue("mask-origin");
  }
  set maskOrigin(value) {
    this.setProperty("mask-origin", value);
  }

  get "mask-origin"() {
    return this.getPropertyValue("mask-origin");
  }
  set "mask-origin"(value) {
    this.setProperty("mask-origin", value);
  }

  get maskPosition() {
    return this.getPropertyValue("mask-position");
  }
  set maskPosition(value) {
    this.setProperty("mask-position", value);
  }

  get "mask-position"() {
    return this.getPropertyValue("mask-position");
  }
  set "mask-position"(value) {
    this.setProperty("mask-position", value);
  }

  get maskRepeat() {
    return this.getPropertyValue("mask-repeat");
  }
  set maskRepeat(value) {
    this.setProperty("mask-repeat", value);
  }

  get "mask-repeat"() {
    return this.getPropertyValue("mask-repeat");
  }
  set "mask-repeat"(value) {
    this.setProperty("mask-repeat", value);
  }

  get maskSize() {
    return this.getPropertyValue("mask-size");
  }
  set maskSize(value) {
    this.setProperty("mask-size", value);
  }

  get "mask-size"() {
    return this.getPropertyValue("mask-size");
  }
  set "mask-size"(value) {
    this.setProperty("mask-size", value);
  }

  get maskType() {
    return this.getPropertyValue("mask-type");
  }
  set maskType(value) {
    this.setProperty("mask-type", value);
  }

  get "mask-type"() {
    return this.getPropertyValue("mask-type");
  }
  set "mask-type"(value) {
    this.setProperty("mask-type", value);
  }

  get maxHeight() {
    return this.getPropertyValue("max-height");
  }
  set maxHeight(value) {
    this.setProperty("max-height", value);
  }

  get "max-height"() {
    return this.getPropertyValue("max-height");
  }
  set "max-height"(value) {
    this.setProperty("max-height", value);
  }

  get maxWidth() {
    return this.getPropertyValue("max-width");
  }
  set maxWidth(value) {
    this.setProperty("max-width", value);
  }

  get "max-width"() {
    return this.getPropertyValue("max-width");
  }
  set "max-width"(value) {
    this.setProperty("max-width", value);
  }

  get minBlockSize() {
    return this.getPropertyValue("min-block-size");
  }
  set minBlockSize(value) {
    this.setProperty("min-block-size", value);
  }

  get "min-block-size"() {
    return this.getPropertyValue("min-block-size");
  }
  set "min-block-size"(value) {
    this.setProperty("min-block-size", value);
  }

  get minHeight() {
    return this.getPropertyValue("min-height");
  }
  set minHeight(value) {
    this.setProperty("min-height", value);
  }

  get "min-height"() {
    return this.getPropertyValue("min-height");
  }
  set "min-height"(value) {
    this.setProperty("min-height", value);
  }

  get minInlineSize() {
    return this.getPropertyValue("min-inline-size");
  }
  set minInlineSize(value) {
    this.setProperty("min-inline-size", value);
  }

  get "min-inline-size"() {
    return this.getPropertyValue("min-inline-size");
  }
  set "min-inline-size"(value) {
    this.setProperty("min-inline-size", value);
  }

  get minWidth() {
    return this.getPropertyValue("min-width");
  }
  set minWidth(value) {
    this.setProperty("min-width", value);
  }

  get "min-width"() {
    return this.getPropertyValue("min-width");
  }
  set "min-width"(value) {
    this.setProperty("min-width", value);
  }

  get mixBlendMode() {
    return this.getPropertyValue("mix-blend-mode");
  }
  set mixBlendMode(value) {
    this.setProperty("mix-blend-mode", value);
  }

  get "mix-blend-mode"() {
    return this.getPropertyValue("mix-blend-mode");
  }
  set "mix-blend-mode"(value) {
    this.setProperty("mix-blend-mode", value);
  }

  get objectFit() {
    return this.getPropertyValue("object-fit");
  }
  set objectFit(value) {
    this.setProperty("object-fit", value);
  }

  get "object-fit"() {
    return this.getPropertyValue("object-fit");
  }
  set "object-fit"(value) {
    this.setProperty("object-fit", value);
  }

  get objectPosition() {
    return this.getPropertyValue("object-position");
  }
  set objectPosition(value) {
    this.setProperty("object-position", value);
  }

  get "object-position"() {
    return this.getPropertyValue("object-position");
  }
  set "object-position"(value) {
    this.setProperty("object-position", value);
  }

  get offsetBlockEnd() {
    return this.getPropertyValue("offset-block-end");
  }
  set offsetBlockEnd(value) {
    this.setProperty("offset-block-end", value);
  }

  get "offset-block-end"() {
    return this.getPropertyValue("offset-block-end");
  }
  set "offset-block-end"(value) {
    this.setProperty("offset-block-end", value);
  }

  get offsetBlockStart() {
    return this.getPropertyValue("offset-block-start");
  }
  set offsetBlockStart(value) {
    this.setProperty("offset-block-start", value);
  }

  get "offset-block-start"() {
    return this.getPropertyValue("offset-block-start");
  }
  set "offset-block-start"(value) {
    this.setProperty("offset-block-start", value);
  }

  get offsetInlineEnd() {
    return this.getPropertyValue("offset-inline-end");
  }
  set offsetInlineEnd(value) {
    this.setProperty("offset-inline-end", value);
  }

  get "offset-inline-end"() {
    return this.getPropertyValue("offset-inline-end");
  }
  set "offset-inline-end"(value) {
    this.setProperty("offset-inline-end", value);
  }

  get offsetInlineStart() {
    return this.getPropertyValue("offset-inline-start");
  }
  set offsetInlineStart(value) {
    this.setProperty("offset-inline-start", value);
  }

  get "offset-inline-start"() {
    return this.getPropertyValue("offset-inline-start");
  }
  set "offset-inline-start"(value) {
    this.setProperty("offset-inline-start", value);
  }

  get opacity() {
    return this.getPropertyValue("opacity");
  }
  set opacity(value) {
    this.setProperty("opacity", value);
  }

  get order() {
    return this.getPropertyValue("order");
  }
  set order(value) {
    this.setProperty("order", value);
  }

  get orphans() {
    return this.getPropertyValue("orphans");
  }
  set orphans(value) {
    this.setProperty("orphans", value);
  }

  get outline() {
    return this.getPropertyValue("outline");
  }
  set outline(value) {
    this.setProperty("outline", value);
  }

  get outlineColor() {
    return this.getPropertyValue("outline-color");
  }
  set outlineColor(value) {
    this.setProperty("outline-color", value);
  }

  get "outline-color"() {
    return this.getPropertyValue("outline-color");
  }
  set "outline-color"(value) {
    this.setProperty("outline-color", value);
  }

  get outlineOffset() {
    return this.getPropertyValue("outline-offset");
  }
  set outlineOffset(value) {
    this.setProperty("outline-offset", value);
  }

  get "outline-offset"() {
    return this.getPropertyValue("outline-offset");
  }
  set "outline-offset"(value) {
    this.setProperty("outline-offset", value);
  }

  get outlineStyle() {
    return this.getPropertyValue("outline-style");
  }
  set outlineStyle(value) {
    this.setProperty("outline-style", value);
  }

  get "outline-style"() {
    return this.getPropertyValue("outline-style");
  }
  set "outline-style"(value) {
    this.setProperty("outline-style", value);
  }

  get outlineWidth() {
    return this.getPropertyValue("outline-width");
  }
  set outlineWidth(value) {
    this.setProperty("outline-width", value);
  }

  get "outline-width"() {
    return this.getPropertyValue("outline-width");
  }
  set "outline-width"(value) {
    this.setProperty("outline-width", value);
  }

  get overflow() {
    return this.getPropertyValue("overflow");
  }
  set overflow(value) {
    this.setProperty("overflow", value);
  }

  get overflowWrap() {
    return this.getPropertyValue("overflow-wrap");
  }
  set overflowWrap(value) {
    this.setProperty("overflow-wrap", value);
  }

  get "overflow-wrap"() {
    return this.getPropertyValue("overflow-wrap");
  }
  set "overflow-wrap"(value) {
    this.setProperty("overflow-wrap", value);
  }

  get overflowX() {
    return this.getPropertyValue("overflow-x");
  }
  set overflowX(value) {
    this.setProperty("overflow-x", value);
  }

  get "overflow-x"() {
    return this.getPropertyValue("overflow-x");
  }
  set "overflow-x"(value) {
    this.setProperty("overflow-x", value);
  }

  get overflowY() {
    return this.getPropertyValue("overflow-y");
  }
  set overflowY(value) {
    this.setProperty("overflow-y", value);
  }

  get "overflow-y"() {
    return this.getPropertyValue("overflow-y");
  }
  set "overflow-y"(value) {
    this.setProperty("overflow-y", value);
  }

  get padding() {
    return this.getPropertyValue("padding");
  }
  set padding(value) {
    this.setProperty("padding", value);
  }

  get paddingBlockEnd() {
    return this.getPropertyValue("padding-block-end");
  }
  set paddingBlockEnd(value) {
    this.setProperty("padding-block-end", value);
  }

  get "padding-block-end"() {
    return this.getPropertyValue("padding-block-end");
  }
  set "padding-block-end"(value) {
    this.setProperty("padding-block-end", value);
  }

  get paddingBlockStart() {
    return this.getPropertyValue("padding-block-start");
  }
  set paddingBlockStart(value) {
    this.setProperty("padding-block-start", value);
  }

  get "padding-block-start"() {
    return this.getPropertyValue("padding-block-start");
  }
  set "padding-block-start"(value) {
    this.setProperty("padding-block-start", value);
  }

  get paddingBottom() {
    return this.getPropertyValue("padding-bottom");
  }
  set paddingBottom(value) {
    this.setProperty("padding-bottom", value);
  }

  get "padding-bottom"() {
    return this.getPropertyValue("padding-bottom");
  }
  set "padding-bottom"(value) {
    this.setProperty("padding-bottom", value);
  }

  get paddingInlineEnd() {
    return this.getPropertyValue("padding-inline-end");
  }
  set paddingInlineEnd(value) {
    this.setProperty("padding-inline-end", value);
  }

  get "padding-inline-end"() {
    return this.getPropertyValue("padding-inline-end");
  }
  set "padding-inline-end"(value) {
    this.setProperty("padding-inline-end", value);
  }

  get paddingInlineStart() {
    return this.getPropertyValue("padding-inline-start");
  }
  set paddingInlineStart(value) {
    this.setProperty("padding-inline-start", value);
  }

  get "padding-inline-start"() {
    return this.getPropertyValue("padding-inline-start");
  }
  set "padding-inline-start"(value) {
    this.setProperty("padding-inline-start", value);
  }

  get paddingLeft() {
    return this.getPropertyValue("padding-left");
  }
  set paddingLeft(value) {
    this.setProperty("padding-left", value);
  }

  get "padding-left"() {
    return this.getPropertyValue("padding-left");
  }
  set "padding-left"(value) {
    this.setProperty("padding-left", value);
  }

  get paddingRight() {
    return this.getPropertyValue("padding-right");
  }
  set paddingRight(value) {
    this.setProperty("padding-right", value);
  }

  get "padding-right"() {
    return this.getPropertyValue("padding-right");
  }
  set "padding-right"(value) {
    this.setProperty("padding-right", value);
  }

  get paddingTop() {
    return this.getPropertyValue("padding-top");
  }
  set paddingTop(value) {
    this.setProperty("padding-top", value);
  }

  get "padding-top"() {
    return this.getPropertyValue("padding-top");
  }
  set "padding-top"(value) {
    this.setProperty("padding-top", value);
  }

  get pageBreakAfter() {
    return this.getPropertyValue("page-break-after");
  }
  set pageBreakAfter(value) {
    this.setProperty("page-break-after", value);
  }

  get "page-break-after"() {
    return this.getPropertyValue("page-break-after");
  }
  set "page-break-after"(value) {
    this.setProperty("page-break-after", value);
  }

  get pageBreakBefore() {
    return this.getPropertyValue("page-break-before");
  }
  set pageBreakBefore(value) {
    this.setProperty("page-break-before", value);
  }

  get "page-break-before"() {
    return this.getPropertyValue("page-break-before");
  }
  set "page-break-before"(value) {
    this.setProperty("page-break-before", value);
  }

  get pageBreakInside() {
    return this.getPropertyValue("page-break-inside");
  }
  set pageBreakInside(value) {
    this.setProperty("page-break-inside", value);
  }

  get "page-break-inside"() {
    return this.getPropertyValue("page-break-inside");
  }
  set "page-break-inside"(value) {
    this.setProperty("page-break-inside", value);
  }

  get perspective() {
    return this.getPropertyValue("perspective");
  }
  set perspective(value) {
    this.setProperty("perspective", value);
  }

  get perspectiveOrigin() {
    return this.getPropertyValue("perspective-origin");
  }
  set perspectiveOrigin(value) {
    this.setProperty("perspective-origin", value);
  }

  get "perspective-origin"() {
    return this.getPropertyValue("perspective-origin");
  }
  set "perspective-origin"(value) {
    this.setProperty("perspective-origin", value);
  }

  get pointerEvents() {
    return this.getPropertyValue("pointer-events");
  }
  set pointerEvents(value) {
    this.setProperty("pointer-events", value);
  }

  get "pointer-events"() {
    return this.getPropertyValue("pointer-events");
  }
  set "pointer-events"(value) {
    this.setProperty("pointer-events", value);
  }

  get position() {
    return this.getPropertyValue("position");
  }
  set position(value) {
    this.setProperty("position", value);
  }

  get quotes() {
    return this.getPropertyValue("quotes");
  }
  set quotes(value) {
    this.setProperty("quotes", value);
  }

  get resize() {
    return this.getPropertyValue("resize");
  }
  set resize(value) {
    this.setProperty("resize", value);
  }

  get right() {
    return this.getPropertyValue("right");
  }
  set right(value) {
    this.setProperty("right", value);
  }

  get rubyAlign() {
    return this.getPropertyValue("ruby-align");
  }
  set rubyAlign(value) {
    this.setProperty("ruby-align", value);
  }

  get "ruby-align"() {
    return this.getPropertyValue("ruby-align");
  }
  set "ruby-align"(value) {
    this.setProperty("ruby-align", value);
  }

  get rubyMerge() {
    return this.getPropertyValue("ruby-merge");
  }
  set rubyMerge(value) {
    this.setProperty("ruby-merge", value);
  }

  get "ruby-merge"() {
    return this.getPropertyValue("ruby-merge");
  }
  set "ruby-merge"(value) {
    this.setProperty("ruby-merge", value);
  }

  get rubyPosition() {
    return this.getPropertyValue("ruby-position");
  }
  set rubyPosition(value) {
    this.setProperty("ruby-position", value);
  }

  get "ruby-position"() {
    return this.getPropertyValue("ruby-position");
  }
  set "ruby-position"(value) {
    this.setProperty("ruby-position", value);
  }

  get scrollBehavior() {
    return this.getPropertyValue("scroll-behavior");
  }
  set scrollBehavior(value) {
    this.setProperty("scroll-behavior", value);
  }

  get "scroll-behavior"() {
    return this.getPropertyValue("scroll-behavior");
  }
  set "scroll-behavior"(value) {
    this.setProperty("scroll-behavior", value);
  }

  get scrollSnapCoordinate() {
    return this.getPropertyValue("scroll-snap-coordinate");
  }
  set scrollSnapCoordinate(value) {
    this.setProperty("scroll-snap-coordinate", value);
  }

  get "scroll-snap-coordinate"() {
    return this.getPropertyValue("scroll-snap-coordinate");
  }
  set "scroll-snap-coordinate"(value) {
    this.setProperty("scroll-snap-coordinate", value);
  }

  get scrollSnapDestination() {
    return this.getPropertyValue("scroll-snap-destination");
  }
  set scrollSnapDestination(value) {
    this.setProperty("scroll-snap-destination", value);
  }

  get "scroll-snap-destination"() {
    return this.getPropertyValue("scroll-snap-destination");
  }
  set "scroll-snap-destination"(value) {
    this.setProperty("scroll-snap-destination", value);
  }

  get scrollSnapType() {
    return this.getPropertyValue("scroll-snap-type");
  }
  set scrollSnapType(value) {
    this.setProperty("scroll-snap-type", value);
  }

  get "scroll-snap-type"() {
    return this.getPropertyValue("scroll-snap-type");
  }
  set "scroll-snap-type"(value) {
    this.setProperty("scroll-snap-type", value);
  }

  get shapeImageThreshold() {
    return this.getPropertyValue("shape-image-threshold");
  }
  set shapeImageThreshold(value) {
    this.setProperty("shape-image-threshold", value);
  }

  get "shape-image-threshold"() {
    return this.getPropertyValue("shape-image-threshold");
  }
  set "shape-image-threshold"(value) {
    this.setProperty("shape-image-threshold", value);
  }

  get shapeMargin() {
    return this.getPropertyValue("shape-margin");
  }
  set shapeMargin(value) {
    this.setProperty("shape-margin", value);
  }

  get "shape-margin"() {
    return this.getPropertyValue("shape-margin");
  }
  set "shape-margin"(value) {
    this.setProperty("shape-margin", value);
  }

  get shapeOutside() {
    return this.getPropertyValue("shape-outside");
  }
  set shapeOutside(value) {
    this.setProperty("shape-outside", value);
  }

  get "shape-outside"() {
    return this.getPropertyValue("shape-outside");
  }
  set "shape-outside"(value) {
    this.setProperty("shape-outside", value);
  }

  get tabSize() {
    return this.getPropertyValue("tab-size");
  }
  set tabSize(value) {
    this.setProperty("tab-size", value);
  }

  get "tab-size"() {
    return this.getPropertyValue("tab-size");
  }
  set "tab-size"(value) {
    this.setProperty("tab-size", value);
  }

  get tableLayout() {
    return this.getPropertyValue("table-layout");
  }
  set tableLayout(value) {
    this.setProperty("table-layout", value);
  }

  get "table-layout"() {
    return this.getPropertyValue("table-layout");
  }
  set "table-layout"(value) {
    this.setProperty("table-layout", value);
  }

  get textAlign() {
    return this.getPropertyValue("text-align");
  }
  set textAlign(value) {
    this.setProperty("text-align", value);
  }

  get "text-align"() {
    return this.getPropertyValue("text-align");
  }
  set "text-align"(value) {
    this.setProperty("text-align", value);
  }

  get textAlignLast() {
    return this.getPropertyValue("text-align-last");
  }
  set textAlignLast(value) {
    this.setProperty("text-align-last", value);
  }

  get "text-align-last"() {
    return this.getPropertyValue("text-align-last");
  }
  set "text-align-last"(value) {
    this.setProperty("text-align-last", value);
  }

  get textCombineUpright() {
    return this.getPropertyValue("text-combine-upright");
  }
  set textCombineUpright(value) {
    this.setProperty("text-combine-upright", value);
  }

  get "text-combine-upright"() {
    return this.getPropertyValue("text-combine-upright");
  }
  set "text-combine-upright"(value) {
    this.setProperty("text-combine-upright", value);
  }

  get textDecoration() {
    return this.getPropertyValue("text-decoration");
  }
  set textDecoration(value) {
    this.setProperty("text-decoration", value);
  }

  get "text-decoration"() {
    return this.getPropertyValue("text-decoration");
  }
  set "text-decoration"(value) {
    this.setProperty("text-decoration", value);
  }

  get textDecorationColor() {
    return this.getPropertyValue("text-decoration-color");
  }
  set textDecorationColor(value) {
    this.setProperty("text-decoration-color", value);
  }

  get "text-decoration-color"() {
    return this.getPropertyValue("text-decoration-color");
  }
  set "text-decoration-color"(value) {
    this.setProperty("text-decoration-color", value);
  }

  get textDecorationLine() {
    return this.getPropertyValue("text-decoration-line");
  }
  set textDecorationLine(value) {
    this.setProperty("text-decoration-line", value);
  }

  get "text-decoration-line"() {
    return this.getPropertyValue("text-decoration-line");
  }
  set "text-decoration-line"(value) {
    this.setProperty("text-decoration-line", value);
  }

  get textDecorationStyle() {
    return this.getPropertyValue("text-decoration-style");
  }
  set textDecorationStyle(value) {
    this.setProperty("text-decoration-style", value);
  }

  get "text-decoration-style"() {
    return this.getPropertyValue("text-decoration-style");
  }
  set "text-decoration-style"(value) {
    this.setProperty("text-decoration-style", value);
  }

  get textEmphasis() {
    return this.getPropertyValue("text-emphasis");
  }
  set textEmphasis(value) {
    this.setProperty("text-emphasis", value);
  }

  get "text-emphasis"() {
    return this.getPropertyValue("text-emphasis");
  }
  set "text-emphasis"(value) {
    this.setProperty("text-emphasis", value);
  }

  get textEmphasisColor() {
    return this.getPropertyValue("text-emphasis-color");
  }
  set textEmphasisColor(value) {
    this.setProperty("text-emphasis-color", value);
  }

  get "text-emphasis-color"() {
    return this.getPropertyValue("text-emphasis-color");
  }
  set "text-emphasis-color"(value) {
    this.setProperty("text-emphasis-color", value);
  }

  get textEmphasisPosition() {
    return this.getPropertyValue("text-emphasis-position");
  }
  set textEmphasisPosition(value) {
    this.setProperty("text-emphasis-position", value);
  }

  get "text-emphasis-position"() {
    return this.getPropertyValue("text-emphasis-position");
  }
  set "text-emphasis-position"(value) {
    this.setProperty("text-emphasis-position", value);
  }

  get textEmphasisStyle() {
    return this.getPropertyValue("text-emphasis-style");
  }
  set textEmphasisStyle(value) {
    this.setProperty("text-emphasis-style", value);
  }

  get "text-emphasis-style"() {
    return this.getPropertyValue("text-emphasis-style");
  }
  set "text-emphasis-style"(value) {
    this.setProperty("text-emphasis-style", value);
  }

  get textIndent() {
    return this.getPropertyValue("text-indent");
  }
  set textIndent(value) {
    this.setProperty("text-indent", value);
  }

  get "text-indent"() {
    return this.getPropertyValue("text-indent");
  }
  set "text-indent"(value) {
    this.setProperty("text-indent", value);
  }

  get textJustify() {
    return this.getPropertyValue("text-justify");
  }
  set textJustify(value) {
    this.setProperty("text-justify", value);
  }

  get "text-justify"() {
    return this.getPropertyValue("text-justify");
  }
  set "text-justify"(value) {
    this.setProperty("text-justify", value);
  }

  get textOrientation() {
    return this.getPropertyValue("text-orientation");
  }
  set textOrientation(value) {
    this.setProperty("text-orientation", value);
  }

  get "text-orientation"() {
    return this.getPropertyValue("text-orientation");
  }
  set "text-orientation"(value) {
    this.setProperty("text-orientation", value);
  }

  get textOverflow() {
    return this.getPropertyValue("text-overflow");
  }
  set textOverflow(value) {
    this.setProperty("text-overflow", value);
  }

  get "text-overflow"() {
    return this.getPropertyValue("text-overflow");
  }
  set "text-overflow"(value) {
    this.setProperty("text-overflow", value);
  }

  get textRendering() {
    return this.getPropertyValue("text-rendering");
  }
  set textRendering(value) {
    this.setProperty("text-rendering", value);
  }

  get "text-rendering"() {
    return this.getPropertyValue("text-rendering");
  }
  set "text-rendering"(value) {
    this.setProperty("text-rendering", value);
  }

  get textShadow() {
    return this.getPropertyValue("text-shadow");
  }
  set textShadow(value) {
    this.setProperty("text-shadow", value);
  }

  get "text-shadow"() {
    return this.getPropertyValue("text-shadow");
  }
  set "text-shadow"(value) {
    this.setProperty("text-shadow", value);
  }

  get textTransform() {
    return this.getPropertyValue("text-transform");
  }
  set textTransform(value) {
    this.setProperty("text-transform", value);
  }

  get "text-transform"() {
    return this.getPropertyValue("text-transform");
  }
  set "text-transform"(value) {
    this.setProperty("text-transform", value);
  }

  get textUnderlinePosition() {
    return this.getPropertyValue("text-underline-position");
  }
  set textUnderlinePosition(value) {
    this.setProperty("text-underline-position", value);
  }

  get "text-underline-position"() {
    return this.getPropertyValue("text-underline-position");
  }
  set "text-underline-position"(value) {
    this.setProperty("text-underline-position", value);
  }

  get top() {
    return this.getPropertyValue("top");
  }
  set top(value) {
    this.setProperty("top", value);
  }

  get touchAction() {
    return this.getPropertyValue("touch-action");
  }
  set touchAction(value) {
    this.setProperty("touch-action", value);
  }

  get "touch-action"() {
    return this.getPropertyValue("touch-action");
  }
  set "touch-action"(value) {
    this.setProperty("touch-action", value);
  }

  get transform() {
    return this.getPropertyValue("transform");
  }
  set transform(value) {
    this.setProperty("transform", value);
  }

  get transformBox() {
    return this.getPropertyValue("transform-box");
  }
  set transformBox(value) {
    this.setProperty("transform-box", value);
  }

  get "transform-box"() {
    return this.getPropertyValue("transform-box");
  }
  set "transform-box"(value) {
    this.setProperty("transform-box", value);
  }

  get transformOrigin() {
    return this.getPropertyValue("transform-origin");
  }
  set transformOrigin(value) {
    this.setProperty("transform-origin", value);
  }

  get "transform-origin"() {
    return this.getPropertyValue("transform-origin");
  }
  set "transform-origin"(value) {
    this.setProperty("transform-origin", value);
  }

  get transformStyle() {
    return this.getPropertyValue("transform-style");
  }
  set transformStyle(value) {
    this.setProperty("transform-style", value);
  }

  get "transform-style"() {
    return this.getPropertyValue("transform-style");
  }
  set "transform-style"(value) {
    this.setProperty("transform-style", value);
  }

  get transition() {
    return this.getPropertyValue("transition");
  }
  set transition(value) {
    this.setProperty("transition", value);
  }

  get transitionDelay() {
    return this.getPropertyValue("transition-delay");
  }
  set transitionDelay(value) {
    this.setProperty("transition-delay", value);
  }

  get "transition-delay"() {
    return this.getPropertyValue("transition-delay");
  }
  set "transition-delay"(value) {
    this.setProperty("transition-delay", value);
  }

  get transitionDuration() {
    return this.getPropertyValue("transition-duration");
  }
  set transitionDuration(value) {
    this.setProperty("transition-duration", value);
  }

  get "transition-duration"() {
    return this.getPropertyValue("transition-duration");
  }
  set "transition-duration"(value) {
    this.setProperty("transition-duration", value);
  }

  get transitionProperty() {
    return this.getPropertyValue("transition-property");
  }
  set transitionProperty(value) {
    this.setProperty("transition-property", value);
  }

  get "transition-property"() {
    return this.getPropertyValue("transition-property");
  }
  set "transition-property"(value) {
    this.setProperty("transition-property", value);
  }

  get transitionTimingFunction() {
    return this.getPropertyValue("transition-timing-function");
  }
  set transitionTimingFunction(value) {
    this.setProperty("transition-timing-function", value);
  }

  get "transition-timing-function"() {
    return this.getPropertyValue("transition-timing-function");
  }
  set "transition-timing-function"(value) {
    this.setProperty("transition-timing-function", value);
  }

  get unicodeBidi() {
    return this.getPropertyValue("unicode-bidi");
  }
  set unicodeBidi(value) {
    this.setProperty("unicode-bidi", value);
  }

  get "unicode-bidi"() {
    return this.getPropertyValue("unicode-bidi");
  }
  set "unicode-bidi"(value) {
    this.setProperty("unicode-bidi", value);
  }

  get verticalAlign() {
    return this.getPropertyValue("vertical-align");
  }
  set verticalAlign(value) {
    this.setProperty("vertical-align", value);
  }

  get "vertical-align"() {
    return this.getPropertyValue("vertical-align");
  }
  set "vertical-align"(value) {
    this.setProperty("vertical-align", value);
  }

  get visibility() {
    return this.getPropertyValue("visibility");
  }
  set visibility(value) {
    this.setProperty("visibility", value);
  }

  get whiteSpace() {
    return this.getPropertyValue("white-space");
  }
  set whiteSpace(value) {
    this.setProperty("white-space", value);
  }

  get "white-space"() {
    return this.getPropertyValue("white-space");
  }
  set "white-space"(value) {
    this.setProperty("white-space", value);
  }

  get widows() {
    return this.getPropertyValue("widows");
  }
  set widows(value) {
    this.setProperty("widows", value);
  }

  get width() {
    return this.getPropertyValue("width");
  }
  set width(value) {
    this.setProperty("width", value);
  }

  get willChange() {
    return this.getPropertyValue("will-change");
  }
  set willChange(value) {
    this.setProperty("will-change", value);
  }

  get "will-change"() {
    return this.getPropertyValue("will-change");
  }
  set "will-change"(value) {
    this.setProperty("will-change", value);
  }

  get wordBreak() {
    return this.getPropertyValue("word-break");
  }
  set wordBreak(value) {
    this.setProperty("word-break", value);
  }

  get "word-break"() {
    return this.getPropertyValue("word-break");
  }
  set "word-break"(value) {
    this.setProperty("word-break", value);
  }

  get wordSpacing() {
    return this.getPropertyValue("word-spacing");
  }
  set wordSpacing(value) {
    this.setProperty("word-spacing", value);
  }

  get "word-spacing"() {
    return this.getPropertyValue("word-spacing");
  }
  set "word-spacing"(value) {
    this.setProperty("word-spacing", value);
  }

  get wordWrap() {
    return this.getPropertyValue("word-wrap");
  }
  set wordWrap(value) {
    this.setProperty("word-wrap", value);
  }

  get "word-wrap"() {
    return this.getPropertyValue("word-wrap");
  }
  set "word-wrap"(value) {
    this.setProperty("word-wrap", value);
  }

  get writingMode() {
    return this.getPropertyValue("writing-mode");
  }
  set writingMode(value) {
    this.setProperty("writing-mode", value);
  }

  get "writing-mode"() {
    return this.getPropertyValue("writing-mode");
  }
  set "writing-mode"(value) {
    this.setProperty("writing-mode", value);
  }

  get zIndex() {
    return this.getPropertyValue("z-index");
  }
  set zIndex(value) {
    this.setProperty("z-index", value);
  }

  get "z-index"() {
    return this.getPropertyValue("z-index");
  }
  set "z-index"(value) {
    this.setProperty("z-index", value);
  }

}

module.exports = {
  implementation: CSSStyleDeclarationImpl,
};
