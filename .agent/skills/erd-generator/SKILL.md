---
name: erd-generator
description: Generates an Entity-Relationship Diagram (ERD) from a Mermaid schema file when requested to design an ERD, data model, or architecture diagram.
---

# ERD Generator Skill

This skill allows you to generate an Entity-Relationship Diagram (ERD) from a Mermaid schema file. It uses the `mmdc` command-line tool to render the diagram as an SVG file.

## Usage

1. Ensure you have a Mermaid schema file located at `docs/architecture/schema.mmd`.
2. Run the script `scripts/render_erd.js` to generate the ERD.
3. The generated ERD will be saved as `docs/architecture/erd.svg`.

## Execution Workflow:
- Parse domain requirements into entities, primary keys (PK), foreign keys (FK), and cardinalities.

- Write the drafted Mermaid schema to `docs/architecture/schema.mmd`.

- Execute node scripts/render_erd.js docs/architecture/schema.mmd.

- **Self-Correction Loop:** If execution fails with SYNTAX_ERROR, parse the error trace, adjust the Mermaid syntax in `docs/architecture/schema.mmd`, and re-run the script (up to 3 retries allowed).

- **Final Output:**Present the raw Mermaid block to the user and reference the generated ERD in `docs/architecture/erd.svg`.