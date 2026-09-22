# Theoretical Topic: Data Modeling & Metric Normalization

This document details the data engineering, mathematical normalization, and heuristic filtering techniques implemented in **Swifty Companion** to transform raw 42 Intranet API responses into structured, user-friendly mobile dashboards.

---

## 1. Client-Side Data Transformation & Modeling

### 1.1 The Challenge of Relational Intranet Payloads
The 42 API v2 returns complex, deeply nested JSON graph structures:
* A `User` entity contains nested arrays: `cursus_users`, `projects_users`, `achievements`, `titles`, etc.
* Each element in `cursus_users` contains nested `skills` and `cursus` objects.
* Each element in `projects_users` contains nested `project` metadata, `marked_at` timestamps, and grading arrays.

Directly coupling UI components to raw API schemas makes code fragile. Swifty Companion transforms nested server responses into clean, normalized view models.

### 1.2 Primary Cursus Selection Algorithm
Students frequently participate in multiple educational tracks throughout their time at 42 (e.g., C Piscine, Discovery Piscine, 42 Cursus, or Post-Cursus specializations).

In [`src/screens/ProfileScreen.js`](file:///home/silvia/GitHub/swifty-companion/src/screens/ProfileScreen.js), an algorithm locates the student's primary academic track:

```javascript
const cursusUser =
  user.cursus_users?.find((c) => c.cursus.slug === "42cursus") ||
  user.cursus_users?.[0];
```
* **Primary Target:** Attempts to select `"42cursus"`, representing the main engineering curriculum.
* **Fallback Target:** If the student is a pooler or applicant without a main cursus, falls back gracefully to the first recorded track (`cursus_users[0]`), preventing blank screens.

---

## 2. Mathematical Normalization & Scale Mapping

### 2.1 Skill Normalization (0–21 Scale to 0–100%)
In the 42 curriculum, technical competencies are graded on a floating-point scale from `0.00` to a theoretical maximum of `21.00`.

To display this meaningfully on visual UI gauges, the raw skill level must be normalized into a standard percentage:

$$\text{Percentage} = \left(\frac{\text{skill.level}}{21}\right) \times 100$$

In [`ProfileScreen.js`](file:///home/silvia/GitHub/swifty-companion/src/screens/ProfileScreen.js):
```javascript
const skillPercentage = Math.min(Math.max((skill.level / 21) * 100, 0), 100);
```
* Clamping with `Math.min(..., 100)` and `Math.max(..., 0)` guarantees that unexpected values outside bounds never break layout constraints.
* The output is formatted with dual precision: raw decimal level for exact evaluation (`lvl 8.42`) and rounded percentage for quick visual assessment (`(40%)`).

### 2.2 Level Progress Fractional Calculation
The overall user level is a floating-point number where the integer portion represents the completed level rank, and the decimal portion represents fractional progress toward the next level:

$$\text{Level Progress (\%)} = (\text{level} \pmod 1) \times 100$$

In [`ProfileScreen.js`](file:///home/silvia/GitHub/swifty-companion/src/screens/ProfileScreen.js):
```javascript
const level = cursusUser ? cursusUser.level : 0;
const levelPercentage = (level % 1) * 100;
```
A student at level `9.42` is visually presented as **Level 9** with **42%** progress toward Level 10.

---

## 3. Heuristic Partitioning & Portfolio Filtering

### 3.1 Eliminating Child Sessions & Exam Retries
In 42's database, exam attempts (e.g. Exam Rank 02 sessions) and sub-projects are stored in `projects_users` with a `parent_id` referencing the master curriculum module. Displaying all sessions clutters the interface.

Swifty Companion filters root projects cleanly:
```javascript
const rootProjects = useMemo(() => {
  return (user.projects_users || []).filter((p) => !p.project?.parent_id);
}, [user.projects_users]);
```

### 3.2 Piscine vs. Cursus Heuristics
Because older 42 database records do not always link projects cleanly to `cursus_ids`, Swifty Companion applies a regex classification heuristic:

```javascript
const isPiscineProject = (proj) => {
  const name = (proj.project?.name || "").trim();
  const slug = (proj.project?.slug || "").trim();

  // Exclude common cursus exam ranks
  if (/^exam[\s_-]*rank/i.test(name) || /^exam[\s_-]*rank/i.test(slug)) {
    return false;
  }

  // Match standard piscine modules (C Piscine, Days, Rushes, BSQ, etc.)
  const piscinePattern =
    /^(C Piscine\b|Day\s*\d{2}\b|BSQ\b|Rush\s*\d{2}|Exam\s*(?:\d{2}|Final)\b|Sastantua\b|Match-N-Match\b|EvalExpr\b)/i;
  return piscinePattern.test(name);
};
```

### 3.3 Dynamic Initial Scope
If a student only has Piscine projects, defaulting to Cursus would display an empty list. Swifty Companion calculates `hasCursusProjects` and dynamically initializes the filter:

```javascript
const hasCursusProjects = useMemo(() => {
  return rootProjects.some((p) => !isPiscineProject(p));
}, [rootProjects]);

const [projectFilter, setProjectFilter] = useState(hasCursusProjects ? "cursus" : "piscine");
```
A scope selector modal allows users to switch between `"Cursus"`, `"Piscine"`, and `"All Projects"`.

---

## 4. Privacy-Conscious Data Modeling

The 42 subject notes:
> *"Due to data privacy concerns, and in compliance with relevant laws in certain countries, it may be necessary to refrain from disclosing certain information."*

In modern API architectures, personal identifying data (such as private mobile telephone numbers and personal emails) is frequently scrubbed or restricted by privacy regulations (GDPR).

Swifty Companion intentionally focuses on publicly accessible academic metrics:
1. Student handle (`@login`)
2. Academic level and skills
3. Project completion history and grades
4. Campus presence (`location`)
5. Public community credits (`wallet` and `correction_point`)

---

## 5. Relevance to Subject Requirements

| Subject Requirement | Theoretical Concept Applied |
| :--- | :--- |
| **"Display the user's skills with level and percentage"** | Mathematical normalization of raw floating-point skill values against maximum scale (21.0) into explicit percentages. |
| **"Display projects completed, including failed ones"** | Status filtering (`validated?`), root project identification (`!parent_id`), and alphabetical sorting. |
| **"Data privacy concerns"** | Privacy-conscious attribute selection compliant with GDPR and 42 Intra API privacy restrictions. |
