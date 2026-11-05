/**
 * Build configuration: the decisions from docs/naming.md and the token build's own, in a
 * form the build can read. Token names and values are NOT decided here.
 */

export const PREFIX = 'smbk';

/** Which tier each resolver set or modifier belongs to. */
export const TIER_OF: Record<string, 'primitive' | 'semantic'> = {
  primitives: 'primitive',
  semantic: 'semantic',
  'typography-styles': 'semantic',
  'effect-styles': 'semantic',
  authored: 'semantic',
  theme: 'semantic',
  palette: 'semantic',
  density: 'semantic',
  'text-size': 'semantic',
  layout: 'semantic',
};

/**
 * Categories that are primitive wherever they are declared. Motion is authored
 * in the authored set because Figma has no motion design, and it holds both
 * tiers there: raw durations and curves, and the motion purposes that alias
 * them. Raw durations belong to the primitive tier, and semantics are named
 * by purpose (motion.{purpose}.{property}).
 */
const PRIMITIVE_CATEGORIES = new Set(['duration', 'easing']);

/** The tier of a token: its category's when the category is always primitive, otherwise its set's or modifier's. */
export function tierOf(owner: string, category: string): 'primitive' | 'semantic' | undefined {
  return PRIMITIVE_CATEGORIES.has(category) ? 'primitive' : TIER_OF[owner];
}

/**
 * Which categories reach CSS, per tier (docs/naming.md, "CSS custom properties").
 * A category is the first path segment. Colour and typography primitives never
 * become custom properties, which is what makes a theme-blind component
 * impossible rather than merely forbidden.
 */
const SEMANTIC_ONLY_CATEGORIES = new Set(['color', 'font']);

export function isEmitted(category: string, tier: 'primitive' | 'semantic'): boolean {
  // Font primitives (families, weights, letter-spacings) are read through the typography composites only, whichever file declares them.
  if (category === 'font') return false;
  // A data palette's values for each theme (`palette.<theme>.<role>`) are read through the data colors only: each
  // `color.data.*` token points at its theme's value, and the palette chosen decides which value that is.
  if (category === 'palette') return false;
  if (tier === 'semantic') return true;
  return !SEMANTIC_ONLY_CATEGORIES.has(category);
}

/**
 * The layout switch. The build writes one inherited custom property that components
 * read with a style query, so a component reflows for the space it is given rather
 * than the window, and a page or a preview can force either form with the attribute.
 * The layout tokens' axis below switches at the same width and follows the same attribute.
 */
export const LAYOUT_SWITCH = {
  property: `--${PREFIX}-layout`,
  attribute: 'data-layout',
  values: ['narrow', 'wide'] as const,
  default: 'narrow' as const,
  // The width is itself a token; the build substitutes its resolved value.
  wideQuery: '(min-width: {breakpoint.layout})',
};

/**
 * How each context axis reaches CSS: theme and density by attribute, text size by media query, and layout by
 * media query with the layout switch's attribute forcing either context on any element.
 */
export type ContextCss =
  | {
      kind: 'attribute';
      attribute: string;
      systemPreference?: Record<string, string>;
      colorScheme?: boolean;
      /**
       * An axis whose values are chosen per context of another attribute axis (the data palette, per theme). Its
       * attribute is read on the page's root element only, and a token may change on it as well as on that axis.
       */
      over?: string;
    }
  | { kind: 'media'; queries: Record<string, string>; attribute?: { name: string; values: Record<string, string> } };

export const CONTEXT_CSS: Record<string, ContextCss> = {
  theme: {
    kind: 'attribute',
    attribute: 'data-theme',
    // A reader's system setting applies when the page has not chosen a theme itself.
    systemPreference: { dark: '(prefers-color-scheme: dark)' },
    // Each theme also tells the browser which it is (`color-scheme`), so the browser's own parts, a scrollbar
    // nobody styled or a native control's popup, follow the theme instead of staying light.
    colorScheme: true,
  },
  // The data palette: which set of data colors a chart draws in, chosen once by the project for the whole page, so
  // set on the root element. Each palette has a value per theme, so its blocks are written once per theme.
  palette: { kind: 'attribute', attribute: 'data-palette', over: 'theme' },
  density: { kind: 'attribute', attribute: 'data-density' },
  'text-size': {
    kind: 'media',
    // The width is itself a token; the build substitutes its resolved value.
    queries: { max: '(min-width: {breakpoint.text-size})' },
  },
  // The layout tokens (Figma's Semantic Layout collection) switch where the layout switch does, and follow its
  // attribute, so a page, a section or a preview forced narrow also takes the phone values.
  layout: {
    kind: 'media',
    queries: { desktop: LAYOUT_SWITCH.wideQuery },
    attribute: { name: LAYOUT_SWITCH.attribute, values: { phone: 'narrow', desktop: 'wide' } },
  },
};

/** Tailwind theme namespaces per category. Categories not listed do not appear in the theme. */
export const TAILWIND_NAMESPACE: Record<string, (segments: string[]) => string | null> = {
  color: (s) => `--color-${s.slice(1).join('-')}`,
  space: (s) => `--spacing-${s.slice(1).join('-')}`,
  radius: (s) => `--radius-${s.slice(1).join('-')}`,
  blur: (s) => `--blur-${s.slice(1).join('-')}`,
  text: (s) => `--text-${s.slice(1).join('-')}`,
  elevation: (s) => (s[1]?.startsWith('inset') ? `--inset-shadow-${s.slice(1).join('-')}` : `--shadow-${s.slice(1).join('-')}`),
  size: (s) => (s[1] === 'viewport' ? `--breakpoint-${s.slice(2).join('-')}` : s[1] === 'content' ? `--container-${s.slice(2).join('-')}` : null),
  // Tailwind has an easing namespace but none for durations.
  easing: (s) => `--ease-${s.slice(1).join('-')}`,
  motion: (s) => (s[s.length - 1] === 'easing' ? `--ease-${s.slice(1, -1).join('-')}` : null),
};
