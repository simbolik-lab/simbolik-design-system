import { createContext, useContext } from 'react';

/**
 * What a field group tells the radios, checkboxes and choice cards inside it, so the page writes each once on
 * the group: the shared name, the error, whether a choice is required, the class that gives a radio or a
 * checkbox the group's option row, and the radios' chosen value when the group holds it.
 */
export interface FieldGroupValue {
  /** The radios' shared name: the page's, or one the group makes, so arrow keys move between them. */
  name: string;
  /** The page's own name, which checkboxes take only when it is given. */
  givenName?: string;
  error: boolean;
  required: boolean;
  optionClass: string;
  /** The chosen radio's value while the group holds it (`null`: none chosen); undefined while the radios hold their own. */
  value?: string | null;
  /** Tells the group a radio was chosen; there when the group holds the value or the page listens for it. */
  choose?(value: string): void;
}

export const FieldGroupContext = createContext<FieldGroupValue | null>(null);

/** The field group a control sits in, or null outside one. */
export function useFieldGroup(): FieldGroupValue | null {
  return useContext(FieldGroupContext);
}
