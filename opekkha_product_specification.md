# Opekkha --- Product Requirements & Coding-Agent Build Specification

**Document type:** Product requirements document (PRD) + implementation
brief\
**Status:** Draft for MVP development\
**Working product name:** Opekkha (অপেক্ষা)\
**Product category:** Personal digital letters, scheduled messages,
memories and anonymous notes\
**Primary market:** Bangladesh; Bengali-first, with English and Banglish
support\
**Product inspiration:** OpenWhen-style scheduled letters and emotional
experiences, with selected sharing/growth mechanics observed in
Opekkha.me\
**Important:** This is an original product specification. Do not copy
another product's branding, UI assets, source code or proprietary
implementation.

------------------------------------------------------------------------

## 1. Product vision

Build a calm, beautiful, mobile-first platform that helps people create
meaningful digital messages for people they care about. A sender can
prepare a letter now and let its recipient open it at a chosen moment:
when they are sad, when they miss the sender, on a birthday, after an
important event, or on a future date.

The product should feel personal and emotionally meaningful---not like
an anonymous social network, public feed, or engagement-maximizing
messaging app.

### Core promise

**Write something today. Let someone open it when it matters.**

### Product principles

1.  **Private by default:** Letters are private to their intended
    recipient unless the creator deliberately chooses a public or
    shareable format.
2.  **Recipient-first:** The opening experience should be simple, warm
    and distraction-free.
3.  **Bengali-first:** Natural Bangla typography, copy, dates,
    localization and cultural context are first-class requirements.
4.  **Low-friction sharing:** Users can share an invitation or a
    designed letter preview without exposing private letter content.
5.  **Trust and control:** Clear delivery rules, privacy controls,
    deletion, blocking and reporting.
6.  **No artificial urgency:** No streaks, manipulative notifications,
    infinite feed or pressure to open content.
7.  **Progressive scope:** Validate the core letter experience before
    adding AI, complex social features or a large marketplace.

------------------------------------------------------------------------

## 2. Product positioning and differentiation

### Target audiences

-   Couples and long-distance partners.
-   Friends who want to encourage or surprise each other.
-   Family members, including parents writing to children.
-   People preparing birthday, anniversary, graduation or milestone
    messages.
-   Bengali-speaking users who prefer Bangla, English or Banglish.

### Main use cases

-   "Open when you miss me."
-   "Open when you feel sad."
-   "Open on your birthday."
-   "Open after your exam."
-   "Open when we meet again."
-   "Open this one year from today."
-   A jar of small notes someone can pick from.
-   A private collection of shared memories.

### Differentiation

  -----------------------------------------------------------------------
  Typical anonymous-message product   Opekkha
  ----------------------------------- -----------------------------------
  Focus on receiving anonymous        Focus on intentional, meaningful
  messages                            messages

  Public or semi-public social        Private relationships and invited
  mechanics                           recipients

  Short-lived interaction             Messages that can be saved and
                                      revisited

  Engagement/feed-led                 Recipient-led, calm experience

  Generic language and templates      Bengali-first writing, templates
                                      and design
  -----------------------------------------------------------------------

Opekkha may offer an optional anonymous-note experience later, but it
must not become the primary product identity.

------------------------------------------------------------------------

## 3. Scope and release strategy

### MVP --- build first

1.  Landing page and product explanation.
2.  Account creation and sign-in.
3.  User profile and shareable profile/invitation link.
4.  Create a digital letter.
5.  Choose a delivery/opening condition.
6.  Invite recipient through a private link.
7.  Recipient opening page and letter reveal.
8.  Letter dashboard: sent, received, drafts and scheduled.
9.  Image/card export for sharing.
10. Basic Facebook sharing handoff and generic share link.
11. Email or in-app delivery notifications, depending on configured
    providers.
12. Basic privacy, deletion, reporting and abuse controls.
13. Bengali and English interface.
14. Responsive mobile-first UI.

### V1 --- after MVP validation

-   Memory Box: private collection of photos, notes and milestones.
-   Note Jar: a collection of small notes that the recipient opens one
    at a time.
-   Future Letters: date-based letters scheduled months or years ahead.
-   Group letters for birthdays, farewells and celebrations.
-   More card themes, fonts and backgrounds.
-   Voice notes and image attachments.
-   Recipient reactions or a private thank-you response.
-   Premium plans and payment integration, only after validating
    willingness to pay.

### Later / do not build before validation

-   AI letter writing or rewriting.
-   Public discovery feed.
-   Anonymous open inbox.
-   Full social graph and friend recommendations.
-   Real-time chat.
-   Complex gamification.
-   Public creator marketplace.
-   Native mobile apps, unless the web MVP proves demand or a required
    platform API cannot be delivered well on web.

### Explicit non-goals for MVP

-   Do not build a clone of OpenWhen or Opekkha.me.
-   Do not assume access to a recipient's Facebook account or private
    data.
-   Do not require Facebook Login.
-   Do not promise that the web app can publish a Story directly to
    Facebook without user action.
-   Do not expose private letter content in public share previews,
    analytics events or URLs.
