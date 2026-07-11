import { useState } from 'react';
import { PromptField } from '@corilus/kernel/chat';

export default {
  title: 'Kernel/Composite/Communication/PromptField',
  component: PromptField,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    canSubmit: { control: 'boolean' },
    submitLabel: { control: 'text' },
    maxHeight: { control: 'number' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Composer shell: framed card + seamless auto-grow TextArea + leading/trailing/header slots + submit. Owns Enter-to-send.',
      },
    },
  },
};

export const Default = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <PromptField
        {...args}
        value={value}
        onChange={e => setValue(e.target.value)}
        onSubmit={() => { alert(`Submitted: ${value}`); setValue(''); }}
        canSubmit={value.length > 0}
      />
    );
  },
  args: {
    placeholder: 'Ask anything…',
    submitLabel: 'Send',
  },
};

export const WithContent = {
  render: () => {
    const [value, setValue] = useState('What medications is this patient taking?');
    return (
      <PromptField
        value={value}
        onChange={e => setValue(e.target.value)}
        onSubmit={() => {}}
        canSubmit={value.length > 0}
        placeholder="Ask anything…"
      />
    );
  },
};
