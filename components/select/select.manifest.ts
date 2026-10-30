import { defineVariants } from '../variants.js';

/** Select. Figma "Select" 4253:2857 (State: Closed, Open, Hover, Focus, Disabled, Error, Filled, Read-only × Size: md, sm): the input well with a caret, and the dropdown panel with its items at the same size when open. Options can sit under group headings (Figma's DropdownHeading 8265:3201, the dropdown's label) and carry an avatar or an icon and a second line (Figma's "RichOption" 8204:3194). */
export const select = defineVariants({
  name: 'select',
  block: 'smbk-select',
  summary: 'A choice from a list: the input well with a caret, opening the dropdown panel with one item per choice, in groups under a heading if wanted, each choice with a picture or an icon and a second line if wanted.',
  adapt: 'css',
  axes: {
    size: {
      values: ['md', 'sm'],
      default: 'md',
      description: 'The input’s two heights, with the dropdown’s items at the same size when open. Small text never goes under 16 px on a phone.',
    },
  },
  flags: {
    error: { description: 'The choice is invalid. Draws the danger border, kept while focused, and the error icon before the caret.' },
    open: { description: 'The list is showing. Set by the component while it is open; given to the wrapper, it holds the list open, as in a picture of the page.' },
  },
  parts: ['well', 'value', 'icon', 'list', 'group', 'option', 'option-lead', 'option-text', 'option-label', 'option-description', 'check'],
  figmaNodeId: '4253:2857',
});