-   Do not add AI features before the core workflow is reliable.

------------------------------------------------------------------------

## 4. Roles and permissions

### Visitor (not signed in)

Can: - View landing page and public product information. - Open a valid
invitation link. - Read a letter if the link's access rules permit it. -
Send a note if the sender has enabled that specific flow. - Sign up or
sign in.

Cannot: - Browse private user dashboards. - Enumerate users, letters or
invitation tokens. - View private letters without authorization.

### Registered sender

Can: - Create, edit and delete drafts. - Schedule or configure
letters. - Invite recipients. - View delivery/open status where
applicable. - Revoke or change access to a letter, subject to delivery
rules. - Export a share card. - Manage profile, privacy and notification
settings. - Report abuse or block an account.

### Recipient

Can: - Open letters addressed to them or accessible through a valid
invitation. - View attachments permitted by the letter. - Save a letter
to their account, if signed in and allowed. - Send a private
acknowledgement if enabled. - Report a letter or block the sender.

### Administrator / moderator

Can: - Review abuse reports. - Suspend or restrict abusive accounts. -
Remove content that violates policy. - Review operational delivery
failures. - Access only the minimum information needed for moderation,
with audit logging.

------------------------------------------------------------------------

## 5. Core feature specifications

## 5.1 Landing page and onboarding

### Landing page sections

-   Hero headline and short explanation.
-   Primary CTA: "Write a letter" / "Create your first letter".
-   Example use cases: "Open when..."
-   How it works: Write → Choose when → Share → Open.
-   Preview of a letter/card.
-   Bengali and English language switch.
-   Privacy explanation.
-   FAQ and footer links: About, Privacy, Terms, Contact.

### Requirements

-   Mobile-first responsive layout.
-   Fast initial load and accessible contrast.
-   SEO title, description, Open Graph metadata.
-   Do not display real user letters as examples without explicit
    consent.
-   Use original illustrations and licensed fonts/assets.

### Onboarding

Keep onboarding short. Ask for only essential details: - Display name. -
Email or supported authentication method. - Preferred language. -
Optional profile image.

Do not force users to import contacts or connect social accounts.

------------------------------------------------------------------------

## 5.2 Authentication and account

Suggested MVP authentication: - Email magic link or email/password. -
Optional Google sign-in if supported by the existing project. - Facebook
Login is not required for the core product.

Requirements: - Email verification if using password authentication. -
Secure session handling. - Password reset flow if passwords are
supported. - Account deletion request. - Rate-limit sign-in,
verification and reset endpoints. - Never expose authentication secrets
in client code.

------------------------------------------------------------------------

## 5.3 Profile and personal link

Each user receives a non-guessable public/invitation identifier, for
example:

`https://example.com/u/<public-slug>`

Profile page may show: - Display name. - Optional avatar. - Short bio,
optional. - A call-to-action to send a note or create an invitation.

Privacy settings: - Profile visibility: private / link-accessible /
public. - Allow or disallow incoming notes. - Allow or disallow
anonymous notes, if that feature is enabled. - Regenerate or disable
personal link. - Block users.

Do not expose email, phone number, internal user ID or private profile
fields.

------------------------------------------------------------------------

## 5.4 Letter creation

### Letter fields

Required: - Letter title or "Open when..." prompt. - Message body. -
Opening/delivery rule. - Recipient method or access mode.

Optional: - Sender display name or "from me". - Cover design/theme. -
Background color or image. - Recipient name. - Photo attachment. - Voice
note (V1). - Signature. - Closing line. - Reminder/notification
preference.

### Letter editor

-   Comfortable writing width and readable line length.
-   Bengali Unicode input must work correctly.
-   Support Bangla, English and Banglish text.
-   Autosave drafts with visible save state.
-   Character count only if useful; avoid restrictive limits without a
    product reason.
-   Preview the recipient's opening experience before sending.
-   Validate required fields and show clear errors.
-   Confirm before leaving with unsaved changes.

### Templates / prompts

Initial examples: - Open when you miss me. - Open when you feel sad. -
Open when you need courage. - Open when you cannot sleep. - Open on your
birthday. - Open on our anniversary. - Open after your exam. - Open when
we meet again. - Open one year from today.

Templates should be editable starting points, not locked formats.

------------------------------------------------------------------------

## 5.5 Opening and delivery rules

Support these rule types:

### A. Open on a date/time

Sender selects: - Date. - Time (optional; default to a clearly stated
local time). - Time zone.

Rules: - Store timestamps in UTC. - Preserve the intended IANA time zone
(e.g. `Asia/Dhaka`) for display and scheduling. - Validate that the
selected time is in the future. - Display the recipient's opening time
clearly. - Define behavior if the recipient's device uses a different
time zone.

### B. Open after a time interval

Examples: - 7 days after sending. - 30 days after sending. - 1 year
after sending.

Calculate and persist the target timestamp at send time. Do not
recalculate it on every page load.

### C. Open when the recipient chooses

The letter can be opened immediately through its invitation link. The
"Open when..." prompt is thematic, not a technical lock.

### D. Optional future rule: recipient milestone confirmation

