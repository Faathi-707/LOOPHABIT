# Agent Rules

These rules are non-negotiable. Follow them for every change.

---

## 1. Architecture and components

- Break every feature into small, focused components.
- Each page must be a thin container that:
  - Fetches data
  - Calls hooks
  - Passes props to feature components
- Sections inside a page must be separate components:
  - Examples: header, sidebar, summary cards, charts, tables, forms, modals.
- Never use emojis, only relevant icons where necessary
Recommended structure

```txt
app/
  (app)/
    _layout.tsx               # tabs
    stats.tsx
    settings/
      index.tsx
    (habits)/
      _layout.tsx             # stack
      index.tsx               # list
      new.tsx                 # create
      [id].tsx                # details/edit
  (auth)/
    _layout.tsx
    login.tsx
    signup.tsx

src/
  components/
    ui/                       # Button, Input, etc.
    EmojiPicker.tsx
    EmptyState.tsx
    HabitCard.tsx
    ProgressWheel.tsx
  i18n/
    index.ts
  store/
    authStore.ts
    habitStore.ts
    index.ts
  theme/
    colors.ts
    index.ts                 # exports useTheme, spacing, typography, etc.
    spacing.ts
    typography.ts
  types/
    index.ts
  utils/
    helpers.ts
    storage.ts
    validation.ts

Keep business logic out of JSX where possible.

Use hooks for data and state.

Use pure functions in lib for calculations, mapping, formatting.

Use TypeScript properly:

Strong types for props, domain models, API responses.

Avoid any. If you must use it, add a short comment explaining why.

2. Reusable components
Always prefer reuse over duplication.

Buttons, cards, inputs, badges, modals, layout wrappers.

Before creating a new component, search for an existing one.

Shared components must be generic and configurable:

No hardcoded copy or colors inside shared atoms.

Accept props for label, variant, size, icon, etc.

If you repeat a pattern more than twice, extract it:

Repeated JSX blocks

Repeated mapping logic

Repeated layout patterns

3. Component types and sub-components
UI primitives

Live in components/ui.

Examples: Button, Input, Card, Modal, Tabs, Table, Badge.

Feature components

Live in components or other feature folders.

Sub-components

If tiny and used only in one parent, you may define them in the same file at the bottom.

If non-trivial or reused, give them their own file in the same domain folder.

If they become generic, move them into components/ui and make them fully reusable.

Every major async section must have a skeleton in components/skeletons:

4. Scope of changes
Do not touch code that is not part of the current task.

Only edit, move, or delete code that is directly related to the feature or bug.

If a change requires cross-feature refactoring, stop and ask for approval.

Do not silently refactor unrelated modules “for cleanliness” under another task.

If something is clearly broken or dangerous, flag it first.

5. Data and AI mapping
Assume most dynamic content comes from AI or user inputs.

All mapping from user inputs to AI prompts or AI responses must live in helpers or hooks:

Not inside UI components.

UI components should receive already shaped data via props.

Do not hardcode production “demo data” inside components.

Use mock data only in dedicated mock or story files.

Production data must flow from services, hooks, or context.

6. UI and UX standards
Follow consistent design and UX patterns:

Spacing, font sizes, colors

Button variants and states

Clear primary vs secondary actions

Forms:

Every form must have labels, validation, and clear error messages.

Flows:

No surprising flows or hidden side effects.

Keep flows simple for non-technical users.

Accessibility:

Use semantic HTML where possible.

Add ARIA attributes where needed.

Components must be usable with keyboard only.

7. File size and structure
Target 150–300 lines per file.

Hard limit: do not create or grow any hand-written file beyond 400 lines.

If a file approaches 300 lines:

Extract components, hooks, or utils.

When touching existing large legacy files:

Keep the change minimal and local.

When practical, extract the part you are working on into a new component or hook and wire it back.

One main unit per file:

One main component per file.

One main hook per file.

Small helper components allowed only if tiny and tightly coupled.

8. Markdown and documentation
All .md files must live in the doc directory.

No markdown files in feature folders.

Do not create any new .md file without explicit permission.

Updates to existing docs are allowed when necessary.

Follow current structure and style when editing docs.

9. Duplication and existing code
Never recreate a component, util, or type that already exists.

Always search first in components, lib, hooks, and types.

If something is similar but not quite right, prefer extending or improving it instead of copying.

If you are not sure whether a file or pattern already exists, ask before creating a new one.

Pay extra attention to:

Buttons, cards, modals

Typography, layouts

10. Communication and safety
Do not introduce new top-level folders or architecture patterns without alignment.

No new app structure, state library, or design system on your own.

When a requirement conflicts with these rules, pause and ask.

Example: a change that requires refactoring shared components or many modules.

If something will break tests, type safety, or consistency, surface it early.

Do not ship “temporary hacks” without clearly tagging them and getting agreement.

11. Testing
Tests are mandatory when changing logic.

If you change or add business logic, add or update tests for it.

Never leave new logic untested in core domains:

No fake or placeholder tests:

Do not write tests like expect(true).toBe(true).

If a test is not ready, use it.todo('description') or skip the describe with a clear // TODO.

Use deterministic expectations: exact EMI, break-even month, payback period, etc.

Do not weaken assertions to wide ranges without strong reason.

Test types and locations:

Use Jest for unit and integration tests.

Place tests next to modules or in tests/ using *.test.ts / *.test.tsx.

For key React flows, use React Testing Library to verify:

Renders without crashing

Key interactions (click, submit, tab change)

Important UI states (loading, empty, error)

Run tests before considering a task done:

Always run npm test (or project test command) after meaningful changes.

Do not commit or merge with failing tests.

If a test is wrong, fix the code or update the test with a clear explanation.

Do not silently delete or disable tests:

Only remove or skip a test if:

The feature has been removed, or

The test is invalid and replaced.

If you skip a test, add a comment:

Why it is skipped

When it should be re-enabled

Keep test files readable:

Target 150–300 lines per test file, hard cap 400.

Extract shared test helpers/mocks into dedicated files instead of bloating one file.

12. Folder structure and naming
Respect the existing structure:

Do not invent new top-level folders without approval.

Fit new code into app/, components/, 


What not to change, Project structure, aliases, or Expo config.
Theme tokens and names in src/theme/colors.ts (extend only if needed).
Store shapes or action names without a migration note.

Do not mix UI and business logic in the same folder.