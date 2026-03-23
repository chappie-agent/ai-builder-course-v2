---
name: huisstijl
description: |
  Brand identity en design tokens voor AI Builder Course. Gebruik deze skill ALTIJD wanneer de gebruiker vraagt om iets te maken "in mijn huisstijl", "in mijn branding", "in de stijl van mijn website", "met mijn kleuren", "on-brand", "branded", of wanneer er een visueel ontwerp, component, pagina, presentatie, document of marketing-materiaal gemaakt moet worden dat past bij het bestaande merk. Trigger ook bij: "maak het mooi", "style dit", "gebruik mijn design system", "in dezelfde stijl", "passend bij de site", "merk-consistent", of wanneer de gebruiker een landingspagina, email, social media post, of ander materiaal wil dat visueel aansluit bij AI Builder Course. Zelfs als de gebruiker niet expliciet om branding vraagt maar wel iets visueels maakt, gebruik dan deze skill om de juiste kleuren, fonts en stijl toe te passen.
---

# Huisstijl — AI Builder Course

Deze skill bevat alle design tokens en merkrichtlijnen voor AI Builder Course. Gebruik deze informatie als basis voor alles wat je maakt — van React componenten en HTML pagina's tot presentaties, documenten en afbeeldingen.

## Merkidentiteit

**Merknaam:** AI Builder Course
**Tagline:** A premium AI course for builders who want to ship real products with modern AI tools and workflows.
**Tone of voice:** Premium, warm, professioneel maar toegankelijk. Spreek builders aan als gelijken.

**Logo:** Tekst-gebaseerd logo — "AI" in een circulaire badge met donkerbruine achtergrond (`#2c231a`) en crème tekst (`#f5f0e8`). Bold, sans-serif. Gebruik dit patroon wanneer een logo-element nodig is.

## Kleurenpalet (Warm Brown/Cream)

Het merk gebruikt een warm, aards kleurenpalet dat premium en uitnodigend aanvoelt. Denk aan warme koffietinten, crème en zand.

### Primaire kleuren

| Rol | Light mode | Dark mode | Gebruik |
|-----|-----------|-----------|---------|
| Background | `#faf7f2` (warm crème) | `#1a140e` (diep bruin) | Pagina-achtergrond |
| Foreground | `#2c231a` (donker bruin) | `#f5f0e8` (crème) | Hoofdtekst |
| Primary | `#2c231a` (donker bruin) | `#f5f0e8` (crème) | Knoppen, links, nadruk |
| Primary foreground | `#f5f0e8` (crème) | `#2c231a` (donker bruin) | Tekst op primaire kleur |

### Secundaire kleuren

| Rol | Light mode | Dark mode | Gebruik |
|-----|-----------|-----------|---------|
| Secondary | `#f0e9dd` (beige) | `#362d22` (bruin) | Subtiele achtergronden |
| Muted | `#f0e9dd` (beige) | `#362d22` (bruin) | Gedempte secties |
| Muted foreground | `#6b5c4c` (medium bruin) | `#c4b5a0` (licht tan) | Secundaire tekst |
| Accent | `#ede6da` (licht beige) | `#4a3f33` (donker tan) | Hover states, badges |
| Ring/Focus | `#8b7355` (warm bruin) | `#8b7355` (warm bruin) | Focus rings, accenten |

### Borders & inputs

| Rol | Light mode | Dark mode |
|-----|-----------|-----------|
| Border | `#e8dfd0` (licht tan) | `#4a3f33` (donker tan) |
| Input | `#e8dfd0` (licht tan) | `#4a3f33` (donker tan) |

### Card & Popover

| Rol | Light mode | Dark mode |
|-----|-----------|-----------|
| Card | `#fdfaf6` (off-white crème) | `#2c231a` (donker bruin) |
| Card foreground | `#2c231a` | `#f5f0e8` |

### Gradiënt (hero/marketing)
Achtergrondgradiënt voor hero secties: `#d6c4b4` → `#f5f0e8` (warm beige naar crème).

### Samenvatting snelle keuzes
Wanneer je snel een kleur nodig hebt:
- **Donker accent / tekst:** `#2c231a`
- **Warm medium bruin:** `#8b7355`
- **Licht medium bruin:** `#6b5c4c`
- **Beige achtergrond:** `#f0e9dd`
- **Crème achtergrond:** `#faf7f2`
- **Off-white:** `#f5f0e8`
- **Destructive/error:** rood, `oklch(0.577 0.245 27.325)`
- **Success:** groen, `oklch(50.8% 0.118 165.612)`

## Typografie

- **Primair font:** Geist Sans (variabel font) — gebruik `font-family: var(--font-geist-sans)` of Tailwind `font-sans`
- **Monospace font:** Geist Mono — gebruik `font-family: var(--font-geist-mono)` of Tailwind `font-mono`
- **Font weight bold:** 700
- **Rendering:** `antialiased`, `text-rendering: optimizelegibility`

Wanneer je buiten het project werkt (bijv. een losse HTML pagina), gebruik dan als fallback: `'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif` — dit benadert de Geist Sans look het best.

## Spacing & Border Radius

- **Base radius:** `0.625rem` (10px)
- **Radius sm:** 6px
- **Radius md:** 8px
- **Radius lg:** 10px (= base)
- **Radius xl:** 14px

Gebruik afgeronde hoeken — het merk voelt zacht en uitnodigend aan, geen scherpe hoeken.

## Animaties

Gebruik subtiele entrance-animaties die premium aanvoelen:

- **Reveal up:** `translateY(18px)` → `translateY(0)` met `opacity: 0` → `1`
- **Duur:** 700ms
- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` (snelle start, zachte landing)
- **Staggering:** 0ms, 120ms, 220ms, 320ms voor opeenvolgende elementen
- Respecteer `prefers-reduced-motion`

## Component systeem

Het project gebruikt **shadcn/ui** (New York style) met **Tailwind CSS v4** en **Lucide icons**. Componenten worden gebouwd met `class-variance-authority` voor variants, en `clsx` + `tailwind-merge` voor className utilities.

Wanneer je componenten maakt binnen dit project:
- Gebruik de bestaande CSS variabelen (`bg-background`, `text-foreground`, `border-border`, etc.)
- Volg het shadcn/ui patroon met CVA variants
- Gebruik Lucide icons voor iconen

## Toepassing per context

**React/HTML componenten:** Gebruik de CSS variabelen en Tailwind classes. Lees `references/design-tokens.md` voor de volledige token-lijst.

**Presentaties (PPTX):** Gebruik het warme kleurenpalet — donkerbruin op crème achtergrond. Headers in `#2c231a`, body text in `#6b5c4c`, achtergronden in `#faf7f2` of `#f0e9dd`.

**Documenten (DOCX/PDF):** Zelfde kleurenpalet. Headers donkerbruin, accenten in `#8b7355`. Gebruik een schoon, modern sans-serif font.

**Email/Marketing:** Gebruik de hero gradiënt (`#d6c4b4` → `#f5f0e8`) als achtergrond. CTA knoppen in `#2c231a` met `#f5f0e8` tekst. Ronde hoeken (10px).

Voor de complete lijst van alle design tokens inclusief dark mode, sidebar, en chart kleuren, lees `references/design-tokens.md`.
