import { IconButton } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Action/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    active: {  control: 'boolean' , description: "Renders the pressed / active visual state (e.g. a toggled toolbar button)." },
    variant: {  control: 'select', options: ["solid"] , description: "Visual treatment. Default is the transparent ghost icon button; `solid` is a filled accent circle for a primary in-place" },
    children: {  control: 'text' , description: "The icon element, e.g. Icon.close({ size: 18 })." },
    'aria-label': {  control: 'text' , description: "Accessible name; required since there is no visible label." },
    disabled: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "Square icon button; Base UI render-target (forwardRef).",
      },
    },
  },
};

export const Default = {
  args: {
    active: false,
    variant: "solid",
    children: "Content",
    'aria-label': "aria-label",
  },
  parameters: {
    docs: {
      source: { code: `<IconButton aria-label="Close">{Icon.close({ size: 18 })}</IconButton>` },
    },
  },
};
