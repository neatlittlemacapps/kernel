# Discovery prompt: AI activity-state signifier

**Status:** problem framing only. No spec, tokens, or component yet. Working name
below is a placeholder; naming is one of the open questions.

Paste this whole prompt into a fresh session (or a pm-coach / kernel-designer style
discovery conversation) to run the discovery.

---

## Problem statement

When a Kernel-hosted agent acts through AG-UI, it is not only generating chat replies:
it is manipulating fields and sections inside a host platform's own UI (an EHR form, a
scheduling grid, a settings panel that may or may not be built on Kernel). A
practitioner looking at that screen currently has no way to tell, at a glance:

1. that a given field or section is **being edited right now** by the agent, versus
   edited by a human, or just sitting idle, and
2. that a given field or section **was edited** by the agent a moment ago and now
   holds AI output that hasn't been reviewed.

Kernel already ships `AIMarker`: a static, content-level disclosure line ("AI-generated,
verify before acting"). That solves attribution/AI Act disclosure for a fixed piece of
content. It does not solve the problem above, which is about live, per-object state
that changes as the agent moves around the screen: something closer to a focus ring
or a "someone is typing" indicator than a caption.

## Constraints carried into discovery

- **AG-UI.** The agent acts inside an existing host platform's UI, not necessarily one
  rendered by Kernel components. So whatever comes out of discovery has to work in at
  least two tiers: a full Kernel-native version (data-attribute driven, tokenized,
  for hosts built on Kernel) and a fallback version simple enough that a host platform
  on a different stack, or a thin/fat client with limited theming, could rebuild it
  from a plain spec (a handful of CSS custom properties, class names, or DOM
  attributes plus a written behavior contract) without adopting Kernel itself.
- **Kernel conventions to respect once this moves past framing (STANDARD.md).**
  Interaction/live state is never a boolean prop; it is a `data-*` attribute styled
  through tokens. That points toward something like `data-ai-state="editing |
  edited | idle"` on the object being acted on, rather than an `isAiEditing` prop.
  Flag this now so discovery doesn't reinvent it, but do not lock the spec yet.
- **AIMarker is prior art, not the answer.** Reference it, decide during discovery
  whether the new concept subsumes it, sits next to it, or AIMarker becomes one
  rendering of it (e.g. the "edited, needs review" state's default content).
- **This is framing, not building.** The output of this discovery is a validated
  problem, a named set of risks, and open questions resolved or explicitly deferred.
  It is not a component, not tokens, not a Storybook story.

## Four risks to work through

Use these as the discovery skeleton. For each, the goal is either an answer or a named
experiment to get one, not a guess.

**Value.** Do practitioners actually lose track of what an agent touched, today, in a
way that causes real problems (missed edits, over-trusted output, redone work)? What's
the evidence: has anyone watched a practitioner work alongside an AG-UI agent yet, or
is this hypothesis-only? What happens today without any signifier: do practitioners
already have a workaround (e.g. manually re-reading every field), and if so how costly
is it?

**Usability.** Can a practitioner tell "editing" from "edited" from "untouched" at a
glance, without it colliding with existing states the field already has (focus,
hover, invalid, disabled, unsaved-changes)? Two states or more: is "editing / edited /
idle" the right set, or is there also "queued" (agent about to touch this), "error"
(agent tried and failed), or "conflicting" (human and agent touched it at once)? How
long does "edited" persist before fading back to idle, and what retires it: time,
practitioner focus, an explicit accept/dismiss?

**Feasibility.** Can AG-UI actually expose per-field "the agent is acting here now" /
"the agent just finished here" events with enough granularity (field-level? section-
level? both?) for a host to render this at all? What's the fallback when the host
can't wire up live per-field events, only a coarser "agent is active somewhere on this
screen" signal?

**Viability.** Regulatory: does a live "AI is editing this" indicator change or
strengthen the AI Act disclosure story that AIMarker already partially covers? Does a
too-subtle signifier create liability if a practitioner misses an AI edit; does a too-
loud one create alert fatigue and get tuned out (the same failure mode as ignored
drug-interaction alerts)? Who owns keeping the two-tier (full/fallback) versions in
sync as the concept evolves?

## Open questions to resolve or explicitly defer

1. State model: confirm the set (`editing`, `edited`, `idle`, plus anything from the
   usability question above) and what triggers each transition.
2. Scope of "object": field only, or also section, card, row, whole panel? Does the
   answer differ for the full vs fallback tier?
3. Visual language direction (not final design, just direction to hand to design):
   border/outline treatment, background tint, badge/icon, motion for the live state
   vs a static mark for the completed state, and how it reads in light/dark and across
   brands (corilus/semble/myneva).
4. Accessibility: how does a screen reader user get the equivalent signal? Likely an
   `aria-live` announcement on state transitions, but confirm phrasing and frequency
   (don't announce every keystroke the agent makes).
5. Relationship to `AIMarker`: pick one of subsumes / sits alongside / AIMarker becomes
   the "edited" state's default content.
6. Working name: something functional, not visual (per STANDARD.md naming rule) -
   candidates to react to: "AI activity state", "agent presence", "AI focus state".
   Whatever it's called, it should read as a state, not a component, since it likely
   attaches to many existing components rather than being one itself.
7. Full-vs-fallback contract: what is the minimum a non-Kernel host must implement to
   claim "AG-UI activity signifier compliant," and what do they get for free if they
   are on Kernel?

## Definition of done for this discovery pass

- A short written answer (or explicit "untested, deferred") for each of the four risks.
- The state model and object-scope questions (1-2) resolved.
- A decision on the AIMarker relationship (5).
- A one-paragraph handoff brief ready to give to interaction-spec work (kernel-designer
  style: spec + data model + propagation scenarios) or to file as a Jira issue.

## Filing

Once framing is validated, this becomes an AD (Agentic Design) issue per the project's
CLAUDE.md: search AD first for duplicates, then create a Task (or Epic if it splits
into full-tier + fallback-tier work), labeled `kernel`, plus `components` and `tokens`
since it touches both a rendering pattern and the state tokens behind it.
