// AlertDialog - modal that interrupts for a consequential confirmation (delete,
// discard). Base UI `alert-dialog` primitive on the .krnl-* token contract. Unlike
// Dialog it does NOT dismiss on backdrop click or Esc alone escaping the decision:
// Base UI gives it role=alertdialog and keeps focus on the choice. Reuses the
// .krnl-dialog-* surface styling; the semantics (not the look) are what differ.
import { AlertDialog as BaseAlertDialog } from '@base-ui-components/react/alert-dialog';

const React = window.React;

// AlertDialog - `trigger` opens it; `title` + `description` state the decision;
// `actions` holds the cancel + confirm controls (wrap cancel in AlertDialogClose).
export function AlertDialog({ trigger, title, description, children, actions, className = '', ...rest }) {
  return (
    <BaseAlertDialog.Root {...rest}>
      {trigger ? <BaseAlertDialog.Trigger render={trigger} /> : null}
      <BaseAlertDialog.Portal>
        <BaseAlertDialog.Backdrop className="krnl-dialog-backdrop" />
        <BaseAlertDialog.Popup className={`krnl-dialog krnl-dialog--alert ${className}`.trim()}>
          {title ? <BaseAlertDialog.Title className="krnl-dialog-title">{title}</BaseAlertDialog.Title> : null}
          {description ? <BaseAlertDialog.Description className="krnl-dialog-desc">{description}</BaseAlertDialog.Description> : null}
          {children ? <div className="krnl-dialog-body">{children}</div> : null}
          {actions ? <div className="krnl-dialog-foot">{actions}</div> : null}
        </BaseAlertDialog.Popup>
      </BaseAlertDialog.Portal>
    </BaseAlertDialog.Root>
  );
}

// The cancel / dismiss control inside an AlertDialog; wrap a Btn as children.
export function AlertDialogClose({ children, ...rest }) {
  return <BaseAlertDialog.Close render={children} {...rest} />;
}

export const meta = {
  AlertDialog: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Overlay',
    usecases: ['destructive confirmation', 'blocking decision'],
    keywords: ['alert-dialog', 'confirm', 'destructive', 'delete', 'warning', 'modal'],
    summary: 'Modal that forces a consequential confirmation (Base UI alert-dialog).',
    props: [
      { name: 'trigger', class: 'content', type: 'ReactElement',
        description: 'Element that opens the alert (a Btn). Omit when controlling open/onOpenChange yourself.' },
      { name: 'title', class: 'content', type: 'ReactNode',
        description: 'The decision, phrased as a question ("Delete prescription?"); the accessible name.' },
      { name: 'description', class: 'content', type: 'ReactNode',
        description: 'The consequence, stated plainly ("This cannot be undone."); wired as aria-describedby.' },
      { name: 'children', class: 'content', type: 'ReactNode',
        description: 'Optional extra body content beyond the description.' },
      { name: 'actions', class: 'content', type: 'ReactNode',
        description: 'The cancel + confirm controls; wrap cancel in AlertDialogClose and make it the safe default.' },
      { name: 'className', class: 'content', type: 'string',
        description: 'Extra class(es) appended to the surface.' },
      { name: 'open', class: 'passThroughControl', passthrough: 'BaseUI.AlertDialog.Root.open' },
      { name: 'defaultOpen', class: 'passThroughControl', passthrough: 'BaseUI.AlertDialog.Root.defaultOpen' },
      { name: 'onOpenChange', class: 'passThroughControl', passthrough: 'BaseUI.AlertDialog.Root.onOpenChange' },
    ],
    bestPractices: [
      { do: true, text: 'Name the consequence in the description; give the confirm Btn tone="error" and label it with the verb ("Delete"), not "OK".' },
      { do: false, text: 'Use an AlertDialog for routine confirmations - reserve it for irreversible or costly actions, or it becomes noise.' },
    ],
    anatomy: [
      { name: 'Backdrop', required: true, description: 'The scrim; blocks interaction until a choice is made.' },
      { name: 'Title', required: true, description: 'The decision question, the accessible name.' },
      { name: 'Description', required: true, description: 'The consequence.' },
      { name: 'Actions', required: true, description: 'Cancel (safe default, in AlertDialogClose) + confirm.' },
    ],
    related: ['Dialog'],
    composes: [],
    usage: '<AlertDialog title="Delete prescription?" description="This cannot be undone."\n  trigger={<Btn variant="secondary">Delete</Btn>}\n  actions={<><AlertDialogClose><Btn variant="secondary">Cancel</Btn></AlertDialogClose><Btn tone="error">Delete</Btn></>} />',
  },
  AlertDialogClose: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Overlay',
    usecases: ['destructive confirmation'],
    keywords: ['alert-dialog-close', 'cancel', 'dismiss'],
    summary: 'The cancel / dismiss control inside an AlertDialog; wrap a Btn.',
    props: [
      { name: 'children', class: 'content', type: 'ReactElement', description: 'The control that dismisses the alert (a Btn); make it the safe default.' },
    ],
    related: ['AlertDialog'],
    composes: [],
    usage: '<AlertDialogClose><Btn variant="secondary">Cancel</Btn></AlertDialogClose>',
  },
};