A sender may choose a prompt such as "Open after your exam" and the
recipient confirms the milestone. This is not objectively verifiable and
must be clearly described as a trust-based interaction.

### Access enforcement

-   Enforce opening conditions on the server, not only in the UI.
-   Before the opening time, show a sealed/envelope state and the
    scheduled opening date.
-   Do not send the message body to the browser before it is eligible to
    open.
-   A signed or random access token must be high entropy and
    unguessable.
-   Allow sender revocation where appropriate.
-   Define whether an already-opened letter remains accessible if the
    sender later deletes or revokes it.

------------------------------------------------------------------------

## 5.6 Invitation and recipient flow

### Invitation methods

MVP: - Copy private link. - Native device share sheet via Web Share API
where available. - Share through a generated image/card. - Optional
email invitation if an email provider is configured.

V1: - WhatsApp share link. - Messenger share link, where supported by
the platform. - QR code.

### Recipient journey

1.  Recipient opens invitation link.
2.  Server validates token and access rule.
3.  If locked, show sealed letter, sender label (if configured) and
    opening date.
4.  If available, show a deliberate "Open letter" action.
5.  Reveal letter with a short, tasteful animation.
6.  Offer save, acknowledgement or share options according to sender
    settings.
7.  Do not force account creation just to read a letter unless the
    sender selected account-bound access.

### Link behavior

-   Use opaque tokens, not sequential IDs.
-   Support revocation and expiration.
-   Prevent search engine indexing of private invitation pages.
-   Add `noindex` metadata and appropriate cache headers.
-   Avoid leaking message body or recipient details in Open Graph
    previews.

------------------------------------------------------------------------

## 5.7 Letter dashboard

Dashboard tabs: - **Received:** letters the user can access or has
saved. - **Sent:** letters created and sent. - **Scheduled:** sent
letters that are not yet openable. - **Drafts:** unsent letters. -
**Archived:** optional later.

Each letter card should show: - Title / prompt. - Recipient or sender
display name. - Status: Draft, Scheduled, Ready to open, Opened,
Revoked, Expired. - Scheduled date if applicable. - Last updated date. -
Contextual actions.

Actions: - Open / preview. - Edit draft. - Copy invitation link. -
Export card. - Revoke link. - Delete. - Archive (if implemented).

Never show "Opened" unless the backend has recorded a successful opening
event.

------------------------------------------------------------------------

## 5.8 Letter reveal experience

The opening experience is a key differentiator.

Design direction: - Warm, calm and personal. - Envelope or folded-paper
metaphor. - Subtle animation, short duration and reduced-motion
support. - Readable typography for Bengali and English. - Minimal
controls and no distracting feed. - Optional ambient sound must be off
by default and user-initiated.

Letter view: - Sender and recipient labels, if configured. - Title /
"Open when..." prompt. - Full letter body. - Attachments. - Date created
and/or intended opening date, if the sender chooses to show it. -
Optional acknowledgement.

Do not reveal sensitive sender metadata.

------------------------------------------------------------------------

## 5.9 Note Jar (V1)

A sender creates a jar containing multiple short notes.

Examples: - "Open one when you need a smile." - "A little reminder that
I believe in you." - "One reason I appreciate you."

Requirements: - Jar title and description. - One or more notes. -
Optional cover design. - Recipient can open one note at a time. - Define
whether notes can be reopened. - Show remaining note count only if
sender enables it. - Do not reveal all notes in page source or API
responses before they are opened. - Each note opening should be recorded
server-side to prevent bypassing the one-at-a-time rule.

------------------------------------------------------------------------

## 5.10 Memory Box (V1)

A private collection for a pair or individual: - Text memories. -
Photos. - Dates and milestones. - Captions. - Optional tags. -
Invite-only access.

Requirements: - Explicit access control. - Upload size/type
validation. - Signed, time-limited media URLs for private files. -
Delete individual items and entire box. - Do not make memories publicly
discoverable by default.

------------------------------------------------------------------------

## 5.11 Future Letters (V1)

Allow users to write letters to: - Their future self. - A partner or
friend. - A child or family member.

Requirements: - Long-term scheduled delivery. - Clear explanation that
delivery depends on the service remaining operational and the recipient
retaining access to the delivery channel. - Sender can edit or cancel
before the scheduled send time. - Delivery job retries and failure
monitoring. - Do not guarantee delivery years in the future without
explaining operational limitations.

------------------------------------------------------------------------

## 5.12 Group letters (later V1)

Use cases: - Birthday messages from a group. - Farewell or graduation
book. - Wedding messages.

Requirements: - Organizer creates a group collection. - Invite
contributors with individual tokens. - Contributors can submit text and
optional media. - Organizer controls whether contributors can see other
submissions. - Set a submission deadline. - Publish or deliver the
collection to the recipient. - Moderate abuse and malicious uploads.

------------------------------------------------------------------------

## 6. Facebook and social sharing integration

This section is important, but do not overstate what Meta APIs allow.

### 6.1 Two distinct sharing experiences

**A. Share a personal invitation link**

