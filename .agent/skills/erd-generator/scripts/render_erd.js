#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';

// Fixed input/output paths as requested
const INPUT = path.join(process.cwd(), 'docs/architecture/schema.mmd');
const OUTPUT = path.join(process.cwd(), 'docs/architecture/erd.svg');

// Spawn npx mmdc to render the Mermaid diagram to SVG
const proc = spawn('npx', ['mmdc', '-i', INPUT, '-o', OUTPUT], { stdio: ['ignore', 'pipe', 'pipe'] });

let stderr = '';
let stdout = '';

proc.stdout.on('data', (data) => { stdout += data.toString(); });
proc.stderr.on('data', (data) => { stderr += data.toString(); });

proc.on('error', (err) => {
  // Execution error when trying to spawn npx
  console.error('SYNTAX_ERROR:', err.message);
  process.exit(1);
});

proc.on('close', (code) => {
  if (code === 0) {
    console.log('SUCCESS');
    process.exit(0);
  }

  // Compilation failed: print the stderr trace (or fallback to stdout)
  const trace = (stderr && stderr.trim()) || (stdout && stdout.trim()) || `mmdc exited with code ${code}`;
  console.error('SYNTAX_ERROR:', trace);
  process.exit(1);
});
