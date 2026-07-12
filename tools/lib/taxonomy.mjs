// tools/lib/taxonomy.mjs
// The single source of truth for the Storybook sidebar tree.
//
// Decision (2026-07-12, Frank): drop the redundant `Kernel/` root prefix (the whole
// Storybook IS Kernel). Top level = TIER (Core / Chat / Clinical); then a hybrid
// Astryx-style layout — Category, with variant/part families nested under a parent.
//
//   {Tier}/{Category}/{Family?}/{Name}
//     Core/Actions/Button
//     Core/Overlays/Menu/MenuItem          (Menu family nested)
//     Clinical/Cards/AllergyCard
//     Chat/ChatBubble                       (chat tier is flat)
//
// Both gen-stories.mjs (baseline stories) and retitle-stories.mjs (hand-authored
// stories) import `titleFor` so the tree can never fork between the two.

// Deprecated aliases — no separate gallery entry; noted on the canonical component.
export const ALIAS_SKIP = new Set(['Btn', 'PAv', 'Tip']);
export const ALIAS_OF = { Btn: 'Button', PAv: 'PersonAvatar', Tip: 'Tooltip' };

// Chat tier (the ./chat subpath — gen-catalog doesn't tag these, so name-list them).
const CHAT = new Set(['ChatBubble', 'PromptField', 'Transcript', 'TypingIndicator']);

// Clinical primitives (relocated behind ./clinical by B-49) get their own folder,
// distinct from the per-object Cards.
const CLINICAL_PRIMITIVES = new Set([
  'Sparkline', 'ReferenceRangeBar', 'ScheduleStrip', 'FieldList', 'ReactionList', 'PrimaryCTA',
]);

// Category assignment for the CORE tier. Keyed by component name so casing/merges are
// explicit (the raw catalog has `Data display`/`Data Display`, `Action`/`Actions`, …).
const CORE_CATEGORY = {
  // Actions
  Button: 'Actions', IconButton: 'Actions', Fab: 'Actions', Trigger: 'Actions', EditChip: 'Actions',
  // Inputs
  Checkbox: 'Inputs', FileInput: 'Inputs', Radio: 'Inputs', RadioGroup: 'Inputs',
  Select: 'Inputs', SelectItem: 'Inputs', Slider: 'Inputs', Stepper: 'Inputs',
  TextArea: 'Inputs', TextInput: 'Inputs', Toggle: 'Inputs', ToggleGroup: 'Inputs', ToggleGroupItem: 'Inputs',
  // Layout
  Box: 'Layout', Stack: 'Layout', Inline: 'Layout', Grid: 'Layout', Card: 'Layout', SidePanel: 'Layout',
  // Overlays
  Dialog: 'Overlays', DialogClose: 'Overlays', AlertDialog: 'Overlays', AlertDialogClose: 'Overlays',
  Menu: 'Overlays', MenuItem: 'Overlays', MenuGroup: 'Overlays', MenuGroupLabel: 'Overlays', MenuSeparator: 'Overlays',
  ContextMenu: 'Overlays', ContextMenuItem: 'Overlays', ContextMenuSeparator: 'Overlays',
  Popover: 'Overlays', PopoverClose: 'Overlays', PopoverDescription: 'Overlays',
  Tooltip: 'Overlays', MeterTooltip: 'Overlays',
  // Navigation
  Tabs: 'Navigation', Tab: 'Navigation', TabList: 'Navigation', TabPanel: 'Navigation', ActionRow: 'Navigation',
  // Data Display
  Chip: 'Data Display', IconPill: 'Data Display', TrendChip: 'Data Display', ValueDisplay: 'Data Display',
  PropertyList: 'Data Display', PatientCard: 'Data Display', SproutCard: 'Data Display',
  // Feedback & Status
  Progress: 'Feedback & Status', StatusPill: 'Feedback & Status',
  // Structure
  Collapsible: 'Structure', Separator: 'Structure',
  // AI & Identity
  AIBadge: 'AI & Identity', AIMarker: 'AI & Identity', PersonAvatar: 'AI & Identity',
  // Utility
  FFSection: 'Utility', SproutToneProvider: 'Utility',
};

// Variant / compound-part families → the parent folder they nest under. The parent
// component itself lives in the same folder alongside its parts.
const FAMILY = {
  Menu: 'Menu', MenuItem: 'Menu', MenuGroup: 'Menu', MenuGroupLabel: 'Menu', MenuSeparator: 'Menu',
  ContextMenu: 'ContextMenu', ContextMenuItem: 'ContextMenu', ContextMenuSeparator: 'ContextMenu',
  Dialog: 'Dialog', DialogClose: 'Dialog',
  AlertDialog: 'AlertDialog', AlertDialogClose: 'AlertDialog',
  Popover: 'Popover', PopoverClose: 'Popover', PopoverDescription: 'Popover',
  Tooltip: 'Tooltip', MeterTooltip: 'Tooltip',
  Tabs: 'Tabs', Tab: 'Tabs', TabList: 'Tabs', TabPanel: 'Tabs',
  Select: 'Select', SelectItem: 'Select',
  Radio: 'Radio', RadioGroup: 'Radio',
  Toggle: 'Toggle', ToggleGroup: 'Toggle', ToggleGroupItem: 'Toggle',
};

export function tierFor(entry) {
  if ((entry.import || '').endsWith('/clinical')) return 'Clinical';
  if (CHAT.has(entry.name)) return 'Chat';
  return 'Core';
}

// The real import specifier for a story file. gen-catalog only tags the ./clinical
// subpath; chat components live behind ./chat (chat.js) and are name-listed here.
export function importFor(entry) {
  if (CHAT.has(entry.name)) return '@corilus/kernel/chat';
  return entry.import || '@corilus/kernel';
}

// Returns the ordered Storybook path segments for an entry (excluding the leaf name),
// or null if the entry should not get a story at all (deprecated alias).
export function segmentsFor(entry) {
  if (ALIAS_SKIP.has(entry.name)) return null;
  const tier = tierFor(entry);
  const name = entry.name;

  if (tier === 'Chat') return ['Chat'];

  if (tier === 'Clinical') {
    const cat = CLINICAL_PRIMITIVES.has(name) ? 'Primitives' : 'Cards';
    return ['Clinical', cat];
  }

  // Core
  const category = CORE_CATEGORY[name] || entry.category || 'Misc';
  const family = FAMILY[name];
  return family ? ['Core', category, family] : ['Core', category];
}

export function titleFor(entry) {
  const segs = segmentsFor(entry);
  if (!segs) return null;
  return [...segs, entry.name].join('/');
}
