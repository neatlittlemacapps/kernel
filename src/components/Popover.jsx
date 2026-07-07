// Popover - anchored, dismissible surface holding rich content (not just a
// command list). Base UI `popover` primitive on the .krnl-* token contract.
// Base UI owns open/close, focus management, dismiss, ARIA, portal positioning.
import { Popover as BasePopover } from '@base-ui-components/react/popover';

const React = window.React;

// Popover - `trigger` opens it (a Btn / IconButton render target); `title` is an
// optional heading; `children` is the body. align/side/sideOffset -> Positioner.
export function Popover({
  trigger,
  title,
  children,
  align = 'center',
  side = 'bottom',
  sideOffset = 8,
  className = '',
  ...rest
}) {
  return (
    <BasePopover.Root {...rest}>
      <BasePopover.Trigger render={trigger} />
      <BasePopover.Portal>
        <BasePopover.Positioner className="krnl-positioner" align={align} side={side} sideOffset={sideOffset}>
          <BasePopover.Popup className={`krnl-popover ${className}`.trim()}>
            {title ? <BasePopover.Title className="krnl-popover-title">{title}</BasePopover.Title> : null}
            {children}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}

// A descriptive paragraph inside a Popover (wires aria-describedby via Base UI).
export function PopoverDescription({ className = '', children, ...rest }) {
  return <BasePopover.Description className={`krnl-popover-desc ${className}`.trim()} {...rest}>{children}</BasePopover.Description>;
}

// A close control inside a Popover; pass an IconButton / Btn as children.
export function PopoverClose({ children, ...rest }) {
  return <BasePopover.Close render={children} {...rest} />;
}

export const meta = {
  Popover: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Overlay',
    usecases: ['popover', 'rich flyout', 'inline detail'],
    keywords: ['popover', 'flyout', 'overlay', 'detail', 'anchored', 'popup', 'card'],
    summary: 'Anchored, dismissible surface for rich content (Base UI popover).',
    props: [
      { name: 'trigger', class: 'content', type: 'ReactElement',
        description: 'The element that opens the popover (a Btn / IconButton). Base UI render target - must be forwardRef or the popup anchors at (0,0).' },
      { name: 'title', class: 'content', type: 'ReactNode',
        description: 'Optional heading; wired as the accessible name (aria-labelledby) by Base UI.' },
      { name: 'children', class: 'content', type: 'ReactNode',
        description: 'The popover body - any content (text, fields, PopoverDescription, a PopoverClose).' },
      { name: 'className', class: 'content', type: 'string',
        description: 'Extra class(es) appended to the popup surface (e.g. a wider variant).' },
      { name: 'align', class: 'passThroughControl', passthrough: 'BaseUI.Popover.Positioner.align' },
      { name: 'side', class: 'passThroughControl', passthrough: 'BaseUI.Popover.Positioner.side' },
      { name: 'sideOffset', class: 'passThroughControl', passthrough: 'BaseUI.Popover.Positioner.sideOffset' },
      { name: 'open', class: 'passThroughControl', passthrough: 'BaseUI.Popover.Root.open' },
      { name: 'defaultOpen', class: 'passThroughControl', passthrough: 'BaseUI.Popover.Root.defaultOpen' },
      { name: 'onOpenChange', class: 'passThroughControl', passthrough: 'BaseUI.Popover.Root.onOpenChange' },
    ],
    bestPractices: [
      { do: true, text: 'Use for rich, interactive content anchored to a control (a filter form, a detail card).' },
      { do: false, text: 'Use a Popover for a simple label - that is a Tip (tooltip). Use it for a command list - that is a Menu.' },
    ],
    anatomy: [
      { name: 'Trigger', required: true, description: 'The forwardRef element that opens the popover.' },
      { name: 'Title', required: false, description: 'Optional heading, the accessible name.' },
      { name: 'Body', required: true, description: 'The content (children); may include PopoverDescription and PopoverClose.' },
    ],
    related: ['Menu', 'Tip', 'Dialog'],
    composes: [],
    usage: '<Popover title="Filters" trigger={<Btn variant="secondary">Filter</Btn>}>\n  <PopoverDescription>Narrow the list.</PopoverDescription>\n</Popover>',
    examples: [
      { name: 'With close', code: '<Popover title="Profile" trigger={<IconButton aria-label="Profile">{Icon.user({ size: 18 })}</IconButton>}>\n  <PopoverDescription>Signed in as Dr. Vermeulen.</PopoverDescription>\n  <PopoverClose><Btn variant="secondary">Close</Btn></PopoverClose>\n</Popover>' },
    ],
  },
  PopoverDescription: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Overlay',
    usecases: ['popover'],
    keywords: ['popover-description', 'description', 'body-text'],
    summary: 'A descriptive paragraph inside a Popover (wires aria-describedby).',
    props: [
      { name: 'children', class: 'content', type: 'ReactNode', description: 'The descriptive text.' },
    ],
    related: ['Popover'],
    composes: [],
    usage: '<PopoverDescription>Narrow the list to unresolved items.</PopoverDescription>',
  },
  PopoverClose: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Overlay',
    usecases: ['popover'],
    keywords: ['popover-close', 'close', 'dismiss'],
    summary: 'A close control inside a Popover; wrap a Btn / IconButton.',
    props: [
      { name: 'children', class: 'content', type: 'ReactElement', description: 'The control that closes the popover on click (a Btn / IconButton).' },
    ],
    related: ['Popover'],
    composes: [],
    usage: '<PopoverClose><IconButton aria-label="Close">{Icon.close({ size: 16 })}</IconButton></PopoverClose>',
  },
};
