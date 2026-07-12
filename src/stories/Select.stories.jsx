import { Select } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Data Input/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {  control: 'text' , description: "Text shown on the trigger when nothing is chosen. Assumes string item values (value === label); for object values supply" },
    children: {  control: 'text' , description: "The options as SelectItems." },
    className: {  control: 'text' , description: "Extra class(es) appended to the popup surface." },
    value: {  control: 'text'  },
    defaultValue: {  control: 'text'  },
    onValueChange: {  control: 'text'  },
    disabled: {  control: 'text'  },
  },
  parameters: {
    docs: {
      description: {
        component: "Dropdown picker for one value from a list (Base UI select).",
      },
    },
  },
};

export const Default = {
  args: {
    placeholder: "placeholder",
    children: "Content",
  },
  parameters: {
    docs: {
      source: { code: `<Select defaultValue="7 days" placeholder="Duration">
  <SelectItem value="3 days">3 days</SelectItem>
  <SelectItem value="7 days">7 days</SelectItem>
</Select>` },
    },
  },
};
