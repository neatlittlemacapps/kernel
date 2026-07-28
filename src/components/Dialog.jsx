// Dialog - modal surface that interrupts the flow for a focused task. Base UI
// `dialog` primitive on the .krnl-* token contract. Base UI owns the modal focus
// trap, scroll lock, Esc-to-close, backdrop, ARIA (role=dialog, labelled/described).
import { Dialog as BaseDialog } from '@base-ui-components/react/dialog';
import { IconButton } from './ui.jsx';
import { Icon } from '../lib/icons.jsx';

const React = window.React;

// Dialog - `trigger` opens it (optional; omit when controlling via `open`).
// `title` / `description` wire the accessible name + description; `children` is
// the body; `actions` is the footer (typically a couple of Btns).
// `onBack` / `headerAction` put controls BESIDE the title (a drill-down back button,
// a close X) without ever letting the caller replace BaseDialog.Title itself — that
// stays the one thing the component guarantees as the accessible name. The head row
// only renders when one of them is set, so every dialog that doesn't use them keeps
// byte-identical DOM (a bare Title as a direct flex child of the popup).
export function Dialog({ trigger, title, description, children, actions,
  onBack, backLabel = 'Back', headerAction, className = '', ...rest }) {
  const headed = !!(onBack || headerAction);
  return (
    <BaseDialog.Root {...rest}>
      {trigger ? <BaseDialog.Trigger render={trigger} /> : null}
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="krnl-dialog-backdrop" />
        <BaseDialog.Popup className={`krnl-dialog ${className}`.trim()}>
          {headed ? (
            <div className="krnl-dialog-head">
              {onBack ? (
                <IconButton onClick={onBack} aria-label={backLabel}>{Icon.back({ size: 14 })}</IconButton>
              ) : null}
              {title ? <BaseDialog.Title className="krnl-dialog-title">{title}</BaseDialog.Title> : null}
              {headerAction ? <div className="krnl-dialog-head-action">{headerAction}</div> : null}
            </div>
          ) : title ? (
            <BaseDialog.Title className="krnl-dialog-title">{title}</BaseDialog.Title>
          ) : null}
          {description ? <BaseDialog.Description className="krnl-dialog-desc">{description}</BaseDialog.Description> : null}
          {children ? <div className="krnl-dialog-body">{children}</div> : null}
          {actions ? <div className="krnl-dialog-foot">{actions}</div> : null}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

// A close control inside a Dialog; wrap a Btn / IconButton as children.
export function DialogClose({ children, ...rest }) {
  return <BaseDialog.Close render={children} {...rest} />;
}

export const meta = {
  Dialog: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Overlay',
    usecases: ['modal dialog', 'focused task', 'confirmation'],
    keywords: ['dialog', 'modal', 'overlay', 'popup', 'sheet', 'window'],
    summary: 'Modal surface for a focused task or confirmation (Base UI dialog).',
    props: [
      { name: 'trigger', class: 'content', type: 'ReactElement',
        description: 'Optional element that opens the dialog (a Btn). Omit when controlling open/onOpenChange yourself.' },
      { name: 'title', class: 'content', type: 'ReactNode',
        description: 'The dialog heading; wired as the accessible name (aria-labelledby).' },
      { name: 'description', class: 'content', type: 'ReactNode',
        description: 'Supporting line under the title; wired as aria-describedby.' },
      { name: 'children', class: 'content', type: 'ReactNode',
        description: 'The dialog body content.' },
      { name: 'actions', class: 'content', type: 'ReactNode',
        description: 'Footer controls, typically a DialogClose-wrapped cancel and a confirm Btn; right-aligned.' },
      { name: 'className', class: 'content', type: 'string',
        description: 'Extra class(es) appended to the dialog surface (e.g. a wider variant).' },
      { name: 'onBack', class: 'event', type: 'fn',
        description: 'When set, a back control is rendered before the title and invoked on activation. Use for a drill-down surface (a section list -> one section) where back should return a level instead of closing the dialog.' },
      { name: 'backLabel', class: 'a11y', type: 'string', default: 'Back',
        description: 'Accessible label for the back control; pass a localized string.' },
      { name: 'headerAction', class: 'content', type: 'ReactNode',
        description: 'Controls pinned to the end of the title row, typically a DialogClose-wrapped IconButton. The title row only renders when onBack or headerAction is set; otherwise the title stays a bare child and existing dialogs are unchanged.' },
      { name: 'open', class: 'passThroughControl', passthrough: 'BaseUI.Dialog.Root.open' },
      { name: 'defaultOpen', class: 'passThroughControl', passthrough: 'BaseUI.Dialog.Root.defaultOpen' },
      { name: 'onOpenChange', class: 'passThroughControl', passthrough: 'BaseUI.Dialog.Root.onOpenChange' },
    ],
    bestPractices: [
      { do: true, text: 'Give every dialog a title and a clear primary action; put the primary Btn last in actions.' },
      { do: false, text: 'Use a modal Dialog for a non-blocking message - use a Banner or Toast. Reserve modality for tasks that need full attention.' },
    ],
    anatomy: [
      { name: 'Backdrop', required: true, description: 'The scrim behind the dialog; dims and blocks the page.' },
      { name: 'Header', required: false, description: 'The title row when onBack / headerAction is set: back control, title, trailing actions.' },
      { name: 'Title', required: false, description: 'The heading and accessible name.' },
      { name: 'Body', required: false, description: 'The task content (children).' },
      { name: 'Actions', required: false, description: 'Footer controls (cancel + confirm).' },
    ],
    related: ['AlertDialog', 'Popover'],
    composes: ['IconButton'],
    usage: '<Dialog title="Rename file" trigger={<Btn>Rename</Btn>}\n  actions={<><DialogClose><Btn variant="secondary">Cancel</Btn></DialogClose><Btn>Save</Btn></>}>\n  <TextInput defaultValue="report.pdf" />\n</Dialog>',
    examples: [
      { name: 'Confirm', code: '<Dialog title="Discard changes?" description="Your edits will be lost."\n  trigger={<Btn variant="secondary">Discard</Btn>}\n  actions={<><DialogClose><Btn variant="secondary">Keep editing</Btn></DialogClose><Btn>Discard</Btn></>} />' },
    ],
  },
  DialogClose: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Overlay',
    usecases: ['modal dialog'],
    keywords: ['dialog-close', 'close', 'cancel', 'dismiss'],
    summary: 'A close control inside a Dialog; wrap a Btn / IconButton.',
    props: [
      { name: 'children', class: 'content', type: 'ReactElement', description: 'The control that closes the dialog on click (a Btn / IconButton).' },
    ],
    related: ['Dialog'],
    composes: [],
    usage: '<DialogClose><Btn variant="secondary">Cancel</Btn></DialogClose>',
  },
};
