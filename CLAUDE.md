# Project: Nurses Now

NestJS REST API with TypeORM + PostgreSQL. Backend for [brief description].
Stack: Node.js 24, NestJS 11, TypeORM, PostgreSQL 17, TypeScript strict mode.

## Essential Commands

npm run start:localhost # start dev server
npm run build # compile
npm run test # e2e tests
npm run format
npm run lint # ESLint check

## Project Structure

src/
modules/ # feature modules (one folder per domain)
shared/ # shared guards, interceptors, decorators, pipes
config/ # environment config (ConfigModule)
migrations/ # migrations, seeds
main.ts

## Architecture Rules

- One module per domain. No cross-module direct imports — use shared services.
- Business logic lives in services only. Controllers handle HTTP in/out, nothing else.
- Entities must not contain business logic.
- Always use DTOs with class-validator for request validation.
- Use repository pattern — inject repositories via TypeORM, never use EntityManager directly.

## TypeORM / Database Rules

- IMPORTANT: Never edit migration files after they are generated. Generate a new one instead.
- Use QueryBuilder for complex joins or filtering — avoid raw queries unless absolutely necessary.
- Always add indexes on foreign keys and columns used in WHERE clauses.
- Use transactions for any operation touching more than one table.
- Soft deletes only — use @DeleteDateColumn(), never hard delete.
- Column naming: snake_case in DB, camelCase in entity (@Column({ name: 'created_at' })).

## Code Style

- TypeScript strict mode is ON. No `any`. Use proper generics.
- ES module imports only. Destructure where possible.
- Async/await everywhere — no raw Promises or .then() chains.
- Return types must be explicit on all public service methods.
- Error handling: use NestJS built-in exceptions (NotFoundException, BadRequestException etc.)

## IMPORTANT: Never Do This

- Never commit secrets or .env values.
- Never bypass validation pipes.
- Never use `synchronize: true` in TypeORM config (we use migrations).
- Never use `getRepository()` — use injected repositories.
- Never run the full test suite to check one module — run `npm run test -- --testPathPattern=module-name`.

## Git Conventions

- Branch: feature/[ticket]-short-description | hotfix/[ticket]-short-description | refactor/module
- Commit: conventional commits — feat:, fix:, chore:, refactor:, test:
- One logical change per commit.

## Available Skills

@~/.claude/skills/sql-query-optimizer/SKILL.md
@~/.claude/skills/code-reviewer/SKILL.md
@~/.claude/skills/backend-engineering-lead/SKILL.md
@~/.claude/skills/performance-engineer/SKILL.md
@~/.claude/skills/backend-security-auditor/SKILL.md
@~/.claude/skills/database-architect/SKILL.md
@~/.claude/skills/jest-test-generator/SKILL.md
