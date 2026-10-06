/**
 * The rules the conformance checker enforces,
 * with the rules for Project Piece classes in docs/naming.md.
 *
 * The id is what a project writes in `conformance-exceptions.json`. The title
 * heads the report; the advice is printed once per rule, above its findings,
 * with `{prefix}` replaced by the project's own prefix.
 */

export type RuleId =
  | 'unknown-class'
  | 'unknown-property'
  | 'primitive-token'
  | 'raw-value'
  | 'width-breakpoint'
  | 'class-prefix'
  | 'class-shape'
  | 'restyles-system'
  | 'look-alike'
  | 'tailwind-arbitrary'
  | 'sticky-hover'
  | 'stale-exception';

export interface Rule {
  title: string;
  advice: string;
}

export const RULES: Record<RuleId, Rule> = {
  'unknown-class': {
    title: 'smbk- class that no component defines',
    advice:
      'No component stylesheet in simbolik/components/ defines this class, and no variant manifest derives it. Check the spelling against the component (its manifest lists every axis, value and part), or use a {prefix} Project Piece class.',
  },
  'unknown-property': {
    title: '--smbk- custom property that does not exist',
    advice:
      'The token build does not write this name and no component defines it, so it resolves to nothing. Check the name on the Showroom foundation pages; names are derived from token paths (docs/naming.md).',
  },
  'primitive-token': {
    title: 'Primitive color or type token',
    advice:
      'Color and type primitives never reach CSS (docs/naming.md), so this reference resolves to nothing. Use the semantic role or typography preset instead.',
  },
  'raw-value': {
    title: 'Design value written by hand',
    advice:
      'Every color, length, font, weight, line height, layer, shadow and timing comes from a token: var(--smbk-...). Proportions (%, fr, vw, vh, dvh, cqi, auto, 0, unitless flex and aspect ratios) are fine. If no token fits, use the nearest one and record the missing token; never inline the value.',
  },
  'width-breakpoint': {
    title: 'Width breakpoint',
    advice:
      'A media or container query with a width or height. Reflow with intrinsic layout (auto-fit grids, wrapping flex, min() against a size token) or read the layout switch: @container style(--smbk-layout: narrow). Queries on reduced motion, color scheme, hover, pointer and print are fine.',
  },
  'class-prefix': {
    title: 'Class without the project prefix',
    advice:
      'Every class is either a real smbk- class or a Project Piece class starting {prefix}. Rename it to {prefix}<block>. A third-party class the project truly needs goes under simbolik.allowClasses in its package.json.',
  },
  'class-shape': {
    title: 'Project class not in the naming shape',
    advice:
      'Project Piece classes follow {prefix}<block>, {prefix}<block>__<element>, {prefix}<block>--<axis>-<value>: lowercase words joined by hyphens, one element level, and every modifier names its axis ({prefix}hero--size-slim, not {prefix}hero--slim).',
  },
  'restyles-system': {
    title: 'Project CSS restyling the design system',
    advice:
      'A project selector aimed at an smbk- class, or a project rule setting a system token. To place or adjust a component, pass a {prefix} class to it (className) and style that class instead.',
  },
  'look-alike': {
    title: 'Native markup the design system already provides',
    advice:
      'This element structurally resembles a system component but carries no smbk- class. Use the component: its React wrapper in TSX, or its smbk- classes in plain HTML.',
  },
  'tailwind-arbitrary': {
    title: 'Tailwind arbitrary value',
    advice:
      'An arbitrary-value utility bypasses the tokens entirely. Use a token-backed utility from the generated theme, or a {prefix} Project Piece class whose CSS uses tokens.',
  },
  'sticky-hover': {
    title: 'Mouse-over look a touch screen would keep',
    advice:
      'A :hover rule outside @media (hover: hover). A phone has no mouse, so the first tap turns the look on and it stays until the reader taps somewhere else. Put the rule inside @media (hover: hover); where it shares its selector with another state (:focus-visible, a selected class), split it so only the hover half moves. :not(:hover), and a rule inside a block that asks about hover, such as @media (hover: none), are fine.',
  },
  'stale-exception': {
    title: 'Exception that matches nothing',
    advice:
      'An entry in conformance-exceptions.json no longer matches any finding. Remove it, or correct its file, rule or match.',
  },
};

export const RULE_ORDER = Object.keys(RULES) as RuleId[];

/**
 * Rule ids the checker no longer has, with what became of what each found. An exception naming one explains nothing:
 * it is noted on every run, never refused and never counted, so a project removes it in its own time.
 */
export const RETIRED_RULES: Record<string, string> = {
  'old-system': 'A class it found is now a class without the project prefix (class-prefix); a custom property it found is no longer a finding.',
};

export function isRuleId(id: string): id is RuleId {
  return id in RULES;
}
