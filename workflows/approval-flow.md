# Approval Flow

Version: 1.0
Last Updated: 2026-03-29

---

## Purpose
Defines how the human approves, rejects, or modifies proposed actions in Guided Mode.

---

## Scope
This protocol applies whenever an agent proposes actions that require human approval.

---

## Approval Commands

### APPROVE ALL
Executes all proposed actions.

### APPROVE: [action numbers]
Executes only the listed actions.

Example:
APPROVE: 1, 3, 5

### REJECT: [reason]
Rejects all proposed actions and requires revision.

Example:
REJECT: Action 2 is too risky

### MODIFY:
Requests changes to proposed actions before approval.

Example:
MODIFY:
Action 2 → change target to /src/app.js

---

## Rules
- Use only the defined approval commands
- Do not mix approval with unrelated instructions
- Keep approvals clear and unambiguous
- Agents must wait for approval before execution when required by system rules