# Practice CMS Implementation Plan

> Execute inline with executing-plans; preserve the current user's uncommitted teaching-area implementation. Do not push or deploy unrelated edits.

**Goal:** Chinese online editing for all six practice modules, preserving legacy content.

**Architecture:** Decap CMS writes structured Markdown to GitHub; Netlify builds the public site. A shared parser validates frontmatter and supplies public entries; existing formats remain editable and readable. Local test backend is explicitly local only.

**Tech Stack:** React, Vite, Decap CMS, YAML, Vitest.

**Spec:** ../specs/2026-09-16-practice-cms-design.md

## Constraints

- No database, generation, scraping, difficulty or required demo link.
- Preserve existing content and URLs. No public secrets. No production publishing without scoped approval.
- Drafts remain off publication branch; hidden content is excluded from counts, lists and details.
- Login and deployment are external gates, not simulated success.

## Tasks

- [ ] 1. Shared format and importer: `public/admin/content-format.js`, `src/data/managed-content.ts`, tests. Test malformed YAML, duplicate IDs, unsafe URLs, hidden entries and stable order. Parse frontmatter via YAML safe schema; ordinary Markdown imports as body. Use same parser for preview, imports and frontend validation.
- [ ] 2. Frontend: `ManagedPracticeContent.tsx`, managed detail component, practice pages. Merge new entries without changing legacy records; show image, category, attachments, steps, copied prompt and factual source/test status. Test direct hidden URLs and copy behavior.
- [ ] 3. Admin: `public/admin/index.html`, `config.js`, `admin.js`, local bundled CMS asset. Six folder collections, legacy file collections, Markdown import widget, preview and validation hooks. Restrict uploads, immutable IDs and safe paths. Supply template and operational instructions.
- [ ] 4. Verify actual Netlify production branch and OAuth setup availability. Do not guess branch or silently enable access. Local proxy only bound to loopback; online build omits local-backend mode.
- [ ] 5. Run build, full tests, validation and browser checks. Exercise import, draft save and rendered fixture using isolated local content repository. Remove disposable fixtures. Report local and online readiness separately.

## Validation examples

```js
expect(parseDocument('---\nid: sample\ntitle: 示例\nmodule: office\nvisible: false\n---\n正文').visible).toBe(false);
expect(() => parseDocument('---\nid: ../bad\n---')).toThrow();
expect(() => validateEntries([sample, sample])).toThrow(/重复/);
expect(safeUrl('javascript:alert(1)')).toBe('');
```

Local checks: `npm test -- --run`, `npm run build`, open `/admin/` and `/practice/office` using isolated fixture data. Confirm original 20 images and prompt collection remain available.
