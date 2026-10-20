import { cloneElement, useId, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { buttonNote } from './button-note.manifest.js';
import { Icon } from '../icon/icon.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface ButtonNoteProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, VariantProps<typeof buttonNote.manifest> {
  /** The words: what pressing the button will do, or why it cannot be pressed now. */
  note: ReactNode;
  /** An info icon before the words. */
  infoIcon?: boolean;
  /** The one Button the note belongs to. */
  children: ReactElement;
}

/**
 * Button note: a Button and its note. The note is the button's description, read after its name, so the wrapper
 * links them (aria-describedby). A disabled button would drop out of the tab order and take its reason with it, so
 * the wrapper turns `disabled` into `aria-disabled`: the button stays focusable, presses still do nothing, and the
 * reason is read when it is reached.
 */
export function ButtonNote({ layout, note, infoIcon, className, children, ...rest }: ButtonNoteProps) {
  const noteId = `${useId()}-note`;
  const own = children.props as { disabled?: boolean; 'aria-describedby'?: string };
  const button = cloneElement(children as ReactElement<Record<string, unknown>>, {
    'aria-describedby': [own['aria-describedby'], noteId].filter(Boolean).join(' '),
    ...(own.disabled ? { disabled: undefined, 'aria-disabled': true } : {}),
  });
  return (
    <div className={cx(buttonNote({ layout }), className)} {...rest}>
      {button}
      <p id={noteId} className={buttonNote.part('note')}>
        {infoIcon && <Icon name="Info" className={buttonNote.part('icon')} />}
        <span className={buttonNote.part('text')}>{note}</span>
      </p>
    </div>
  );
}
