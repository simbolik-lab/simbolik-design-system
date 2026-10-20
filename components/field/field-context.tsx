import { createContext, useContext, type ReactNode } from 'react';

/**
 * What a field tells the control it holds, so the control is named, described and marked by the field wherever it
 * sits under it, even inside a site's own component around it: the control's id, the label's id, the ids of the
 * lines under it, and whether it is in error, required, disabled or read-only. The system's form controls read it
 * with `useFieldControl`; a control that does not read it is handed the same props by the field instead.
 */
export interface FieldControlValue {
  /** The control's id: its own, given on the field's child, or one the field makes. The label points at it. */
  id: string;
  /** The label's id, which names the control unless it names itself. */
  labelId: string;
  /** The ids of the field's help or error line and its warning, when it has them. */
  describedBy?: string;
  error: boolean;
  required: boolean;
  disabled: boolean;
  readOnly: boolean;
}

/** The props a field hands its control. Every system form control takes them. */
export interface FieldControlProps {
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

const FieldContext = createContext<FieldControlValue | null>(null);

/**
 * The control's props with the field's laid over them, by the one rule: the field's id; the label's name unless the
 * control names itself (its own aria-labelledby or aria-label); the control's own description first, then the
 * field's lines, each id once; and error, required, disabled and read-only on when the field says so, the control's
 * own otherwise. A key the control's props lack is added after its own, so the attributes come out in one order
 * however the props arrived. Applied twice it gives the same props, so a site's component that passes the field's
 * props on to a system control, which reads the field too, gives that control nothing twice.
 */
export function withField<P extends FieldControlProps>(own: P, field: FieldControlValue): P {
  const describedBy = [...new Set([own['aria-describedby'], field.describedBy].join(' ').split(' ').filter(Boolean))].join(' ') || undefined;
  return {
    ...own,
    id: field.id,
    'aria-labelledby': own['aria-labelledby'] ?? (own['aria-label'] ? undefined : field.labelId),
    'aria-describedby': describedBy,
    ...(field.error ? { error: true } : {}),
    ...(field.required ? { required: true } : {}),
    ...(field.disabled ? { disabled: true } : {}),
    ...(field.readOnly ? { readOnly: true } : {}),
  };
}

/**
 * A form control's props as the field around it, if any, completes them (`withField`). Each system form control
 * calls it first, so it needs no props from the field: a site's own component around it, which passes nothing
 * on, still leaves it named, described and marked. Outside a field the props come back as they are.
 */
export function useFieldControl<P extends FieldControlProps>(props: P): P {
  const field = useContext(FieldContext);
  return field ? withField(props, field) : props;
}

/** The components that read the field themselves, which the field hands nothing by props. */
const readers = new WeakSet<object>();

/** Marks a form control as one that calls `useFieldControl`, so a field holding it passes it nothing by cloning it. */
export function readsField<C extends object>(control: C): C {
  readers.add(control);
  return control;
}

/** Whether an element's type is a control that reads the field itself. */
export function isFieldReader(type: unknown): boolean {
  return (typeof type === 'function' || (typeof type === 'object' && type !== null)) && readers.has(type);
}

/** The field's word to the controls under it. Only the field gives it. */
export function FieldProvider({ value, children }: { value: FieldControlValue; children: ReactNode }) {
  return <FieldContext.Provider value={value}>{children}</FieldContext.Provider>;
}

/**
 * Ends the field's reach: the controls inside are not the field's control, such as a slider's number box, the colour
 * picker's code field, or anything in an input's own slots. Every component that draws a form control for its own
 * use puts it inside, so a field around that component never names, describes or marks the inner control.
 */
export function OutsideField({ children }: { children: ReactNode }) {
  return <FieldContext.Provider value={null}>{children}</FieldContext.Provider>;
}
