# css-object-model

css-object-model is an implementation of the [CSS Object Model](https://drafts.csswg.org/cssom) (CSSOM) specification for use in [jsdom](https://github.com/tmpvar/jsdom). It is built upon the excellent [csstree](https://github.com/csstree/csstree) parser, offering both speed and standards-compliant parsing.

It is a work in progress, with the currently supported interfaces listed below:

## Interfaces

### Fully supported

* CSSFontFaceRule
* CSSNamespaceRule
* CSSRule
* CSSRuleList
* CSSRuleList
* StyleSheetList

### Partially supported

* CSSStyleDeclaration
* CSSStyleRule
* CSSStyleSheet
* StyleSheet

### Not supported (yet)

* CSS
* CSSConditionRule
* CSSGroupingRule
* CSSImportRule
* CSSKeyframeRule
* CSSKeyframesRule
* CSSMarginRule
* CSSMediaRule
* CSSPageRule
* MediaList
