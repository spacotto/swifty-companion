# Feature Specifications & Component Mapping

This document provides a comprehensive breakdown of all user-facing and architectural features in **Swifty Companion**. For each feature, it details the business/user purpose, technical behavior, error edge cases, and maps the specific code components responsible for its implementation.

---

## Feature Index

1. [OAuth2 Authentication & Token Lifecycle](#1-oauth2-authentication--token-lifecycle)
2. [Student Directory Search & Input Validation](#2-student-directory-search--input-validation)
3. [Comprehensive Error Handling & Offline Recovery](#3-comprehensive-error-handling--offline-recovery)
4. [Student Profile & Identity Dashboard](#4-student-profile--identity-dashboard)
5. [Curriculum Level & Progress Meter](#5-curriculum-level--progress-meter)
6. [Technical Skills Visualization](#6-technical-skills-visualization)
7. [Projects Portfolio & Scope Selector](#7-projects-portfolio--scope-selector)
8. [Navigation & Stack Management](#8-navigation--stack-management)
9. [Responsive Cross-Platform Layout](#9-responsive-cross-platform-layout)

---

## 1. OAuth2 Authentication & Token Lifecycle

### Description
Manages secure access to the 42 Intranet API using the OAuth 2.0 `client_credentials` grant flow. Ensures that API rate limits are respected by preventing per-query token creation, while supporting full automatic recovery if credentials expire or are revoked by the server.

### Key Behaviors
* Ingests API credentials (`UID` and `SECRET`) from local environment variables via `process.env`.
* Caches generated bearer tokens in memory along with an expiration timestamp (`tokenExpiresAt`).
* Reuses existing valid tokens if at least 60 seconds remain before expiration.
* **Reactive 401 Recovery (Bonus):** If the 42 API returns a `401 Unauthorized` during any user request, the stale token is invalidated and the request is transparently re-attempted once with a newly negotiated token.

### Relevant Components
* **[`src/api/auth.js`](file:///home/silvia/GitHub/swifty-companion/src/api/auth.js)** — Negotiates tokens via `POST /oauth/token`, maintains cache variables (`cachedToken`, `tokenExpiresAt`), and exports `getAccessToken()` and `invalidateToken()`.
* **[`src/api/user.js`](file:///home/silvia/GitHub/swifty-companion/src/api/user.js)** — Injects the bearer token into outgoing requests and triggers reactive invalidation upon receiving HTTP 401 responses.
* **[`.env`](file:///home/silvia/GitHub/swifty-companion/.env.example)** — Local uncommitted environment configuration storing `EXPO_PUBLIC_FT_CLIENT_ID` and `EXPO_PUBLIC_FT_CLIENT_SECRET`.

---

## 2. Student Directory Search & Input Validation

### Description
Allows users to look up any student across the global 42 campus network by entering their 42 intranet username.

### Key Behaviors
* Normalizes input by trimming leading/trailing whitespace and converting queries to lowercase.
* Validates empty or whitespace-only inputs, rendering an immediate prompt without triggering unnecessary API traffic.
* Automatically dismisses the mobile software keyboard upon submitting a search.
* Triggers an active loading spinner (`ActivityIndicator`) and disables the submit button during network calls to prevent duplicate submissions.

### Relevant Components
* **[`src/screens/SearchScreen.js`](file:///home/silvia/GitHub/swifty-companion/src/screens/SearchScreen.js)** — Houses the search `TextInput`, search trigger button, state tracking (`query`, `loading`, `errorMsg`), and user interaction logic.
* **[`src/api/user.js`](file:///home/silvia/GitHub/swifty-companion/src/api/user.js)** — Sanitizes login strings with `encodeURIComponent` and executes the network request to `/v2/users/:login`.

---

## 3. Comprehensive Error Handling & Offline Recovery

### Description
Ensures the application never crashes when encountering network faults, missing users, or unexpected API conditions, presenting actionable, human-readable feedback.

### Key Behaviors
* **Student Not Found (404):** Displays a specific alert: `"User '<login>' not found"`.
* **Network Disconnection / Timeout:** Catches network-layer exceptions and displays: `"Network error: Unable to reach 42 API. Check internet connection."`.
* **HTTP Faults:** Displays the HTTP status code for unexpected backend responses.
* **Non-Blocking UI:** Errors are displayed as an inline banner below the search bar without modal locks or screen transitions.

### Relevant Components
* **[`src/api/user.js`](file:///home/silvia/GitHub/swifty-companion/src/api/user.js)** — Normalizes backend status codes (404, 401, 500) and catches low-level network errors.
* **[`src/screens/SearchScreen.js`](file:///home/silvia/GitHub/swifty-companion/src/screens/SearchScreen.js)** — Catches exceptions thrown by the API layer, turns off loading spinners, and renders the error message.

---

## 4. Student Profile & Identity Dashboard

### Description
Presents a verified overview of the student's identity, active campus presence, and institutional standing.

### Key Behaviors
* **Avatar Display:** Renders the student's official intranet photo (`user.image?.link`), with automatic fallback to a placeholder graphic if unassigned.
* **Identity:** Displays the student's legal/preferred full display name and `@login` handle.
* **Campus Workstation Location:** Displays their active physical cluster desk (e.g., `e1r2p3`) or `"Unavailable"` if the student is logged off.
* **Community Metrics:** Displays school wallet balance (`user.wallet ₳`) and available peer evaluation points (`user.correction_point`).

### Relevant Components
* **[`src/screens/ProfileScreen.js`](file:///home/silvia/GitHub/swifty-companion/src/screens/ProfileScreen.js)** — Constructs the profile card header, circular avatar image, and metrics stat boxes.
* **[`src/navigation/AppNavigator.js`](file:///home/silvia/GitHub/swifty-companion/src/navigation/AppNavigator.js)** — Dynamically sets the top navigation bar title to match the queried user's login.

---

## 5. Curriculum Level & Progress Meter

### Description
Calculates and visualizes the student's academic standing within the 42 curriculum.

### Key Behaviors
* Locates the primary cursus from `user.cursus_users` (prioritizing `42cursus`).
* Computes overall level (integer) and percentage progress towards the next rank (`(level % 1) * 100`).
* Displays a styled progress bar indicating visual progress along with explicit numeric level and percentage text (e.g., `Level 9 — 9.42 (42%)`).

### Relevant Components
* **[`src/screens/ProfileScreen.js`](file:///home/silvia/GitHub/swifty-companion/src/screens/ProfileScreen.js)** — Evaluates `cursus_users`, extracts level numbers, and calculates percentages.
* **[`src/components/ProgressBar.js`](file:///home/silvia/GitHub/swifty-companion/src/components/ProgressBar.js)** — Reusable UI bar rendering the animated fill track and dual-label text row.

---

## 6. Technical Skills Visualization

### Description
Breaks down the student's technical strengths across core competencies tracked by the 42 curriculum (e.g., Algorithms, Unix, Graphics, Web, Network & System Administration).

### Key Behaviors
* Iterates over all skills listed in the student's active cursus.
* Computes normalized percentage against 42's maximum skill rank (level 21): `(skill.level / 21) * 100`.
* Renders each skill with a `ProgressBar` displaying the skill title, bar gauge, and explicit level and percentage figures (e.g., `Algorithms — lvl 8.42 (40%)`).
* Renders a placeholder message (`"No skills recorded."`) if the student has no registered skills.

### Relevant Components
* **[`src/screens/ProfileScreen.js`](file:///home/silvia/GitHub/swifty-companion/src/screens/ProfileScreen.js)** — Maps `skills` array and scales values to percentage bounds.
* **[`src/components/ProgressBar.js`](file:///home/silvia/GitHub/swifty-companion/src/components/ProgressBar.js)** — Renders the clamped percentage gauge and formatted text for each skill.

---

## 7. Projects Portfolio & Scope Selector

### Description
Displays an organized log of every project registered by the student, detailing evaluation outcomes, scores, and ongoing work.

### Key Behaviors
* **Sub-project Filtering:** Excludes internal exam sessions and child attempts (`!p.project?.parent_id`) to only display root projects.
* **Multi-Scope Selector Modal:** Provides a popup dialog allowing users to switch between:
  * **Cursus Projects:** Standard curriculum assignments.
  * **Piscine Projects:** Intensive candidate bootcamp exercises.
  * **All Projects:** Unfiltered combined portfolio.
* **Intelligent Scoping:** Detects if the student only has Piscine projects (e.g. poolers) and automatically defaults to the Piscine scope rather than showing an empty state.
* **Status Badges & Coloring:**
  * **Validated:** Displayed in Cyan with numeric mark (e.g., `100`, `125`).
  * **Failed:** Displayed in Magenta with numeric mark (e.g., `0`, `42`).
  * **In Progress:** Displayed in Yellow with `"In progress"` status text.
* **Crash Resilience:** Implements optional chaining (`proj.project?.name`) to safely handle corrupt project nodes.

### Relevant Components
* **[`src/screens/ProfileScreen.js`](file:///home/silvia/GitHub/swifty-companion/src/screens/ProfileScreen.js)** — Manages project filtering, alphabetical sorting, scope modal state, and color-coded mark rendering.

---

## 8. Navigation & Stack Management

### Description
Provides seamless multi-screen routing adhering to platform-native mobile navigation patterns.

### Key Behaviors
* Uses React Navigation's native stack navigator (`@react-navigation/native-stack`) backed by native iOS and Android navigation controllers.
* Passes fetched user payload from `SearchScreen` to `ProfileScreen` via route params.
* Supports all native back-navigation gestures:
  * Header bar back button
  * Android physical/virtual hardware back button
  * iOS edge-swipe pop gesture

### Relevant Components
* **[`src/navigation/AppNavigator.js`](file:///home/silvia/GitHub/swifty-companion/src/navigation/AppNavigator.js)** — Configures screen stack, dark theme headers, and route bindings.
* **[`App.js`](file:///home/silvia/GitHub/swifty-companion/App.js)** — Mounts the root `<NavigationContainer>`.

---

## 9. Responsive Cross-Platform Layout

### Description
Ensures UI elements scale adaptively across all screen geometries, devices, and platforms (Android, iOS, and Web).

### Key Behaviors
* Employs Flexbox with fluid percentage widths, flex rows, and alignment constraints.
* Encloses profile information in a vertical `ScrollView` to prevent content clipping on smaller viewports.
* Integrates `SafeAreaProvider` to automatically accommodate device-specific notches, camera islands, and system gesture bars.

### Relevant Components
* **[`App.js`](file:///home/silvia/GitHub/swifty-companion/App.js)** — Hosts `<SafeAreaProvider>`.
* **[`src/screens/SearchScreen.js`](file:///home/silvia/GitHub/swifty-companion/src/screens/SearchScreen.js)** — Responsive centered form layout.
* **[`src/screens/ProfileScreen.js`](file:///home/silvia/GitHub/swifty-companion/src/screens/ProfileScreen.js)** — Scrollable dashboard container.
* **[`src/components/ProgressBar.js`](file:///home/silvia/GitHub/swifty-companion/src/components/ProgressBar.js)** — Clamped auto-scaling visual progress track.