-   User copies a link or opens the system share sheet.
-   The link can be shared in Facebook posts, Messenger, WhatsApp or
    other supported apps.
-   A generic link preview may show the product's logo and a neutral
    invitation.
-   Never include private letter content in the link preview.

**B. Share a designed image to Facebook Story**

-   Generate a 9:16 image (recommended target: 1080 × 1920).
-   The image can contain a tasteful letter excerpt only if the sender
    explicitly chooses to share it.
-   Include product branding and an optional call-to-action.
-   Where a supported native app integration exists, hand off the image
    to Facebook's Story composer.
-   The user must review and publish the Story themselves.

### 6.2 Important platform limitation

Do not assume a normal website can directly publish a Facebook Story to
a user's account. Story sharing generally relies on supported native
platform integrations and user action. Verify the current official Meta
documentation and SDK requirements before implementation.

For a web-only MVP: 1. Generate a downloadable/shareable image. 2. Use
Web Share API when supported. 3. Provide "Save image" and "Copy link"
fallbacks. 4. Explain that the user can upload the image to their Story
manually. 5. Do not label a generic share action as "Post directly to
Facebook Story".

For a native Android/iOS app later: - Investigate Meta's official
Sharing to Stories capabilities and current SDK requirements. - Confirm
supported image formats, URL schemes, app IDs, platform versions and app
availability. - Test installed/not-installed Facebook behavior. -
Provide a fallback if Facebook is unavailable. - Do not request Facebook
Login permissions just to share an image.

### 6.3 Share-card generator

Presets: - Minimal paper. - Envelope. - Floral / celebratory. - Bengali
typography. - Birthday / anniversary. - Neutral branded invitation.

Card contents: - Optional sender display name. - Optional recipient
name. - Short prompt or explicitly selected excerpt. - Decorative
design. - Product name or small logo. - Optional QR code or short URL.

Requirements: - User can preview before exporting. - User controls what
text appears. - Never export the full private letter without explicit
action. - Avoid embedding access tokens in QR codes visible to the
public unless the user deliberately chooses a public invitation. -
Generate image server-side or client-side with consistent Bengali font
rendering. - Validate fonts and Unicode shaping in exported images. -
Include alt text / accessible text alternative where possible.

### 6.4 Open Graph metadata

For public marketing pages: - Use product title, description and
approved brand image.

For private letter/invitation URLs: - Use a generic title and generic
image. - Do not expose letter title, message body, recipient name or
sender email in crawler-visible metadata. - Avoid caching private
content in social preview crawlers.

------------------------------------------------------------------------

## 7. Notifications and delivery

MVP: - Email notification when a letter becomes available, if email
delivery is configured and the recipient has consented or the sender's
invitation flow permits it. - In-app notification for signed-in users.

V1: - Reminder before a scheduled opening, if the recipient has opted
in. - Sender notification when a letter is opened, if enabled. - Group
contribution reminders.

Rules: - Respect notification preferences. - Do not send repeated
reminders for the same event. - Use an idempotency key for each
scheduled notification. - Track provider delivery status and failures. -
Include a clear link to manage notification preferences. - Do not put
private letter content in email subject lines or notification previews
by default.

------------------------------------------------------------------------

## 8. Localization and accessibility

### Languages

MVP: - Bengali (`bn`) - English (`en`)

Consider Banglish as user-entered content, not necessarily a separate UI
locale.

Requirements: - All interface copy stored in localization files. - User
can switch language. - Bengali numerals/date formatting may be supported
as a preference. - Use fonts with good Bengali glyph coverage and
correct shaping. - Test mixed Bengali/English text, punctuation, emoji
and line wrapping. - Avoid hardcoded English strings in components. -
Store timestamps in UTC and format using the selected locale and
intended time zone.

### Accessibility

-   Keyboard navigation.
-   Visible focus states.
-   Semantic headings and buttons.
-   Sufficient contrast.
-   Screen-reader labels for envelope and reveal actions.
-   Respect `prefers-reduced-motion`.
-   Do not communicate locked/unlocked state by color alone.
-   Support browser zoom and large text.

------------------------------------------------------------------------

## 9. Monetization (not required for MVP)

Start with a useful free product. Validate retention and sharing before
adding payment friction.

Possible later tiers:

**Free** - Limited number of active scheduled letters, if limits are
needed. - Core letter editor and basic themes. - Shareable invitation
links.

**Premium** - More active letters. - Premium themes and typography. -
More attachment storage. - Voice notes. - Memory Box. - Group letters. -
Custom branding or longer-term archive features.

Bangladesh payment options to investigate: - bKash. - Nagad. - Cards
through a supported local payment gateway.

Do not hardcode prices before user research. Clearly communicate
subscription renewal, cancellation, refunds and storage limits.

------------------------------------------------------------------------

## 10. Data model (suggested relational schema)

Use UUID primary keys. Add `created_at` and `updated_at` to mutable
records. Apply database constraints and indexes. Names are suggestions;
adapt to the existing codebase.

### `profiles`

