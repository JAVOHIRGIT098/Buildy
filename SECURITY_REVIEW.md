# Buildy beta: security and regression review

## Changes verified

- Preserved all existing records. Added an optional typed listing relationship to requests; existing requests are not migrated or deleted.
- Bound new requests to an existing, eligible product, professional, or job. The collection boundary checks relationship/type agreement, availability, and job status.
- Assigned request owner, subject, and initial workflow status on the server. App users cannot change workflow status or another user's request.
- Restricted account-role changes and verification to CMS administrators. Pending suppliers, professionals, and employers cannot create public listings before verification.
- Kept app accounts separate from Payload Admin. App auth reads only the HTTP-only `app-session` cookie; CMS cookies are not used to authenticate app users.
- Used Payload-native login protection (5 failed attempts, 15-minute lock), native sessions, and native logout revocation. Cookie expiry follows the issued token expiry.
- Removed password trimming/truncation. Added bounded server validation and Uzbek phone-number normalization.
- Made contact submissions persist in a private Payload collection, with admin-only read/update/delete, field validation, and a form honeypot. Removed invented contact details.
- Added honest loading, error, success, unavailable-listing, and empty-search states.
- Fixed a Node/Chromium ICU formatting mismatch that caused hydration failures for UZS prices.
- Fixed estimator bounds and non-finite values; invalid inputs hide the result instead of silently clamping or showing invalid numbers. Displayed the actual estimation formulas.
- Added all product categories to filters and state-aware account navigation.
- Added `nosniff`, referrer, and browser-permission headers without blocking the Figma preview iframe.
- Enabled TypeScript errors to block production builds.

## Verification

Executed successfully:

```sh
pnpm exec tsc --noEmit
pnpm exec playwright test
figma make verify-deploy
```

The targeted `oxfmt --check` passed for all changed TypeScript, JSX, configuration, and test files.

Eight Playwright tests cover:

1. Validation and estimator edge cases.
2. All 20 generated public pages, loaded images, and browser runtime errors.
3. Query-string search, category/location filters, empty states, mobile width, and mobile menu navigation.
4. Estimator field changes and invalid input.
5. Anonymous private-data denial, protected dashboard redirect, and unknown-product 404.
6. Registration/login; account UI updates; role/verification escalation denial; all three request types; duplicate-request prevention; invalid target rejection; owner isolation; logout and token revocation.
7. Invalid-session dashboard denial.
8. Private contact submission and confirmation.

These are development-browser tests plus a platform-managed production build verification, not a penetration-test certification or a test of a newly published public origin.

The integration tests deliberately create records named `Buildy QA...` and randomized `buildy-qa-...@example.com` accounts through the real UI. They do not overwrite real accounts, delete data, or persist credentials in test artifacts. Traces, screenshots, and videos containing authenticated data are disabled.

## Production rendering contract

Confirmed by `figma make verify-deploy`:

- Static: `/`, `/about`, `/ai-assistant`, `/contact`, `/faq`, `/jobs`, `/login`, `/marketplace`, `/professionals`, `/register`.
- SSG: all generated `/products/[slug]`, `/professionals/[slug]`, and `/jobs/[slug]` details.
- Request-time: `/dashboard`, `/api/app-session`, Payload Admin, and Payload APIs.
- Public catalog content intentionally remains a build-time snapshot. After catalog edits in Payload Admin, click **Publish** again. Request and contact submissions are durable immediately; the signed-in dashboard reads requests at request time.

## Dependency audit and remaining work

`pnpm audit --prod` initially reported 33 findings, including 4 high severity findings.

Compatible patched dependency overrides for DOMPurify, Zod, Happy DOM, and fast-uri reduced the report to:

| Severity | Remaining findings |
| --- | ---: |
| Critical | 0 |
| High | 0 |
| Moderate | 4 |
| Low | 1 |

The audit command still exits nonzero. Remaining transitive dependencies include `uuid`, `minimatch`, `glob`, and `deepmerge`. Some available fixes require major upgrades in upstream platform dependencies; `deepmerge` has no patched version in the advisory. Do not represent the dependency audit as clean. Resolve these with compatible upstream releases rather than blindly overriding every transitive major version.

Before a real public launch:

- Add deployment-level abuse/rate controls and, if needed, CAPTCHA for public signup/contact endpoints. The honeypot and per-listing duplicate guard are not distributed rate limiting.
- Connect an email provider for password recovery and transactional delivery. The UI does not pretend these are connected.
- Complete role-specific supplier/worker/employer management, notifications, subscriptions, and actual recipient delivery. Current dashboard placeholders identify unavailable features.
- Verify the editor-authenticated Figma/Payload Admin session alongside app login/logout using a real editor browser; automated tests do not have a Figma editor SSO session.
- Recheck on the published origin, including secure cookies and image delivery.
