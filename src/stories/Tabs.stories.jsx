import { Tabs } from '@corilus/kernel';

export default {
  title: 'Core/Navigation/Tabs/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text', description: "A TabList of Tabs followed by a TabPanel per value.", table: { category: 'Content', type: { summary: "ReactNode" } } },
  },
  parameters: {
    docs: { description: { component: "Switch between peer views in one space (Base UI tabs).\n\n**Import**\n\n```ts\nimport { Tabs } from '@corilus/kernel'\n```\n\n**Do**\n- Use for a handful of peer views the user switches between; keep tab labels to one or two words.\n\n**Don't**\n- Use Tabs for a linear multi-step flow - that is a stepper/wizard. Tabs imply the sections are independent and equal.\n\n**Anatomy**\n- **List** — The row of tabs + the sliding indicator.\n- **Tab** — One selectable label.\n- **Panel** — The content shown for the selected tab." } },
  },
};

export const Playground = {
  args: {
    children: "Content",
  },
  parameters: { docs: { source: { code: `<Tabs defaultValue="overview">
  <TabList>
    <Tab value="overview">Overview</Tab>
    <Tab value="history">History</Tab>
  </TabList>
  <TabPanel value="overview">…</TabPanel>
  <TabPanel value="history">…</TabPanel>
</Tabs>` } } },
};