-   `id` UUID, primary key, references auth user.
-   `display_name` text.
-   `username` text, unique, nullable.
-   `avatar_path` text, nullable.
-   `bio` text, nullable.
-   `preferred_locale` text, default `bn`.
-   `timezone` text, default `Asia/Dhaka`.
-   `profile_visibility` enum: `private`, `link`, `public`.
-   `allow_incoming_notes` boolean.
-   `created_at`, `updated_at`.

### `letters`

-   `id` UUID.
-   `sender_id` UUID, references profiles.
-   `recipient_id` UUID, nullable for link-only recipient.
-   `recipient_name` text, nullable.
-   `title` text.
-   `prompt` text, nullable.
-   `body` text.
-   `status` enum: `draft`, `scheduled`, `available`, `opened`,
    `revoked`, `expired`.
-   `access_mode` enum: `account`, `private_link`.
-   `opening_rule` enum: `immediate`, `at_datetime`, `after_interval`,
    `recipient_confirmation`.
-   `opens_at` timestamptz, nullable.
-   `sender_timezone` text.
-   `scheduled_send_at` timestamptz, nullable.
-   `theme_id` text, nullable.
-   `sender_label` text, nullable.
-   `allow_acknowledgement` boolean, default false.
-   `opened_at` timestamptz, nullable.
-   `created_at`, `updated_at`, `deleted_at` nullable.

### `letter_access_tokens`

-   `id` UUID.
-   `letter_id` UUID.
-   `token_hash` text, unique.
-   `expires_at` timestamptz, nullable.
-   `revoked_at` timestamptz, nullable.
-   `created_at`.

Store a hash of a high-entropy token rather than the raw token. Return
the raw token only once at creation time.

### `letter_attachments`

-   `id` UUID.
-   `letter_id` UUID.
-   `storage_path` text.
-   `mime_type` text.
-   `file_size_bytes` bigint.
-   `alt_text` text, nullable.
-   `created_at`.

### `letter_events`

-   `id` UUID.
-   `letter_id` UUID.
-   `actor_id` UUID, nullable.
-   `event_type` text: `created`, `scheduled`, `invited`, `opened`,
    `revoked`, `acknowledged`, `deleted`.
-   `metadata` JSONB, restricted to non-sensitive operational data.
-   `created_at`.

Do not store full letter bodies or access tokens in event metadata.

### `notification_jobs`

-   `id` UUID.
-   `letter_id` UUID.
-   `recipient_id` UUID, nullable.
-   `channel` text.
-   `event_type` text.
-   `scheduled_for` timestamptz.
-   `status` enum: `pending`, `processing`, `sent`, `failed`,
    `cancelled`.
-   `attempt_count` integer.
-   `idempotency_key` text, unique.
-   `last_error` text, sanitized.
-   `created_at`, `updated_at`.

### `share_cards`

-   `id` UUID.
-   `user_id` UUID.
-   `letter_id` UUID, nullable.
-   `template_id` text.
-   `storage_path` text, nullable.
-   `visibility` enum: `private`, `public`.
-   `created_at`.

### `blocks`

-   `id` UUID.
-   `blocker_id` UUID.
-   `blocked_id` UUID.
-   `created_at`.
-   Unique constraint on `(blocker_id, blocked_id)`.

### `reports`

-   `id` UUID.
-   `reporter_id` UUID, nullable.
-   `letter_id` UUID, nullable.
-   `reported_user_id` UUID, nullable.
-   `reason` text.
-   `details` text, nullable.
-   `status` enum: `open`, `reviewing`, `resolved`, `dismissed`.
-   `created_at`, `resolved_at`.

### V1 tables

-   `note_jars`
-   `jar_notes`
-   `jar_note_openings`
-   `memory_boxes`
-   `memory_items`
-   `group_letters`
-   `group_contributors`
-   `group_submissions`
-   `subscriptions`
-   `payment_transactions`

------------------------------------------------------------------------

## 11. API / server action outline

Adapt to the framework's conventions. These are logical operations, not
mandatory route names.

### Authentication/profile

-   `GET /api/me`
-   `PATCH /api/profile`
-   `GET /api/profiles/:username`
-   `POST /api/profile-link/regenerate`

### Letters

-   `POST /api/letters` --- create draft.
-   `PATCH /api/letters/:id` --- edit authorized draft.
-   `POST /api/letters/:id/schedule` --- validate and schedule.
-   `POST /api/letters/:id/send` --- send/invite for immediate letter.
-   `GET /api/letters` --- list only authorized letters.
-   `GET /api/letters/:id/preview` --- sender preview.
-   `POST /api/letters/:id/revoke` --- revoke access.
-   `DELETE /api/letters/:id` --- delete according to retention policy.

### Recipient access

-   `GET /api/open/:token` --- return only permitted envelope/status
    data.
-   `POST /api/open/:token/reveal` --- server checks eligibility,
    returns letter content and records opening.
-   `POST /api/open/:token/acknowledge` --- optional acknowledgement.

### Sharing

-   `POST /api/letters/:id/share-card` --- authorize and generate a card
    from explicitly selected content.
-   `GET /api/share-card/:id` --- retrieve card only if authorized.
-   Client-side share sheet / download fallback.

### Moderation

