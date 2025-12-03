// RTL (Right-to-Left) utility for Dhivehi language support
// Mirrors text alignment and flex direction when language is RTL

export const rtlStyle = (isRTL: boolean, ltrStyle: any, rtlStyle: any) => {
  return isRTL ? rtlStyle : ltrStyle;
};

export const rtlAlign = (isRTL: boolean): 'left' | 'right' => {
  return isRTL ? 'right' : 'left';
};

export const rtlFlex = (isRTL: boolean): 'row' | 'row-reverse' => {
  return isRTL ? 'row-reverse' : 'row';
};

export const rtlMargin = (isRTL: boolean, value: number) => {
  return isRTL
    ? { marginRight: value }
    : { marginLeft: value };
};

export const rtlPadding = (isRTL: boolean, value: number) => {
  return isRTL
    ? { paddingRight: value }
    : { paddingLeft: value };
};

// Helper for margin/padding on both sides symmetrically
export const rtlHorizontal = (isRTL: boolean, left: number, right: number) => {
  return isRTL
    ? { marginLeft: right, marginRight: left }
    : { marginLeft: left, marginRight: right };
};

export const rtlPaddingHorizontal = (isRTL: boolean, left: number, right: number) => {
  return isRTL
    ? { paddingLeft: right, paddingRight: left }
    : { paddingLeft: left, paddingRight: right };
};
