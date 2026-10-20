import { defineVariants } from '../variants.js';

/**
 * Field. Figma "Field" 4800:63897: State (Default, Error, Disabled, Read-only) × Layout (Stacked, Side by side), with a
 * Description boolean and a slot that holds the control: an input, a select or a text area. The line under the control
 * is Figma's Field message; the field draws it with the field message's classes beside its own.
 */
export const field = defineVariants({
  name: 'field',
  block: 'smbk-field',
  summary: 'The frame around one form control: its label with an optional required mark, and help text or an error message under the control.',
  adapt: 'css',
  axes: {
    layout: {
      values: ['stacked', 'side-by-side'],
      default: 'stacked',
      description: 'Stacked puts the label above the control. Side by side puts it on the left of a small control, for settings; in a narrow space the field stacks.',
    },
  },
  flags: {
    error: { description: 'The value is invalid. The label and the message under the control turn the danger color, the message leads with an icon, and the control draws its danger border and icon.' },
    disabled: { description: 'The control is disabled. The label, its mark and the help text take the disabled color.' },
    readonly: { description: 'The control can be read and copied, not changed. It keeps its place in the tab order.' },
  },
  parts: ['label', 'description', 'warning'],
  figmaNodeId: '4800:63897',
});
