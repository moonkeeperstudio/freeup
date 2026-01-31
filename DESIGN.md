# FreeUp — Style Guidelines Reference

Quick reference for the design system. Use Tailwind with the tokens below.

## 01. Colors

| Role       | Name        | Hex       | Tailwind / CSS              |
|-----------|-------------|-----------|-----------------------------|
| Brand     | Primary     | `#05061C` | `text-primary` / `bg-primary` |
| Brand     | Secondary   | `#F2994A` | `text-secondary` / `bg-secondary` (buttons) |
| State     | Available   | `#56FF5B` | `text-available` / `bg-available` |
| State     | Limited     | `#FFA04D` | `text-limited` / `bg-limited` |
| State     | Unavailable | `#FF5656` | `text-unavailable` / `bg-unavailable` |
| Logo      | Purple      | `#B68CFD` | `text-logo-purple` / `bg-logo-purple` |
| Logo      | Pink        | `#FF7EA3` | `text-logo-pink` / `bg-logo-pink` |
| Logo      | Peach       | `#FACABB` | `text-logo-peach` / `bg-logo-peach` |

## 02. Typography (Inter)

- **Headings:** line-height = 1.1 × font size  
- **Body:** line-height = 1.4 × font size  

| Element   | Size  | Line height | Usage              |
|----------|-------|-------------|--------------------|
| H1       | 56px  | 61.6px      | `text-5xl` / custom |
| H2       | 48px  | 52.8px      | `text-4xl`         |
| H3       | 40px  | 44px        | `text-3xl`         |
| H4       | 32px  | 35.2px      | `text-2xl`         |
| H5       | 24px  | 26.4px      | `text-xl`          |
| H6       | 20px  | 22px        | `text-lg`          |
| Large    | 20px  | 28px        | `text-body-large`  |
| Medium   | 18px  | 25.2px      | `text-body-medium` |
| Normal   | 16px  | 22.4px      | `text-body-normal` |
| Small    | 14px  | 19.6px      | `text-body-small`  |

Use **Inter** (loaded in `layout.tsx`). Bold = `font-bold`, Regular = `font-normal`.

## 08. Buttons

- **Padding:** horizontal = 5 × font size, vertical = 1 × font size  
- **Full-width:** width = container; vertical padding = 1 × font size  
- **Primary color:** Secondary brand (`#F2994A`)

### Variants

- **Solid (default):** `bg-secondary`; hover darker, active lighter, disabled grey  
- **Outline:** border + text secondary; hover fill secondary  
- **Icon + text:** solid + icon (e.g. "+") left of label  
- **Icon only:** circular, icon only  

### Sizes

Use `Button` component: `size="small" | "normal" | "medium" | "large"`, `variant="solid" | "outline" | "icon-text" | "icon-only"`, optional `fullWidth`.

---

*Design tokens are applied in `src/app/globals.css` and `src/components/ui/Button.tsx`.*
