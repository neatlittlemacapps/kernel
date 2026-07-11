import { Tabs } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    children: {  control: 'text' , description: "A TabList of Tabs followed by a TabPanel per value." },
    value: {  control: 'text'  },
    defaultValue: {  control: 'text'  },
    onValueChange: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "Switch between peer views in one space (Base UI tabs).",
      },
    },
  },
};

export const Default = {
  args: {
    children: "...",
    value: undefined,
    defaultValue: undefined,
    onValueChange: undefined,
  },
  parameters: {
    docs: {
      source: { code: `<Tabs defaultValue="overview">
  <TabList>
    <Tab value="overview">Overview</Tab>
    <Tab value="history">History</Tab>
  </TabList>
  <TabPanel value="overview">…</TabPanel>
  <TabPanel value="history">…</TabPanel>
</Tabs>` },
    },
  },
};
