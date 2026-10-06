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
- **Enter** is something arriving or opening: a drawer, a modal, a menu, an accordion's content. It is the longest of the interaction purposes, with a fast start and a long, gentle stop, so the thing is almost in place at once and then settles.
- **Exit** is something leaving or closing. It is shorter than entering and accelerates away, so a dismissal never holds anyone up.

**Stagger** is a delay, not a duration. It is added once per item when several things enter one after another, and the items still move with the enter purpose.

The rest are loops, each tied to one behavior: **loading**, the sweep across a skeleton while it waits for its content, the one loop a system component uses; and four for the sites built on the system: **marquee**, a strip that scrolls on its own at a constant speed; **live pulse**, the pulse of something really live, open or running; **cursor**, a blinking text cursor that blinks in steps rather than along a curve; and **ambient**, a slow background drift the eye should never have to follow.

The curves only decelerate or accelerate. There is no bounce, no overshoot and no elastic curve. Figma has no motion design, so this group is authored in the token source.

**Reduced motion.** When a reader's system asks for less motion, every component drops its movement: things appear, disappear and change state at once. Nothing else changes. Content, focus and state all arrive exactly as they would with motion (MOT-001, MOT-002). This is a rule in each component's stylesheet rather than a token context, because no value changes; the movement is simply removed.

The marquee and the cursor have no easing token. The marquee runs at a constant speed and the cursor blinks in steps, so neither follows a curve.

## Tiers

Both tiers reach CSS, as they do for the other categories that do not change with theme or width. A component always reads a purpose, never a raw duration or curve: the purpose is the decision and the raw value is only its current setting. The raw tier exists so that two purposes sharing a value today share it through one token, and a change to that step reaches both.

The Tailwind theme carries the easing curves and the purposes' easings as utilities. Tailwind has no place for durations; use the custom properties for those.

## Usage rules

### Do

- Choose the purpose first, then use its duration and its easing together.
- Enter with the enter purpose and leave with the exit purpose, so leaving is always quicker than arriving.
- Move what explains the change: position, size and opacity. A slide should travel from where the thing came from, such as the edge a drawer belongs to or the button a menu hangs from.
- Give every movement a reduced-motion rule that removes it, and check that nothing is lost without it.
- Keep a staggered sequence short, so nobody waits for its last item.
- Use the live pulse only for something that is really live, open or running.

### Don't

- Write a duration or an easing curve in component CSS. Read a purpose.
- Read a raw duration or curve in a component. It skips the decision the purpose records (MOT-003).
- Make motion the only sign of a change. Whatever moved must also look different when it stops.
- Hold back focus or content until a movement finishes. Focus moves at once; the movement plays around it.
- Add a bounce, an overshoot or an elastic curve.
- Make an exit longer than its entrance.
- Flash anything. Flashing must stay below the seizure thresholds WCAG sets (MOT-004).
- Type a travel distance. Take it from the spacing tokens or from the element's own size: a drawer slides its own full width, a menu drops across the gap between it and its button, and a toast rises by a spacing step.
