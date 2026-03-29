## Stage Transition Rules

### 1. PM → Architect
Trigger:
- PM output is complete
- Acceptance criteria are defined

Action:
- Route task to Architect

---

### 2. Architect → Developer
Trigger:
- Architecture is complete
- Implementation plan is defined

Action:
- Route task to Developer

---

### 3. Developer → QA
Trigger:
- Implementation is complete
- Developer provides summary

Action:
- Route task to QA

---

### 4. QA → (PASS)
Trigger:
- QA Status = PASS

Action:
- Mark task as COMPLETE

---

### 5. QA → (FAIL)
Trigger:
- QA Status = FAIL

Action:
- Route back to Developer
- Include full QA Report

---

### 6. QA → (FAIL + Human Override)
Trigger:
- QA Status = FAIL
- Human approves issues

Action:
- Mark task as COMPLETE
- Log accepted issues