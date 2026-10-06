import { Fragment, type HTMLAttributes, type ReactNode } from 'react';
import { accordion } from './accordion.manifest.js';
import { Icon } from '../icon/icon.js';
import { Divider } from '../divider/divider.js';
import type { VariantProps } from '../variants.js';

export interface AccordionItemProps {
  title: ReactNode;
  children: ReactNode;
  open?: boolean;
  disabled?: boolean;
  /** Give items in one group the same name so only one stays open. */
  name?: string;
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof accordion.manifest> {
  items: AccordionItemProps[];
}

/**
 * Accordion: native disclosures. The flat look ends each item with the divider
 * component, as Figma's flat item does; it sits after the disclosure rather
 * than inside it, where a closed item would hide it with its content.
 */
export function Accordion({ look, items, className, ...rest }: AccordionProps) {
  return (
    <div className={[accordion({ look }), className].filter(Boolean).join(' ')} {...rest}>
      {items.map((item, i) => (
        <Fragment key={i}>
          <details
            className={[accordion.part('item'), item.disabled ? `${accordion.part('item')}--disabled` : ''].filter(Boolean).join(' ')}
            open={item.open}
            name={item.name}
          >
            <summary className={accordion.part('summary')} aria-disabled={item.disabled ? true : undefined} tabIndex={item.disabled ? -1 : undefined}>
              <span className={accordion.part('title')}>{item.title}</span>
              <Icon name="CaretDown" className={accordion.part('caret')} />
            </summary>
            <div className={accordion.part('content')}>{item.children}</div>
          </details>
          {look === 'flat' && <Divider className={accordion.part('divider')} aria-hidden="true" />}
        </Fragment>
      ))}
    </div>
  );
}
