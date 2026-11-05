---
name: table
title: Table
type: component
block: smbk-table
adaptStrategy: css
figmaNodeId: 4318:16988
status: candidate
---

# Table

## Purpose

Rows of the same kind of thing, one per line, under headings the reader can sort by: clusters, users, orders. It is for comparing and finding, not for laying out a page. A card grid is for things that each need room; a table is for many things that each need a line.

## Anatomy

- The block, a frame around a real table element, with a hidden caption naming it. It comes in three looks: framed, the default, a bordered and rounded frame for a table on the page; flat, for a small table inside a card; and filled, the framed table with a calmer heading (below). The parts here are the framed look's.
- The header row on the default surface, with a rule under it in the control color. Each header part holds a heading in the small label style and, when sortable, an arrow: up on a column sorted ascending, down on one sorted descending, both ways on a column not sorted; hairlines separate the headings. The first heading may carry the choose-all checkbox. After the heading may come a filter button, a funnel with a count beside it while filters apply, and an info button; both are the extra-small quiet icon button.
- A column of figures lines up at the end: its heading, its arrow (before the label, so the label meets the figures' edge) and its cells.
- The row part, one per record, with a subtle rule under it, taking the hover fill under the pointer. A chosen row takes its own fill, beside its ticked checkbox, and keeps it under the pointer, and its descriptions turn one step darker so they stay readable on it. A disabled row is dimmed.
- The cell part, holding a value part: text with an optional icon before it, a description straight under it, both in the tiny style, and a copy button after it. A cell may instead hold an avatar beside a link, a tag, a badge, a row of icon buttons, a picture, or a figure with a bar after it, the progress track filled to its share; the content part lines them up. Numbers take digits of equal width, so they line up down a column.
- A prose column holds sentences: its cells wrap between a narrowest and a widest measure, and the other cells of the row line up with the first line.
- A table whose cells differ a lot in height may start every cell at the top of its row, each first line level with the others.
- A column may keep a width of its own, and the table then keeps every column where it is while its rows change. The column parts, one per column at the table's top, hold those widths.
- A column may be headed by a block rather than a line: a few lines and buttons, such as a record's name, a line of facts and its commands, in the header block part. Its heading grows to hold them, and the heading row is as high as its tallest heading, the rule running under that one. Every heading in that row starts at the top, and a column that did not ask keeps its one line.
- A row that can be pressed holds one link or button, the row press part, with no words to show, lying over the whole row; the controls in its cells lie over that. It looks like any other row: the hover fill under the pointer, and the chosen row's fill while it is pressed and while what it opened is open.
- Row states beside chosen and disabled: the current row takes the chosen row's fill and keeps it under the pointer, in a table with or without checkboxes; a pinned row has a brand edge on its start side and a pin at its start; a highlighted row takes the info tint; a rule above a row, stronger than the rest, starts a new group.
- A row that opens has a caret at its start, pointing to the end while closed and down while open, and unfolds a detail row under it: one cell across every column on the sunken surface, often a title over a few lines. In a table with such rows, or pinned ones, every first cell keeps the same room at its start, so the columns line up. A row may instead open from a button of the page's own in one of its cells, such as a count that opens the list it counts; the table then draws no caret, and no room at the rows' start unless a row is pinned. An open row draws no rule under it, so its detail joins it; the detail keeps the rule under it.
- A group heading row: one cell across the row with a label and a count in the subtle color, starting the rows under it.
- The choose checkbox, when rows are chosen: a subtle small checkbox in the first column, and the same in the first heading for every row.
- The footer part, under a strong rule, for the range pagination on the left, with its small select, and the numbers pagination on the right.
- Three forms for big tables, in the framed and filled looks. The long form keeps a long table's heading row in view, in one of two places. In a frame of its own (`sticky-header`), whose height the page limits, the heading row stays at the frame's top and the foot at its foot while the rows scroll inside it. In the page (`page-sticky-header`), the frame keeps no height of its own: while the page scrolls, the heading row stays at the top of what shows and the foot at the window's foot, until the table ends. The pinned form (`pin-first`) keeps the first column in view while a wide table scrolls sideways. Each heading that sticks or moves draws its own rules and surface, so they stay with it and nothing passing behind shows at its edges.
- The flat look draws the same parts with less around them. It has no frame and no rounded corner, no fill on the heading row and no hairlines between its headings, which are in the small body style. A subtle rule runs over every row, the heading row's included, and the table's first and last cells keep no room at the sides, so the table's words line up with the card's own. Each row is one line of the body text with a small inset above and below, and the heading row is as high as the others; a row grows only where a cell holds something taller than a line, such as a button or a value over its description.
- The filled look keeps the framed table's frame, its rows and their states, and marks its other parts with fills rather than lines. The heading row and the foot sit on a neutral fill, each with a subtle rule along it, and no hairlines separate the headings. A group row is sunken and one small control high, and a foot is at least that high, growing with what it holds. The room at a row's ends and between its columns is the same. A column not sorted shows its arrow only while the pointer is over its heading or the keyboard is on its sort button.

## When to use

- Lists of records with several attributes each, where the reader scans and compares.
- Anything the reader may want to sort or select in bulk.
- A few figures inside a card, such as what was sold this week and the total: give the table the flat look, so it reads as part of the card rather than a second card inside it.
- A table on the page whose heading should stay quiet, such as a dense list under group rows: give it the filled look, so fills mark the heading, the groups and the foot, and the rows carry the only lines.
- A row whose detail is about one of its values, such as a part's count of the models it fits: open the detail from that value, a button in its cell (`detailTrigger="cell"`), rather than from a caret at the row's start.
- A table longer than the screen, read down the page, such as every product in a catalog: give it the long form in the page (`page-sticky-header`), so the page keeps one scroll and the headings stay in view.
- A long table in a panel of a set height, such as one tile of a dashboard: give it the long form in a frame of its own (`sticky-header`) and limit the frame's height.
- A list of things to open, such as invoices, where a reader expects a press anywhere on a row to open one: give each row an `href`, or an `onClick` for something that opens in the page.
- A small card about a row, such as a person's or a ship's, that a press on the row opens beside it: hang a popover on the row's own button (`openerId`), so the row stays one Tab stop.
- A table whose rows change while the reader compares them, through a filter, pages, a search or tabs: give its columns widths, so they stay where they are.
- A few records compared side by side, each heading a column of its own with its name, its facts and its commands: give those columns a tall heading (`tallHeader`), so the head of each record sits above its figures.
- A table of many short values in a comfortable page, such as a long list of figures: give it `density="compact"`, so it sits tighter than the page around it.
- Cells of very different heights, such as a first column that wraps over a line and a button beside figures of one line: give the table `align-top`, so each figure stays level with the name it belongs to.

## When not to use

- Fewer than three columns. A [list](../list/list.md) will do.
- Content that needs room or pictures. Use [cards](../card/card.md). A column of short sentences is fine as a prose column.
- A narrow screen. Tables do not reflow; give the reader a list there.
- A press on the whole row, in a table people copy words out of. A press on a row's words presses the row, so the pointer cannot pick them; put a link on the row's name instead.
- A long or wide table in the flat look. The flat look takes none of the long and pinned forms; give such a table the framed or filled look.
- The compact table where a reader presses something in most rows on a touch screen. A press area stops at its own row, so a lower row gives a finger less to aim at.
- The long form in the page inside a part that scrolls sideways or clips what runs past it. The heading row follows the nearest part around the table that scrolls or clips, so there it follows that part rather than the page.

## Behavior

A row is at least one medium control high, and grows with what its cells hold: a value over its description keeps a medium inset above and below it, so its two lines never run up to the rules, and a prose cell's sentences grow the row line by line.

When one cell of a row is much taller than the others, the others sit in the middle of that height, a line or two below the name they belong to, and the eye has to match them up row by row. With `align-top` every cell starts at the top of its row and its first line stands where a one-line value's does, so the eye reads straight across. That holds for plain words, a value, a value over its description, a link or value that wraps and a block of the page's own, and a row's caret, pin and choose box and a value's copy button stay with the first line.

A row of one line looks the same either way, so the flag changes only the rows that are taller. Every look takes it, a held first column on a phone included. A prose column already lines its own row up at the top, and the flag does the same for a table with no column of sentences, without the prose measure. In the flat look a row is one line of text, so a tag, an avatar or a button, taller than that line, starts at the top of the row with its middle a little below the line. Markup written by hand takes the block's `align-top` modifier and needs no script.

Pressing a heading's filter button opens a list of choices that tick; ticking one leaves the list open, and the consumer filters the rows and passes the new count. Pressing the info button opens its explanation in a popover beside it; Escape, a press outside or moving focus away closes it. Pressing a row's caret opens or closes its detail row; the table keeps which rows are open, or the consumer does when it passes them in. With `detailTrigger="cell"` the table draws no caret: a button the consumer puts in one of the row's cells opens the detail, and the consumer holds which rows are open in `expanded`. Give that table an `id`; `tableDetailId(id, row.id)` is the id of each row's detail row, for the button's `aria-controls`. Pressing a sortable heading asks the consumer to sort by it; the sorted heading reads in the default text color, shows its direction with its arrow and announces it. The sort button and the copy button each give the pointer at least 24 by 24 px to press. Choosing rows is the consumer's to handle; the table draws the checkboxes and the chosen rows' fill and reports the presses. In a selectable table a row can be left out of the choosing (`selectable: false`): it has no checkbox and keeps the checkbox's room empty, so its first value lines up with the others, and the heading's checkbox speaks for the rows that can be chosen, ticked when every one of them is; pressing it asks the consumer to choose, or let go of, those rows only. A row also passes on any `data-` attribute given to it, such as `'data-task': '42'`, to its row element, for the page's own scripts, checks and links. A row can also be the current one (`current`), in a table with checkboxes or without. It is the one row that a button of the page's own in it acted on, such as the part fitted or the plan in use. It takes the chosen row's fill and darker descriptions, and its row element has `aria-current="true"` for screen readers. Use `selected` for the rows a reader chooses with the checkboxes, to act on them together, and `current` for the one row a button in it made current. A row can be both, and looks the same as either. Rows cannot be reordered: the table draws no drag handle, and `draggable` draws nothing. In the filled look (`look="filled"`), the arrow of a column not sorted is unseen until a reader goes to it: it shows while a pointer is over its heading and while the keyboard is on its sort button, and it keeps its room, so the heading does not move as it comes and goes. On a touch screen it shows once the column is sorted. The sort button itself never hides. The flat look (`look="flat"`) keeps every behavior here but the two forms for big tables: their sticking cells paint a surface of their own, which a card around the table would not match. Given `sticky-header` or `pin-first` with it, the table draws without them and warns in development. A table wider than its place scrolls sideways inside its frame, so no column is ever hidden; with the first column pinned, every row keeps its subject in view while it does. A long table given a lower frame scrolls inside it with its headings in view. Nothing animates.

A table wider than its frame scrolls sideways inside it, and a long table given a lower frame scrolls down inside it, with the system's scrollbar: a thin, see-through bar over its rows that takes no room and shows while the mouse is over it or it scrolls. While the bar is hidden it is not laid out at all, so a page that measures how far the frame runs past its width just after narrowing it gets the table's own width; while the bar shows, it follows the frame's new size a moment later. Where no scrollbar takes room (the system's, or the browser's on a phone or a trackpad), a thin bar along the frame's foot also shows that there is more to the side and how much of the table is in view, and follows the scroll; it holds the frame's visible edges, and in a long table its foot, just over the table's foot. It fades while the system's scrollbar shows, in the same strip, so there is never a second bar.

A column takes its width from what its rows hold, so when the rows change, the columns move. Give a column a `width` and the table keeps every column's width instead: filtering, paging, showing more rows, opening a row or swapping the rows for others moves no column, because the table no longer reads its rows to size them. A `width` is a share of the table (`share-` and the percent), a size token (its path, which starts `size-`) or `rest`, the room the other columns leave, which columns taking it share equally. A column given no `width` in such a table takes the rest too, and there is no way to give a number. Give one column `rest` and the others a width, and that column takes whatever the table has over.

What a cell holds then wraps inside its column and its row grows; a word too long for the column breaks; a heading too long for it takes a second line. A tag, a button and a picture keep their size, so a column holding one needs room for it. A prose column takes the width it is given, and its lines still stop at its widest measure.

A table with column widths narrows with its frame down to a least width, and past that its frame scrolls it sideways, as any table too wide for its frame does. So a column taking the rest keeps its room on a phone, and shares stay readable. `minWidth` on the table gives it another least width, as a size token, or `none`, for a small table that may narrow with its frame. The least width has to leave room for the column taking the rest beside the columns with a size token: when they fill it, that column has nothing left. A table that gives no column a width sizes itself from its rows, as it always has.

A column can be headed by a block rather than a line: give it `tallHeader`, and `header` holds a few lines and buttons, such as a value over its description and a row of buttons. Its heading grows to fit, the heading row is as high as the tallest heading in it, and the rule runs under that one. A column without `tallHeader` keeps its one line. The block's lines stack and wrap, and its column stays wide enough to read them while a table too wide for its frame narrows, so the frame scrolls sideways instead. A column with a `width` sets the block's width, so give it room for the block's buttons.

A block can hold buttons of its own, and a button cannot hold a button, so in a tall heading the block sits outside the sort button. The arrow alone sorts, after the block, or close before it in a column lined up at the end, with the filter and info buttons after it on the block's first line. The block's own buttons do not sort. In the filled look a tall heading's arrow stays in view, since it has no words to press.

In the long forms, what is scrolled into view lands clear of the heading, however high it stands, and the same goes for a long heading wrapping in a column with a width. A heading that would take more than half of what shows, the frame or in the page what scrolls it, would cover the rows it heads, so it stops holding: it stays at the table's top and scrolls away with the rows until there is room for it again. A pinned first column stays pinned, and the foot stays at the foot.

A row can be pressed as a whole, to open what it stands for, and is a plain row until a page says what the press does. Give it `href` and it holds a real link, so opening in a new tab, the link's menu and every other way of following a link work from anywhere on the row. Give it `onClick` and it holds a real button. Give it both, for a page that moves between its own pages, and the link calls `onClick`, which can stop the browser going there. A disabled row takes no press. A press on a control in the row, a checkbox, a caret, a link, a button or anything else that takes a press, does that control's job and never the row's, so the page's own handlers have nothing to stop. A disabled control keeps the press too and does nothing with it. A swipe over a row scrolls, as it does anywhere.

The row takes the hover fill as every row does, and the chosen row's fill while it is pressed. While what it opened is open, the page marks it `current`, which keeps that fill, with the pointer still resting on the row too, and tells screen readers, on the row and on its link or button. What opens over the page, such as a dialog, is named by the row's `aria-haspopup`.

A press on a row can open a popover with no opener of the page's own, since the row's own link or button can be that opener. Give the table an `id`, and give the popover `openerId`, the id of the row's link or button, which `tableRowPressId(id, row.id)` gives. Put the popover in one of the row's cells. The row's `onClick` turns the popover's `open` over, and the page marks the row `current` while it is open and gives the row `aria-haspopup="dialog"`. The row stays one Tab stop. Opening moves focus into the panel, Escape and the close button put it back on the row's own link or button, and another press on the row closes the panel. The panel hangs on the whole row, so it opens under the row's start. To hang it on the row's name, wrap the name in a `div` with an id and pass that as the popover's `hangOnId`: a `span` around a cell's value has only the first line's box, so the panel would cover the description. With the first column held, a press on the held cell does all this too, and focus never stays on the held cell's copy, which Tab and screen readers leave out.

It works beside everything else a row does. In a table with checkboxes, a press on the row opens it and only its checkbox chooses it, so a row can be open and chosen apart. A row with a detail keeps its caret, or the page's button in a cell, for the detail, and a press elsewhere on the row does the row's own job; the detail row is no part of the press. It works in every look and form. With the first column held (`pin-first`), the held cell takes the press too, and a control passing under it stays out of reach, as in every held table.

The filled look takes every form and behavior here. Its fills are see-through, so a table takes them on any surface; a heading or a foot that sticks or moves lays them over the page canvas, so the rows pass under it unseen, which suits a table on the canvas. Its foot grows with what it holds and wraps on a phone, so nothing in it runs past the frame, and it stays in place while a wide table scrolls sideways, its fill under the whole of what shows.

A table takes the density of the page it sits on. `density="compact"` makes one table compact in a comfortable page: it writes `data-density="compact"` on the frame, and everything inside the frame then takes the compact steps of the design tokens, exactly as it would on a compact page. The rows, the heading row and the foot step down together, as does what they hold: a pagination's buttons and select, a small button, the room at a tag's sides. A tag keeps its height, as it does at either density. Nothing outside the frame changes, and on a page that is compact already the option changes nothing. A row with a choose box and a caret at its start, or an avatar in a cell, stands a little taller than a plain one, as it does on a compact page.

What the table opens over the page keeps the table's density, wherever it shows, because it stays inside the frame in the page's structure: a heading's filter list, its info popover, and the list of the select in the foot. A control of the page's own in a cell or a detail row is compact too, and so is a dialog the page draws there; draw it outside the table to give it the page's density. The density is the page's to set, never a control for the reader.

Every look and form takes it. The sort, filter, info, caret and copy buttons keep their size and their focus rings. On a touch screen their press areas still stop at their own row, so they are as tall as the lower row, and never less than the least a press needs.

In the long form in a frame of its own, the table's foot stays at the frame's foot while the rows scroll under it, as the heading row stays at its top, and what the frame scrolls into view, such as a focused button, lands clear of both.

In the long form in the page, the frame never scrolls downwards, so every turn of the wheel and every swipe over the table moves the page. As the page scrolls, the heading row's real cells move down to stay just under the room the page keeps clear at the top of what scrolls it, and stop where the table ends; the foot, the scroll hint and the scrollbar's sideways bar move up to the foot of what shows, never above the heading row's own place. That room is the scroll padding at the top (`scroll-padding-top`) of what scrolls the table: the window, or the nearest part around the table that scrolls or clips what runs past it. The system's app bar that hides on scroll keeps its room there while it shows, and the heading rises into the room while the bar has slid away. The table still scrolls sideways inside its frame, its heading cells with their columns, and a pinned first column stays pinned. Where the browser can tie the move to the scroll itself, it moves them as it scrolls; elsewhere the table's script moves them on each scroll. What the page scrolls into view in the rows, such as a focused button, lands clear of the heading and the foot. Without the table's script, nothing moves and the table reads as a plain long one.

A reader can press the heading anywhere down a long table, and a browser that holds a scroll to a row on the screen would follow the row a sort moved. So in both long forms nothing in the frame anchors a scroll (`overflow-anchor: none`): a sort leaves the page, or the frame, where it is, and a site needs no rule of its own for it. The same goes for a row that opens or grows above what shows: the rows under it move down, and the scroll does not make up for it.

On a touch screen the sort, copy and caret buttons, the heading's filter and info buttons and a choose box keep their size and take an invisible press area round them, out to the comfortable touch target but never past their own row; side by side in a cell, they reach only halfway to each other. In a table with a pinned first column, what scrolls into view stops beside the pinned column, never under it.

## Accessibility
### What it does for you

- It is a real table with a caption, column headings with scope, and sort state on the sorted heading.
- The choose-all checkbox is named, shows a mixed state when some rows are chosen, and each row's checkbox is named after the row. A row that cannot be chosen has no checkbox, so nothing that does nothing is reached, and the choose-all checkbox counts only the rows that can be.
- The info button on a heading is a real button that Tab reaches, named for what it explains ("About Budget"); Enter, Space, a click or a tap opens its popover, and Escape returns focus to it.
- The filter button is named for its column and says how many filters apply ("Filter Stage, 2 applied"), so the count is heard, not only seen. Its list is a menu of items that tick, moved through with the arrow keys and ticked with Space, and Escape closes it and returns focus.
- In the filled look a sort button is always in the tab order with its name, whether or not its arrow shows, and the sorted heading says its direction. The arrow is decoration for the eye: the state is on the heading.
- A row's caret is a button named for its row ("Details for Brand refresh") that says whether the row is open and points at the detail row; a closed detail row is hidden, so it is out of the reading order. The detail row is named the same way, so it is heard as that row's detail.
- A group heading is a heading cell for the rows under it, each group a body of its own.
- A pinned row is told by its pin, which says "Pinned" to screen readers, not by its edge alone.
- A cell's bar is hidden from screen readers; the figure beside it is the value.
- A chosen row is told by its ticked checkbox, not by its fill alone.
- A tall heading's sort button is a real button named for its column ("Sort by Plan A"), and the sorted heading says its direction. The heading gives a screen reader the column's `label` in place of the whole block (`abbr`), for those that say a column's heading before each of its cells.
- The current row tells screen readers it is the current one (`aria-current="true"` on its row element), beside its fill.
- A row that can be pressed stays a plain table row, read cell by cell as any other, with no new keys to learn. What presses it is a real link or button, one Tab stop named for what it does and for its row ("Open invoice INV-2042"), with a focus ring round the whole row. It comes first in the row, or after the first cell's controls where that column is held.
- While a row that can be pressed is current, its link or button says so too (`aria-current="true"`), so it is heard where the focus is.
- A row that opens a popover stays one Tab stop. Focus moves into the panel as it opens, and Escape and the close button put it back on the row's own link or button, a press on a held cell included.
- In the long form in a frame of its own, the frame scrolls up and down, so it is a region named after the caption that Tab can reach, and the arrow keys scroll it.
- In the long form in the page, the heading row is the real one wherever it shows, so its sort buttons are read and pressed there, and a control focused in the rows lands clear of the heading and the foot. The frame never scrolls downwards, so it is a region and a Tab stop only while it scrolls sideways.
- In both long forms, a control focused in the rows lands clear of a heading taller than one line. A heading that would take more than half of what shows scrolls away with the rows, so it never hides the control the keyboard is on.
- In a compact table the sort, filter, info, caret and copy buttons are as tall as in any other table, and take the same focus ring.
- A table too wide for its frame scrolls sideways inside it; while it does, the frame is the same named region that Tab reaches. A frame with nothing to scroll takes no Tab.
- The scroll hint is decoration: hidden from assistive technology, and it takes no press; the table scrolls as it always does.
- On a touch screen the sort, copy and caret buttons, the heading's filter and info buttons and a choose box take an invisible press area out to the comfortable touch target, never past their own row.

### What you must do

- Give the table a caption.
- When some rows cannot be chosen, say why near the table or in the row, such as its state: the missing checkbox is not explained by itself.
- In markup written by hand, put an empty `smbk-table__choose-space` element where a row that cannot be chosen would have its checkbox.
- Say in words, from the page, why a row is highlighted: a highlighted row's tint says nothing to a screen reader.
- Say in words, in the current row, that it is the current one, such as "Fitted" or "Your plan". Not every screen reader announces the current mark on a table row, and the fill alone says nothing.
- In markup written by hand, give the current row the row's current modifier and `aria-current="true"`.
- When a button of your own in a cell opens a row's detail (`detailTrigger="cell"`), give it `aria-expanded`, `aria-controls` set to the detail row's id (`tableDetailId(id, row.id)`, with the table's `id`), and a name that says what it opens and for which row, its visible words included, such as "Brake pads fits 6 models".
- In markup written by hand, a table whose rows open from such a button has no lead part, and a closed detail row takes `hidden`.
- In markup written by hand, a table with column widths gives its table part the `columns-fixed` modifier, and holds a `colgroup` straight after its caption with one `col` per column, each the column part with its `width` modifier, such as `smbk-table__column--width-rest`. A least width is the table part's `min-width` modifier.
- In markup written by hand, a filled table's frame takes the look's modifier, `smbk-table--look-filled`, and its sorted heading the `smbk-table__header--active` modifier beside `aria-sort`: the modifier is what keeps that column's arrow showing. Nothing else in the markup changes.
- Give a column with `tallHeader` a `label`, the heading in words: it names the arrow, the filter and the info button, and without one they are named from the column's key. A page in another language gives the words of the sort button's name in `sortLabel`.
- Keep heading elements (`h1` to `h6`) out of a block: a table's heading cell cannot hold one. Give the line the text style it needs.
- In markup written by hand, a tall heading's header part takes the `tall` modifier, `smbk-table__header--tall`. Its `header-cell` part is a `div` holding the block, a `div` with the `header-block` part. A sort button in it holds the arrow alone and needs an `aria-label`, and the heading its `abbr`.
- In markup written by hand, a long table in a frame of its own has no script to measure a tall heading: set the frame's `scroll-padding-top` to the heading's height, so what scrolls into view lands clear of it.
- Give a row that can be pressed a `label`, which names its link or button, and pass `rowPressLabel` when the press does something other than open the row, such as "Edit invoice INV-2042". Without a label a screen reader hears the row's id.
- Show that rows can be pressed in more than the hover fill, which a touch screen does not have: say so near the table, or end each row with a caret.
- When a press on a row opens a popover, give the row `aria-haspopup="dialog"` and mark it `current` while the panel is open, which is how its link or button says so.
- In markup written by hand, give a row that can be pressed the row's `pressable` modifier, and as the first thing in its first cell an empty link or button with the `smbk-table__row-press` class and an `aria-label`. It needs no script. In a table with its first column held, that link or button goes first in the second cell, and the first cell takes a copy of it with `tabindex="-1"` and `aria-hidden="true"`, so the held cell takes the press too.
- In markup written by hand, a compact table's frame takes `data-density="compact"`. Nothing else in the markup changes.
- Give the page's own words for everything the table says by itself, such as the names of its checkboxes, carets, pins, filter, info and copy buttons, and of what a row's press does, which keep their English until you do; a page in another language can change them.

### How to test

- Tab through a heading: the sort, filter and info buttons each take focus with a focus ring, and Enter or Space presses them. In the filled look a sort button's arrow shows as it takes focus, and the heading does not move. Open a filter list, move with the arrow keys, tick with Space, and press Escape: the list closes and focus returns to the filter button.
- Tab to a row's caret, or to the button in a cell that opens its detail, and press Enter or Space: the detail row opens and the button says it is open.
- Press a row that can be pressed on its words, on its empty room and on a picture or a bar: it opens. Press its checkbox, its caret and a button in it: each does its own job, and the row does not open.
- Tab to a row that can be pressed: a ring runs round the whole row, no column moves, and Enter opens it. On a row with a link, open it in a new tab from anywhere on the row.
- On a row that opens a popover, press Enter: the panel opens and focus moves in. Press Escape: it closes, and the ring is back round the row. Press the row twice with the pointer: the second press closes the panel and it stays closed.
- With a screen reader, a row that can be pressed is read as a plain row, and its link or button by what it does and the row's name, and as current while what it opened is open.
- With a screen reader, the table is read with its caption and headings, the sorted heading with its direction, each row's checkbox by the row's name, and the filter button with its count.
- In a forced-color mode, where the fills are gone, the current row's words still say it is the current one.
- In a table wider than its frame or taller than its place, Tab reaches the frame by its name, and the arrow keys scroll it.
- In the long form in the page, scroll with the wheel over the table: the page moves every time, and the heading row stays in view. Tab through the rows' buttons: each shows clear of the heading and the foot. Press a sortable heading far down the table: the page stays where it is, as a frame of its own does in the other long form.
- In a table with a tall heading, Tab through the heading: the block's own buttons, then its arrow, each with a focus ring. In a long form, Tab on through the rows' buttons: each shows clear of the heading. Lower the frame or the window until the heading takes more than half of it: the heading scrolls away with the rows.
- On a touch screen, the small buttons take a press just outside their own edge.
- In a compact table on a comfortable page, Tab through its buttons: each takes the same focus ring as on any other table. Open a heading's filter list: it is as tight as the table, and a list opened from outside the table is not.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus through the heading's sort, filter, info and copy buttons, the row checkboxes and carets, a block's or a cell's own buttons, the link or button of a row that can be pressed, and the scrolling frame when it has something to scroll. |
| Enter or Space | On a button (sort, filter, info, caret, copy, a block's or a cell's own, a row's), presses it. |
| Enter | On the link of a row that can be pressed, follows it. |
| Space | On a checkbox, ticks or clears it. |
| Down Arrow or Up Arrow | In a filter list, moves to the next or previous item. |
| Space | On an item of a filter list, ticks it and leaves the list open. |
| Escape | Closes a filter list or the info popover and returns focus to its button. Closes a popover a row opened and returns focus to the row's own link or button. |
| Arrow keys | On the scrolling frame, scroll it. |

## Composition

Cells take a value, or an avatar, link, tag, badge, buttons, picture or a figure with a bar from the system. A tall heading's block takes the same, a value over its description and a row of buttons included. A heading's filter list takes dropdown items that tick; a detail row takes a title and text, or a small panel such as a short history or a form. The foot takes paginations. Sits in a page in the framed or filled look, or in a card in the flat look; do not put a table in a table, a detail row included.

## Usage rules

### Do

- Put the identifying column first.
- Keep a value to one line; put the rest in the description, and give sentences a prose column.
- Line figures up at the end of their column.
- Name each row with `label` when it has a caret, a detail or a checkbox, so their names say which row they act on.
- Open a row's detail from the value it is about, a button in that value's cell, and keep the caret for a detail about the whole row.
- Give a table longer than the screen the long form in the page, so its headings stay in view and the page keeps one scroll.
- Under a bar fixed at the top of the page, set the page's scroll padding at the top to the room the bar covers, so the heading row stays under the bar. The system's app bar that hides on scroll sets it for you.
- Pin the first column of a table wider than its place, on the page canvas.
- In markup written by hand, give a chosen row the row's selected modifier as well as ticking its checkbox.
- Mark the row a button in it acted on as current, and keep the chosen fill for rows ticked with their checkboxes.
- Mark a row that can be pressed as current while what it opened is open, so the reader sees where they came from.
- Hang a popover a row opens on the row's own link or button, and keep it in one of that row's cells, so Tab goes on through the panel from the row.
- Give a row an `href` when its press goes to an address, so it stays a real link that opens in a new tab.
- Give a small table inside a card the flat look, so its words line up with the card's other lines.
- Keep a filled table that sticks or holds a column on the page canvas, the floor its heading and foot are laid over.
- Give the columns of a table whose rows change a width each, and let the column that names the row take the rest.
- Give a table with column widths a least width that holds its columns on a phone, or `none` when it fits its frame anyway.
- Keep a tall heading to a few lines in a long table, so it stays in view while the rows scroll under it.
- Set a table's own density with `density`, on the table, and leave the rest of the page to the page's.
- Give a table `align-top` when its cells differ a lot in height, so each first line stands level with the name beside it.
- In a table with `align-top`, put a control, a tag or a picture in `TableContent`, which centers it on the first line.

### Don't

- Sort on the client for more rows than fit in memory.
- Use the row hover as the only sign of interactivity.
- Let a highlight carry meaning by its tint alone.
- Tell the chosen rows from the current row by their fill. Both take the same fill, so the checkboxes and the current row's words tell them apart.
- Put a long explanation in a heading's info: it is for a sentence or two.
- Open one detail from two controls, a caret and a button in a cell: choose one, and give the table `detailTrigger="cell"` for the button.
- Open a row's detail with a press on the whole row. The row's button cannot say whether the detail is open: use the caret, or a button in a cell.
- Put a button in a row that does what a press on the row does. It is a second Tab stop saying the same thing.
- Put a framed table inside a small card: its frame reads as a second card, and its words sit in from the card's own.
- Measure the rows to work out a column's width. The widths then follow the rows, which is what a set width is for stopping.
- Give a column less room than a tag, a button or a picture in it takes. Words wrap, those do not, and they run over the next column.
- Rely on an arrow to tell a reader a filled table's heading sorts: it stays unseen until they go to it, and on a touch screen until they press. Where sorting matters, say so near the table or sort a column from the start.
- Let a pinned first column take the rest in a table that scrolls sideways on a phone. Held at that width, it leaves the other columns little room to pass: give it a share or a size token.
- Put long sentences in a tall heading. It is the head of a column, and the rows carry the detail.
- Put `data-density` on a part of a page other than a table's frame. A table is the one part that takes a density of its own.
- Give a long table in the page a frame of its own lower than the window. Two scrolls on one page take the wheel from the page wherever the pointer is over the table.

## Related

- [Pagination](../pagination/pagination.md): the foot's two types.
- [Checkbox](../checkbox/checkbox.md): the subtle variant, in the rows and in the header.
- [Button](../button/button.md), [Dropdown](../dropdown/dropdown.md) and [Popover](../popover/popover.md): the heading's filter and info buttons, the filter's list and the info's panel. A row's own button can open a popover too.
- [Progress](../progress/progress.md): the track and fill of a cell's bar.
- [Card](../card/card.md): for records that need room.
- [List](../list/list.md): rows that are links or buttons, for records with one or two attributes.
