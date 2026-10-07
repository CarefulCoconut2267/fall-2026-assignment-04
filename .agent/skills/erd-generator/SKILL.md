---
name: erd-generator
description: Designs and generates an Entity-Relationship Diagram (ERD) from data requirements or a Mermaid schema file, rendering it to an SVG.
---

# ERD Generator Skill

Generates an Entity-Relationship Diagram (ERD) using Mermaid syntax and renders it to SVG using the `render_erd.js` script.

## Preconditions
- Ensure the output directory `docs/architecture` exists before writing files.
- Ensure Node.js and npm/npx are available in the runtime environment.

## Execution Workflow

1. **Model Domain Requirements:**
   - Parse requirements into entities, attributes, primary keys (`PK`), foreign keys (`FK`), and cardinalities (`||--o{`, `||--||`, etc.).
   - Follow standard Mermaid `erDiagram` syntax.

2. **Write Schema:**
   - Save the Mermaid definition to `docs/architecture/schema.mmd`.

3. **Render Diagram:**
   - Run the rendering script:
     ```bash
     node scripts/render_erd.js
     ```

4. **Self-Correction Loop:**
   - If the script exits with `SYNTAX_ERROR`, inspect the error trace, correct the syntax errors in `docs/architecture/schema.mmd`, and re-run `node scripts/render_erd.js`.
   - Allow a maximum of 3 retries.

5. **Deliver Output:**
   - Present the final Mermaid code block to the user.
   - Reference the rendered artifact at `docs/architecture/erd.svg`.