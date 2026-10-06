/**
 * The variant helper.
 *
 * A component declares its variant axes once, in a manifest. This helper turns
 * that manifest into a class-name function AND keeps the manifest attached to
 * it, so the React wrapper, the Showroom's configuration panel, the generated
 * snippets and the documentation all read the same declaration at runtime.
 *
 * Class names are derived, never written twice (docs/naming.md):
 *   block                     smbk-btn
 *   block__part               smbk-btn__icon
 *   block--axis-value         smbk-btn--size-lg
 *   block--flag               smbk-btn--loading
 */

export interface VariantAxis<V extends string = string> {
  /** Allowed values, in the order the Showroom should offer them. */
  values: readonly V[];
  /** The value used when the prop is omitted. Must be one of `values`. */
  default: V;
  /** One line for the Showroom's configuration panel. */
  description?: string;
}

export interface VariantFlag {
  description?: string;
}

export interface VariantManifest<
  Axes extends Record<string, VariantAxis> = Record<string, VariantAxis>,
  Flags extends Record<string, VariantFlag> = Record<string, VariantFlag>,
  Parts extends readonly string[] = readonly string[],
> {
  /** The component's directory name. */
  name: string;
  /** The block class, e.g. "smbk-btn". Public API: renaming it is a breaking change. */
  block: string;
  /** One sentence for the Showroom's sidebar and search. */
  summary: string;
  /** How desktop and mobile differ: presentation only (css) or two implementations (js). */
  adapt: 'css' | 'js';
  /** Each axis of appearance or composition, with its allowed values. */
  axes: Axes;
  /** Boolean modifiers that are on or off, e.g. loading, selected. */
  flags: Flags;
  /** The element parts, e.g. ["icon", "label"]. Each becomes block__part. */
  parts: Parts;
  /** The Figma node this component is read from, or blank until mapped. */
  figmaNodeId: string;
}

export type AxisValues<M extends VariantManifest> = {
  [K in keyof M['axes']]?: M['axes'][K]['values'][number];
};
export type FlagValues<M extends VariantManifest> = {
  [K in keyof M['flags']]?: boolean;
};
export type VariantProps<M extends VariantManifest> = AxisValues<M> & FlagValues<M>;

export interface VariantFunction<M extends VariantManifest> {
  (props?: VariantProps<M>): string;
  /** The declaration this function was built from. Read by the Showroom and the snippet generator. */
  manifest: M;
  /** block__part for a named part. Throws on an unknown part, so a typo cannot ship. */
  part(name: M['parts'][number]): string;
  /** The modifier class for one axis value, without the block. */
  modifier<K extends keyof M['axes'] & string>(axis: K, value: M['axes'][K]['values'][number]): string;
  /** The modifier class for one flag. */
  flag(name: keyof M['flags'] & string): string;
}

const BLOCK = /^smbk-[a-z0-9]+(-[a-z0-9]+)*$/;
const NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function defineVariants<
  const Axes extends Record<string, VariantAxis>,
  const Flags extends Record<string, VariantFlag>,
  const Parts extends readonly string[],
>(manifest: VariantManifest<Axes, Flags, Parts>): VariantFunction<VariantManifest<Axes, Flags, Parts>> {
  type M = VariantManifest<Axes, Flags, Parts>;
  validateManifest(manifest);

  const modifier = (axis: string, value: string) => `${manifest.block}--${axis}-${value}`;
  const flagClass = (name: string) => `${manifest.block}--${name}`;

  const fn = ((props: VariantProps<M> = {}) => {
    const classes = [manifest.block];
    for (const [axis, def] of Object.entries(manifest.axes)) {
      const given = (props as Record<string, unknown>)[axis];
      const value = given === undefined ? def.default : String(given);
      if (!def.values.includes(value)) {
        throw new Error(`${manifest.block}: "${value}" is not a value of axis "${axis}" (allowed: ${def.values.join(', ')}).`);
      }
      classes.push(modifier(axis, value));
    }
    for (const name of Object.keys(manifest.flags)) {
      if ((props as Record<string, unknown>)[name] === true) classes.push(flagClass(name));
    }
    for (const key of Object.keys(props)) {
      if (!(key in manifest.axes) && !(key in manifest.flags)) {
        throw new Error(`${manifest.block}: "${key}" is neither an axis nor a flag.`);
      }
    }
    return classes.join(' ');
  }) as VariantFunction<M>;

  fn.manifest = manifest;
  fn.part = (name) => {
    if (!manifest.parts.includes(name)) throw new Error(`${manifest.block}: "${name}" is not a declared part.`);
    return `${manifest.block}__${name}`;
  };
  fn.modifier = (axis, value) => modifier(axis, value as string);
  fn.flag = (name) => flagClass(name);
  return fn;
}

function validateManifest(m: VariantManifest): void {
  if (!BLOCK.test(m.block)) throw new Error(`Block class "${m.block}" must be smbk- followed by lowercase words joined with hyphens.`);
  if (!NAME.test(m.name)) throw new Error(`Component name "${m.name}" must be lowercase words joined with hyphens.`);
  if (m.adapt !== 'css' && m.adapt !== 'js') throw new Error(`${m.block}: adapt must be "css" or "js".`);
  for (const [axis, def] of Object.entries(m.axes)) {
    if (!NAME.test(axis)) throw new Error(`${m.block}: axis "${axis}" must be lowercase words joined with hyphens.`);
    if (def.values.length === 0) throw new Error(`${m.block}: axis "${axis}" has no values.`);
    for (const v of def.values) if (!NAME.test(v)) throw new Error(`${m.block}: value "${v}" of axis "${axis}" must be lowercase words joined with hyphens.`);
    if (!def.values.includes(def.default)) throw new Error(`${m.block}: axis "${axis}" defaults to "${def.default}", which is not one of its values.`);
    if (axis in m.flags) throw new Error(`${m.block}: "${axis}" is both an axis and a flag.`);
  }
  for (const flag of Object.keys(m.flags)) if (!NAME.test(flag)) throw new Error(`${m.block}: flag "${flag}" must be lowercase words joined with hyphens.`);
  for (const part of m.parts) if (!NAME.test(part)) throw new Error(`${m.block}: part "${part}" must be lowercase words joined with hyphens.`);
}

/** Every combination of axis values, for the render harness and the Showroom. */
export function allCombinations<M extends VariantManifest>(manifest: M): AxisValues<M>[] {
  let combos: Record<string, string>[] = [{}];
  for (const [axis, def] of Object.entries(manifest.axes)) {
    combos = combos.flatMap((c) => def.values.map((v) => ({ ...c, [axis]: v })));
  }
  return combos as AxisValues<M>[];
}
