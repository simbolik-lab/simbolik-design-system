---
name: timeline
title: Timeline
type: component
block: smbk-timeline
adaptStrategy: css
figmaNodeId: 7607:118483
status: experimental
---

# Timeline

## Purpose

Shows things that happened, one after another, so the reader can follow a history: a project's activity, the steps of a deploy, an order on its way. Each event has a dot for its kind, what happened, when, and who or what did it. It differs from the stepper, which shows where the reader is in steps still to come, and from the list, whose rows are not tied to a moment.

## Anatomy

- The block, an ordered list of events.
- The item part, a list item for each event. Its tone is a modifier of the part: default, info, success, warning or danger.
- The rail part: the marker part, a 16 circle in the kind's soft color holding the dot part, and the line part, down to the next event. The last event has no line.
- The body part: the top part holding the title part, what happened, and the time part, when; then the meta part, who or what did it; then the detail part, an optional line in code type on a sunken box.
- An event that unfolds: the body holds the disclosure part, a `details` element whose summary part holds the top, meta and detail parts, with the caret part after the time, and the more part, what it shows when open.
- The hidden part: the event's kind in words for screen readers, before its title.

## When to use

- A record of what happened to one thing, newest first or oldest first.
- The stages a piece of work went through, with when each happened.
- A short activity panel on a dashboard.

## When not to use

- Steps the reader is still working through. Use the [stepper](../stepper/stepper.md).
- Items that are not tied to a moment, or that the reader acts on. Use the [list](../list/list.md).
- Messages or log lines in the hundreds. Use a [log](../log/log.md) or a [table](../table/table.md) that can be searched.

## Behavior

The events keep the order the page gives them; the timeline does not sort. The title wraps beside its time, which stays at the end of the line. The detail wraps inside its box. Nothing moves and nothing takes focus, except an event that unfolds.

An event can hold more than its title, time, meta line and detail (`more`), such as the whole entry of a log, shown in place when the reader presses the event. The event's title, time, meta line and detail are then one row that opens and closes it, with a caret after the time that turns when it is open; the more unfolds under the row with the expand motion, as an accordion's item does, in Body SM and the secondary text color, its paragraphs a small step apart. It starts closed unless `defaultExpanded` is set, or the page holds it with `expanded` and `onExpandedChange`. Under reduced motion the height lands at once and the fade still plays. Written by hand, the body holds a `details` element with the disclosure class, its `summary` with the summary class holding spans with the top, title, time, meta and detail classes, and the more after it.

## Accessibility
### What it does for you

- The events are an ordered list.
- The rail is decoration and hidden from screen readers.
- The kind of event is said in words before the title, such as "Warning: Two images failed to upload".
- With a machine-readable date, the time is a `time` element carrying it.
- It takes no focus of its own; a link in a title or a detail is a Tab stop.
- An event that unfolds is a native disclosure: its row is a Tab stop, named by the kind, title, time, meta line and detail, says whether it is expanded, and opens and closes with Enter and Space, with no script.

### What you must do

- Name the list with `aria-label` when the page has more than one.
- Say the kind in the title's own words too ("Deploy failed", not "Build 481"), so a reader who cannot tell the dots' colors apart still knows it.
- In markup written by hand, add the kind's words in the hidden part.
- Keep links and buttons out of an unfolding event's title, meta line and detail: they sit inside the row that opens it. Put them in the more.

### How to test

- With a screen reader, the events are read as an ordered list in the order given, each with its kind before its title.
- Tab through the page: focus skips the timeline itself and lands only on a link in a title or a detail.
- With text at 200% and the page 320 pixels wide, the title wraps beside its time, and the detail wraps inside its box.
- Tab to an event that unfolds and press Enter or Space: the more shows under it and a screen reader hears it expanded; press again and it closes.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the row of each event that unfolds, and to a link in a title, a detail or an open more. |
| Enter or Space | On an event's row, shows its more, or hides it when shown. |

## Composition

Holds events only. An event's title, meta or detail may hold a link. Sits on a page, in a card, a side panel or a drawer.

## Usage rules

### Do

- Say what happened in the title, in a few words.
- Keep one order through the whole timeline, newest first or oldest first.
- Give the time in the reader's own form, and a machine-readable date beside it.

### Don't

- Leave the dot's color alone to say that something failed.
- Mix events of different things in one timeline without saying in the meta line which each is about.

## Related

- [Stepper](../stepper/stepper.md): where the reader is in steps still to come.
- [List](../list/list.md): rows of things not tied to a moment.
- [Table](../table/table.md): many events compared across the same columns.
