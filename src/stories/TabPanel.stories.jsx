import { TabPanel } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Navigation/TabPanel',
  component: TabPanel,
  tags: ['autodocs'],
  argTypes: {
    value: {  control: 'text'  },
    children: {  control: 'text' , description: "The panel content." },
  },
  parameters: {
    docs: {
      description: {
        component: "The content for one tab.",
      },
    },
  },
};

export const Default = {
  args: {
    value: undefined,
    children: "...",
  },
  parameters: {
    docs: {
      source: { code: `<TabPanel value="overview">…</TabPanel>` },
    },
  },
};
