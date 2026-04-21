# Design Brief — Proctored Hiring Exam Platform

## Overview
Professional, trust-inspiring interface for high-stakes technical interviews. Corporate testing platform aesthetic (HackerRank/Codility). Light-first design with slate blue primary and minimal ornamentation.

## Tone & Differentiation
Austere professional, no-nonsense, secure. Every element reinforces credibility and focus. Minimal decoration emphasizes content clarity and exam integrity.

## Color Palette (OKLCH)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| Primary | 0.52 0.16 265 | 0.70 0.16 265 | Buttons, links, focus states |
| Secondary | 0.65 0.08 265 | 0.35 0.06 265 | Supporting UI, inactive tabs |
| Accent | 0.75 0.15 80 | 0.75 0.15 80 | Alerts, warnings, emphasis |
| Background | 0.97 0.01 260 | 0.125 0.01 260 | Page background |
| Card | 0.99 0 0 | 0.16 0.01 260 | Forms, content containers |
| Foreground | 0.15 0 0 | 0.94 0.01 260 | Body text, primary content |
| Muted | 0.75 0.04 260 | 0.30 0.04 260 | Placeholder, disabled, tertiary |
| Border | 0.92 0.02 260 | 0.25 0.02 260 | Dividers, input borders |

## Typography

| Layer | Font | Usage |
|-------|------|-------|
| Display | General Sans (400) | Headings, titles, branding |
| Body | DM Sans (400) | Instructions, questions, form labels, body text |
| Mono | Geist Mono (400) | Timer, code blocks, answer displays |

## Structural Zones

| Zone | Light | Dark | Treatment |
|------|-------|------|-----------|
| Header | bg-card, border-b | bg-card, border-b | Fixed, contains logo + session state |
| Main Content | bg-background | bg-background | Spacious card-based grid (1-2 columns) |
| Sidebar (Exam) | bg-card, shadow-card | bg-card, shadow-card | Fixed right panel for timer + progress (exam only) |
| Form Container | bg-card, shadow-card | bg-card, shadow-card | Centered, max-width 600px, rounded-sm |
| Footer | bg-muted/20, border-t | bg-muted/20, border-t | Sparse, compliance + links |

## Elevation & Depth
Card shadow (subtle slate blue tint) for layered depth. No shadows on interactive elements during hover — use background color shift instead.

## Component Patterns
- Buttons: Slate primary (default), slate secondary (alt), destructive (red)
- Forms: Minimal labels, clear focus indicators (ring only on input)
- Timer: Mono font, amber accent if < 5 mins, red if < 1 min
- Warnings: Amber accent bg-accent/10 with amber text
- Success: Green (chart-3) for pass indicator

## Spacing & Rhythm
Tight spacing (0.5rem gaps), form fields 1rem apart. Card margins 2rem on light mode. Question containers 1.5rem padding.

## Shape Language
Radius: 4px (sm), 6px (md), 0px corners for minimal aesthetic. No decorative shapes.

## Motion
Fade-in on page load (0.3s). Slide-in from top for notifications. Smooth transitions on all interactive elements (0.3s cubic-bezier). No bounce or playful animations.

## Constraints & Guardrails
- No full-width backgrounds except header/footer
- No gradient backgrounds (solid colors only)
- Consistent field heights (44px buttons/inputs)
- Max content width 1200px
- No decorative icons; use functional icons only

## Key Screens
1. **Registration**: Card-based form (name, email) → generated password display (highlight in card)
2. **Login**: Email + password, lockout counter, forgot password link
3. **Proctoring Consent**: Warning cards for camera/mic permissions, acknowledgment checkbox
4. **Exam Portal**: Question + options on left, timer + progress panel on right (sticky)
5. **Scoreboard**: Score breakdown table (by difficulty), pass/fail banner, time taken, proctoring flags
