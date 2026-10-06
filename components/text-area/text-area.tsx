import type { Ref, TextareaHTMLAttributes } from 'react';
import { textArea } from './text-area.manifest.js';
import { input } from '../input/input.manifest.js';
import { Icon } from '../icon/icon.js';
import type { VariantProps } from '../variants.js';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textArea.manifest> {
  /** Extra classes for the well, not the control. */
  className?: string;
  /** Reaches the native textarea, e.g. to focus it. */
  ref?: Ref<HTMLTextAreaElement>;
}

/**
 * Text area: the input's well around a native textarea. The well carries the
 * chrome; the textarea carries the value and the attributes. Three rows tall
 * unless `rows` says otherwise, which is the height Figma draws.
 */
export function TextArea({ error, className, rows = 3, ref, ...rest }: TextAreaProps) {
  const classes = [input({ error }), textArea({ error }), className].filter(Boolean).join(' ');
  return (
    <span className={classes}>
      <textarea ref={ref} className={`${input.part('control')} ${textArea.part('control')}`} rows={rows} aria-invalid={error ? true : undefined} {...rest} />
      <Icon name="Notches" className={textArea.part('grip')} />
    </span>
  );
}
