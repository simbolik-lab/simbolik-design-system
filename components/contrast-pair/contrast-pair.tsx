import type { CSSProperties, HTMLAttributes, Ref } from 'react';
import { contrastPair } from './contrast-pair.manifest.js';
import { Badge } from '../badge/badge.js';
import { contrastRatio, contrastResult, readColor, type ColorInput, type ContrastResult } from '../color.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface ContrastPairProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, VariantProps<typeof contrastPair.manifest> {
  /** The text color. */
  foreground: ColorInput;
  /** The color the text sits on. */
  background: ColorInput;
  /** The two roles in words, such as "Text subtle on surface default". */
  names: string;
  /** The ratio to show, when the page has measured it itself. Worked out from the two colors unless given. */
  ratio?: number;
  /** The pair's words, in the page's language: each in English unless given. */
  words?: Partial<ContrastPairWords>;
  ref?: Ref<HTMLDivElement>;
}

/** The words the contrast pair shows and says, in the page's language. */
export interface ContrastPairWords {
  /** What a screen reader hears for the ratio, given it with two decimals: "Contrast 4.50 to 1,". */
  ratio: (ratio: string) => string;
  /** The badge's words for each result. */
  aaa: string;
  aa: string;
  aaLarge: string;
  fails: string;
}

export const CONTRAST_PAIR_WORDS: ContrastPairWords = {
  ratio: (ratio) => `Contrast ${ratio} to 1,`,
  aaa: 'AAA',
  aa: 'AA',
  aaLarge: 'AA large',
  fails: 'Fails',
};

/** The badge's words and type for each result. */
const MARK: Record<ContrastResult, { words: keyof Omit<ContrastPairWords, 'ratio'>; tone: 'success' | 'warning' | 'danger' }> = {
  aaa: { words: 'aaa', tone: 'success' },
  aa: { words: 'aa', tone: 'success' },
  'aa-large': { words: 'aaLarge', tone: 'warning' },
  fails: { words: 'fails', tone: 'danger' },
};

/** A ratio written with two decimals, never rounded up past what it is, so 4.499 never shows as 4.50. */
const twoDecimals = (r: number) => (Math.floor(r * 100) / 100).toFixed(2);

/**
 * Contrast pair: two colors drawn as they are, "Aa" in the text color on the background, with the contrast ratio, the mark
 * it earns in a badge, and the two roles' names. The ratio and the mark are worked out from the two colors unless given.
 * The sample is hidden from screen readers, which read the roles, the ratio and the mark in words.
 */
export function ContrastPair({ foreground, background, names, ratio, result, words, className, style, ref, ...rest }: ContrastPairProps) {
  const w = { ...CONTRAST_PAIR_WORDS, ...words };
  const fg = readColor(foreground);
  const bg = readColor(background);
  const measured = ratio ?? contrastRatio(fg, bg);
  const earned = result ?? contrastResult(measured);
  const mark = MARK[earned];
  const shown = twoDecimals(measured);
  const colors = { '--smbk-contrast-pair-foreground': fg.toString('css'), '--smbk-contrast-pair-background': bg.toString('css') } as CSSProperties;
  return (
    <div ref={ref} {...rest} style={{ ...style, ...colors }} className={cx(contrastPair({ result: earned }), className)}>
      <span className={contrastPair.part('sample')} aria-hidden="true">Aa</span>
      <div className={contrastPair.part('text')}>
        <div className={contrastPair.part('result')}>
          <span className={contrastPair.part('ratio')}>
            <span aria-hidden="true">{shown}:1</span>
            <span className={contrastPair.part('hidden')}>{w.ratio(shown)}</span>
          </span>
          <Badge look="soft" size="sm" tone={mark.tone} className={contrastPair.part('badge')}>{w[mark.words]}</Badge>
        </div>
        <p className={contrastPair.part('names')}>{names}</p>
      </div>
    </div>
  );
}
