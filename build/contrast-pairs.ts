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
  /** What the background is laid over: the page's canvas unless it is a band over a picture, measured over the brightest and the darkest picture. */
  under?: 'picture';
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
  ...on('color.text.subtlest', SURFACES, 'text', 'Placeholders, captions and key hints. Placeholder text is not exempt. A tree view row\'s count'),
  ...on('color.text.brand', SURFACES, 'text', 'The card eyebrow at rest, on every card surface the well\'s sunken one included'),
  ...on('color.text.link', SURFACES.slice(0, 3), 'text', 'Links in running text'),
  ...on('color.text.link-hover', SURFACES.slice(0, 3), 'text', 'Links while hovered; hovered navigation items, tabs, segments and sidebar items'),
  { fg: 'color.text.default', bg: 'color.surface.selected', kind: 'text', where: 'The current sidebar item, an open group\'s item and the current link in a sidebar flyout: the bolder label on the see-through selected fill. A chosen option in a selectable list: its title on the same fill. A tree view\'s chosen row: its bolder label on the same fill' },
  { fg: 'color.text.subtle', bg: 'color.surface.selected', kind: 'text', where: 'A chosen option in a selectable list: its quiet line on the see-through selected fill' },
  ...on('color.text.link-pressed', SURFACES.slice(0, 3), 'text', 'Links while pressed'),
  ...on('color.text.inverse', ['color.surface.inverse'], 'text', 'Inverse tooltips, default avatars, the tick in a checked checkbox and a line chart\'s marked value'),
  ...on('color.text.on-brand', ['color.surface.brand'], 'text', 'Initials on a brand avatar, text on brand tags'),
  ...on('color.text.default', ['color.surface.overlay', 'color.surface.hover'], 'text', 'Dropdown items and the popover\'s title, on the overlay panel, and an item under the pointer or keyboard focus on its hover fill; a calendar\'s month and days in the date picker\'s panel. A tree view\'s row under the pointer: its label on the hover fill'),
  ...on('color.text.subtle', ['color.surface.overlay'], 'text', 'The popover\'s description, body and helper text, a combobox list\'s no results and loading rows, and a calendar\'s weekday names in the date picker\'s panel, on the overlay panel'),
  ...on('color.text.subtlest', ['color.surface.overlay'], 'text', 'Dropdown group labels and icons, and the popover\'s close cross, on the overlay panel'),
  { fg: 'color.text.default', bg: 'color.surface.neutral-subtle', kind: 'text', where: 'Default badges: the label on the see-through gray' },
  { fg: 'color.text.subtle', bg: 'color.surface.neutral-subtle', kind: 'text', where: 'Default tags: the label on the see-through gray. A ruler\'s layout state names on the shaded stretches of its band' },
  { fg: 'color.text.default', bg: 'color.feedback.info.surface-subtle', kind: 'text', where: 'A highlighted table row: its values on the info tint' },
  { fg: 'color.text.subtle', bg: 'color.feedback.info.surface-subtle', kind: 'text', where: 'A highlighted table row: a value\'s description on the tint, one step darker than elsewhere' },
  { fg: 'color.text.default', bg: 'color.feedback.danger.surface-subtle', kind: 'text', where: 'The error summary\'s intro line, on its danger tint' },
  { fg: 'color.text.default', bg: 'color.action.default.background-pressed', kind: 'text', where: 'A chosen table row: its values and links on the row\'s fill' },
  ...on('color.text.default', ['color.action.ghost.background-hover', 'color.action.ghost.background-pressed'], 'text', 'A list row that can be pressed, under the pointer and pressed: its title on the row\'s fill. A calendar day under the pointer: its figure on the hover fill. A stepper\'s step that can be gone back to, under the pointer and pressed: its name on the step\'s fill'),
  ...on('color.text.subtle', ['color.action.ghost.background-hover', 'color.action.ghost.background-pressed'], 'text', 'A list row that can be pressed, under the pointer and pressed: its quiet line on the row\'s fill. A stepper\'s step that can be gone back to, under the pointer and pressed: its status line on the step\'s fill'),
  ...on('color.feedback.danger.text-on-subtle', ['color.action.ghost.background-hover', 'color.action.ghost.background-pressed'], 'text', 'A stepper\'s step with an error, under the pointer and pressed: what is wrong, on the step\'s fill'),
  { fg: 'color.text.subtle', bg: 'color.action.default.background-pressed', kind: 'text', where: 'A chosen table row: a value\'s description on the row\'s fill, one step darker than elsewhere' },
  { fg: 'color.text.on-media', bg: 'color.surface.scrim', kind: 'text', under: 'picture', where: 'A card with its picture behind: the title, eyebrow and text on the dark band at its foot, over the brightest and the darkest picture' },

  // ---- button labels on their own fills, in every state a reader can act on ----
  ...([
    ['brand', 'Brand buttons and chips: the label on the fill, at rest, hovered and pressed; on a chip also the tick of a selected one and the focus ring of its remove button. The chosen calendar day: its figure on the fill, at rest and hovered. A stepper\'s current step: its number on the brand mark'],
    ['secondary', 'Secondary buttons: the label on the fill, at rest, hovered and pressed'],
    ['inverse', 'Inverse chips: the label on the fill, at rest, hovered and pressed, the tick of a selected one and the focus ring of the remove button'],
  ] as const).flatMap(([kind, where]) =>
    on(`color.action.${kind}.foreground`, [`color.action.${kind}.background`, `color.action.${kind}.background-hover`, `color.action.${kind}.background-pressed`], 'text', where),
  ),
  ...on('color.action.default.foreground', ['color.surface.neutral-subtle', 'color.surface.hover', 'color.action.default.background-pressed'], 'text', 'Default chips: the label on the see-through gray, hovered and pressed, and the tick of a selected one'),
  // The destructive button switches its label to the hover colour on the hover and pressed fills (button.css).
  { fg: 'color.action.danger.foreground', bg: 'color.action.danger.background', kind: 'text', where: 'Destructive buttons: the label on the fill at rest' },
  ...on('color.action.danger.foreground-hover', ['color.action.danger.background-hover', 'color.action.danger.background-pressed'], 'text', 'Destructive buttons: the hover label on the fill, hovered and pressed'),
  ...on('color.action.outline.foreground', ['color.surface.default', 'color.surface.canvas', 'color.surface.raised', 'color.surface.overlay', 'color.action.outline.background-hover', 'color.action.outline.background-pressed'], 'text', 'Outline buttons and chips: the label on the page, in a drawer or a popover, hovered and pressed, and the tick of a selected chip'),
  ...on('color.action.ghost.foreground', ['color.surface.default', 'color.surface.canvas', 'color.surface.raised', 'color.action.ghost.background-hover', 'color.action.ghost.background-pressed'], 'text', 'Ghost buttons and icon-only buttons: the label or icon on the page or in a drawer, hovered and pressed'),
  { fg: 'color.action.outline.foreground', bg: 'color.surface.sunken', kind: 'text', where: 'A toggle button that is on: its label or icon on the sunken fill' },

  // ---- feedback text on its own surfaces ----
  ...['success', 'info', 'warning', 'danger'].flatMap((kind) => [
    { fg: `color.feedback.${kind}.text-on-surface`, bg: `color.feedback.${kind}.surface`, kind: 'text' as const, where: `Flat ${kind} badges${kind === 'danger' ? '. A stepper\'s step with an error: the warning sign on its red mark' : ''}` },
    { fg: `color.feedback.${kind}.text-on-subtle`, bg: `color.feedback.${kind}.surface-subtle`, kind: 'text' as const, where: `${kind[0]!.toUpperCase()}${kind.slice(1)} alerts, toasts, tags and soft badges${kind === 'danger' ? '. The error summary: its heading and its mistakes' : ''}` },
  ]),

  // ---- a failed progress bar: its words and its retry are the danger text color on the page ----
  ...on('color.feedback.danger.text-on-subtle', ['color.surface.default', 'color.surface.canvas'], 'text', 'A failed progress bar: what failed and Try again; a field message of the error type, under a field or a field group or in a file upload; a file row that failed or was not added: its reason; a stepper\'s step with an error: what is wrong; a diff stat: the lines removed; on the page'),
  ...on('color.feedback.success.text-on-subtle', ['color.surface.default', 'color.surface.canvas'], 'text', 'A file row that has gone through: the word Uploaded, on the row and on the page. A diff stat: the lines added. The goal row block: On track'),
  ...on('color.feedback.warning.text-on-subtle', ['color.surface.default', 'color.surface.canvas'], 'text', 'The goal row block: At risk, on the page'),
  { fg: 'color.feedback.danger.text-on-subtle', bg: 'color.surface.overlay', kind: 'text', where: 'A combobox list that could not load: what went wrong and what to do, on the overlay panel' },

  // ---- the banner: its link and dismiss control sit on the tone's own surface ----
  ...['success', 'info', 'warning', 'danger'].flatMap((kind) => on('color.text.link', [`color.feedback.${kind}.surface-subtle`], 'text', `Banners in a feedback tone: the link on the tone's surface${kind === 'info' ? '. A highlighted table row: a link in a cell on the tint' : ''}`)),
  { fg: 'color.action.ghost.foreground', bg: 'color.surface.sunken', kind: 'text', where: 'Ghost icon buttons inside a field: the password field\'s eye, the number field\'s minus and plus, an input\'s trailing action, on the sunken well. A ghost toggle button that is on, a toolbar\'s tool: its icon or label on the sunken fill' },
  ...on('color.action.ghost.foreground', ['success', 'info', 'warning', 'danger'].map((kind) => `color.feedback.${kind}.surface-subtle`), 'text', 'Banners in a feedback tone: the dismiss cross on the tone\'s surface'),

  // ---- non-text: only what identifies a control, its state, or focus ----
  ...on('color.border.focus', SURFACES.slice(0, 3), 'non-text', 'The focus ring around buttons, links and controls, against the page; and the ring inside the command palette\'s search box, on the panel'),
  ...on('color.border.focus', ['color.surface.overlay', 'color.surface.hover'], 'non-text', 'The focus ring of a dropdown item, and inside the select\'s highlighted choice and the combobox\'s active option, on the overlay panel and on the hover fill; around a calendar day in the date picker\'s panel'),
  ...on('color.border.focus', ['success', 'info', 'warning', 'danger'].map((kind) => `color.feedback.${kind}.surface-subtle`), 'non-text', 'The focus ring of a dismiss or remove button, or a link, on an alert, toast, banner or tag in a feedback tone, and of a mistake\'s link in the error summary'),
  { fg: 'color.border.focus', bg: 'color.surface.neutral-subtle', kind: 'non-text', where: 'The focus ring of the remove button on a default chip or tag' },
  { fg: 'color.border.focus-inverse', bg: 'color.surface.brand', kind: 'non-text', where: 'The focus ring of a brand tag\'s remove button, on the tag' },
  { fg: 'color.border.focus-field', bg: 'color.surface.sunken', kind: 'non-text', where: 'A focused field: its border against the field inside it' },
  { fg: 'color.border.focus-field', bg: 'color.surface.default', kind: 'non-text', where: 'A focused field: its border against the page around it' },
  ...on('color.feedback.danger.border', ['color.surface.sunken', 'color.surface.default', 'color.surface.canvas'], 'non-text', 'A field, checkbox, radio or file upload in error: its red edge or ring, the sign of the error besides the message, against the field or the drop zone inside it and the page around it'),
  { fg: 'color.surface.sunken', bg: 'color.surface.default', kind: 'non-text', where: 'Inputs, selects and search fields: the well that shows where to type, against the page. The command palette\'s highlighted command: the sunken fill that marks it, against the panel; the command\'s bolder label marks it too. A toggle button that is on: the sunken fill that shows it, against the page; its rim and the shadow along its top mark it too.' },
  { fg: 'color.surface.sunken', bg: 'color.surface.raised', kind: 'non-text', where: 'A ghost toggle button that is on, a toolbar\'s tool: the sunken fill that shows it, against the raised bar; its rim and the shadow along its top mark it too, and it says it is pressed' },
  ...on('color.border.control', ['color.surface.default', 'color.surface.canvas'], 'non-text', 'An unchecked checkbox or radio: its edge is all that shows it is there. A standard slider: the gray line past the value, which shows where the range runs, against the page'),
  ...on('color.feedback.info.border', ['color.surface.default', 'color.surface.sunken', 'color.surface.canvas'], 'non-text', 'The diagram node block, chosen: its thicker edge, which marks the box a reader is reading about, on the box and the page'),
  ...on('color.border.strong', ['color.surface.default', 'color.surface.canvas'], 'non-text', 'An unchecked subtle checkbox: its edge against the page. A drop zone: its dashed edge, which shows where files can be dropped, against the zone inside it and the page around it. A stepper\'s step not started: the ring around its number'),
  ...on('color.surface.inverse', ['color.surface.default', 'color.surface.canvas'], 'non-text', 'A checked checkbox: the filled shape that shows the state'),
  ...on('color.action.inverse.background', ['color.surface.default', 'color.surface.canvas'], 'non-text', 'A chosen radio: the filled mark that shows the choice'),
  ...on('color.surface.brand', ['color.surface.default', 'color.surface.canvas'], 'non-text', 'A switch that is on: the filled track. A standard slider: the round thumb, which marks the value, against the page beside its thin line'),
  ...['color.surface.inverse', 'color.surface.brand', ...['success', 'warning', 'danger'].map((kind) => `color.feedback.${kind}.surface`)].map((fill) => ({ fg: fill, bg: 'color.surface.track-subtle', kind: 'non-text' as const, where: `A progress bar's ${fill === 'color.surface.inverse' ? 'default' : fill === 'color.surface.brand' ? 'brand' : fill.split('.')[2]} fill: the amount, against the empty track it runs along` })),
  { fg: 'color.surface.inverse', bg: 'color.surface.track', kind: 'non-text', where: 'A capacity meter\'s taken places against its free ones: the filled bars beside the empty bars' },
  ...['color.data.series', ...['success', 'warning', 'danger'].map((kind) => `color.feedback.${kind}.icon`)].map((fill) => ({ fg: fill, bg: 'color.surface.track-subtle', kind: 'non-text' as const, where: fill === 'color.data.series' ? 'A meter\'s series fill and a progress ring\'s done part: the amount, against the empty track it runs along' : `A meter's ${fill.split('.')[2]} fill: the amount, against the empty track it runs along` })),
  ...on('color.surface.track', ['color.surface.default', 'color.surface.canvas'], 'non-text', 'A switch that is off: its filled track is what shows it is there'),
  ...on('color.surface.thumb', ['color.surface.track', 'color.surface.brand'], 'non-text', 'A switch\'s thumb, whose place shows on or off, against the track it sits on'),
  { fg: 'color.border.control', bg: 'color.surface.sunken', kind: 'non-text', where: 'A slider: the gray lines on their band, which show where the range runs' },
  { fg: 'color.border.brand', bg: 'color.surface.sunken', kind: 'non-text', where: 'A slider: the red lines up to the value, on their band. A drop zone with files held over it: its brand edge against the sunken surface inside it' },
  ...on('color.border.brand', ['color.surface.default', 'color.surface.canvas', 'color.surface.raised', 'color.surface.sunken'], 'non-text', 'A chosen choice card: its brand edge, which shows the choice beside the filled mark, against the card inside it and the page around it. A selected card: its brand edge, against each card surface inside it and the page around it. Today in a calendar: the ring inside its mark, on the page. A drop zone with files held over it: its brand edge against the page around it. A splitter being dragged: its brand line, twice as thick, against the page. A chosen tab in the line look: its brand underline, or its side bar in a vertical bar, which is how the choice shows. A pinned table row: its brand edge at the start, beside the pin'),
  { fg: 'color.border.brand', bg: 'color.surface.overlay', kind: 'non-text', where: 'Today in a calendar: the ring inside its mark, in the date picker\'s panel' },
  ...on('color.action.brand.background', ['color.surface.overlay', 'color.surface.default', 'color.surface.canvas'], 'non-text', 'The chosen calendar day: the filled mark that shows the choice, in the date picker\'s panel and on the page. A standard slider\'s red line up to the value, and a fill slider\'s red part, against the page. A stepper\'s current step: the brand mark that shows it, against the page'),
  { fg: 'color.action.brand.background', bg: 'color.surface.neutral-subtle', kind: 'non-text', where: 'A fill slider: the red part up to the value, against the empty bar beside it. A ruler\'s handle, the width now, on a shaded stretch of its band' },
  { fg: 'color.action.brand.background', bg: 'color.surface.sunken', kind: 'non-text', where: 'A curve editor\'s handles, their brand ring, on the sunken plot; a ruler\'s handle, the width now, on the plain stretch of its band' },
  ...on('color.surface.neutral-subtle', ['color.surface.default', 'color.surface.canvas'], 'non-text', 'A fill slider: the empty bar past the value, which shows where the range runs, against the page'),
  { fg: 'color.action.brand.foreground', bg: 'color.action.brand.background', kind: 'non-text', where: 'A fill slider: the thin handle, which marks the value, on the red part around it' },
  { fg: 'color.surface.brand', bg: 'color.surface.sunken', kind: 'non-text', where: 'A slider: the thumb, which marks the value, against the band it crosses' },
  ...on('color.icon.default', SURFACES.slice(0, 3), 'non-text', 'A spinner: the turning ring, which shows that something is being worked on, against the page; its words say what'),
  { fg: 'color.icon.default', bg: 'color.surface.selected', kind: 'non-text', where: 'A chosen option in a selectable list: the tick that shows it is chosen, on the option\'s see-through selected fill' },
  { fg: 'color.surface.default', bg: 'color.surface.canvas', kind: 'non-text', where: 'The current row of a navigation list: the default fill that marks it, against the page; its rim and its bolder title mark it too' },
  ...on('color.icon.subtle', SURFACES.slice(0, 3), 'non-text', 'A subtle spinner: the turning ring against the page, as in a file row that is uploading. A splitter\'s grip: the dots that show where to take hold, on the raised pill'),
  { fg: 'color.icon.subtle', bg: 'color.surface.overlay', kind: 'non-text', where: 'A combobox list that is loading: the subtle spinner\'s ring on the overlay panel; its words say what' },
  { fg: 'color.surface.raised', bg: 'color.surface.canvas', kind: 'non-text', where: 'The chosen tab, the chosen segment of a segmented control and the chosen theme in the theme switch: the raised pill against the bar, which is how the choice shows' },
  { fg: 'color.surface.canvas', bg: 'color.surface.default', kind: 'non-text', where: 'The current navigation item, pressed into the bar: the canvas fill that marks it, against the bar' },
  { fg: 'color.action.ghost.background-pressed', bg: 'color.surface.default', kind: 'non-text', where: 'The current page of a pagination: its pressed fill against the page' },
  { fg: 'color.icon.default', bg: 'color.action.secondary.background', kind: 'non-text', where: 'A stepper\'s finished step: the check that shows it, on its gray mark' },
  ...on('color.feedback.danger.surface', ['color.surface.default', 'color.surface.canvas'], 'non-text', 'A stepper\'s step with an error: the red mark around the warning sign, against the page'),

  // ---- code: each kind of code the code block colors, on its well ----
  ...['keyword', 'declaration', 'string', 'number', 'function', 'type', 'tag', 'property', 'comment', 'punctuation'].map((role): ContrastPair => ({ fg: `color.code.${role}`, bg: 'color.surface.raised', kind: 'text', where: `A code block's ${role === 'punctuation' ? 'punctuation' : `${role}s`}, colored by kind on its well` })),

  // ---- charts: the marks that carry a value or name a series, on what a chart sits on ----
  ...on('color.data.series', SURFACES.slice(0, 3), 'non-text', 'A sparkline\'s line and end dot, a line chart\'s line and marked point, plain bars, and a legend item\'s series swatch: the one series of a chart'),
  ...['1', '2', '3', '4', '5', '6', '7', '8'].flatMap((n) => on(`color.data.categorical.${n}`, SURFACES.slice(0, 3), 'non-text', `A legend item's swatch ${n}, a stacked bar's segment and a donut's part in it: the color that matches a series to its name`)),
  ...on('color.surface.track', SURFACES.slice(0, 3), 'non-text', 'A legend item\'s muted swatch, and Other in a stacked bar or a donut: the gray of everything else'),
  ...on('color.data.series-hover', SURFACES.slice(0, 3), 'non-text', 'A bar chart\'s current bar, such as today\'s: a step darker than the rest, also named by its label'),
  ...on('color.data.reference-line', SURFACES.slice(0, 3), 'non-text', 'A line chart\'s dashed line for the period compared with, and the baseline at zero of the line and bar charts'),
  ...['3', '4', '5'].flatMap((n) => on(`color.data.sequential.${n}`, SURFACES.slice(0, 3), 'non-text', `A heatmap's level ${Number(n) - 1} of 4: a day's square, the amount in its shade, which its table also holds`)),
  ...['success', 'warning', 'danger'].flatMap((kind) => on(`color.feedback.${kind}.icon`, SURFACES.slice(0, 3), 'non-text', `An uptime bar's ${kind === 'success' ? 'up' : kind === 'warning' ? 'incident' : 'outage'} bars, which the summary and the share up also say in words`)),
  { fg: 'color.icon.on-brand', bg: 'color.action.brand.background', kind: 'non-text', where: 'A chosen picture tile: the tick on its brand disc, which shows the choice as a shape' },
  ...on('color.border.inverse', ['color.surface.overlay', ...SURFACES.slice(0, 3)], 'non-text', 'A color swatch picker\'s chosen color: the ring with a gap round its swatch, which shows the choice as a shape, against the surface in the gap and around it, in the color picker\'s panel and on the page'),
];