-   `POST /api/reports`
-   `POST /api/users/:id/block`
-   Admin-only report review operations.

Every operation must verify authorization server-side. Do not rely on
hidden buttons or client-side checks.

------------------------------------------------------------------------

## 12. Suggested technical architecture

The coding agent must inspect the existing repository first and preserve
its established architecture where reasonable. Do not rewrite a working
project merely to match this suggested stack.

### Suggested stack if starting from scratch

-   Frontend: Next.js + React + TypeScript.
-   Styling: Tailwind CSS and an accessible component system.
-   Backend/database: Supabase Postgres.
-   Authentication: Supabase Auth.
-   File storage: Supabase Storage with private buckets for private
    attachments.
-   Scheduled delivery: a reliable scheduled job/queue (Supabase
    scheduled functions, an external worker, or the platform's existing
    scheduler).
-   Hosting: Vercel or the project's chosen host.
-   Email: a transactional email provider selected by the project owner.
-   Analytics: privacy-conscious event analytics.
-   Error monitoring: a service with sensitive-data scrubbing.

### Architecture rules

-   Keep business logic out of presentation components.
-   Validate input on the server with schemas.
-   Use typed database access.
-   Enforce row-level security (RLS) for every user-owned table.
-   Private files must not live in public buckets.
-   Use signed URLs with short expiry for private attachments.
-   Use server-side time checks for scheduled letters.
-   Make scheduled jobs idempotent and retryable.
-   Add indexes for common queries.
-   Use migrations for schema changes.
-   Keep secrets in environment variables.
-   Provide `.env.example` with names and descriptions, never real
    secrets.

### RLS / authorization expectations

-   A sender can read and modify their own drafts.
-   A sender can view their sent letters and permitted status metadata.
-   A recipient can read a letter only after authorization and when the
    opening condition is satisfied.
-   A private-link recipient can access only the letter associated with
    that valid token.
-   Users cannot enumerate tokens or letters.
-   A user cannot change `sender_id`, `recipient_id`, status or
    `opened_at` through arbitrary client updates.
-   Admin access must be explicit and audited.
-   Test RLS with at least two separate user accounts.

------------------------------------------------------------------------

## 13. Security, privacy and abuse prevention

This product handles personal and potentially sensitive messages. Treat
privacy as a core feature.

### Required safeguards

-   High-entropy random invitation tokens.
-   Store token hashes, not raw tokens.
-   Rate-limit token attempts and public submission endpoints.
-   Server-side authorization on every read/write.
-   RLS policies tested with multiple users.
-   Input validation and output encoding.
-   Upload MIME type, extension and size validation.
-   Malware scanning for uploads if available and appropriate.
-   Private object storage for letter attachments.
-   Signed URLs with expiry.
-   CSRF protection where applicable.
-   Secure, HTTP-only cookies where applicable.
-   Content Security Policy and secure headers.
-   Audit events for sensitive operations.
-   Secrets never committed to Git.
-   Scrub message bodies, emails, tokens and attachment URLs from logs
    and analytics.
-   Account deletion and data deletion workflow.
-   Backup and restore plan.
-   Privacy policy and terms before public launch.

### Abuse controls

-   Report a letter/user.
-   Block a sender.
-   Revoke invitation links.
-   Rate-limit anonymous submissions.
-   CAPTCHA or bot protection on suspicious public forms.
-   Prevent users from sending repeated unwanted messages.
-   Admin review queue.
-   Clear community guidelines.

### Privacy defaults

-   No public letter feed.
-   No public indexing of private letters.
-   No letter body in social previews.
-   No automatic sharing to social accounts.
-   No contact-book upload.
-   No tracking pixels in private letter content.
-   No use of private letters to train AI models.

------------------------------------------------------------------------

## 14. Analytics and product metrics

Track product health without collecting message contents.

### Activation

-   Landing page visit.
-   Signup completed.
-   First letter draft created.
-   First letter sent/scheduled.
-   Recipient invitation opened.

### Core value

-   Letter successfully revealed.
-   Time from invitation to opening.
-   Percentage of sent letters opened.
-   Percentage of users creating a second letter.
-   Share-card export rate.
-   Invitation-link share rate.

### Retention

-   Sender returns within 7/30 days.
-   Recipient becomes a sender.
-   Repeat letter creation.
-   Memory Box / Note Jar usage (later).

### Safety and reliability

-   Failed scheduled jobs.
-   Failed notification delivery.
-   Token abuse / rate-limit events.
-   Reports per active user.
-   Account deletion completion time.

Never send letter body, private title, recipient email or raw invitation
token to analytics.

------------------------------------------------------------------------

## 15. UI / screen inventory

### Public

1.  Landing page.
2.  How it works.
3.  Example use cases.
4.  Pricing (only when monetization exists).
5.  FAQ.
6.  Privacy policy.
7.  Terms.
8.  Contact.

### Authentication

9.  Sign up.
10. Sign in.
11. Verify email.
12. Reset password (if applicable).

### User app

