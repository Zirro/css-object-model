interface CSSGroupingRule : CSSRule {
    readonly attribute CSSRuleList cssRules;
    unsigned long insertRule (CSSOMString rule, unsigned long index);
    void deleteRule (unsigned long index);
};
