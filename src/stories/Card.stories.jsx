import { Card } from '@corilus/kernel';

export default {
  title: 'Core/Layout/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    appearance: { control: 'select', options: ["filled","outline","subtle","elevated"], description: "Surface treatment: filled (panel + border), outline (border only), subtle (no border/fill), elevated (raised ring + shadow, hover-lift - the base PatientCard is built on).", table: { category: 'Appearance', defaultValue: { summary: "filled" } } },
    tone: { control: 'text', description: "Colour identity: a named status (info/success/warning/error) or any colour/var. Sets --card-tone (+ tinted surface via [data-tone]); neutral when omitted.", table: { category: 'Appearance', type: { summary: "string" } } },
    orientation: { control: 'select', options: ["vertical","horizontal"], description: "Lays the slots in a column (default) or a row.", table: { category: 'Appearance', defaultValue: { summary: "vertical" } } },
    size: { control: 'select', options: ["sm","md","lg"], description: "Padding density step.", table: { category: 'Appearance', defaultValue: { summary: "md" } } },
    interactive: { control: 'boolean', description: "Renders a focusable <button> with hover / pressed / focus states. Opt-in only (not implied by onClick), so a specialised non-button card can compose Card via `as` + its own onClick.", table: { category: 'Appearance', type: { summary: "bool" } } },
    as: { control: 'text', description: "Element tag for the non-interactive form (default div; e.g. \"article\"). Ignored when interactive (always a <button>).", table: { category: 'Appearance', type: { summary: "string" } } },
    selected: { control: 'boolean', description: "Marks the chosen state (accent border via [data-selected]); sets aria-pressed on the interactive form.", table: { category: 'Appearance', type: { summary: "bool" } } },
    dragging: { control: 'boolean', description: "Lifted drag state (elevation via [data-dragging]).", table: { category: 'Appearance', type: { summary: "bool" } } },
    floatingAction: { control: false, description: "A control pinned top-right (e.g. a menu button or checkbox).", table: { category: 'Content', type: { summary: "ReactNode" } } },
    onClick: { control: false, description: "Click handler attached to the card element. Pair with `interactive` for the focusable <button> affordance.", table: { category: 'Events', type: { summary: "(event) => void" } } },
    children: { control: 'text', description: "Card.Preview / Card.Header / Card.Body / Card.Footer (+ any content).", table: { category: 'Content', type: { summary: "ReactNode" } } },
  },
  parameters: {
    docs: { description: { component: "Neutral base card: wrapper + appearance + rest/hover/pressed/focus/selected/dragging states; fill Preview / Header / Body / Footer.\n\n**Import**\n\n```ts\nimport { Card } from '@corilus/kernel'\n```\n\n**Do**\n- Compose the base Card + fill slots for a specialised card; do not hand-roll a card wrapper.\n- Use interactive/onClick for a clickable card; selected for a chosen state in a set.\n- For a dense selectable list row (citation / suggestion / radio row), compose an interactive Card with size=\"sm\" + a single Card.Header (leading | title + description | action); appearance=\"subtle\" gives a borderless row with a surface hover, appearance=\"outline\" a bordered one.\n\n**Don't**\n- Nest an interactive Card inside another interactive Card (button-in-button).\n\n**Anatomy**\n- **Preview** _(optional)_ — Edge-to-edge media (Card.Preview).\n- **Header** _(optional)_ — Leading + title/description + trailing action (Card.Header).\n- **Body** _(optional)_ — Main content (Card.Body).\n- **Footer** _(optional)_ — Actions row (Card.Footer)." } },
  },
};

export const Playground = {
  args: {
    appearance: "filled",
    orientation: "vertical",
    size: "md",
    interactive: false,
    selected: false,
    dragging: false,
    children: "Content",
  },
  parameters: { docs: { source: { code: `<Card>
  <Card.Header title="Prescribe a medication" action={<IconButton .../>} />
  <Card.Body>…</Card.Body>
  <Card.Footer><Button>Accept</Button></Card.Footer>
</Card>` } } },
};

export const Gallery = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
      {["filled","outline","subtle","elevated"].map((v) => (
        <Card key={v} appearance={v}>{v}</Card>
      ))}
    </div>
  ),
};
