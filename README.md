# Simbolik Design System

Design tokens, CSS components and React components for the web, free to use under the MIT License. The design is drawn in Figma; this repository is the design system as code. It comes with a site that shows every piece, and a checker for the projects built on it.

- **The Showroom**, https://design.simbolik.ai/: every foundation and component, with a live preview, the code to copy and the design tokens it reads.
- **The Figma file**, https://www.figma.com/community/file/1688324308358870630: the design the code is built from, on Figma Community, free to open and copy.
- **What each version holds, and what it's missing**: the [release notes](release-notes/), also on the Showroom's Releases page, https://design.simbolik.ai/releases/.

It's an alpha. Names and behavior can still change between versions, and each version's release notes say what changed and what breaks.

## Try it

You need git and Node 22 or later.

```sh
git clone https://github.com/simbolik-lab/simbolik-design-system.git
cd simbolik-design-system
npm ci
npm run css:bundle
```

That writes `css/simbolik.css`, the design tokens and every component in one stylesheet, and `assets/`, the fonts and the icon font with their licenses. Copy `assets/`, `css/` and, for React, `components/` into your site, then:

1. Link `assets/fonts/fonts.css` (every font the system uses, in one stylesheet), `assets/phosphor/regular/style.css` and `css/simbolik.css`.
2. Write the markup with the `smbk-` classes. Every component's page in the Showroom has its markup to copy.
3. In React, use the wrappers in `components/` instead (`components/button/button.tsx`). A wrapper sets the classes and adds behavior; the stylesheet still draws everything, so link it as above. The wrappers are written for React 19 and TypeScript.

## What's in it

| Folder | What it holds |
|---|---|
| `tokens/` | The design tokens, in the JSON format of the W3C Design Tokens Community Group (DTCG): what the Figma export holds, plus `authored.tokens.json` for what Figma can't hold (motion, breakpoints, fixed widths, the stacking order). The only place a design value is written |
| `build/` | The token build, which checks the design tokens against its rules and writes the outputs below; the one stylesheet with its fonts and icons; the contrast report |
| `css/` | `tokens.css` (the design tokens as CSS custom properties), `tailwind.css` (the same as a Tailwind theme) and `simbolik.css`: the design tokens and every component in one stylesheet |
| `output/` | The design tokens as a TypeScript module and as JSON |
| `foundations/` | One page per token group: what it's for and how to use it |
| `components/` | One folder per component: its stylesheet, its variant manifest, its React wrapper and its documentation |
| `conformance/` | A command-line checker that reads a project and lists every raw value and every hand-built copy of a component |
| `release-notes/` | One file per version |
| `docs/` | How names are made |
| `GLOSSARY.md` | The words the system uses, and the ones it avoids |

## Status

Every foundation and component has a Status, shown on its page in the Showroom.

| Status | What it means |
|---|---|
| Proposed | Needed, not built yet |
| Experimental | Built. Expect big changes |
| Candidate | Complete as far as I know. Use it; it may still change |
| Stable | Supported. Changing it is a breaking change |
| Deprecated | On its way out. Move off it |
| Retired | Removed |

Each one moves on its own, when its checks pass and I'm sure of it, whatever the version number says.

## Use it

**Theme, density and layout.** A page follows the reader's light or dark setting. Set `data-theme="light"` or `data-theme="dark"` on any element to fix its theme, and `data-density="compact"` for the tighter spacing. Components with a phone form switch to it by the window's width; `data-layout="narrow"` or `"wide"` on a wrapper forces one form inside it.

**Check a project.** `npm run conformance -- path/to/project` lists every raw color, size or font where a design token belongs. It also lists every component the project rebuilds by hand. Add `--json` for a report a script can read. The checker reads the project's settings from `"simbolik"` in its `package.json`: `prefix`, the start of the project's own class names (`"site-"`); `allowClasses`, classes from elsewhere the project needs; and `ignore`, the folders and files it shouldn't read, such as notes or drafts (`"ignore": ["notes"]`). It never reads `node_modules`, dot folders, or `site`, `dist`, `public` and `design-system` at the project's top. A finding the project keeps on purpose goes in `conformance-exceptions.json`, with the file, the rule, the text it matches and the reason, and is printed on every run: each entry once, with its count and first places, or every finding with `--explained`.

## Work on it

In this folder, after `npm ci`:

| Command | What it does |
|---|---|
| `npm run tokens:validate` | Checks the design tokens against the build's rules |
| `npm run tokens:build` | Checks the design tokens, then writes `css/tokens.css`, `css/tailwind.css`, `output/tokens.ts` and `output/tokens.json` |
| `npm run typecheck` | Type-checks the build, the components and the checker |
| `npm run css:bundle` | Writes `css/simbolik.css`, and copies the fonts and the icon font into `assets/` |
| `npm run tokens:contrast` | Measures contrast in both themes: text on what it sits on, and the colors that show a control, its state or focus |
| `npm run conformance -- <project>` | Checks a project built on the system (Use it, above) |

## How it's built

**The token build.** `npm run tokens:build` checks the design tokens before it writes a file, and it won't guess what someone meant. It stops on two token paths that make the same name, a reference to a design token that doesn't exist, a value that leads back to itself, and an alias to a design token of another type. Then it writes `css/tokens.css`, `css/tailwind.css`, `output/tokens.ts`, and `output/tokens.json`. Theme and density reach CSS as attributes, and text size as a media query on the window's width. The layout switch is one inherited custom property, `--smbk-layout`, which components read with a style container query.

[`docs/naming.md`](docs/naming.md) says how a design token's path becomes a custom property or a class, and [`GLOSSARY.md`](GLOSSARY.md) which words mean what.

## What comes next

This is the first version, and more is on the way:

- **Skills for AI agents**, the instructions a coding agent reads before it builds with the system.
- **A custom Showroom.** The Showroom at https://design.simbolik.ai/ is built from this system, but its own code isn't in this repository yet.
- **And more.**

## Bugs and pull requests

This repository is a copy made at each Release, so I don't merge pull requests here. Report a bug in an issue, or write to hello@simbolik.ai.

## License

The code is under the MIT License, copyright simbolik ([`LICENSE`](LICENSE)). Use it, change it and sell what you build with it. Every copy of the code keeps the copyright line and the license text; nothing has to show on screen.

The [Figma file](https://www.figma.com/community/file/1688324308358870630) is on Figma Community, which puts every free file under Creative Commons Attribution 4.0 (CC BY 4.0). Use it, change it, build paid work from it, and give credit:

> "Simbolik Design System" by simbolik (https://design.simbolik.ai/), licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/).

The fonts and the icons are other makers' work, under their own licenses. Funnel Display, Geist and Geist Mono are under the SIL Open Font License 1.1, and the Phosphor icons under the MIT License. `npm run css:bundle` puts each license in `assets/` beside its files, and every copy keeps it there.

The licenses cover the design system, not the brands. The simbolik name and logo stay simbolik's, so replace the logo with your own before you ship.

Questions about reuse: hello@simbolik.ai.
