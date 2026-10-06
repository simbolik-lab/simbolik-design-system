# Changelog

What each Release of the Simbolik Design System brought, newest first. Each Release's notes are also in [`release-notes/`](release-notes/), one file per version, and on the Showroom's Releases page, https://design.simbolik.ai/releases/.

## 0.1.2-alpha · 2026-10-05

Version `0.1.2-alpha`, a small step after 0.1.1 alpha, much of it for phones. A tapped control no longer keeps its mouse-over look or flashes the browser's gray box. The app bar can slide away as the reader scrolls, and the browser's own bar can take the page's color. A site can draw its own logo, and the footer can open a link in a new tab. The conformance checker gains a rule that finds mouse-over looks a phone would keep. What breaks says what to change.

### New

- **Logo and sidebar**: a site can draw its own logo. Give your logo's shapes to the logo as `shapes`, or to the sidebar as `logoShapes`. They take the same form as the built-in logo: a name, the frame, the view boxes of the mark and the wordmark, and their paths. Your logo is drawn and colored like the built-in one.
- **App bar**: on a phone, the bar can slide away as the reader scrolls down and come back as soon as they scroll up. Turn it on page by page with `hide-on-scroll`. It stays at the top of the window and never hides while a menu is open or keyboard focus is in it. For a reader who asks for reduced motion, it hides and shows at once. Wide screens keep the bar as it is.
- **Footer**: give a column link or a social icon `external` and it opens in a new tab. A screen reader says "(opens in a new tab)" after its name; nothing changes on screen. Legal links always stay in the same tab.
- **Theme switch**: `followThemeColor()` colors a phone browser's own bar to match the page, and keeps it matching when the theme changes. Call it once where the page sets its theme. Without it, a dark page can sit under a white bar.

### Changed

- **Checker**: a new rule, sticky-hover, finds a mouse-over look that a phone would keep after a tap. That is a `:hover` rule outside `@media (hover: hover)`. Rules inside a block that asks about hover are fine, and so is `:not(:hover)`.
- **Checker**: each exception in `conformance-exceptions.json` is now printed once, with how many findings it explains and the first 3 places. A long reason no longer fills the report. Add `--explained` to list every finding, as before.

### Fixed

- **Components**: on a phone, a tapped control no longer keeps its mouse-over look until the next tap. Mouse-over looks now wait for a device that can hover. With a mouse, nothing changes.
- **Components**: a tap on a control now shows only the control's own looks. The browser's gray box is gone, and tapping twice quickly no longer zooms the page. Holding a finger on a button, chip or tab no longer selects its label.

### What breaks

- **Checker**: a project's `:hover` rule outside `@media (hover: hover)` now fails its check. Move it inside, splitting off any other state it shares a selector with.
- **Logo and sidebar**: the logo now has one built-in brand, simbolik. Its `brand`, and the sidebar's, take only `simbolik`; the other brand's value and its modifier class are gone. A site that drew that logo passes its own shapes instead: `shapes` on the logo, `logoShapes` on the sidebar.

### Known gaps

- **The app bar has no in-between form.** Wide, it holds its links, search and actions in one row; narrow, it moves them into a menu. On a screen wide enough for the wide form but too narrow for everything in it, they run out of the bar. Until the app bar has a form for this, put `data-layout="narrow"` on a wrapper around a crowded bar.
- **The dropdown always opens downward.** With too little room below its opener, part of the panel ends up out of view. The select's list already opens upward when there's more room above, and the dropdown's panel doesn't yet.
- **Some color pairs fall short of contrast.** A few colors measure below the contrast ratio WCAG asks for against the background they sit on. Text needs 4.5 to 1; the edge or mark that shows a control or its state needs 3 to 1. Some pairs are still to be fixed. Others are kept on purpose, a choice of taste for the system's look. The Contrast section of the [color page](https://design.simbolik.ai/foundations/color/#contrast) lists every pair, what it measures and what it needs.

### Take it

The code is on GitHub, https://github.com/simbolik-lab/simbolik-design-system, tagged `v0.1.2-alpha`. Clone it, then `npm ci`, `npm run css:bundle` and `npm run release:bundle` write a Release bundle to `release/0.1.2-alpha/`. It's one folder with what a site builds with and every license, and the README says how to use each part.

