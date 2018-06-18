[LegacyArrayClass]
interface MediaList {
  stringifier attribute [TreatNullAs=EmptyString] DOMString mediaText;
  readonly attribute unsigned long length;
  getter CSSOMString? item(unsigned long index);
  void appendMedium(CSSOMString medium);
  void deleteMedium(CSSOMString medium);
};
