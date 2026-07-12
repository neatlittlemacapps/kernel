import { FileInput } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Data Input/FileInput',
  component: FileInput,
  tags: ['autodocs'],
  argTypes: {
    multiple: {  control: 'text'  },
    accept: {  control: 'text'  },
    onChange: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "Native file picker; usually hidden and triggered via a ref (forwardRef).",
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      source: { code: `<FileInput ref={fileRef} multiple onChange={onFiles} style={{ display: 'none' }} />` },
    },
  },
};
