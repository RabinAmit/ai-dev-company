# File Editing Workflow

## Purpose
Define safe and reliable file modification practices.

---

## Rules

### 1. Prefer Small Changes
- Avoid large patches
- Modify only necessary sections

---

### 2. Split Large Changes
- Break into multiple patches
- Apply sequentially

---

### 3. Handle Encoding Issues
- Watch for corrupted characters (e.g. â€œ)
- Avoid strict context matching if detected

---

### 4. Failure Recovery
If patch fails:
1. Retry with smaller change
2. Reduce context
3. Switch approach

---

### 5. Verify Changes
- Ensure file integrity
- Ensure no partial updates

## Related Memory

For known environment limitations and edge cases, see:

- `/memory/sandbox-limitations.md`