/**
 * The categorical data colors in their fixed order. Each pair that a chart draws side by side, and the last
 * beside the first where a donut closes its circle, is checked for how far apart the two look to readers with the
 * three kinds of color blindness, in both themes (npm run tokens:contrast).
 */
export const CATEGORICAL = ['1', '2', '3', '4', '5', '6', '7', '8'].map((n) => `color.data.categorical.${n}`);

/**
 * How far apart two series colors must look, as the distance between them in the OKLab color space times 100,
 * after each is changed as a reader with color blindness sees it (Machado, Oliveira and Fernandes, 2009, at full
 * strength). At the target or above, a pair is told apart by color; between the floor and the target, only with
 * a label or a marker beside it; below the floor, not at all. With full color vision a pair needs the normal floor.
 */
export const SEPARATION = { target: 8, floor: 6, normal: 15 };

export const NOT_MEASURED: NotMeasured[] = [
  { what: 'Disabled text and controls', why: 'WCAG exempts controls that cannot be used. They must still read as disabled, which is checked by eye, not by a ratio.' },
  { what: 'Dividers, card and panel edges, the highlight and shade edges', why: 'They separate or polish. What they surround is identified by its text, its fill or its place, so their color is not what makes anything usable.' },
  { what: 'Button borders', why: 'A button is identified by its label and its fill; the border only styles it. The label is measured.' },
  { what: 'Hover and pressed fills against the page, a selected chip\'s fill, a chosen list option\'s fill, the current sidebar item\'s fill, and a tree view\'s chosen row\'s fill', why: 'Hover is not needed to find or use a control. The label on each hover and pressed fill is measured as text. A selected chip and a chosen list option show the choice by their tick, measured on their fill, and the current sidebar item and a tree view\'s chosen row by their bolder label, measured on their fill, so their fills are extra.' },
  { what: 'Logos and text straight on pictures', why: 'Logos are exempt. Text on a photograph with no band under it depends on the photograph, so it is checked by eye where it is used. The card\'s band over its picture is measured.' },
  { what: 'A card\'s warning and danger edges and its corner brackets', why: 'The edges draw attention to a card whose trouble is said in words inside it, measured as text; the brackets are decoration and say nothing a reader needs.' },
  { what: 'Shadows and elevation', why: 'They show depth, not what a control is or which state it is in.' },
  { what: 'Skeletons', why: 'A skeleton holds the place of content that has not arrived and is hidden from assistive technology; the region around it says it is loading. Its see-through gray shows on every surface, which is checked by eye.' },
  { what: 'A toolbar\'s rim and a docked toolbar\'s line', why: 'They draw the edge of a bar that is not a control itself; each tool in it carries its own look, and the floating bar\'s raised surface and shadow set it off too.' },
  { what: 'A code block\'s line numbers', why: 'They help a reader point at a line; they are hidden from screen readers, left out when the code is selected or copied, and say nothing the code does not. The code itself is measured.' },
  { what: 'Icons beside a text label', why: 'The label carries the meaning; the icon is decoration for this rule. Icons that stand alone, in icon-only buttons, are measured with the ghost button pairs.' },
  { what: 'A stepper\'s connecting lines, its finished steps\' gray marks, and its summary\'s track', why: 'The lines join the steps and repeat their order; each step\'s status is in its mark\'s number, check or warning sign and in words. A finished step is shown by its check, measured on the mark. The summary\'s track repeats its count, which is words, and is hidden from screen readers.' },
  { what: 'A timeline\'s dots and lines', why: 'The kind of event is said in the title\'s words and, for screen readers, in words before it; the dot repeats it in color and the line joins the events in their order. The words are measured.' },
  { what: 'A splitter\'s line at rest and under the pointer', why: 'The line is the divider\'s groove: it separates the two panes. The grip\'s dots on their pill show where to take hold and are measured; under the pointer the hit area takes the hover fill and the pointer changes shape, and while it is dragged the line turns brand and twice as thick, which is measured. A splitter without its grip is found by its place between the panes.' },
  { what: 'A tree view\'s lines and its changed dot', why: 'The lines repeat the levels the rows\' indents already show. The changed dot is said in words after the label, which a screen reader hears; a page says it in the pane beside the tree as well.' },
  { what: 'A sparkline\'s soft area', why: 'It repeats the line above it, which is measured; the figure beside the sparkline carries the meaning.' },
  { what: 'A heatmap\'s empty squares and its lightest level', why: 'They show the rhythm of the weeks at a glance, not a value to read: every day\'s value is in the heatmap\'s table, which a screen reader reads and a page can show. The three stronger levels are measured.' },
  { what: 'A chart\'s grid lines, the area under a line, the drop line and the ring round a marked point', why: 'The grid lines and the drop line help the eye read a value across to its label; the area repeats the line above it; the ring keeps the point clear of the line. The values themselves are in each chart\'s table, and the line, the bars and the parts are measured.' },
  { what: 'A fill slider\'s marks', why: 'They are a scale to read by eye between the lowest and highest values, not the value itself, which the red part, the handle and the words show.' },
  { what: 'A status dot\'s dot, and the dot on a navigation item or a sidebar item', why: 'The status is said in the words beside the dot, or in its name when it stands alone; on a navigation or sidebar item the dot\'s words are part of the item\'s name. The dot is a cue for the eye, so its color is not what makes the status known.' },
  { what: 'The sidebar\'s tree line, the line under a row of line tabs, and the subtle underline of a line tab under the pointer', why: 'The tree line repeats what the children\'s indent already shows; the line under the tabs separates them from their panel; hover is not needed to find or use a tab. The chosen tab\'s brand underline is measured.' },
  { what: 'An empty state\'s icon, an error summary\'s icon and its edge, and the cue at the end of a page header\'s tabs', why: 'The empty state and the error summary say what happened in words, which are measured; the icon and the edge repeat the tone. The cue only hints that the row of tabs scrolls; the tabs past it are reached by scrolling and by the arrow keys, and each tab\'s label is measured.' },
  { what: 'A chosen picture tile\'s rim and an avatar group\'s rings', why: 'The tick on the chosen tile shows the choice and is measured; the rim repeats it. The rings only keep overlapping faces apart.' },
  { what: 'The colors a color range\'s steps, a contrast pair\'s sample and a shadow editor\'s preview show; a curve editor\'s curve, arms, straight line and limit; a ruler\'s breakpoint lines and width ticks; a corner sample\'s edges', why: 'The colors are the reader\'s data, each told in words beside it (a step\'s name and ratio, the roles, the ratio and the mark, the layers\' numbers). The lines draw numbers that the curve editor\'s boxes and handles, and the ruler\'s figures and handle, give in words; a corner sample is a picture whose step and size are written beside it.' },
  { what: 'The colors a color swatch, a color slider\'s strip and a color area show, their edges, the checkerboard, and a color thumb\'s light ring', why: 'The colors are the reader\'s data, not the system\'s, so no pair can be fixed; each color is also said in words (a swatch\'s name, a slider\'s or an area\'s value and color name, a code). The edges and the checkerboard only show where a color ends and how see-through it is. The thumb\'s ring is light on any color and its focus ring, with the page\'s color in the gap, is measured with the focus pairs.' },
];
