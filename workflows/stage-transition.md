## Stage Transition Rules

---

### 1. PM → Critic (PM Review)

Trigger:
- PM output is complete
- Acceptance criteria are defined

Action:
- Route task to Critic for review

---

### 2. Critic → (PM Approved)

Trigger:
- Critic Approval Status = APPROVED

Action:
- Route task to UI/UX

---

### 3. Critic → (PM Revision Required)

Trigger:
- Critic Approval Status = REVISE

Action:
- Route back to PM with feedback

---

### 4. UI/UX → Critic (UX Review)

Trigger:
- UI/UX output is complete

Action:
- Route task to Critic for review

---

### 5. Critic → (UX Approved)

Trigger:
- Critic Approval Status = APPROVED

Action:
- Route task to Architect

---

### 6. Critic → (UX Revision Required)

Trigger:
- Critic Approval Status = REVISE

Action:
- Route back to UI/UX with feedback

---

### 7. Architect → Critic (Architecture Review)

Trigger:
- Architecture is complete
- Implementation plan is defined

Action:
- Route task to Critic for review

---

### 8. Critic → (Architecture Approved)

Trigger:
- Critic Approval Status = APPROVED

Action:
- Route task to Developer

---

### 9. Critic → (Architecture Revision Required)

Trigger:
- Critic Approval Status = REVISE

Action:
- Route back to Architect with feedback

---

### 10. Developer → QA

Trigger:
- Implementation is complete
- Developer provides summary

Action:
- Route task to QA

---

### 11. QA → (PASS)

Trigger:
- QA Status = PASS

Action:
- Mark task as COMPLETE

---

### 12. QA → (FAIL)

Trigger:
- QA Status = FAIL

Action:
- Route back to Developer
- Include full QA Report

---

### 13. QA → (FAIL + Human Override)

Trigger:
- QA Status = FAIL
- Human approves issues

Action:
- Mark task as COMPLETE
- Log accepted issues