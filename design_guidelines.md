# Design Guidelines: Personal Expense Tracker

## Design Approach

**Selected Approach:** Design System (Material Design 3 + Modern Financial App Patterns)

**Justification:** This is a utility-focused, information-dense productivity application where data clarity, efficiency, and consistent interaction patterns are paramount. Drawing inspiration from Linear's clean aesthetics and modern fintech apps (Mint, YNAB), while following Material Design 3 principles for robust component patterns.

**Key Design Principles:**
- Data-first clarity: Information hierarchy optimized for quick scanning
- Purposeful color: Use color strategically to indicate budget status, categories, and actions
- Gestural efficiency: Minimize taps/clicks for common actions
- Trustworthy aesthetics: Professional, stable design that inspires confidence in financial data

---

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary: 239 84% 67% (Vibrant blue for CTAs and key actions)
- Surface: 0 0% 98% (Off-white background)
- Surface Variant: 0 0% 95% (Card backgrounds)
- On Surface: 220 20% 20% (Primary text)
- On Surface Variant: 220 10% 45% (Secondary text)
- Success: 142 71% 45% (Under budget, positive indicators)
- Warning: 38 92% 50% (Near budget limit)
- Error: 0 72% 51% (Over budget, alerts)
- Border: 220 13% 91% (Subtle dividers)

**Dark Mode:**
- Primary: 239 84% 67% (Same vibrant blue)
- Surface: 220 18% 12% (Deep charcoal background)
- Surface Variant: 220 15% 16% (Elevated card surfaces)
- On Surface: 0 0% 95% (Primary text)
- On Surface Variant: 220 10% 65% (Secondary text)
- Success: 142 71% 55% (Slightly brighter for dark mode)
- Warning: 38 92% 60%
- Error: 0 72% 61%
- Border: 220 13% 25% (Visible dividers on dark)

**Category Color System:**
Assign consistent, distinguishable colors to expense categories:
- Shopping: 280 60% 60% (Purple)
- Food: 25 75% 55% (Orange)
- Bills: 200 60% 50% (Cyan)
- Others: 160 50% 50% (Teal)
- Misc: 45 70% 55% (Yellow-gold)

### B. Typography

**Font Stack:** System font stack for optimal performance and native feel
- Primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- Monospace (for amounts): "SF Mono", "Roboto Mono", Consolas, monospace

**Type Scale:**
- Hero/Display: 2.5rem (40px) / bold / tight leading
- H1: 2rem (32px) / semibold
- H2: 1.5rem (24px) / semibold
- H3: 1.25rem (20px) / medium
- Body Large: 1.125rem (18px) / regular
- Body: 1rem (16px) / regular
- Body Small: 0.875rem (14px) / regular
- Caption: 0.75rem (12px) / medium / tracking-wide

**Amount Display:** Use tabular figures (font-variant-numeric: tabular-nums) for consistent alignment

### C. Layout System

**Spacing Primitives:** Tailwind units of 1, 2, 4, 6, 8, 12, 16, 24
- Tight spacing (buttons, form fields): p-2, gap-2
- Standard spacing (cards, sections): p-4, p-6, gap-4
- Generous spacing (page sections): p-8, py-12, gap-8
- Large spacing (module separation): py-16, py-24

**Container Widths:**
- Mobile: Full width with px-4 padding
- Tablet/Desktop: max-w-7xl mx-auto px-6
- Forms/Content: max-w-2xl for optimal readability
- Dashboard grids: max-w-6xl

**Grid System:**
- Mobile: Single column (grid-cols-1)
- Tablet: 2 columns for cards (md:grid-cols-2)
- Desktop: 3-4 columns for year/month cards (lg:grid-cols-3 xl:grid-cols-4)

### D. Component Library

**Avatar System:**
- Size: 64px (w-16 h-16) for primary selection
- Size: 48px (w-12 h-12) for secondary contexts
- Background: Generated from user initials with consistent color mapping
- Active state: 3px primary color ring with subtle shadow
- Hover: Scale to 105% with smooth transition

**Cards:**
- Background: Surface variant color
- Border: 1px solid border color
- Radius: rounded-xl (12px)
- Shadow: Subtle elevation shadow (shadow-sm in light, shadow-lg in dark)
- Padding: p-6
- Hover state: Slight scale (102%) and increased shadow
- Active card: Primary color left border (border-l-4)

