# Design System: New Task Modal (RemindMee)
**Project ID:** 13692678390764865519

## 1. Visual Theme & Atmosphere
A calm, focused dark-mode experience with a soft, modern clarity. The UI feels “quietly premium”: muted slate surfaces, a gentle blue primary accent, and a bottom-sheet modal that floats above a blurred, desaturated background list. It balances density with comfort—compact information, but padded controls and rounded geometry keep it approachable.

## 2. Color Palette & Roles
- **Crisp Electric Blue (#258cf4):** Primary action color for CTAs, focus rings, and selected accents.
- **Soft Paper Gray (#f5f7f8):** Light background for the overall canvas in light mode.
- **Deep Night Navy (#101922):** Dark-mode base background for the app shell.
- **Ink Slate (#0f172a):** Primary dark text on light surfaces; used for headers and key labels.
- **Fog Slate (#f1f5f9):** Light borders and subtle surface separation in light mode.
- **Mist Slate (#e2e8f0):** Light surface fills and dividers in light mode.
- **Steel Slate (#334155):** Mid-contrast text and iconography in dark mode.
- **Charcoal Slate (#1e293b):** Dark surfaces for cards and inputs in dark mode.
- **Ash Slate (#64748b):** Secondary text and helper copy.
- **Granite Slate (#475569):** Iconography and tertiary text on light surfaces.

## 3. Typography Rules
- **Font Family:** Inter (sans-serif) for all UI text.
- **Hierarchy:**
  - Large section headers use bold weights (600–700) and larger sizes (text-2xl, text-xl).
  - Body and labels use medium weights (500–600) for clarity without heaviness.
  - Secondary metadata and helper text use regular weight (400–500).
- **Tone:** Tight, modern typography with clear emphasis; no decorative letter-spacing.

## 4. Component Stylings
- **Buttons:**
  - Primary CTA uses a bold fill in Electric Blue with white text, generous padding, rounded corners, and a soft colored shadow. Hover brightens slightly; active state subtly scales down.
  - Secondary actions are neutral: slate text on transparent or light/neutral surfaces with gentle hover backgrounds.
- **Cards/Containers:**
  - Task rows and modal panels use softly rounded corners (rounded-xl, rounded-t-3xl) with clean borders and subtle shadow depth (shadow-2xl for the modal).
  - Light mode surfaces are white with pale slate borders; dark mode surfaces use charcoal slates with semi-transparent borders.
- **Inputs/Forms:**
  - Inputs are tall and roomy with rounded corners, pale slate backgrounds, and crisp 1px borders.
  - Focus state uses a 2px Electric Blue ring to signal active attention.
  - Placeholder text is muted slate for low emphasis.

## 5. Layout Principles
- **Structure:** Bottom-sheet modal anchored to the lower edge, with a layered backdrop that fades and desaturates the underlying task list.
- **Spacing:** Consistent padding blocks (p-4, px-4) and comfortable vertical rhythms between sections (space-y-4 and space-y-6).
- **Alignment:** Clean left alignment for labels and inputs; action buttons expand to full width, with primary action visually dominant.
- **Density:** Moderate density—information-rich but softened by rounded geometry and generous input heights.

## 6. Design System Notes for Stitch Generation
Use this block verbatim in Stitch prompts to preserve visual consistency:

Visual language: Calm, modern dark-mode UI with muted slate surfaces, electric blue accents, and rounded geometry. Soft, premium atmosphere with clean typography and subtle depth.
Color roles: Primary Electric Blue (#258cf4) for CTAs and focus rings. Dark base background #101922. Light base background #f5f7f8. Slate neutrals for surfaces, borders, and text hierarchy.
Typography: Inter family. Headers bold (600–700), labels medium (500–600), body regular (400–500).
Components: Rounded-xl inputs and cards, rounded-t-3xl bottom sheets. Subtle borders, soft shadow depth for elevated panels. Primary CTA filled blue with white text and gentle glow.
Layout: Generous padding, left-aligned labels, full-width action buttons, moderate density.