A site on 0.1.1 alpha swaps its copy of the bundle for this one. Its markup stays as it is, unless it draws the logo's other brand. If it runs the conformance checker, read What breaks first. The new rule can find mouse-over looks in the site's own stylesheets to move. A site still on 0.1 alpha reads the [0.1.1 alpha notes](https://design.simbolik.ai/releases/0.1.1-alpha/) too.

The Figma file the design is drawn in is on Figma Community, https://www.figma.com/community/file/1688324308358870630, where anyone can open it and copy it.

The code is under the MIT License and the Figma file under CC BY 4.0. The [Licenses page](https://design.simbolik.ai/licenses/) says what each one asks.

## 0.1.1-alpha · 2026-10-04

Version `0.1.1-alpha`, a small step after 0.1 alpha. Screen readers get names they were missing, Safari gets two fixes, and a page can load every font from one stylesheet. The segmented control and the badge now match the Figma file, and the conformance checker reads more of a project. What breaks says what to change.

### New

- **One font stylesheet.** `assets/fonts/fonts.css` holds every weight of Funnel Display, Geist and Geist Mono that the design system uses. Link it, and a page waits for one font stylesheet where it waited for fifteen, one per font and weight. The fifteen are still there, so pages that link them keep working.
- **Footer.** A link given `active` tells screen readers it's the current page. A column link also shows it with the navigation item's current look; a legal link looks as it did. `navLabel` names the columns' navigation ("Footer" unless you give another), for a page with two footers.
- **Header.** `navLabel` names the navigation holding its links ("Main" unless you give another), as the app bar's already could.
- **Code block.** `status` says what the last action did, such as "Copied", in a status line the page doesn't show (`smbk-code__status`) and screen readers read out. Empty it after a moment, so the same result is read again the next time.

### Changed

- **Code block.** A bare block shows no bar, but a `label` given to it now names its code when the code scrolls. Before, every bare block was named "Code".
- **Segmented control.** The chosen item is now on the raised surface, a shade lighter than before, like the chosen tab and the chosen theme in the theme switch. Its edge and shadow are the same.
- **Badge.** A badge of the default type now has a thin highlight edge round it, as the Figma file draws it. Its size doesn't change, and the dot look stays as it was.
- **Design tokens.** The token files no longer hold Figma's code syntax (`$extensions.figma.codeSyntax`), the name Figma's Dev Mode shows for a variable. Every custom property is still named from its token's path, so the CSS, TypeScript and JSON outputs are the same.
- **Conformance checker.** The README now says which settings the checker reads from a project's `package.json`. An exception naming a rule the checker no longer has gets a note on every run. It used to stop the check.

### Fixed

- **Sidebar.** Its panel has a name now, the sidebar's `label`, as its navigation had. A page with another side column no longer has two that sound the same to a screen reader.
- **Search field.** In Safari, Escape now empties a field holding text, as other browsers already did, and the page hears it as a change. In an empty field, Escape is left to the page (to close a dialog, say).
- **Select.** Safari no longer cuts the tails off letters such as g, p and y in the value and the choices. The select also points assistive technology at its list only while the list is open, as ARIA 1.2 asks.
- **Table.** The drag handles' column has a heading screen readers read, "Reorder", written out of sight (`smbk-table__header-name`). A name given only as an `aria-label` wasn't read everywhere.
- **Table of contents.** With `extra`, its `aria-label` went to the box around it. It now names the navigation, with or without `extra`, and the heading stays as it is.

### What breaks

- **Conformance checker, the folders it reads.** It used to skip two more folder names at a project's top. Now it skips `node_modules`, dot folders, and `site`, `dist`, `public` and `design-system` at the top, and reads the rest. If a project keeps notes or drafts it shouldn't check, list their folders under `ignore` in its `package.json`, as in `"simbolik": { "ignore": ["notes"] }`.
- **Conformance checker, the `old-system` rule.** The rule is gone, and so are its counts at the end of the report and `oldClasses` and `oldProperties` in the `--json` summary. A class it found is now a class without the project prefix (`class-prefix`). Rebuild it with a component or a Project Piece, or list it under `allowClasses` if the project needs it as it is. An exception naming `old-system` no longer explains anything; remove it.

### Known gaps

- **The app bar has no in-between form.** Wide, it holds its links, search and actions in one row; narrow, it moves them into a menu. On a screen wide enough for the wide form but too narrow for everything in it, they run out of the bar. Until the app bar has a form for this, put `data-layout="narrow"` on a wrapper around a crowded bar.
- **The dropdown always opens downward.** With too little room below its opener, part of the panel ends up out of view. The select's list already opens upward when there's more room above, and the dropdown's panel doesn't yet.
- **Some color pairs fall short of contrast.** A few colors measure below the contrast ratio WCAG asks for against the background they sit on. Text needs 4.5 to 1; the edge or mark that shows a control or its state needs 3 to 1. Some pairs are still to be fixed. Others are kept on purpose, a choice of taste for the system's look. The Contrast section of the [color page](https://design.simbolik.ai/foundations/color/#contrast) lists every pair, what it measures and what it needs.

### Take it

The code is on GitHub, https://github.com/simbolik-lab/simbolik-design-system, tagged `v0.1.1-alpha`. Clone it, then `npm ci`, `npm run css:bundle` and `npm run release:bundle` write a Release bundle to `release/0.1.1-alpha/`. It's one folder with what a site builds with and every license, and the README says how to use each part.

A site on 0.1 alpha swaps its copy of the bundle for this one, and its markup stays as it is. If it runs the conformance checker, read What breaks first. To load the fonts from the one stylesheet, link `assets/fonts/fonts.css` in place of the fifteen.

The Figma file the design is drawn in is on Figma Community, https://www.figma.com/community/file/1688324308358870630, where anyone can open it and copy it.

The code is under the MIT License and the Figma file under CC BY 4.0. The [Licenses page](https://design.simbolik.ai/licenses/) says what each one asks.

## 0.1.0-alpha · 2026-10-04

Version `0.1.0-alpha`, the first Release of the design system.

### What's in it

- **Design tokens** in the format of the W3C Design Tokens Community Group (DTCG), drawn from the Figma file. The build turns them into CSS custom properties, a Tailwind theme, a TypeScript module and JSON. Two themes (light and dark), two densities (comfortable and compact), and type sizes that follow the window's width.
- **Foundations**: a page for each token group, from color and type to motion, on what the group is for and how to use it.
- **Components**: buttons, inputs, selects, checkboxes and sliders; cards, alerts, toasts and tooltips; breadcrumbs, tabs, a header, a footer and a sidebar that folds into a column of icons; modals, drawers, dropdowns, popovers, tables and a command palette. Each one is a stylesheet first, with a React wrapper over it.
- **One stylesheet**, `css/simbolik.css`, for sites without React, with the fonts (Funnel Display, Geist and Geist Mono) and the Phosphor icons beside it.
- **The conformance checker**, which reads a project and lists every raw value where a design token belongs.

Each component and foundation carries a Status. Most components start as Candidate (believed complete, may still change); the card, the drawer, the logo, the modal and the skeleton start as Experimental (expect big changes). Of the foundations, typography and radius start as Stable; border width, elevation, focus, opacity, size, spacing and stacking order as Candidate; and blur, breakpoints, color and motion as Experimental. From here, each moves on its own.

### What alpha means

Until 1.0, any version can rename or remove things. Its notes list what breaks. The `smbk-` class names are what a site's markup leans on most, so a renamed class is always named in them.

### Known gaps

- **The app bar has no in-between form.** Wide, it holds its links, search and actions in one row; narrow, it moves them into a menu. On a screen wide enough for the wide form but too narrow for everything in it, they run out of the bar. Until the app bar has a form for this, put `data-layout="narrow"` on a wrapper around a crowded bar.
- **The dropdown always opens downward.** With too little room below its opener, part of the panel ends up out of view. The select's list already opens upward when there's more room above, and the dropdown's panel doesn't yet.
- **Some color pairs fall short of contrast.** A few colors measure below the contrast ratio WCAG asks for against the background they sit on. Text needs 4.5 to 1; the edge or mark that shows a control or its state needs 3 to 1. Some pairs are still to be fixed. Others are kept on purpose, a choice of taste for the system's look. The Contrast section of the [color page](https://design.simbolik.ai/foundations/color/#contrast) lists every pair, what it measures and what it needs.

### Take it

The code is on GitHub, https://github.com/simbolik-lab/simbolik-design-system, tagged `v0.1.0-alpha`. Clone it, then `npm ci`, `npm run css:bundle` and `npm run release:bundle` write a Release bundle to `release/0.1.0-alpha/`. It's one folder with what a site builds with and every license, and the README says how to use each part.

The Figma file the design is drawn in is on Figma Community, https://www.figma.com/community/file/1688324308358870630, where anyone can open it and copy it.

The code is under the MIT License and the Figma file under CC BY 4.0. The [Licenses page](https://design.simbolik.ai/licenses/) says what each one asks.
