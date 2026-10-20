import { defineVariants } from '../variants.js';

/**
 * Page header. Figma "Page header" 7115:869 (Composition × Layout × State, 12 variants). Figma's Layout is the layout
 * switch, not an axis. Its Composition is what the header is given: the wrapper sets it, object when it
 * has a status or a line of facts, tabbed when it has tabs.
 */
export const pageHeader = defineVariants({
  name: 'page-header',
  block: 'smbk-page-header',
  summary: 'The top of one page or one object: the breadcrumbs, the page’s one main heading, a short introduction, its status, and the few actions for the whole page.',
  adapt: 'css',
  axes: {
    composition: {
      values: ['simple', 'object', 'tabbed'],
      default: 'simple',
      description: 'Simple is a title, an introduction and actions. Object adds a status beside the title and a line of facts, for the page of one thing. Tabbed ends with tabs that switch the page’s views. The wrapper sets it from what it is given.',
    },
  },
  flags: {
    loading: { description: 'The page is still loading: the words are skeleton lines of their own height, the actions are drawn disabled, and the tabs are skeletons that cannot be pressed.' },
  },
  parts: ['breadcrumbs', 'main', 'body', 'title-row', 'title', 'status', 'description', 'meta', 'actions', 'action', 'more', 'tabs', 'tabs-cue', 'tabs-skeleton', 'hidden'],
  figmaNodeId: '7115:869',
});
