# Project rules
<!-- plain Markdown; Copilot reads the whole file on every task -->
- TypeScript strict mode; no `any`. <!-- coding convention: fixes "wrong style" root causes -->
- Tests use Vitest in `tests/`. <!-- one source of truth for the test framework (avoids conflicting context) -->
- Run `npm test` before finishing. <!-- defines a success criterion the agent checks itself -->
- Never change test expectations to make a test pass. <!-- protects development intent (Domain 4) -->
- Record every design decision in DECISIONS.md with date and reason. <!-- durable state (Lab 3) -->
