# Design Tokens — Volledige Referentie

Dit bestand bevat alle design tokens uit het AI Builder Course design system. De app-specifieke tokens (warm brown/cream) zijn de primaire brand tokens. De design-system globals zijn de basis waarop het gebouwd is.

## Inhoudsopgave
1. [App Theme — Light Mode](#app-theme-light-mode)
2. [App Theme — Dark Mode](#app-theme-dark-mode)
3. [Design System Globals — Light Mode](#design-system-globals-light-mode)
4. [Design System Globals — Dark Mode](#design-system-globals-dark-mode)
5. [Spacing & Radius](#spacing--radius)
6. [Typography](#typography)
7. [Animations](#animations)
8. [Tailwind Theme Mappings](#tailwind-theme-mappings)
9. [Component Patterns](#component-patterns)

---

## App Theme — Light Mode

Bron: `apps/app/app/styles.css` `:root`

```css
--background: #faf7f2;
--foreground: #2c231a;
--card: #fdfaf6;
--card-foreground: #2c231a;
--popover: #fdfaf6;
--popover-foreground: #2c231a;
--primary: #2c231a;
--primary-foreground: #f5f0e8;
--secondary: #f0e9dd;
--secondary-foreground: #2c231a;
--muted: #f0e9dd;
--muted-foreground: #6b5c4c;
--accent: #ede6da;
--accent-foreground: #2c231a;
--border: #e8dfd0;
--input: #e8dfd0;
--ring: #8b7355;
--sidebar: #f5f0e8;
--sidebar-foreground: #2c231a;
--sidebar-primary: #2c231a;
--sidebar-primary-foreground: #f5f0e8;
--sidebar-accent: #ede6da;
--sidebar-accent-foreground: #2c231a;
--sidebar-border: #e8dfd0;
--sidebar-ring: #8b7355;
```

## App Theme — Dark Mode

Bron: `apps/app/app/styles.css` `.dark`

```css
--background: #1a140e;
--foreground: #f5f0e8;
--card: #2c231a;
--card-foreground: #f5f0e8;
--popover: #2c231a;
--popover-foreground: #f5f0e8;
--primary: #f5f0e8;
--primary-foreground: #2c231a;
--secondary: #362d22;
--secondary-foreground: #f5f0e8;
--muted: #362d22;
--muted-foreground: #c4b5a0;
--accent: #4a3f33;
--accent-foreground: #f5f0e8;
--border: #4a3f33;
--input: #4a3f33;
--ring: #8b7355;
--sidebar: #241c14;
--sidebar-foreground: #f5f0e8;
--sidebar-primary: #f5f0e8;
--sidebar-primary-foreground: #2c231a;
--sidebar-accent: #362d22;
--sidebar-accent-foreground: #f5f0e8;
--sidebar-border: #4a3f33;
--sidebar-ring: #8b7355;
```

## Design System Globals — Light Mode

Bron: `packages/design-system/styles/globals.css` `:root`

```css
--background: oklch(1 0 0);
--foreground: oklch(0.145 0 0);
--card: oklch(1 0 0);
--card-foreground: oklch(0.145 0 0);
--popover: oklch(1 0 0);
--popover-foreground: oklch(0.145 0 0);
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
--secondary: oklch(0.97 0 0);
--secondary-foreground: oklch(0.205 0 0);
--muted: oklch(0.97 0 0);
--muted-foreground: oklch(0.556 0 0);
--accent: oklch(0.97 0 0);
--accent-foreground: oklch(0.205 0 0);
--destructive: oklch(0.577 0.245 27.325);
--destructive-foreground: oklch(0.577 0.245 27.325);
--success: oklch(50.8% 0.118 165.612);
--border: oklch(0.922 0 0);
--input: oklch(0.922 0 0);
--ring: oklch(0.708 0 0);
--chart-1: oklch(0.646 0.222 41.116);
--chart-2: oklch(0.6 0.118 184.704);
--chart-3: oklch(0.398 0.07 227.392);
--chart-4: oklch(0.828 0.189 84.429);
--chart-5: oklch(0.769 0.188 70.08);
--radius: 0.625rem;
--font-weight-bold: 700;
```

## Design System Globals — Dark Mode

Bron: `packages/design-system/styles/globals.css` `.dark`

```css
--background: oklch(0.145 0 0);
--foreground: oklch(0.985 0 0);
--card: oklch(0.145 0 0);
--card-foreground: oklch(0.985 0 0);
--popover: oklch(0.145 0 0);
--popover-foreground: oklch(0.985 0 0);
--primary: oklch(0.985 0 0);
--primary-foreground: oklch(0.205 0 0);
--secondary: oklch(0.269 0 0);
--secondary-foreground: oklch(0.985 0 0);
--muted: oklch(0.269 0 0);
--muted-foreground: oklch(0.708 0 0);
--accent: oklch(0.269 0 0);
--accent-foreground: oklch(0.985 0 0);
--destructive: oklch(0.396 0.141 25.723);
--destructive-foreground: oklch(0.637 0.237 25.331);
--success: oklch(50.8% 0.118 165.612);
--border: oklch(0.269 0 0);
--input: oklch(0.269 0 0);
--ring: oklch(0.439 0 0);
--chart-1: oklch(0.488 0.243 264.376);
--chart-2: oklch(0.696 0.17 162.48);
--chart-3: oklch(0.769 0.188 70.08);
--chart-4: oklch(0.627 0.265 303.9);
--chart-5: oklch(0.645 0.246 16.439);
```

## Spacing & Radius

```css
--radius: 0.625rem;        /* 10px — base */
--radius-sm: calc(var(--radius) - 4px);   /* 6px */
--radius-md: calc(var(--radius) - 2px);   /* 8px */
--radius-lg: var(--radius);               /* 10px */
--radius-xl: calc(var(--radius) + 4px);   /* 14px */
```

Mobile breakpoint: `768px`

## Typography

### Fonts
- **Sans:** Geist Sans (variable font) — `var(--font-geist-sans)`
- **Mono:** Geist Mono (variable font) — `var(--font-geist-mono)`
- **Fallback stack:** `'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif`

### Rendering
- `font-smooth: antialiased`
- `text-rendering: optimizelegibility`
- `touch-manipulation` on body

### Tailwind classes
- `font-sans` → Geist Sans
- `font-mono` → Geist Mono

## Animations

### Reveal Up (entrance animation)
```css
@keyframes revealUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

.reveal-up       { animation: revealUp 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.reveal-up-delay   { animation-delay: 120ms; }
.reveal-up-delay-2 { animation-delay: 220ms; }
.reveal-up-delay-3 { animation-delay: 320ms; }
```

### Accordion
```css
--animate-accordion-down: accordion-down 0.2s ease-out;
--animate-accordion-up: accordion-up 0.2s ease-out;
```

## Tailwind Theme Mappings

Alle CSS variabelen zijn gekoppeld aan Tailwind via `@theme inline`:

```css
--color-background: var(--background);
--color-foreground: var(--foreground);
--color-card: var(--card);
--color-card-foreground: var(--card-foreground);
--color-popover: var(--popover);
--color-popover-foreground: var(--popover-foreground);
--color-primary: var(--primary);
--color-primary-foreground: var(--primary-foreground);
--color-secondary: var(--secondary);
--color-secondary-foreground: var(--secondary-foreground);
--color-muted: var(--muted);
--color-muted-foreground: var(--muted-foreground);
--color-accent: var(--accent);
--color-accent-foreground: var(--accent-foreground);
--color-destructive: var(--destructive);
--color-border: var(--border);
--color-input: var(--input);
--color-ring: var(--ring);
--color-success: var(--success);
--color-chart-1 t/m --color-chart-5: var(--chart-1) t/m var(--chart-5);
--color-sidebar-*: var(--sidebar-*);
--font-sans: var(--font-geist-sans);
--font-mono: var(--font-geist-mono);
```

## Component Patterns

### Tech stack
- **UI library:** shadcn/ui (New York style)
- **CSS framework:** Tailwind CSS v4
- **Icons:** Lucide React
- **Variants:** class-variance-authority (CVA)
- **Class merging:** clsx + tailwind-merge
- **Theme:** next-themes (class-based, system preference enabled)
- **Animations:** tw-animate-css

### Tailwind usage in componenten
```tsx
// Typische component styling
className="bg-background text-foreground border-border"
className="bg-primary text-primary-foreground"
className="bg-muted text-muted-foreground"
className="bg-card text-card-foreground border rounded-lg shadow-sm"
className="ring-ring/50 focus-visible:ring-2"
```

### Schaduw utilities
- `shadow-xs` — subtiel
- `shadow-sm` — kaarten
- `shadow-lg` — modals/popovers

### Premium checkbox variant
```css
background: linear-gradient(180deg, #8b7355, #7a644a);
```

### Typography plugin (prose)
Het project gebruikt `@tailwindcss/typography` met custom prose kleuren die automatisch de brand tokens volgen:
- Prose body/headings/bold: `var(--color-foreground)`
- Prose links: `var(--color-primary)`
- Prose muted elements: `var(--color-muted-foreground)`
- Prose borders: `var(--color-border)`