13. Dashboard.
14. Create letter.
15. Edit draft.
16. Choose opening condition.
17. Recipient/invitation settings.
18. Sender preview.
19. Scheduled letter detail.
20. Sent letter detail.
21. Received letters.
22. Letter opening / reveal.
23. Profile settings.
24. Privacy settings.
25. Notification settings.
26. Share-card editor/export.

### Administration

27. Report queue.
28. Report detail.
29. User restriction/suspension.
30. Operational delivery status.

### V1 screens

31. Note Jar creation and view.
32. Memory Box.
33. Future Letters.
34. Group letter organizer.
35. Group contribution form.

------------------------------------------------------------------------

## 16. Design direction

### Visual character

-   Warm, intimate, thoughtful and modern.
-   Paper, envelope, letter, seal and keepsake motifs.
-   Calm whitespace and readable typography.
-   Avoid childish visuals or overly ornate wedding-card styling.
-   Make Bangla text look intentional, not like a translated
    afterthought.

### Design requirements

-   Responsive mobile-first layouts.
-   Consistent spacing, typography and color tokens.
-   Dark mode optional; not required for MVP.
-   Use original or properly licensed illustrations.
-   Keep animations subtle and respect reduced-motion settings.
-   Ensure the letter itself is the visual focus.
-   Do not overload the dashboard with decorative cards.

### Suggested tone of voice

Bangla should sound natural and warm, not machine-translated. English
should be concise and emotionally sincere. Avoid exaggerated claims such
as "forever guaranteed" for future delivery.

------------------------------------------------------------------------

## 17. MVP acceptance criteria

The MVP is not complete until all of the following work end-to-end.

### Account and profile

-   [ ] A visitor can create an account and sign in.
-   [ ] A user can edit display name and preferred language.
-   [ ] Private profile information is not exposed publicly.
-   [ ] A user can request account deletion.

### Create and schedule

-   [ ] A signed-in user can create and save a draft.
-   [ ] Bengali, English and mixed text render correctly.
-   [ ] Draft autosave works and shows save status.
-   [ ] A user can schedule a letter for a future date/time.
-   [ ] Time zone is preserved and displayed correctly.
-   [ ] Invalid or past opening dates are rejected.
-   [ ] Sender can preview the recipient experience.

### Invite and open

-   [ ] User can generate and copy a private invitation link.
-   [ ] Link token is unguessable and can be revoked.
-   [ ] An unauthorized user cannot access the letter.
-   [ ] A locked letter does not expose its body through API responses
    or page source.
-   [ ] A letter becomes available only after the server-side opening
    time.
-   [ ] Opening is recorded once and status is accurate.
-   [ ] The recipient can read a permitted letter without forced signup
    when link mode allows it.

### Sharing

-   [ ] User can export a share card.
-   [ ] User can choose exactly what text appears on the card.
-   [ ] Private content is not automatically included.
-   [ ] Copy link and native share fallbacks work.
-   [ ] Facebook Story wording accurately describes the available
    action.
-   [ ] If direct native Story handoff is not implemented, the UI offers
    save/share fallback rather than pretending to publish.

### Privacy and safety

-   [ ] RLS prevents one user from reading another user's private
    letters.
-   [ ] Private attachments are inaccessible without authorization.
-   [ ] User can revoke a link.
-   [ ] User can report content and block another user.
-   [ ] Rate limits protect public endpoints.
-   [ ] Logs and analytics do not contain message bodies or raw tokens.

### Quality

-   [ ] Mobile layout works on common screen sizes.
-   [ ] Keyboard navigation works for primary flows.
-   [ ] Reduced-motion preference is respected.
-   [ ] Loading, empty, success and error states exist.
-   [ ] Tests cover critical authorization and scheduling behavior.
-   [ ] Deployment and environment setup are documented.

------------------------------------------------------------------------

## 18. Testing plan

### Unit tests

-   Opening-rule calculations.
-   Time-zone conversions.
-   Token generation and hashing.
-   Letter status transitions.
-   Share-card content selection.
-   Input validation.

### Integration tests

-   Create draft → schedule → becomes available.
-   Create immediate letter → invite → recipient opens.
-   Locked token cannot retrieve body.
-   Revoked token cannot open.
-   Sender cannot edit another user's letter.
-   Recipient cannot access unrelated letters.
-   Duplicate scheduled job does not send duplicate notification.
-   Private attachment access is denied without authorization.

### End-to-end tests

-   Signup and onboarding.
-   Create a Bengali letter.
-   Schedule for a future time.
-   Copy invitation link in a second browser/session.
-   Verify locked state.
-   Advance test clock or use controlled test data.
-   Open and verify the letter.
-   Export share card and inspect Bengali glyph rendering.
-   Test mobile browser share and fallback behavior.

### Manual platform tests

-   Safari on iOS.
-   Chrome on Android.
-   Desktop Chrome and Safari.
-   Facebook installed vs not installed for any native integration.
-   Facebook Story handoff only if implemented through a currently
    supported official route.

------------------------------------------------------------------------

## 19. Implementation plan

Suggested sequence. The coding agent should break this into small,
reviewable PRs and avoid implementing all features in one pass.

### Phase 0 --- repository inspection

