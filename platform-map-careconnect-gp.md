# Platform map — CareConnect GP

Structural reference for the AG-UI playground (Juglans vs CareConnect surface decisions). Not a how-to; not real patient data.

**Source note:** The originally-specified primary manual (`careconnectmanual.corilus.be`) is still fully dead — the whole domain 301-redirects to a broken `my.corilus.be` portal, no path resolves, no Wayback snapshot exists. This version uses `support.corilus.be/generalpractitioner/nl/collections/1434660-handleiding` instead, which is live and includes the manual's actual master table of contents (article 655269). That TOC is the ground truth for tab structure used below — it resolved two open questions from the first pass: "Journaal" is not a separate screen, it's the same tab as "Contact" (the manual calls it both); and "Journaal log" is the top-level, admin-rights-only **Logboek**, distinct from Contact. Entries are grouped by CareConnect's own top-level tabs, per that TOC — not invented groupings. The source articles (Intercom-hosted) do contain embedded screenshots of the actual interface — this map was built from text-based fetches that describe those screenshots' content rather than from direct visual inspection, so entries below are sourced from article prose, not first-hand screen review. `[GAP: needs screenshot]` markers flag specifics that prose alone didn't resolve (layout, exact state machine, etc.), not "no image exists at all."

## Dossiers – Administratief

## Patiëntdetails — Dossiers › Administratief › Patiëntdetails
**Purpose:** Core identity record — the entry point ("patiënt-info") for a patient file.
**Data objects:** Name, sex, DOB, address, phone/mobile/email, INSZ, EMD info, blood group.
**Editable in this screen:** Yes — all fields above; mandatory fields marked with `*`.
**Obligation flags:** validation — a *therapeutische relatie* can only be registered once INSZ + eID/Kids-ID, or INSZ + ISI+ card, is on file. This gates [[Externe Platformen]], [[Helena]], and hub access everywhere else.
**Notes:** "Rijksregister raadplegen" does a manual national-registry lookup (no longer automatic — a documented behavior change). Files can be archived on death/relocation. Household files at a matching address surface as linked shortcuts.

## Dossier – Administratief (remaining sub-tabs) — Dossiers › Administratief
**Purpose:** Container for platform/consent/export administration around the file; sub-tabs persist in the tab bar while the file stays open.
**Data objects:** *Externe platformen* (hub/Vitalink document & lab search, "Nieuw" posts a ≤300-char journal note to Vitalink), *Privacybeheer* (informed-consent + therapeutic-relationship status, incl. a separate "Hubs" relationship type), *Dossier toegang* (per-colleague/role access rights), *Export* (SumEHR v2 / GP Migration Format / Patient Migration Format / Corilus XML / Patient Readable Format), *Importeer* (received-file history with a mandatory "compare the data" verification step before merge).
**Editable in this screen:** Yes across all five — register consent/relationship, adjust access rights, trigger an export in a chosen format, run a verified import.
**Obligation flags:** validation (consent/relationship prerequisite to unlock hub search) | audit-legal (Export and Import both keep a dated history of who-sent/received-what) | none of these for Dossier toegang beyond role-based limits.
**Notes:** Access rights vary by license tier (e.g. "vrijwilliger" is more restricted than "medisch assistent"). Patient Readable Format is specifically for a patient relocating outside Belgium.

## Helena (account link) — Dossiers › Administratief › Helena
**Purpose:** Manage the GP-side connection to Helena, the ISO27001 patient-facing portal (secure messaging, doc/prescription sharing, video consult, parameter sharing).
**Data objects:** Account/link status, proxy-account eligibility and activation window.
**Editable in this screen:** Yes — GMD physicians can create a proxy account for a child under 12, an adult unable to self-manage, or a shared-phone household; the proxy holder must activate within **2 weeks**. Existing self-managed accounts can be converted to proxy (revokes patient access).
**Obligation flags:** patient-facing (Helena) | signing/audit-legal (2-week activation deadline and access-rights changes both create a documented authorization trail).
**Notes:** Patients with self-managed accounts can independently authorize a provider via national-ID + email in their own Helena settings — a patient-initiated trust action worth surfacing distinctly from GP-initiated proxy creation.

## SumEHR (export) — Dossiers › Administratief › Sumehr
**Purpose:** Maintain and export the legally-defined summary health record, kept "automatically up to date."
**Data objects:** Auto-derived summary of the file's most relevant information (exact field list detailed in the dedicated Export sub-article, not this one).
**Editable in this screen:** No direct field editing here — governed by export-time configuration ([[Dossier – Administratief (remaining sub-tabs)]] → Export → "SumEhr v2").
**Obligation flags:** audit-legal (formally structured export, subject to consent/privacy prerequisites) | validation (blocked until consent + therapeutic relationship are registered).
**Notes:** Uploadable directly to Vitalink/Hubs from the Export flow.

