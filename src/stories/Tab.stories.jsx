import { Tab } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Navigation/Tab',
  component: Tab,
  tags: ['autodocs'],
  argTypes: {
    value: {  control: 'text'  },
    children: {  control: 'text' , description: "The tab label (one or two words)." },
  },
  parameters: {
    docs: {
      description: {
        component: "One selectable tab.",
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
      source: { code: `<Tab value="overview">Overview</Tab>` },
    },
  },
};
