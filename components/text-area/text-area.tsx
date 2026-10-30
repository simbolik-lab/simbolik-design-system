'use client';

import type { Ref, TextareaHTMLAttributes } from 'react';
import { useObjectRef } from 'react-aria';
import { textArea } from './text-area.manifest.js';
import { input } from '../input/input.manifest.js';
import { Icon } from '../icon/icon.js';
import { InputWell } from '../input/input-well.js';
import { readsField, useFieldControl } from '../field/field-context.js';
import { useScrollbar } from '../scrollbar.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textArea.manifest> {
  /** Extra classes for the well, not the control. */
  className?: string;
  /** Reaches the native textarea, e.g. to focus it. */
  ref?: Ref<HTMLTextAreaElement>;
}

/**
 * Text area: the input's well around a native textarea. The well carries the
 * chrome; the textarea carries the value and the attributes. Two rows tall
 * unless `rows` says otherwise, which is the height Figma draws.
 */
export function TextArea(props: TextAreaProps) {
  const { error, className, rows = 2, ref, ...rest } = useFieldControl(props);
  const control = useObjectRef(ref);
  const bar = useScrollbar(control, { over: true });
  return (
    <InputWell className={cx(textArea({ error }), className)} error={error} nameCheck="TextArea" end={<Icon name="Notches" className={textArea.part('grip')} />}>
      <textarea ref={control} className={`${input.part('control')} ${textArea.part('control')}`} rows={rows} aria-invalid={error ? true : undefined} {...bar} {...rest} />
    </InputWell>
  );
}
readsField(TextArea);