## Terugbetaling & Hoofdstuk IV — Dossiers › Administratief › Terugbetaling / Hoofdstuk IV
**Purpose:** GMD and Chapter-IV medication reimbursement status, queried live from MyCareNet.
**Data objects:** Insurability data, GMD status/history, Chapter-IV request list with green (sent)/yellow (MyCareNet response received) status.
**Editable in this screen:** Yes — "Creëer" takes over or opens a GMD (requires contact date + nomenclature number); Chapter-IV requests are queried by date range/paragraph/medication and can attach digitally signed supporting forms.
**Obligation flags:** signing (Chapter-IV supporting forms can be digitally completed and signed) | audit-legal (GMD creation and Chapter-IV requests both log a MyCareNet-confirmed timestamp/status trail).
**Notes:** Requires an active eHealth certificate + patient INSZ; GMD additionally requires the therapeutic relationship from [[Dossier – Administratief (remaining sub-tabs)]].

## Dossiers – Medisch

## Dashboard (Medisch) — Dossiers › Medisch › Dashboard
**Purpose:** Landing summary inside the medical record: care elements, antecedents, active medication, alerts, messages, recent contact, attention points, notes, and planning up to 6 months out.
**Data objects:** Rollups from every sub-tab below, plus GMD/SumEHR/Helena alerts and mijnWGK home-care integration.
**Editable in this screen:** Mostly read-only; a few quick actions (planning status toggle, task priority) surface directly here.
**Obligation flags:** audit-legal (surfaces GMD/SumEHR/consent gaps as alerts).
**Notes:** This is the natural fork point for assistant-vs-in-app framing — nearly every obligation-bearing action lives one tab deeper. Sub-tabs not otherwise itemized in this map (Handelingen, Vaccinaties, Aandachtspunten, Patiëntinfo, Planning, Notities, Zwangerschap) all roll up here; flag if the playground needs one of those in detail.

## Zorgelementen — Dossiers › Medisch › Zorgelementen
**Purpose:** Registered diagnoses/care elements, coded or free-text.
**Data objects:** Title, ICPC-2 code (optional), status (active/passive-relevant/inactive), links to care packages and contacts.
**Editable in this screen:** Yes — create, change status, set visibility/confidentiality, merge duplicates, delete.
**Obligation flags:** validation (ICPC-2 typeahead; triggers medication-interaction warnings on entry) | audit-legal (status changes are logged; coded entries feed SumEHR and statistics).
**Notes:** Can also be created directly from a document or from a Contact's evaluation field.

## Zorgaanpakken — Dossiers › Medisch › Zorgaanpakken
**Purpose:** Care-plan/trajectory layer attached to a Zorgelement (e.g. diabetes monitoring).
**Data objects:** Plan title (predefined or custom), status (active/passive-relevant), auto-linked parameter set.
**Editable in this screen:** Yes — define/select a plan, change status and confidentiality.
**Obligation flags:** audit-legal (Dashboard eligibility alerts document preventive-care compliance).
**Notes:** Auto-populates the relevant [[Parameters]] set for the linked condition.

## Contact / Nieuw contact (= Journaal) — Dossiers › Medisch › Contact
**Purpose:** The journal itself — chronological log of every patient encounter (in-person, telehealth, admin update), and the entry point for creating a new one.
**Data objects:** Connection type, date/time, evaluation field, links to care elements/documents/parameters/vaccinations created from within the contact.
**Editable in this screen:** Yes — fully editable; navigate between past contacts via arrows.
**Obligation flags:** audit-legal (complete, timestamped audit trail; the FAQ separately documents restoring an accidentally-deleted contact — implying deletion is possible but recoverable, not silent) | validation (an Evaluation entry can spawn a new Zorgelement).
**Notes:** "Contact" and "Journaal" are the same screen under two names in the source material — resolves the open question from the first pass. [[Journaal log (Logboek)]] is the separate, admin-only audit screen — do not conflate the two.

## Journaal log (Logboek) — top-level › Logboek
**Purpose:** System/user-activity audit log, visible only to users with administrator rights.
**Data objects:** Not itemized in either source beyond "tracks user activity and system changes."
**Editable in this screen:** No (assumed).
**Obligation flags:** audit-legal.
**Notes:** `[GAP: needs screenshot or admin-facing doc — what event types Logboek actually records, and whether it's filterable/exportable]`

