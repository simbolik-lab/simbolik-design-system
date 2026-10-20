import type { ReactNode } from 'react';
import { Accordion } from './accordion/accordion.js';
import { Table } from './table/table.js';

export interface ChartDataProps {
  /** The chart's parts: `table`, kept out of sight for screen readers, and `data`, the disclosure when shown. */
  part: (name: 'table' | 'data') => string;
  /** What the values are: the table's caption, which a screen reader hears. */
  caption: string;
  /** The column headings: what each row is, then each value. */
  columns: readonly string[];
  /** A row per item: its name, then its values as the page reads them. */
  rows: readonly (readonly ReactNode[])[];
  /** Under the chart in a disclosure, closed, titled `title`, rather than out of sight. */
  shown?: boolean;
  /** The disclosure's title, such as "Data". */
  title: string;
}

/**
 * A chart's values as a table: every value the chart draws, in words, so no value rests on the picture. Out of
 * sight for screen readers, or the system's table inside a closed disclosure under the chart.
 */
export function ChartData({ part, caption, columns, rows, shown, title }: ChartDataProps) {
  if (shown) {
    const cols = columns.map((header, i) => ({ key: String(i), header }));
    const body = rows.map((row, r) => ({ id: String(r), cells: Object.fromEntries(row.map((cell, i) => [String(i), cell])) }));
    return <Accordion className={part('data')} look="flat" items={[{ title, children: <Table caption={caption} columns={cols} rows={body} /> }]} />;
  }
  return (
    <table className={part('table')}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          {columns.map((c, i) => (
            <th key={i} scope="col">{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, r) => (
          <tr key={r}>
            {row.map((cell, i) => (i === 0 ? <th key={i} scope="row">{cell}</th> : <td key={i}>{cell}</td>))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
