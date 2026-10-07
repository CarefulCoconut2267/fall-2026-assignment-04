---
name: kysely-migration-generator
description: Generates type-safe Kysely database migration files from a previously generated Mermaid ERD.
---

# Kysely Migration Generation Skill

## Context & Inputs
- **Source:** Mermaid ER diagram (`.mmd` or fenced markdown block).
- **Default Dialect:** PostgreSQL (unless specified otherwise).

## Translation Rules:

- **Entity & Attribute Naming:**
  - Entities map to pluralized `snake_case` table names (e.g., `USER` -> `users`).
  - Attributes map to `snake_case` column names (e.g., `createdAt` -> `created_at`).

- **Data Types (PostgreSQL defaults):**
  - `id / uuid` -> `uuid` (defaulting to `gen_random_uuid()`) or `serial`.
  - `string / varchar` -> `varchar(255)` or `text`.
  - `int / integer` -> `integer` or `bigint`.
  - `datetime / timestamp` -> `timestamptz` (defaulting to `sql`now()`` where appropriate).
  - `boolean` -> `boolean`.
  - `json / object` -> `jsonb`.

- **Keys & Constraints:**
  - Mark Primary Keys using `.primaryKey()`.
  - Mark non-nullable fields using `.notNull()`.
  - For Foreign Keys:
    - Reference parent tables: `.references('parent_table.id')`.
    - Apply `.onDelete('cascade')` for owned/child relations, or `.onDelete('restrict')` / `.onDelete('set null')` for optional relationships.

- **Cardinalities & Relationships:**
  - `||--o{` (One-to-Many): Add parent FK column to the child table.
  - `||--o|` (One-to-One): Add FK column with `.unique()` constraint to the dependent table.
  - `}o--o{` (Many-to-Many): Generate an explicit join table with composite PK or individual FKs.

- **Execution Order:**
  - **`up()`**: Create independent tables first, followed by dependent tables with FK references.
  - **`down()`**: Drop tables in exact reverse dependency order using `.dropTable('...').ifExists().execute()`.

- **File Output:**
  - Path: `src/db/migrations/<YYYYMMDDHHMMSS>_<migration_name>.ts`
  - Imports: `import { Kysely, sql } from 'kysely';`