import { FileInput } from '@corilus/kernel';

export default {
  title: 'Core/Inputs/FileInput',
  component: FileInput,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: "Native file picker; usually hidden and triggered via a ref (forwardRef).\n\n**Import**\n\n```ts\nimport { FileInput } from '@corilus/kernel'\n```" } },
  },
};

export const Playground = {
  parameters: { docs: { source: { code: `<FileInput ref={fileRef} multiple onChange={onFiles} style={{ display: 'none' }} />` } } },
};
