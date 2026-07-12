import { PersonAvatar } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Identity/PersonAvatar',
  component: PersonAvatar,
  tags: ['autodocs'],
  argTypes: {
    p: {  control: 'text' , description: "The person record; the name drives the initials fallback when no photo is available." },
    size: {  control: 'number' , description: "Pixel diameter of the (always circular) avatar." },
  },
  parameters: {
    docs: {
      description: {
        component: "Person avatar with initials fallback.",
      },
    },
  },
};

export const Default = {
  args: {
    size: 0,
  },
  parameters: {
    docs: {
      source: { code: `<PersonAvatar p={patient} size={32} />` },
    },
  },
};
