/**
 * The colour pairs that need contrast, and the ones that do not, with reasons.
 *
 * Read by the contrast report (npm run tokens:contrast) and the Showroom's
 * colour page. The rules apply WCAG 2.2:
 *
 *   text      1.4.3   4.5:1 against what the text actually sits on
 *                     (3:1 for large text: 24px regular or about 19px bold;
 *                     every text role here also sets body text, so 4.5:1 is used)
 *   non-text  1.4.11  3:1 for what is needed to see that a control is there,
 *                     which state it is in, or where focus is
 *
 * Only pairs that the components really use are listed (each foreground
 * names the backgrounds it is approved on), as the stylesheets draw
 * them today. Each pair is listed once; where one pair is drawn in several
 * places, its "where" names them all. Borders are not checked wholesale: a
 * border needs contrast only when it is what identifies a control or its
 * state, never when it decorates or separates.
 */

export type Kind = 'text' | 'non-text';

export interface ContrastPair {
  fg: string;
  bg: string;
  kind: Kind;
  /** Where the pair occurs, in plain words. */
  where: string;
}

export interface NotMeasured {
  what: string;
  why: string;
}

export const NEEDS: Record<Kind, number> = { text: 4.5, 'non-text': 3 };

const SURFACES = ['color.surface.canvas', 'color.surface.default', 'color.surface.raised', 'color.surface.sunken'];
const on = (fg: string, bgs: string[], kind: Kind, where: string): ContrastPair[] => bgs.map((bg) => ({ fg, bg, kind, where }));

