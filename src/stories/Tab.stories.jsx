import { Tabs, Tab, TabList, TabPanel } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Navigation/Tab',
  component: Tab,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'One selectable tab. Must be used within <Tabs> and <TabList>.' } },
  },
};

export const Default = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab value="history">History</Tab>
        <Tab value="notes">Notes</Tab>
      </TabList>
      <TabPanel value="overview">Overview content</TabPanel>
      <TabPanel value="history">History content</TabPanel>
      <TabPanel value="notes">Notes content</TabPanel>
    </Tabs>
  ),
};
