import { PAv } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Identity/PAv',
  component: PAv,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: "Deprecated alias of PersonAvatar (B-39). Use PersonAvatar; PAv is removed on the next major.",
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      source: { code: `<PersonAvatar p={patient} size={32} />` },
    },
  },
};
