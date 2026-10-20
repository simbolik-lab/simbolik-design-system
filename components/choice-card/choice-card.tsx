import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import { choiceCard } from './choice-card.manifest.js';
import { radio } from '../radio/radio.manifest.js';
import { checkbox } from '../checkbox/checkbox.manifest.js';
import { Icon } from '../icon/icon.js';
import { ChoiceLabel, useChoice } from '../choice.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface ChoiceCardProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'children'>, VariantProps<typeof choiceCard.manifest> {
  /** The choice's name, the card's title. */
  children: ReactNode;
  /** A line under the title that says more about the choice. It is read after the choice's name, not as part of it. */
  description?: ReactNode;
  className?: string;
  /** Reaches the native input, e.g. to focus it. */
  ref?: Ref<HTMLInputElement>;
}

/**
 * Choice card: the whole card is the label of one native radio or checkbox, so a press anywhere on it picks it,
 * Space picks it from the keyboard, and radios in one group take one Tab stop with the arrow keys moving the
 * choice. The input is named by the title and described by the line. Inside a field group it takes the group's
 * name, error and required state, and, as a radio, the group's chosen value (the choice row, `../choice.tsx`).
 */
export function ChoiceCard({ mark = 'radio', error, description, className, children, ref, ...rest }: ChoiceCardProps) {
  const isRadio = mark === 'radio';
  const choice = useChoice({ type: isRadio ? 'radio' : 'checkbox', ids: 'choice', error, description, stacked: true, ref, props: rest });
  const markClasses = isRadio ? radio({ error: choice.invalid }) : checkbox({ error: choice.invalid });
  return (
    <label className={cx(choiceCard({ mark, error: choice.invalid }), markClasses, className)}>
      <input type={isRadio ? 'radio' : 'checkbox'} className={isRadio ? radio.part('control') : checkbox.part('control')} {...choice.input} />
      {isRadio ? (
        <span className={radio.part('circle')} aria-hidden="true">
          <span className={radio.part('dot')} />
        </span>
      ) : (
        <span className={checkbox.part('box')} aria-hidden="true">
          <Icon name="Check" className={checkbox.part('icon')} />
          <Icon name="Minus" className={checkbox.part('mixed-icon')} />
        </span>
      )}
      <ChoiceLabel choice={choice} part={choiceCard.part}>{children}</ChoiceLabel>
    </label>
  );
}
