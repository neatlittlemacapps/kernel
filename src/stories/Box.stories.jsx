import { Box } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Layout/Box',
  component: Box,
  tags: ['autodocs'],
  argTypes: {
    p: {  control: 'number' , description: "Padding step, resolves to var(--space-N). px/py set an axis; pt/pr/pb/pl set one side." },
    px: {  control: 'number' , description: "Horizontal padding step (left + right)." },
    py: {  control: 'number' , description: "Vertical padding step (top + bottom)." },
    bg: {  control: 'text' , description: "Surface token name; resolves to var(--<bg>), e.g. bg=\"surface-raised\"." },
    radius: {  control: 'text' , description: "Radius token step; resolves to var(--krnl-radius-<radius>), e.g. radius=\"sm\"." },
    border: {  control: 'boolean' , description: "Adds a hairline token border (--border-subtle)." },
    as: {  control: 'text' , description: "The HTML element to render." },
    children: {  control: 'text' , description: "The laid-out content." },
  },
  parameters: {
    docs: {
      description: {
        component: "Primitive layout container: token-driven padding / surface / radius / border.",
      },
    },
  },
};

export const Default = {
  args: {
    p: 0,
    px: 0,
    py: 0,
    bg: undefined,
    radius: undefined,
    border: false,
    as: undefined,
    children: "...",
  },
  parameters: {
    docs: {
      source: { code: `<Box p={4} bg="surface-raised" radius="md" border>...</Box>` },
    },
  },
};
