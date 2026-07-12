import { FieldList } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Data display/FieldList',
  component: FieldList,
  tags: ['autodocs'],
  argTypes: {
    items: {  control: 'text' , description: "The rows to render. Each label becomes a dt and its value a dd; both accept nodes, not just strings." },
  },
  parameters: {
    docs: {
      description: {
        component: "Definition list of label / value rows for demographic and condition detail bodies.",
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      source: { code: `<FieldList items={[{ label: "Born", value: "1978-04-12" }, { label: "Sex", value: "F" }]} />` },
    },
  },
};
