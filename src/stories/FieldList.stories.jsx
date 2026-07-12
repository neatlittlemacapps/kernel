import { FieldList } from '@corilus/kernel/clinical';

export default {
  title: 'Clinical/Primitives/FieldList',
  component: FieldList,
  tags: ['autodocs'],
  argTypes: {
    items: { control: false, description: "The rows to render. Each label becomes a dt and its value a dd; both accept nodes, not just strings.", type: { name: 'other', value: 'Array<{ label: node, value: node }>', required: true }, table: { category: 'Content', type: { summary: "Array<{ label: node, value: node }>" } } },
  },
  parameters: {
    docs: { description: { component: "Definition list of label / value rows for demographic and condition detail bodies.\n\n**Import**\n\n```ts\nimport { FieldList } from '@corilus/kernel/clinical'\n```" } },
  },
};

export const Playground = {
  args: {
    items: [{"label":"Geboortedatum","value":"12-04-1978"},{"label":"Geslacht","value":"Vrouw"},{"label":"Rijksregisternr.","value":"78.04.12-006.83"}],
  },
  parameters: { docs: { source: { code: `<FieldList items={[{ label: "Born", value: "1978-04-12" }, { label: "Sex", value: "F" }]} />` } } },
};
