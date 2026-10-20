/**
 * What the color components share: how a color is given. A color is the page's data, never a design value, so no component
 * starts from a color of its own: each takes the page's color, held by the page (value, with onChange) or by the
 * component from a first color (defaultValue).
 */
import { parseColor, type Color } from 'react-stately';

/** A color as the page gives it: a CSS color string such as "#3E63DD", "rgb(62 99 221 / 80%)" or "hsl(226 70% 55%)", or a React Aria color. */
export type ColorInput = string | Color;

/** The color, held by the page (value) or by the component from a first color (defaultValue): one of the two is needed. */
export type ColorValue =
  | { /** The color, when the page holds it. Pair it with onChange. */ value: ColorInput; /** The first color, when the component holds its own. */ defaultValue?: undefined }
  | { value?: undefined; defaultValue: ColorInput };

/** A color read from either form. */
export function readColor(c: ColorInput): Color {
  return typeof c === 'string' ? parseColor(c) : c;
}

/** One sRGB channel, 0 to 255, as light. */
const lightOf = (v: number) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

/** The color as red, green and blue, 0 to 255, laid over what is under it when it lets light through. */
function rgbOver(c: Color, under: [number, number, number]): [number, number, number] {
  const rgb = c.toFormat('rgb');
  const a = rgb.getChannelValue('alpha');
  return (['red', 'green', 'blue'] as const).map((ch, i) => rgb.getChannelValue(ch) * a + under[i]! * (1 - a)) as [number, number, number];
}

const luminance = ([r, g, b]: [number, number, number]) => 0.2126 * lightOf(r) + 0.7152 * lightOf(g) + 0.0722 * lightOf(b);

/**
 * The contrast ratio between two colors, from 1 to 21, as WCAG 2.2 counts it: the text color over its background, and the
 * background over white when it lets light through.
 */
export function contrastRatio(foreground: ColorInput, background: ColorInput): number {
  const bg = rgbOver(readColor(background), [255, 255, 255]);
  const fg = rgbOver(readColor(foreground), bg);
  const [l1, l2] = [luminance(fg), luminance(bg)];
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** What a contrast ratio earns: AAA at 7:1 and up, AA at 4.5:1, AA large (large text and controls only) at 3:1, else fails. */
export type ContrastResult = 'aaa' | 'aa' | 'aa-large' | 'fails';

export function contrastResult(ratio: number): ContrastResult {
  return ratio >= 7 ? 'aaa' : ratio >= 4.5 ? 'aa' : ratio >= 3 ? 'aa-large' : 'fails';
}