export const PAIRS: ContrastPair[] = [
  // ---- text on the surfaces it is set on ----
  ...on('color.text.default', SURFACES, 'text', 'Titles, values and body text across the components'),
  ...on('color.text.subtle', SURFACES, 'text', 'Descriptions, labels and links at rest in navigation'),
  ...on('color.text.subtlest', SURFACES, 'text', 'Placeholders, captions and key hints. Placeholder text is not exempt'),
  ...on('color.text.brand', SURFACES.slice(0, 3), 'text', 'The card eyebrow at rest'),
  ...on('color.text.link', SURFACES.slice(0, 3), 'text', 'Links in running text'),
  ...on('color.text.link-hover', SURFACES.slice(0, 3), 'text', 'Links while hovered; hovered navigation items, tabs, segments and sidebar items'),
  { fg: 'color.text.link-hover', bg: 'color.surface.sunken', kind: 'text', where: 'A hovered sidebar child item: its words on its sunken fill' },
  ...on('color.text.link-pressed', SURFACES.slice(0, 3), 'text', 'Links while pressed'),
  ...on('color.text.inverse', ['color.surface.inverse'], 'text', 'Inverse tooltips, default avatars and the tick in a checked checkbox'),
  ...on('color.text.on-brand', ['color.surface.brand'], 'text', 'Initials on a brand avatar, text on brand tags'),

  // ---- button labels on their own fills, in every state a reader can act on ----
  ...['brand', 'secondary', 'default', 'inverse'].flatMap((kind) =>
    on(`color.action.${kind}.foreground`, [`color.action.${kind}.background`, `color.action.${kind}.background-hover`, `color.action.${kind}.background-pressed`], 'text', `${kind[0]!.toUpperCase()}${kind.slice(1)} buttons: the label on the fill, at rest, hovered and pressed`),
  ),
  // The destructive button switches its label to the hover colour on the hover and pressed fills (button.css).
  { fg: 'color.action.destructive.foreground', bg: 'color.action.destructive.background', kind: 'text', where: 'Destructive buttons: the label on the fill at rest' },
  ...on('color.action.destructive.foreground-hover', ['color.action.destructive.background-hover', 'color.action.destructive.background-pressed'], 'text', 'Destructive buttons: the hover label on the fill, hovered and pressed'),
  ...on('color.action.outline.foreground', ['color.surface.default', 'color.surface.canvas', 'color.action.outline.background-hover', 'color.action.outline.background-pressed'], 'text', 'Outline buttons: the label on the page, hovered and pressed'),
  ...on('color.action.ghost.foreground', ['color.surface.default', 'color.surface.canvas', 'color.action.ghost.background-hover', 'color.action.ghost.background-pressed'], 'text', 'Ghost buttons and icon-only buttons: the label or icon on the page, hovered and pressed'),

  // ---- feedback text on its own surfaces ----
  ...['success', 'info', 'warning', 'danger'].flatMap((kind) => [
    { fg: `color.feedback.${kind}.text-on-surface`, bg: `color.feedback.${kind}.surface`, kind: 'text' as const, where: `Flat ${kind} badges` },
    { fg: `color.feedback.${kind}.text-on-subtle`, bg: `color.feedback.${kind}.surface-subtle`, kind: 'text' as const, where: `${kind[0]!.toUpperCase()}${kind.slice(1)} alerts, toasts, tags and soft badges` },
  ]),

  // ---- the banner: its link and dismiss control sit on the tone's own surface ----
  ...on('color.text.link', ['success', 'info', 'warning', 'danger'].map((kind) => `color.feedback.${kind}.surface-subtle`), 'text', 'Banners in a feedback tone: the link on the tone\'s surface'),
  ...on('color.action.ghost.foreground', ['success', 'info', 'warning', 'danger'].map((kind) => `color.feedback.${kind}.surface-subtle`), 'text', 'Banners in a feedback tone: the dismiss cross on the tone\'s surface'),

  // ---- non-text: only what identifies a control, its state, or focus ----
  ...on('color.border.focus', SURFACES.slice(0, 3), 'non-text', 'The focus ring around buttons, links and controls, against the page; and the ring inside the command palette\'s highlighted command, on its canvas fill'),
  { fg: 'color.border.focus', bg: 'color.surface.sunken', kind: 'non-text', where: 'The focus ring inside the select\'s highlighted choice, on its sunken fill' },
  ...on('color.border.focus', ['success', 'info', 'warning', 'danger'].map((kind) => `color.feedback.${kind}.surface-subtle`), 'non-text', 'The focus ring of a dismiss or remove button, or a link, on an alert, toast, banner or tag in a feedback tone'),
  { fg: 'color.border.focus', bg: 'color.action.brand.background', kind: 'non-text', where: 'The focus ring of a brand chip\'s remove button, on the chip' },
  { fg: 'color.border.focus', bg: 'color.surface.brand', kind: 'non-text', where: 'The focus ring of a brand tag\'s remove button, on the tag' },
  { fg: 'color.border.focus-field', bg: 'color.surface.sunken', kind: 'non-text', where: 'A focused field: its border against the field inside it' },
  { fg: 'color.border.focus-field', bg: 'color.surface.default', kind: 'non-text', where: 'A focused field: its border against the page around it' },
  ...on('color.feedback.danger.border', ['color.surface.sunken', 'color.surface.default'], 'non-text', 'A field in error: its red edge, the sign of the error besides the message, against the field inside it and the page around it'),
  { fg: 'color.surface.sunken', bg: 'color.surface.default', kind: 'non-text', where: 'Inputs, selects and search fields: the well that shows where to type, against the page. The current sidebar item and the select\'s highlighted choice: the sunken fill that marks them, against the panel' },
  ...on('color.border.control', ['color.surface.default', 'color.surface.canvas'], 'non-text', 'An unchecked checkbox or radio: its edge is all that shows it is there'),
  ...on('color.border.strong', ['color.surface.default', 'color.surface.canvas'], 'non-text', 'An unchecked subtle checkbox: its edge against the page'),
  ...on('color.surface.inverse', ['color.surface.default', 'color.surface.canvas'], 'non-text', 'A checked checkbox, and the default progress fill: the filled shape that shows the state or the amount'),
  ...on('color.action.inverse.background', ['color.surface.default', 'color.surface.canvas'], 'non-text', 'A chosen radio: the filled mark that shows the choice'),
  ...on('color.surface.brand', ['color.surface.default', 'color.surface.canvas'], 'non-text', 'A switch that is on, and the brand progress fill: the filled track'),
  ...['success', 'warning'].map((kind) => ({ fg: `color.feedback.${kind}.surface`, bg: 'color.surface.default', kind: 'non-text' as const, where: `The ${kind} progress fill: the amount, against the page` })),
  { fg: 'color.border.subtle', bg: 'color.surface.default', kind: 'non-text', where: 'A switch that is off: the edge of its track is what shows it is there' },
  { fg: 'color.border.control', bg: 'color.surface.sunken', kind: 'non-text', where: 'A slider: the gray lines on their band, which show where the range runs' },
  { fg: 'color.border.brand', bg: 'color.surface.sunken', kind: 'non-text', where: 'A slider: the red lines up to the value, on their band' },
  { fg: 'color.surface.brand', bg: 'color.surface.sunken', kind: 'non-text', where: 'A slider: the thumb, which marks the value, against the band it crosses' },
  { fg: 'color.surface.raised', bg: 'color.surface.canvas', kind: 'non-text', where: 'The chosen tab, the chosen segment of a segmented control and the chosen theme in the theme switch: the raised pill against the bar, which is how the choice shows' },
  { fg: 'color.surface.canvas', bg: 'color.surface.default', kind: 'non-text', where: 'The current navigation item, pressed into the bar, and the command palette\'s highlighted command: the canvas fill that marks them, against the bar or the panel' },
  { fg: 'color.action.ghost.background-pressed', bg: 'color.surface.default', kind: 'non-text', where: 'The current page of a pagination: its pressed fill against the page' },
  ...['brand', 'default', 'inverse'].map((kind) => ({ fg: `color.action.${kind}.background-pressed`, bg: `color.action.${kind}.background`, kind: 'non-text' as const, where: `A selected ${kind} chip: its pressed fill against an unselected one, which is how the choice shows` })),
  { fg: 'color.action.outline.background-pressed', bg: 'color.surface.default', kind: 'non-text', where: 'A selected outline chip: its pressed fill against an unselected one, which has none and shows the page' },
];

export const NOT_MEASURED: NotMeasured[] = [
  { what: 'Disabled text and controls', why: 'WCAG exempts controls that cannot be used. They must still read as disabled, which is checked by eye, not by a ratio.' },
  { what: 'Dividers, card and panel edges, the highlight and shade edges', why: 'They separate or polish. What they surround is identified by its text, its fill or its place, so their color is not what makes anything usable.' },
  { what: 'Button borders', why: 'A button is identified by its label and its fill; the border only styles it. The label is measured.' },
  { what: 'Hover and pressed fills against the page', why: 'Hover is not needed to find or use a control. The label on each hover and pressed fill is measured as text.' },
  { what: 'Logos and text on pictures', why: 'Logos are exempt. Text on a photograph depends on the photograph, so it is checked by eye where it is used.' },
  { what: 'Shadows and elevation', why: 'They show depth, not what a control is or which state it is in.' },
  { what: 'Icons beside a text label', why: 'The label carries the meaning; the icon is decoration for this rule. Icons that stand alone, in icon-only buttons, are measured with the ghost button pairs.' },
];