**Year/Month Tiles:**
- Card-based with prominent title
- Large amount display in monospace font
- Progress bar: 6px height, rounded-full, with gradient from success to error based on budget usage
- Sub-info: Grid layout showing "Active Months", "Top Category", etc.
- Icon: Small category icon top-right corner

**Forms:**
- Input fields: Surface variant background, border on focus (2px primary), rounded-lg
- Dropdowns: Custom styled with chevron icon, max-height with scroll
- Spacing: gap-4 between fields, gap-2 for label-input pairs
- Labels: Body small size, medium weight, secondary color
- Required indicator: Red asterisk
- Validation: Border color changes (success/error), inline message below field

**Buttons:**
- Primary: Primary color background, white text, px-6 py-3, rounded-lg, medium weight
- Secondary: Transparent with primary border, primary text
- Text: No background, primary text, hover with light background
- Icon buttons: 40x40px, rounded-lg, hover state with surface variant background
- Disabled: 50% opacity, cursor-not-allowed

**Expense List Items:**
- Horizontal layout: Category icon | Details (title, subcategory, description) | Amount
- Left accent: 4px colored bar matching category
- Padding: py-3 px-4
- Border bottom: 1px subtle divider
- Hover: Surface variant background
- Swipe actions: Red background for delete, blue for edit

**Charts & Visualizations:**
- Pie charts: Category colors, with labels and percentages
- Bar charts: Horizontal preferred for readability, consistent height (h-8)
- Progress bars: 6-8px height, rounded-full, animated fill
- Sparklines: 32px height, stroke-2, primary color

**Presets Tile:**
- Distinct from year tiles with gear icon
- Neutral color (no budget coloring)
- Secondary border color
- Icon-first layout

**Analytics Panels:**
- Grid layout: 2 columns on desktop, stacked on mobile
- Each metric card: Icon + label + large value
- Mini charts inline with metrics
- Color-coded by performance (success/warning/error)

**Navigation:**
- Fixed header: Backdrop blur effect, subtle bottom border
- Back button: Simple arrow icon, no background
- Settings icon: Top right, subtle
- Tab bar (if needed): Bottom fixed on mobile, subtle shadow upward

### E. Specific Module Guidelines

**Module 1 - User Login:**
- Centered layout with max-w-4xl
- Avatar row: Horizontal scroll with snap-scroll, gap-6
- Add user button: Dashed border card with plus icon
- Admin avatar: Distinct badge or crown icon
- Selection: Tap avatar → shows name, then "Select" button appears below

**Module 2 - Year Overview:**
- Greeting header: Left-aligned, generous top padding (pt-12)
- Year cards grid: 3 columns on desktop, 2 on tablet, 1 on mobile
- Presets tile: Same size as year tile, placed at end of grid
- Each year tile: Number top-left, total amount center (large), progress bar bottom, small stats in corners

**Module 3 - Yearly/Monthly Overview:**
- Month cards: Chronological order, latest first
- Each card shows: Month name, total, top 2 categories with icons, mini bar chart
- Add month: Large floating action button (FAB) bottom-right, primary color, shadow-lg
- Filter bar: Sticky below header, chips for categories/payment modes

**Module 4.2 - Expense Entry Form:**
- Full-screen modal on mobile, centered card on desktop (max-w-2xl)
- Field order as specified in requirements
- Amount field: Largest, prominent, monospace font
- Category/subcategory: Cascading dropdowns with icons
- Date/time: Native pickers with calendar/clock icons
- Submit button: Full width on mobile, standard on desktop, prominent at bottom

**Module 4.3 - Monthly Expense Overview:**
- Analytics cards: Top section, 2x2 grid on desktop
- Expense list: Below analytics, with filters
- Charts: Collapsible sections for Category, Payment Mode, Made For breakdowns
- Add expense: FAB consistent with Module 3

**Module 5 - Presets Configuration:**
- Tabbed interface: Categories, Subcategories, Payment Modes, Made For
- Each tab: Table/list view with add/edit/delete actions
- Inline editing: Click to edit, ESC to cancel, Enter to save
- Color/icon pickers: Visual selectors with swatches

---

## Images

**No images required** for this data-focused application. All visual interest comes from:
- Consistent category color coding
- Charts and data visualizations  
- Progress indicators and budget status
- Clean typography and spacing
- Avatar representations for users

Icons only (use Heroicons via CDN):
- Category icons (shopping-cart, utensils, receipt, ellipsis-horizontal)
- Action icons (plus, pencil, trash, cog, chevron)
- Status icons (check-circle, exclamation-triangle, x-circle)