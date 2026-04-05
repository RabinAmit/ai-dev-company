# Sandbox Limitations

## Purpose
Capture known environment and tooling limitations that may affect agent execution.

---

## Known Issues

### Windows command length limit
- Large single-shot patch operations may fail with:
  - `CreateProcessAsUserW failed: 206`
- This indicates a Windows process or command-length limitation.

Implication:
- Large patch payloads should be split into smaller operations.

---

### apply_patch fragility with encoding-damaged files
- Files containing corrupted characters such as:
  - `â€œ`
  - `â†’`
  - `â€”`
may cause context-based patch matching to fail.

Implication:
- Prefer smaller targeted changes
- Prefer reduced-context edits
- Use caution when editing encoding-damaged files

---

## Operational Guidance
- Treat large patch operations as higher risk in Windows sandbox environments
- Prefer small, sequential edits
- Verify file integrity after modifications

---

## Notes
- This file provides supporting context only
- Workflow files define procedure
- Agent files define authority and constraints