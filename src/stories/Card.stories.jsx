import { Card } from '@corilus/kernel';

export default {
  title: 'Kernel/Atom/Layout/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    appearance: {  control: 'select', options: ["filled","outline","subtle","elevated"] , description: "Surface treatment: filled (panel + border), outline (border only), subtle (no border/fill), elevated (raised ring + shad" },
    tone: {  control: 'text' , description: "Colour identity: a named status (info/success/warning/error) or any colour/var. Sets --card-tone (+ tinted surface via [" },
    orientation: {  control: 'select', options: ["vertical","horizontal"] , description: "Lays the slots in a column (default) or a row." },
    size: {  control: 'select', options: ["sm","md","lg"] , description: "Padding density step." },
    interactive: {  control: 'boolean' , description: "Renders a focusable <button> with hover / pressed / focus states. Opt-in only (not implied by onClick), so a specialised" },
    as: {  control: 'text' , description: "Element tag for the non-interactive form (default div; e.g. \"article\"). Ignored when interactive (always a <button>)." },
    selected: {  control: 'boolean' , description: "Marks the chosen state (accent border via [data-selected]); sets aria-pressed on the interactive form." },
    dragging: {  control: 'boolean' , description: "Lifted drag state (elevation via [data-dragging])." },
    disabled: {  control: 'text'  },
    floatingAction: {  control: 'text' , description: "A control pinned top-right (e.g. a menu button or checkbox)." },
    onClick: {  control: false , description: "Click handler attached to the card element. Pair with `interactive` for the focusable <button> affordance." },
    children: {  control: 'text' , description: "Card.Preview / Card.Header / Card.Body / Card.Footer (+ any content)." },
  },
  parameters: {
    docs: {
      description: {
        component: "Neutral base card: wrapper + appearance + rest/hover/pressed/focus/selected/dragging states; fill Preview / Header / Body / Footer.",
      },
    },
  },
};

export const Default = {
  args: {
    appearance: "filled",
    tone: "tone",
    orientation: "vertical",
    size: "sm",
    interactive: false,
    as: "as",
    selected: false,
    dragging: false,
    children: "Content",
  },
  parameters: {
    docs: {
      source: { code: `<Card>
  <Card.Header title="Prescribe a medication" action={<IconButton .../>} />
  <Card.Body>…</Card.Body>
  <Card.Footer><Button>Accept</Button></Card.Footer>
</Card>` },
    },
  },
};
