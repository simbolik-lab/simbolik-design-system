---
name: motion
title: Motion
summary: How long a change takes and how it speeds up and slows down, chosen by why something moves.
type: foundation
tokenGroup: motion
tiers: both
themeAware: false
densityAware: false
viewportAware: false
status: experimental
---

# Motion

## Purpose

How a change plays out over time: how long it takes, and how it speeds up and slows down. Motion here explains a change and nothing more. It shows where a panel came from, that a switch really flipped, that a menu opened from the button that was pressed. It is never decoration, and never the only sign that something happened.

## How it is structured

Two layers. Underneath are raw durations, named by their length, and raw easing curves, named by their shape. On top are purposes. Each purpose names why something moves and pairs a duration with an easing, so the two are always chosen together: timing is chosen by purpose, not by taste, and named as motion, then purpose, then property.

The purposes for interaction:

- **Feedback** confirms a pointer or focus change: a color shift on hover, a tooltip appearing. It is the shortest.
- **State** is a control changing in place and able to change back: a switch thumb sliding, a caret turning, a progress bar growing. It eases in and out, because it plays the same way in both directions.
- **Enter** is something arriving or opening over the page: a drawer, a modal, a menu. It is the longest of the interaction purposes, with a fast start and a long, gentle stop, so the thing is almost in place at once and then settles.
- **Exit** is something leaving or closing. It is shorter than entering and accelerates away, so a dismissal never holds anyone up.
- **Expand** is content opening in place and pushing what follows down, then folding back: an accordion's item. It plays the same way in both directions, with a soft start and a gentle stop, so what follows never jumps at the end and a press halfway turns it round from where it is. It also says how blurred the content is as it starts to fade in, and the accordion's caret turns with it.
- **Fill** is a choice's mark filling as it is chosen: a checkbox's box or a radio's circle fills from a little smaller than the mark as the fill fades in, and empties the same way.
- **Draw** is a tick drawing itself in its box once the box has nearly filled, from its start to its tip, after a short wait; unticked, it erases itself back at once. A mixed box's dash draws without the wait.
- **Pop** is a small mark popping into place, as a radio's dot does: it grows from nothing a little past its size and settles back, and shrinks away the same way.
- **Fold** is a sidebar folding to its column of icons and unfolding again. Its width, and what the column hides, move on one curve that eases in and out, the same both ways, so a press on the way turns it round from where it is. Its words fade into a slight blur in the first part of a fold, before the rows narrow, and come back out of it in the last part of an unfold, once the rows are nearly wide again: it says how long that takes and how blurred the words get.

**Stagger** is a delay, not a duration. It is added once per item when several things enter one after another, and the items still move with the enter purpose.

**Waits** are delays too, for what shows while a mouse rests on something. **Hover** is a panel opening from its opener, as a site header's menus do: a short wait before it opens, and a longer one before it closes, so the pointer can cross from the opener into the panel. **Tooltip** is the longest wait, so a pointer passing over a row of controls shows nothing. **Help**, a label's information icon, waits less than a tooltip, since pointing at it is asking for it. A tooltip and help close after the hover close delay. **Scrollbar** is how long the scrollbar over a part that scrolls stays after the last scroll before it fades, so a reader scrolling with the wheel sees where they are. Keyboard focus and touch never wait for a hover. **Hold** is the one wait for touch: a finger held still on a place that offers a menu, such as a right-click menu, opens it once the hold delay has passed, so a tap or the start of a scroll opens nothing.

**Chart entrance** is a chart drawing itself once, the first time it comes into view: bars grow up from the baseline one after another, a line and the area under it are uncovered from left to right, a ring sweeps round from the top. It has its own durations (one for a bar to grow, one for a line or a ring to be uncovered), its own small step between bars, a span the last bar always starts within, and a curve that starts at full speed and settles gently. It is the one movement a reader may see as a page loads, when a chart is already in view; changes to a chart after it land at once.

The rest are loops, each tied to one behavior: **loading**, the sweep across a skeleton while it waits for its content, the one loop a system component uses; and four for the sites built on the system: **marquee**, a strip that scrolls on its own at a constant speed; **live pulse**, the pulse of something really live, open or running; **cursor**, a blinking text cursor that blinks in steps rather than along a curve; and **ambient**, a slow background drift the eye should never have to follow.

The curves decelerate or accelerate. One, back-out, runs a little past its end and settles back; only the pop purpose uses it, for a small mark popping into place. There is no bounce and no elastic curve. Figma has no motion design, so this group is authored in the token source.

**Reduced motion.** When a reader's system asks for less motion, the motion gets fewer and gentler, not gone. Everything that travels stops: slides, rises and drops, growing and shrinking, sweeps and turns land at once. Fades stay, at their usual durations, because a fade changes nothing's place and helps the eye follow what changed: a modal fades in without rising, a drawer appears in place and fades in instead of sliding, a toast fades without rising, an accordion's item opens at once and its content fades in, a checkbox's fill and tick and a radio's dot fade without growing, a sidebar folds at once while its words still fade, and a color change still eases. Things that only move, such as a spinner's turn, a skeleton's sweep and a marquee, stand still, and a chart's entrance is drawn at once. Content, focus and state all arrive exactly as they would with motion (MOT-001, MOT-002). This is a rule in each component's stylesheet rather than a token context, because no value changes; the movement is simply removed and the fade kept.

The marquee and the cursor have no easing token. The marquee runs at a constant speed and the cursor blinks in steps, so neither follows a curve.

## Tiers

Both tiers reach CSS, as they do for the other categories that do not change with theme or width. A component always reads a purpose, never a raw duration or curve: the purpose is the decision and the raw value is only its current setting. The raw tier exists so that two purposes sharing a value today share it through one token, and a change to that step reaches both.

The Tailwind theme carries the easing curves and the purposes' easings as utilities. Tailwind has no place for durations; use the custom properties for those.

## Usage rules

### Do

- Choose the purpose first, then use its duration and its easing together.
- Enter with the enter purpose and leave with the exit purpose, so leaving is always quicker than arriving. Content that unfolds in place, pushing what follows, uses the expand purpose both ways instead.
- Move what explains the change: position, size and opacity. A slide should travel from where the thing came from, such as the edge a drawer belongs to or the button a menu hangs from.
- Give every movement a reduced-motion rule that removes the travel and keeps the fade, and check that nothing is lost without it.
- Keep a staggered sequence short, so nobody waits for its last item.
- Use the live pulse only for something that is really live, open or running.

### Don't

- Write a duration or an easing curve in component CSS. Read a purpose.
- Read a raw duration or curve in a component. It skips the decision the purpose records (MOT-003).
- Make motion the only sign of a change. Whatever moved must also look different when it stops.
- Hold back focus or content until a movement finishes. Focus moves at once; the movement plays around it.
- Add a bounce or an elastic curve, or run past the end anywhere but a small mark popping into place.
- Make an exit longer than its entrance.
- Flash anything. Flashing must stay below the seizure thresholds WCAG sets (MOT-004).
- Type a travel distance. Take it from the spacing tokens or from the element's own size: a drawer slides its own full width, a menu drops across the gap between it and its button, and a toast rises by a spacing step.
