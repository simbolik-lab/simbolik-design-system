import { defineVariants } from '../variants.js';

/**
 * Toolbar. Figma "Toolbar" 7343:1575: Placement (Floating, Docked), with three zone sets nested in it, ToolbarContext
 * 7339:1264 (what the bar acts on), ToolbarTools 7341:1454 (one group of tools) and ToolbarActions 7342:1452 (the
 * overflow menu and the main action), each turned on or off, a second tools place, and a row of details under it.
 * The zones' Types (Title, Breadcrumb, Selection, Commands, Formatting, View, Primary, Run…) are content built from
 * the system's own components, not classes: this block lays the zones out, draws the bar and its dividers, and gives
 * the few words of its own (a title, a line of status, a quieter note) their type. Wide and narrow are the layout
 * switch, not an axis: a part marked wide-only goes in a narrow space, and one marked narrow-only comes.
 */
export const toolbar = defineVariants({
  name: 'toolbar',
  block: 'smbk-toolbar',
  summary: 'A labelled bar of related tools for a view, a selection or an editor: what it acts on, groups of tools, and its main action, moved through with the arrow keys as one Tab stop.',
  adapt: 'css',
  axes: {
    placement: {
      values: ['floating', 'docked'],
      default: 'floating',
      description: 'Floating: a raised bar as wide as its tools, with its rim, rounded corners and shadow, over a page, a map or a text selection. Docked: flat across the top of a panel, a line under it, the actions pushed to its end. Where it sticks (the top, the foot of the window) is the page’s to set. Figma: Placement.',
    },
  },
  flags: {},
  parts: ['row', 'context', 'tools', 'actions', 'divider', 'icon', 'title', 'value', 'text', 'meta', 'status', 'field', 'details', 'wide-only', 'narrow-only'],
  figmaNodeId: '7343:1575',
});
