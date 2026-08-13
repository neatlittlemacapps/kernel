// Table - a real semantic <table> shell: the first tabular-data primitive in Kernel
// (previously only FieldList's <dl>, a clinical key/value list, existed). Base UI
// ships no table primitive, so this is a hand-rolled leaf on tokens - plain semantic
// elements + slot components, the same shape as Card's Header/Body/Footer parts.
// Structure modelled on shadcn/ui's Table (Table/Header/Body/Footer/Row/Head/Cell/
// Caption compound API) - not its CSS, which is Tailwind; this is styled entirely in
// Kernel token CSS, borderless by default so a consumer (a usage ledger, a
// comparison list) adds rules only where it actually wants them.
//
// Classes are `krnl-tbl*`, NOT `krnl-table*` - `.krnl-table` is an existing,
// unrelated hand-rolled `<table className="krnl-table">` convention already
// consumed by greenhouse (medication-scheme.jsx, Juglans.jsx, clinical/chunks.jsx),
// with its own full-grid-border CSS. Reusing that class name here silently pulled in
// that heavier look on discovery; `krnl-tbl*` avoids the collision entirely rather
// than trying to reconcile two different visual contracts under one class.
const React = window.React;

export function Table({ className = '', children, ...rest }) {
  return (
    <div className="krnl-tbl-wrap">
      <table className={`krnl-tbl ${className}`.trim()} {...rest}>{children}</table>
    </div>
  );
}

Table.Caption = function TableCaption({ className = '', children, ...rest }) {
  return <caption className={`krnl-tbl-caption ${className}`.trim()} {...rest}>{children}</caption>;
};

Table.Header = function TableHeader({ className = '', children, ...rest }) {
  return <thead className={`krnl-tbl-header ${className}`.trim()} {...rest}>{children}</thead>;
};

Table.Body = function TableBody({ className = '', children, ...rest }) {
  return <tbody className={`krnl-tbl-body ${className}`.trim()} {...rest}>{children}</tbody>;
};

Table.Footer = function TableFooter({ className = '', children, ...rest }) {
  return <tfoot className={`krnl-tbl-footer ${className}`.trim()} {...rest}>{children}</tfoot>;
};

Table.Row = function TableRow({ className = '', children, ...rest }) {
  return <tr className={`krnl-tbl-row ${className}`.trim()} {...rest}>{children}</tr>;
};

Table.Head = function TableHead({ numeric, className = '', children, ...rest }) {
  return (
    <th scope="col" data-numeric={numeric || undefined} className={`krnl-tbl-head ${className}`.trim()} {...rest}>
      {children}
    </th>
  );
};

Table.Cell = function TableCell({ numeric, className = '', children, ...rest }) {
  return (
    <td data-numeric={numeric || undefined} className={`krnl-tbl-cell ${className}`.trim()} {...rest}>
      {children}
    </td>
  );
};

export const meta = {
  Table: {
    layer: 'atom', scope: 'global', status: 'experimental', category: 'Data Display',
    usecases: ['tabular data', 'usage/consumption breakdown', 'comparison rows'],
    keywords: ['table', 'data table', 'rows', 'columns', 'tabular', 'grid', 'ledger'],
    summary: 'A real semantic <table> (Table / Caption / Header / Body / Footer / Row / Head / Cell), borderless by default - the first tabular-data primitive in Kernel.',
    props: [
      { name: 'children', class: 'content', type: 'ReactNode', description: 'Table.Header + Table.Body, plus optional Table.Caption and Table.Footer.' },
    ],
    bestPractices: [
      { do: true, text: 'Always include a Table.Caption describing the table\'s content, even if visually hidden - it is the table\'s accessible name (WCAG 1.3.1) and screen-reader users hear it before any row.' },
      { do: true, text: 'Use Table.Head with `numeric` on any column of figures so it right-aligns and sets tabular-nums - alignment on the decimal is what makes a borderless table legible without rules.' },
      { do: false, text: 'Reach for divs styled to look like a grid - if the content is genuinely tabular data, use the real element so screen readers get row/column semantics for free.' },
    ],
    anatomy: [
      { name: 'Caption', required: false, description: 'The table\'s accessible name (<caption>). Can be visually hidden.' },
      { name: 'Header', required: true, description: 'Table.Header wraps one Table.Row of Table.Head cells (<thead>/<th scope="col">).' },
      { name: 'Body', required: true, description: 'Table.Body wraps the data Table.Row / Table.Cell rows (<tbody>).' },
      { name: 'Footer', required: false, description: 'Table.Footer for a totals/summary row (<tfoot>).' },
      { name: 'numeric alignment', required: false, description: 'Table.Head / Table.Cell take a `numeric` bool: right-aligns the column and applies tabular-nums, for a column of figures.' },
    ],
    related: ['FieldList', 'PropertyList'],
    composes: [],
    usage: '<Table>\n  <Table.Caption>Credits used this month by AI service</Table.Caption>\n  <Table.Header>\n    <Table.Row><Table.Head>Use case</Table.Head><Table.Head numeric>Uses</Table.Head><Table.Head numeric>Credits</Table.Head></Table.Row>\n  </Table.Header>\n  <Table.Body>\n    <Table.Row><Table.Cell>Consult notes</Table.Cell><Table.Cell numeric>21</Table.Cell><Table.Cell numeric>21.00</Table.Cell></Table.Row>\n  </Table.Body>\n</Table>',
  },
};