## Documenten (Medisch) — Dossiers › Medisch › Documenten
**Purpose:** All integrated reports, scans, and correspondence for the patient.
**Data objects:** Documents grouped by type, status (green = incoming, yellow = sent via Hector, white = manual), auto-extracted "conclusion"/"decision" text.
**Editable in this screen:** Content itself isn't edited, but status, confidentiality, linked care elements/packages, and the conclusion text are.
**Obligation flags:** signing (Adobe Reader-compatible digital signature, legally valid) | audit-legal (export tracking to other providers; direct eHealthBox transmission to hospital departments is logged).
**Notes:** Right-click on selected document text can spawn a care element, action, conclusion, or note directly — a cross-tab authoring shortcut worth rehearsing.

## Parameters — Dossiers › Medisch › Parameters
**Purpose:** Vitals/clinical values with history and trend graphs.
**Data objects:** Predefined sets (basic, COVID-19, depression, asthma, hypertension, screening) plus pediatric growth curves.
**Editable in this screen:** Only while a contact is open (grayed out otherwise); date-stamped, with an optional comment.
**Obligation flags:** patient-facing (Helena sync requires patient confirmation) | validation (date-stamped, contact-scoped entry).
**Notes:** Auto-populated by a linked [[Zorgaanpakken]] set (e.g. diabetes monitoring parameters).

## Labo (incl. Laboaanvraag) — Dossiers › Medisch › Labo
**Purpose:** Laboratory results, grouped by set, plus outbound lab request creation.
**Data objects:** Results (green = complete, yellow = incomplete, abnormal values in red), a chronological "all sets" view, and — via "Nieuw" — a new lab request.
**Editable in this screen:** Results are read-only (status/confidentiality/links only); a new request is created and sent via "Nieuw," which requires the lab interface pre-configured under Configuratie.
**Obligation flags:** audit-legal (read-only results preserve record integrity; status changes are logged) | validation (Laboaanvraag depends on a configured lab interface).
**Notes:** Abnormal values also surface on the [[Dashboard (Medisch)]].

## Medicatie (incl. Prescriptions/Vitalink medicatieschema) — Dossiers › Medisch › Medicatie
**Purpose:** Active/stopped medication list, electronic prescribing, and the one shared medication schema synced externally.
**Data objects:** Medication entries (C = chronic), prescription status (green = not picked up, yellow = picked up, white = manual/no-print), the synced posology schema.
**Editable in this screen:** Yes — status changes, reactivation/discontinuation; prescriptions are editable up until transmission to Recip-e.
**Obligation flags:** signing (Recip-e prescription IDs) | audit-legal (pickup status and sync are both logged; complex posology auto-converts to free text for safety, and that conversion is documented) | patient-facing (prescriptions are visible to the patient via Helena).
**Notes:** Schema syncs to **Vitalink or Réseau Santé Wallon** (regional, not a free choice) and to pharmacies individually per prescription. Distinct from [[Aanvragen]], which is inbound, not outbound.

## Aanvragen (prescription proposals) — top-level › Aanvragen
**Purpose:** Inbox of prescription proposals sent in by nursing-home pharmacies for the GP to action.
**Data objects:** Proposal (patient, sender, drug, dosage, quantity); posology auto-populated from active medication history where available.
**Editable in this screen:** Yes — adjust posology, then Accept (issues a Recip-e prescription), Reject (deletes + notifies sender), or Accept-and-invoice (also creates a billable "Advice" attestation, max once/patient/day).
**Obligation flags:** signing (Accept issues a real prescription) | audit-legal (accept-and-invoice billing rule) | validation (posology must be populated; patient must already be known).
**Notes:** Separate top-level tab from [[Medicatie (incl. Prescriptions/Vitalink medicatieschema)]] — inbound proposals vs. outbound prescribing live in different places.

## Agenda — top-level › Agenda
**Purpose:** Appointment calendar — CareConnect doesn't run its own scheduling engine, it embeds one external system per practice (Progenda, MyOrganizer, Sanmax/Doctena, Introlution, or Mikrono).
**Data objects:** Appointments by date, patient-name links into the file.
**Editable in this screen:** Yes, once an external system is configured — create appointments directly from a Contact via the agenda icon; patient-file matching is automatic but a mismatch can be manually corrected or unlinked.
**Obligation flags:** patient-facing (several of the connected systems, e.g. Progenda, take patient self-service bookings) | validation (auto-match can mislink; manual correction exists).
**Notes:** Multi-user practices see agendas side-by-side.

