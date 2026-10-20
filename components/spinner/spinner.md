---
name: spinner
title: Spinner
type: component
block: smbk-spinner
adaptStrategy: css
figmaNodeId: 7110:461
status: experimental
---

# Spinner

## Purpose

A small turning ring that says something is being worked on, for a wait whose end is not known: a search running, a list loading, a file being sent. It differs from the progress bar, which shows how much of a known amount is done, and from the skeleton, which stands in for content that is about to arrive.

## Anatomy

- The block, an inline row that sits on the line of the text around it.
- The ring part, two arcs facing each other on a circle, turning together. It is decorative: a screen reader never reads it.
- The label part, the words that say what is happening. Always present; drawn beside the ring when the label flag is on, and read aloud either way.

## When to use

- A wait of a second or more with no known end, in a region the reader is looking at: a list that is loading, a panel being refreshed.
- Beside its words, in a row that reports a state: "Uploading", "Checking the address".
- Inside a control that is waiting for its results, such as a search box while it searches.

## When not to use

- Inside a button whose action is running. Use the [button](../button/button.md)'s loading flag, which keeps the button's width and name and says it is busy.
- When the amount of work is known. Use the [progress bar](../progress/progress.md), so the reader can see how far along it is.
- When the content's shape is known before it arrives. Use the [skeleton](../skeleton/skeleton.md), so the page does not jump.
- For a wait shorter than about a second. Show nothing; a ring that flashes is noise.

## Behavior

The ring turns at an even speed for as long as the spinner is shown. When the reader has asked their system for reduced motion, the ring stands still and the words show beside it, so the words say what is happening when nothing moves.

A spinner has no end of its own. If the wait passes a few seconds, the page shows what is happening and offers a way out, such as a message with a Try again button. A spinner that never stops, with no way to recover, is not supported.

Two tones: the default ring is the main icon color; the subtle ring is quieter, for a wait beside secondary text. Three sizes match the icon sizes, so a spinner can take the place of an icon of the same step.

## Accessibility
### What it does for you

- The spinner is a status region: a screen reader reads its words when it appears, without moving focus. The ring is hidden from assistive technology.
- Without words, the wrapper says "Loading" and warns in development.
- Under reduced motion the ring stops and the words show.

### What you must do

- Give it its words, even when they are not drawn. Say what is happening, such as "Loading results", not just "Please wait".
- Announce completion or failure once, from the page: replace the spinner with the result, or with a message that says what went wrong.

### How to test

- With a screen reader, the words are read when the spinner appears, and focus does not move.
- Turn on reduced motion in the system: the ring stands still and the words show beside it.
- When the wait ends, the page says how it went, once.

## Composition

Contains the ring and its words. Sits inline beside text, in a list row, in a field, or alone in an empty region. Inside a button it is drawn by the button's loading flag, not placed by hand.

## Usage rules

### Do

- Write the words as what is happening: "Saving changes", "Loading projects".
- Replace the spinner with the result as soon as it is ready.
- Offer a way out when the wait runs long.

### Don't

- Put a spinner inside a button by hand. Use the button's loading flag.
- Show several spinners for one wait.
- Leave a spinner turning with no end and no way to recover.

## Related

- [Button](../button/button.md): its loading flag draws this ring over its hidden label.
- [Progress](../progress/progress.md): for a known amount of work.
- [Skeleton](../skeleton/skeleton.md): for content whose shape is known before it arrives.
