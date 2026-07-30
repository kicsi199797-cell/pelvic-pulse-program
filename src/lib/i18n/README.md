# i18n

All user-facing strings live in `src/lib/i18n/locales/*.ts`. Never hardcode text in components — use `useT()` / `useI18n()`.

## Adding a language

1. Copy `locales/en.ts` to `locales/<code>.ts` and translate the values.
2. Type it as `Dict` (`const xx: Dict = { ... }`) — TypeScript then fails the build if any key is missing.
3. Register it in `src/lib/i18n/index.tsx`: add the code to `LanguageCode`, an entry in `SUPPORTED_LANGUAGES` (label, flag, BCP-47 locale), and the import in `DICTS`.

## Rules

- Placeholders use `{name}` and must match the English string exactly.
- Dates and numbers go through `formatDate` / `formatNumber` from `useI18n()` so they follow the selected locale.
- Unknown keys fall back to English, then to the key itself.

## Validation

```bash
bun scripts/i18n-check.ts
```

Reports missing keys, unknown keys, and placeholder mismatches per locale.
