---
name: Kinetic Precision
colors:
  surface: '#11131b'
  surface-dim: '#11131b'
  surface-bright: '#373942'
  surface-container-lowest: '#0c0e16'
  surface-container-low: '#191b24'
  surface-container: '#1d1f28'
  surface-container-high: '#282933'
  surface-container-highest: '#33343e'
  on-surface: '#e2e1ee'
  on-surface-variant: '#c2c6d8'
  inverse-surface: '#e2e1ee'
  inverse-on-surface: '#2e3039'
  outline: '#8c90a1'
  outline-variant: '#424655'
  surface-tint: '#b3c5ff'
  primary: '#b3c5ff'
  on-primary: '#002b75'
  primary-container: '#1462ef'
  on-primary-container: '#eceeff'
  inverse-primary: '#0054d7'
  secondary: '#b3c5ff'
  on-secondary: '#132d67'
  secondary-container: '#2d447f'
  on-secondary-container: '#9db3f6'
  tertiary: '#ffb59a'
  on-tertiary: '#5b1b00'
  tertiary-container: '#c04200'
  on-tertiary-container: '#ffebe5'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b3c5ff'
  on-primary-fixed: '#001849'
  on-primary-fixed-variant: '#003fa5'
  secondary-fixed: '#dae1ff'
  secondary-fixed-dim: '#b3c5ff'
  on-secondary-fixed: '#001849'
  on-secondary-fixed-variant: '#2d447f'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59a'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#802900'
  background: '#11131b'
  on-background: '#e2e1ee'
  surface-variant: '#33343e'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  numeric-data:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-padding: 16px
  gutter: 12px
---

## Brand & Style

The design system is engineered for high-performance fitness tracking, blending the raw energy of a professional training facility with the precision of a medical-grade health suite. The brand personality is motivational, authoritative, and frictionless.

The design style follows a **Modern Corporate** aesthetic with a **High-Contrast** edge. It utilizes deep, technical blue-grey backgrounds to create a focused "gym-floor" environment, allowing vibrant functional colors to direct the user's attention toward active metrics and performance goals. The interface prioritizes clarity through generous negative space and a rigorous information hierarchy, ensuring that even during intense physical activity, the user can process data at a glance.

## Colors

The palette is anchored in "Deep Cobalt Slate" to reduce eye strain and provide a professional, athletic backdrop. This dark secondary base ensures that high-chroma accents pop with maximum luminance.

- **Primary (Cobalt Blue):** Core actions, primary buttons, and focused interactive states.
- **Secondary (Cool Slate):** Structural elements and supporting surfaces to maintain depth.
- **Tertiary (Burnt Ochre):** High-energy performance metrics, recovery highlights, and motivational progress indicators.
- **Semantic Colors:** Strict adherence to Green (Success), Red (Danger/High Heart Rate), and Amber (Warning/Recovery Needed) to ensure instant cognitive recognition of health status.

## Typography

This design system utilizes a dual-font strategy. **Hanken Grotesk** is used for headlines and primary metrics; its sharp, contemporary geometry conveys strength and precision. **Inter** is used for body copy and UI labels to ensure maximum legibility across all device types, especially in dense data environments.

Numeric data should always be rendered with high-weight fonts to emphasize performance stats (reps, weight, calories). Use the `label-md` style with uppercase transformations for category headers to create a distinct architectural hierarchy.

## Layout & Spacing

The design system employs a **Fluid Grid** model based on a 4px baseline rhythm. This ensures that all components align to a mathematical scale, creating a sense of order and reliability.

- **Mobile (Primary):** A single-column layout with 16px horizontal margins. Cards should span the full width of the container.
- **Tablet:** A 2-column or 3-column layout for dashboards, allowing for a persistent sidebar or navigation rail.
- **Desktop:** A 12-column grid with a maximum content width of 1200px. 

Spacing between stacked cards should be consistently 12px or 16px to maintain a dense but readable vertical flow.

## Elevation & Depth

This design system uses **Tonal Layers** rather than heavy shadows to maintain a clean, high-performance look. In a dark-mode environment, depth is achieved by increasing the lightness of the surface color against the secondary slate background.

- **Level 0 (Background):** Deepest cobalt slate (#5f75b3 derivative), used for the main canvas.
- **Level 1 (Cards/Surfaces):** A slightly lighter slate to separate content from the background.
- **Level 2 (Active/Hover):** Subtly lighter than Level 1, used for interactive states.
- **Outlines:** Use 1px low-contrast borders for cards to provide definition without visual clutter. For "Active" states, use a 2px primary cobalt border.

## Shapes

The shape language is **Rounded**, balancing the "hard" nature of gym equipment with the "soft" user-friendly nature of a digital tool. 

- **Primary UI Elements:** (Buttons, Input Fields) use a standard 8px (0.5rem) radius.
- **Cards:** Use 16px (1rem) radius to soften the high-contrast data they contain.
- **Icons:** Should be contained within circular or rounded-square enclosures to maintain consistency.

## Components

- **Primary Buttons:** High-saturation Cobalt Blue with light contrasting text. No shadows; use a slight scale-down transform on tap for tactile feedback.
- **Workout Cards:** Use a Level 1 surface with a primary color accent bar on the left edge to indicate the "active" or "next" workout.
- **Progress Charts:** Use a stroke-based approach (Burnt Ochre or Cobalt Blue) on a subtle grid. Avoid filled areas unless representing volume (e.g., weight lifted).
- **Chips:** Small, high-contrast labels for "Legs", "HIIT", or "Keto" with a subtle background tint of the primary or tertiary color.
- **Input Fields:** Darker than the card surface with a high-contrast 1px border that glows (primary cobalt) when focused.
- **Lists:** Clean rows with 16px vertical padding, separated by low-contrast 1px dividers.