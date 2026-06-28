## Plan: Mega-menu navbar redesign

Replace only the navbar. No other page, route, 3D canvas, or layout is touched. Existing routes stay valid; links to pages that don't exist yet (products/*, /newsletter, /events, /sitemap, /team-leadership, /security, /privacy, /support, /careers) render as plain `<a href>` so the typed router doesn't fail the build — they'll 404 gracefully until those routes are added later. Existing routes (`/`, `/contact`, `/about`, `/services/*`) use TanStack `<Link>`.

Note: spec lists `/services/mobile-app-development`, `/services/ai-automation`, `/services/ui-ux-design`, `/services/it-consulting`, `/services/it-support-maintenance`, `/services/digital-marketing`, `/services/startup-mentorship`. Current project only has `web-development`, `mobile-development`, `ai-solutions`, `cloud-services`, `devops`, `consulting`, `software-development`. I'll use the spec's URLs verbatim via `<a href>` so the navbar matches the brief exactly, even though several will 404 until matching routes exist.

### Files

**New:** `src/components/layout/MegaMenu.tsx`
- Renders the three mega panels (Offerings, Products, Inside) and the small Careers dropdown given a `kind` prop + `onClose`.
- Glass panel styling per spec: `rgba(10,18,35,0.95)`, `backdrop-blur(24px)`, 16px radius, blue-tinted border + shadow, 32px padding, opens 4px below trigger.
- Framer Motion `AnimatePresence` fade + Y(-8→0) over 200ms ease-out.
- Offerings: 2-col grid — left list of 10 services (lucide icon + bold label + muted description, hover = blue-tinted bg + 2px left blue border), right glass CTA card "Not sure where to start?" → `/contact`.
- Products: 2×2 card grid for Kalesh / KaryON / Stylon / Axis Conference Web (name, tagline, "Learn more →" appears on hover, blue-glow border on hover). Bottom row: Contact Sales + Partner Program.
- Inside: 3 columns (Home / Resources / Who We Are) with the listed links.
- Careers: narrow dropdown (240px) with three rows; "Open Positions" gets a green "We're Hiring!" badge.

**New:** `src/components/layout/MobileDrawer.tsx`
- Right-side slide-in drawer, full height, `rgba(5,11,24,0.98)` + blur, close X top-right, body scroll locked.
- Each top-level item is an accordion (chevron rotates, height/opacity animated) revealing the same link list.
- Sticky "Book Consultation" gradient CTA at the bottom, full width.
- Framer Motion slide + fade.

**Rewrite:** `src/components/layout/Navbar.tsx`
- Fixed top, 64px desktop / 56px mobile, `rgba(5,11,24,0.85)` + `backdrop-blur(20px)`, 1px bottom border `rgba(255,255,255,0.06)`, `z-50`.
- Layout: logo (keep existing D-monogram + DIMISI.tech wordmark) · 4 nav triggers (Our Offerings, Products, Inside, Careers) · right side "Contact Us" text link + "Book Consultation" gradient button.
- Triggers: 14px / 500, muted `#94A3B8` → white on hover/open, chevron rotates 180° when open, active route gets white + small blue glow dot.
- Hover-intent: open on mouseenter, close on mouseleave with 120ms grace so cursor can cross the 4px gap into the panel; click also toggles for touch; Escape closes; outside click closes.
- Mobile (`<lg`): hide nav + right CTAs, show hamburger that opens `MobileDrawer`.
- Book Consultation button uses the spec gradient (`#3B82F6 → #7C3AED`), glow shadow, hover scale 1.02.

### Accessibility
- `<nav role="navigation" aria-label="Primary">`.
- Triggers are `<button aria-haspopup="true" aria-expanded={open} aria-controls={panelId}>`.
- Panels have matching `id` and `role="menu"`, items `role="menuitem"`.
- Tab moves through trigger → panel items; Escape returns focus to trigger and closes; Enter/Space on trigger toggles.
- Focus trap inside open panel via a lightweight first/last-element wrap (no extra dep).
- Drawer traps focus, Escape closes, returns focus to hamburger.

### Verification
- `tsgo` typecheck.
- Playwright: load `/`, screenshot, hover each trigger, screenshot each open panel, resize to 390×844, open drawer, screenshot. Confirm 3D canvas still renders beneath and no layout shifts on other pages.
