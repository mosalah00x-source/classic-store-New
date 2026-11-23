# Frontend Language, Direction and Theme Guide

**Repository:** `mosalah00x-source/classic-store-New`  
**Implementation branch:** `FrontendApp`  
**Documentation copy:** `docs/project-reference`  
**Scope:** current Next.js application under `frontend/`, not the separate static UI prototype under `docs/ui-reference/`.

## 1. Language and text direction

### Product decision

- Supported locales: Arabic (`ar`) and English (`en`).
- Arabic uses RTL; English uses LTR.
- Catalog and Product pages must support English/LTR completely, including translated UI copy, alignment, navigation, controls, spacing and directional behavior. Do not force Arabic direction when locale is English.
- Locale switching should preserve the equivalent page/path where possible.

### Current implementation locations on `FrontendApp`

| Concern | Path | Responsibility |
|---|---|---|
| Locale definitions and default | `frontend/src/i18n/routing.ts` | `ar` and `en`; current default locale is `ar` |
| Request locale and message loading | `frontend/src/i18n/request.ts` | Selects valid locale and loads its message JSON |
| Direction mapping | `frontend/src/i18n/direction.ts` | Maps `ar` to `rtl` and `en` to `ltr` |
| Arabic messages | `frontend/src/messages/ar.json` | Arabic message catalog |
| English messages | `frontend/src/messages/en.json` | English message catalog |
| Root locale layout | `frontend/src/app/[locale]/layout.tsx` | Sets `<html lang>` and `dir`, loads messages and global CSS |
| Locale switcher | `frontend/src/components/LocaleSwitcher.tsx` | Switches between locales while retaining pathname |
| Catalog page | `frontend/src/app/[locale]/products/page.tsx` and `frontend/src/components/CatalogClient.tsx` | Catalog route and client UI |
| Product page | `frontend/src/app/[locale]/products/[slug]/page.tsx` and `frontend/src/components/ProductDetailClient.tsx` | Product route and client UI |
| Global styling | `frontend/src/app/globals.css` | Shared tokens, layout and responsive/directional styling |
| Locale tests | `frontend/tests/i18n-messages.test.tsx` | Locale/message-related test coverage |

**Implementation note:** `routing.ts` currently declares Arabic as the default locale. This is compatible with Arabic-first product requirements; it does not remove the requirement for complete English/LTR behavior when `en` is selected.

## 2. Theme policy

### Approved PO decision

- Light is the default theme.
- Dark is available through a user-controlled toggle.
- Theme preference must use one shared storage key and one consistent read/write mechanism across all application pages.
- Theme changes must apply globally, not only on Product detail.
- A stored Dark preference must be restored consistently on subsequent visits; unavailable/blocked browser storage must fail safely to Light for the current view.

### Current implementation locations on `FrontendApp`

| Concern | Path | Responsibility / observed state |
|---|---|---|
| Theme preference helper | `frontend/src/lib/theme-preference.ts` | Defines `ThemePreference`, `readThemePreference`, `writeThemePreference` and storage key `classic-store-theme` |
| Global theme tokens | `frontend/src/app/globals.css` | Defines Light tokens and `[data-theme="dark"]` token overrides |
| Root theme attribute | `frontend/src/app/[locale]/layout.tsx` | Currently renders `data-theme="light"` statically; must be wired to the shared preference mechanism for persistence/global restoration |
| Product toggle styling | `frontend/src/app/globals.css` | `.product-theme-toggle` styles are currently scoped to the Product UI |
| Product client | `frontend/src/components/ProductDetailClient.tsx` | Inspect before changing; existing toggle behavior must be reconciled with the shared helper |

**Important status distinction:** the helper and CSS tokens exist, but the presence of those files alone does not prove the PO-approved global theme flow is complete. The locale layout currently hardcodes `data-theme="light"`; the global initialization/restoration and a shared toggle across all relevant pages remain acceptance items until verified in code and browser tests. Do not treat the old product-only toggle as completion of V7.

## 3. Do not confuse the static UI reference with the Next.js app

`docs/ui-reference/README.md` on `FrontendApp` documents a separate static HTML/CSS/JS prototype. It mentions prototype paths such as `docs/ui-reference/js/i18n.js`, `docs/ui-reference/js/store.js`, and an older `cs-theme` localStorage key. Those are not the current Next.js source paths and must not be used as the implementation location for the current app without an explicit migration decision.

Current Next.js implementation paths are under `frontend/src/`, listed above. When updating this guide, verify them against the live `FrontendApp` tree first.

## 4. Acceptance checklist

- [ ] Arabic Catalog and Product render with `lang="ar"` and `dir="rtl"`.
- [ ] English Catalog and Product render with `lang="en"` and `dir="ltr"`.
- [ ] No untranslated user-facing UI strings remain in either locale.
- [ ] Locale switch retains the equivalent route and selected locale.
- [ ] Light is used when no valid preference is stored.
- [ ] Dark can be selected from the shared application UI and applies across routes.
- [ ] One shared key (`classic-store-theme`) is used by all theme readers/writers; no competing page-specific keys.
- [ ] Reload restores the selected theme without a visible incorrect-theme flash where technically feasible.
- [ ] Storage exceptions do not crash rendering or interaction.
- [ ] Automated tests and frontend CI pass on the same SHA.
- [ ] Browser screenshots cover Catalog and Product in both locales and both themes at desktop and mobile widths before claiming visual acceptance.

## 5. Change control

This guide records the PO decisions and maps them to the observed implementation. It does not authorize code changes. Any change to locale policy, theme default, storage key, or cross-page scope requires explicit PO approval if it departs from the decisions above.