## Berichten (Postvak in / Verzonden / Foutief) — top-level › Berichten
**Purpose:** Inbound/outbound secure-message hub (eHealthBox-style), split into three tabs.
**Data objects:** Postvak in (received — sender, patient, content, integration/read-status dots), Verzonden (sent), Foutief (messages that failed to parse — wrong format).
**Editable in this screen:** Yes — add/select conclusion text on a message, manually integrate a message lacking auto-match data (or spin up a new patient file from it), bulk-select and delete (Shift/Ctrl-click).
**Obligation flags:** audit-legal (an orange dot marks auto-integration into the file; single vs. double checkmark distinguishes one-user-read vs. all-staff-read) | validation (Foutief messages are unreadable-format, not just unmatched).
**Notes:** `[GAP: what recovery action, if any, exists for a Foutief message — resend request, manual re-parse, or dead end — isn't stated in either source]`

## Tarificatie

## Tarificatie 2.0 — status tabs (Klaar om verzenden / In verwerking / Afgewerkt / Geweigerd)
**Purpose:** Pipeline for electronic attestations (eAttest) and invoices from draft to mutuality settlement.
**Data objects:** Attestations by status — ready-to-send, processing, completed, refused — plus a "register payment" action.
**Editable in this screen:** Yes — refused eAttests can be corrected and resent; ready-to-send items remain editable pre-transmission.
**Obligation flags:** signing (eAttest/eFact — electronic invoicing gains legal effect only once transmitted to the mutuality) | audit-legal (post-transmission removal of an eAttest is a separate, constrained action).
**Notes:** Support-doc-derived (FAQ-style articles, not a full screen manual) — thinner sourcing than the Dossiers entries above. [[Contact / Nieuw contact (= Journaal)]]'s antedating rule (eAttest can't be backdated, eFact can) applies here too.

## Boekhouding / Geavanceerde tarifering — Tarificatie sub-collections
**Purpose:** Daily receipts/accounting overview; custom rates, memo codes, third-party payers, personalized invoices.
**Data objects / Editable / Obligation flags:** `[GAP: not crawled — low playground priority, per task scope]`
**Notes:** Named sub-collections exist under Tarificatie; intentionally not crawled in depth.

---

## Other collections (skimmed for missing screens only)

## Statistiek — Populatieonderzoek / eGMD / preventie module
**Purpose:** Practice-level population statistics — screening cohorts, eGMD stats, flu-vaccination stats, type-2-diabetes/cardiovascular early-detection stats — distinct from any single patient file.
**Data objects:** Cohort/report data per statistic type; bulk patient-email export across active files.
**Editable in this screen:** `[GAP: not crawled in detail — report-generation only, per skim]`
**Obligation flags:** audit-legal (eGMD statistics tie to the same GMD concept as [[Terugbetaling & Hoofdstuk IV]]).
**Notes:** Surfaced only because the task brief flagged population/statistics as a screen the map might otherwise miss — confirmed to exist as its own top-level collection.

## Medisch huis, Configuratie, FAQ, diabetes-pathway collection
**Purpose:** Group-practice enrollment/role admin (Medisch huis); user/hardware/certificate admin (Configuratie); troubleshooting FAQ; Type-2-diabetes reimbursement-rule FAQ.
**Data objects / Editable / Obligation flags:** not mapped — confirmed to be IT/account admin or a reimbursement-rule detail, not distinct screen structure, per task scope.
**Notes:** No additional patient-record or billing screens surfaced on skim beyond what's captured above.

---

## GAP list (screenshot shopping list)

- The source articles do contain embedded screenshots, but this map was compiled from text-based fetches describing them, not direct visual inspection — every screen above is sourced from article prose, not a screen review. Treat this as a standing caveat rather than 20 repeated line items; per-entry `[GAP: needs screenshot]` markers below flag specifics prose alone left unresolved.
- **Logboek**: exact event taxonomy, filtering, export — content beyond "admin-only audit log" wasn't available.
- **Foutief** messages: what recovery/reprocessing action exists, if any.
- **Zwangerschap** (pregnancy) sub-tab under Dossiers – Medisch: existence confirmed, no functional detail found.
- **Patiëntinfo** (a *sub-tab inside* Dossiers – Medisch) vs. **Patiëntdetails** (the *Administratief* tab): both surface identity-adjacent data under similar names — confirm in a screenshot whether these are genuinely two different screens or one screen referenced twice in the manual's own IA.
- Exact field list included in a SumEHR export (the Export sub-article was referenced but not itself fetched) — worth a follow-up pass if the playground needs SumEHR field-level detail.
- **Tarificatie 2.0** tab layout and the refusal/resubmit flow — FAQ-derived, not screenshot-verified.
- **Boekhouding** and **Geavanceerde tarifering**: not crawled at all (low priority per task scope).
- **Statistiek / Populatieonderzoek** dashboard: existence and topic confirmed, no layout or editability detail found.
