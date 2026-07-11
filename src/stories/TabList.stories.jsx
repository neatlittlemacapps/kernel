import { TabList } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Navigation/TabList',
  component: TabList,
  tags: ['autodocs'],
  argTypes: {
    children: {  control: 'text' , description: "The Tab elements." },
  },
  parameters: {
    docs: {
      description: {
        component: "The row of Tabs with the active indicator.",
      },
    },
  },
};

export const Default = {
  args: {
    children: "...",
  },
  parameters: {
    docs: {
      source: { code: `<TabList><Tab value="a">A</Tab></TabList>` },
    },
  },
};