-   Inspect existing framework, package manager, routes, database, auth,
    UI system and deployment configuration.
-   Identify reusable components and existing conventions.
-   Report the current architecture and proposed changes before large
    refactors.
-   Do not overwrite existing user work.

### Phase 1 --- foundation

-   Database migrations.
-   Authentication and profiles.
-   Localization.
-   Design tokens and shared components.
-   RLS policies and tests.

### Phase 2 --- core letter workflow

-   Letter editor and drafts.
-   Opening rules.
-   Private invitation tokens.
-   Recipient envelope and reveal experience.
-   Dashboard and status tracking.

### Phase 3 --- sharing

-   Share-card templates.
-   Image export.
-   Copy link and Web Share API.
-   Facebook Story native integration only if platform and app
    architecture support it; otherwise ship a truthful save/share
    fallback.

### Phase 4 --- reliability and launch readiness

-   Scheduled job processing.
-   Notifications.
-   Rate limits.
-   Abuse reporting and blocking.
-   Monitoring, analytics and error handling.
-   Accessibility, responsive QA and security tests.

### Phase 5 --- V1 validation and expansion

Only after MVP usage data: - Note Jar. - Memory Box. - Future Letters. -
Group letters. - Premium themes and payments.

------------------------------------------------------------------------

## 20. Coding-agent operating instructions

The coding agent should follow these instructions throughout
implementation.

1.  **Inspect before coding.** Read the repository, README, package
    scripts, environment examples, database schema and existing
    patterns.
2.  **Do not assume the stack.** If an existing app is present, adapt
    this specification to it. Do not migrate frameworks without a clear
    technical reason.
3.  **Plan first.** Return a concise implementation plan, affected
    files, schema changes and risks before making broad changes.
4.  **Build vertical slices.** Complete one end-to-end user journey at a
    time.
5.  **Prioritize the MVP.** Do not implement Note Jar, Memory Box, AI,
    group letters or payments unless explicitly requested after the core
    workflow is working.
6.  **Security is not optional.** Server-side checks and database
    authorization must protect every private resource.
7.  **Never trust client state.** The backend determines whether a
    letter is eligible to open.
8.  **Do not leak content.** Locked letter bodies, private metadata and
    raw access tokens must not appear in HTML, logs, analytics, previews
    or public APIs.
9.  **Use migrations.** Do not make undocumented manual database
    changes.
10. **Test as you go.** Add tests for time zones, authorization, token
    revocation and scheduled jobs.
11. **Handle failures.** Include loading, empty, error, retry and
    expired-link states.
12. **Keep UI consistent.** Reuse existing design components and ensure
    Bengali typography is tested.
13. **Be honest about Meta integration.** Verify current official
    documentation. Never claim that a web-only button publishes a
    Facebook Story if it only downloads or shares an image.
14. **Document setup.** Update README, `.env.example`, migrations and
    deployment instructions.
15. **Summarize every phase.** Report what changed, tests run, known
    limitations and the next recommended task.
16. **Do not invent credentials.** If a provider needs an API key,
    create a documented environment variable and ask the project owner
    to configure it.
17. **Preserve user data.** Never run destructive migrations, reset
    production databases or delete existing files without explicit
    approval.

### Required first response from the coding agent

Before implementation, return:

-   Existing repository architecture.
-   Which requirements are already implemented.
-   MVP gaps.
-   Proposed implementation sequence.
-   Database/schema changes.
-   External services or credentials required.
-   Risks, especially scheduling, private-link access and Facebook Story
    sharing.

Then begin with Phase 0 and proceed in small steps.

------------------------------------------------------------------------

## 21. Open product decisions

Do not block repository inspection on these questions. Use conservative
defaults and flag decisions that materially affect architecture.

1.  Is the product name definitely **Opekkha**, or is that only a working
    name?
2.  Should recipients be able to open a private-link letter without
    creating an account? **Recommended default: yes.**
3.  Should a sender be able to send a letter anonymously? **Recommended
    default: optional sender display name, but no unmoderated anonymous
    inbox in MVP.**
4.  Should letters be editable after sending? **Recommended default: no,
    except for clearly defined correction/revocation rules.**
5.  Should a letter remain accessible forever? **Recommended default:
    retain until deleted or account/data policy says otherwise; explain
    service limitations.**
6.  Is the first release web-only? **Recommended default: responsive web
    app.**
7.  Is direct Facebook Story sharing a launch requirement? **Recommended
    default: no; ship export + native share fallback first.**
8.  What is the free-tier limit? **Recommended default: do not impose a
    restrictive limit until usage and costs are understood.**

------------------------------------------------------------------------

## 22. Definition of success

The MVP succeeds if a new user can:

1.  Understand the product in seconds.
2.  Create a personal letter in Bangla or English.
3.  Choose when it can be opened.
4.  Share a private invitation link.
5.  Have the recipient open the letter without confusion.
6.  Trust that the letter is private and the opening rule is enforced.
7.  Want to create another letter for someone else.

**The first product milestone is not a large feature set. It is one
delightful, reliable letter journey that people genuinely want to
share.**
