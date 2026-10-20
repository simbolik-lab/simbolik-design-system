import { defineVariants } from '../variants.js';

/**
 * Contrast pair. Figma "Contrast pair" 7416:115: Result (AAA, AA, AA large, Fails), 4 variants. A row (`space/inline/lg`,
 * `space/inset/md` all round) on `color/surface/default`, `color/border/subtle` 1 inside, `radius/container/sm`: the sample
 * (`size/48` square, `radius/control/md`, `color/border/edge-shade-subtle` 1 inside, "Aa" in Heading XS; its fill and text are
 * the pair's own colors, data), then a column (`space/stack/xs`) of the result row (`space/inline/sm`: the ratio in Label MD
 * `color/text/default` and a Badge Soft sm, Success for AAA and AA, Warning for AA large, Danger for Fails) over the roles'
 * names in Body XS `color/text/subtle`. The result is worked out from the two colors unless given.
 */
export const contrastPair = defineVariants({
  name: 'contrast-pair',
  block: 'smbk-contrast-pair',
  summary: 'Two colors drawn as text on its background, with their contrast ratio and the mark it earns: AAA, AA, AA large or fails.',
  adapt: 'css',
  axes: {
    result: {
      values: ['aaa', 'aa', 'aa-large', 'fails'],
      default: 'aaa',
      description: 'The mark the ratio earns: AAA at 7:1 and up, AA at 4.5:1, AA large at 3:1 (large text and controls only), else fails. Worked out from the two colors unless given; it sets the badge’s words and type.',
    },
  },
  flags: {},
  parts: ['sample', 'text', 'result', 'ratio', 'badge', 'names', 'hidden'],
  figmaNodeId: '7416:115',
});
