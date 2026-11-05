import { defineVariants } from '../variants.js';

/**
 * Tag. Figma "Tag" 4088:12242: Tone × State, 14 variants; icon and remove control are content, the State shows the
 * remove button's focus. The pressable flag and the leading content (a picture of the page's own) are the code's.
 */
export const tag = defineVariants({
  name: 'tag',
  block: 'smbk-tag',
  summary: 'A small label naming a category, with an optional leading icon or picture and remove control; pressable, it opens something about what it names.',
  adapt: 'css',
  axes: {
    tone: {
      values: ['default', 'brand', 'outline', 'info', 'success', 'danger', 'warning'],
      default: 'default',
      description: 'A see-through gray that shows on every surface, brand, outlined, or one of the four feedback families on their subtle surfaces.',
    },
  },
  flags: {
    pressable: { description: "The tag is a button that opens something about what it names, such as a card, with the hover, pressed and focus looks in the tag's own shape. The wrapper sets it when given onClick, as a popover's opener is; plain markup sets it on a button." },
  },
  parts: ['icon', 'leading-content', 'label', 'remove'],
  figmaNodeId: '4088:12242',
});
