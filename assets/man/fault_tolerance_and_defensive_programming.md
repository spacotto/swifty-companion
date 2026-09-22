# Theoretical Topic: Fault Tolerance & Defensive Programming

This document explores distributed systems resilience, error classification, and defensive programming patterns implemented within **Swifty Companion** to ensure zero runtime crashes under adverse network and data conditions.

---

## 1. The Fallacies of Distributed Computing & Mobile Networks

### 1.1 The Fallacies in Practice
In 1994, L. Peter Deutsch and Sun Microsystems identified the **Fallacies of Distributed Computing**—false assumptions often made by developers new to network programming:
1. *The network is reliable.*
2. *Latency is zero.*
3. *Bandwidth is infinite.*
4. *The topology does not change.*

In mobile software engineering, these fallacies are especially pronounced:
* Mobile devices constantly transition between Wi-Fi and cellular towers.
* Users enter elevators, tunnels, or areas with high packet drop rates.
* Network sockets may be reset abruptly by routers or operating systems.

### 1.2 Designing for Failure
Software must be designed with the fundamental premise that **network I/O will eventually fail**. An unhandled network exception must never cause an application to crash or freeze.

In [`src/api/user.js`](file:///home/silvia/GitHub/swifty-companion/src/api/user.js), network requests are wrapped in explicit exception boundaries:

```javascript
let response;
try {
  response = await fetch(`${BASE_URL}/v2/users/${encodeURIComponent(trimmed)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
} catch (err) {
  throw new Error('Network error: Unable to reach 42 API. Check internet connection.');
}
```
If the device has no internet access, `fetch()` throws a low-level `TypeError: Network request failed`. The exception is caught, normalized into an informative, user-facing error message, and presented cleanly without crashing.

---

## 2. Error Taxonomy & Systematic Normalization

Swifty Companion classifies errors into distinct operational domains:

```text
                           [ Application Errors ]
                                      |
         +----------------------------+----------------------------+
         |                                                         |
  [ User / Client Errors ]                                 [ Infrastructure Errors ]
         |                                                         |
  +------+-------+                                          +------+-------+
  |              |                                          |              |
Validation    Not Found                                 Transport      Authentication
(Empty Query) (404 Error)                               (Offline/Net)  (401 Token Fail)
```

### 2.1 Validation Errors (Pre-Flight)
Before transmitting data over the radio interface, [`SearchScreen.js`](file:///home/silvia/GitHub/swifty-companion/src/screens/SearchScreen.js) performs client-side validation:
```javascript
const login = query.trim().toLowerCase();
if (!login) {
  setErrorMsg('Please enter a 42 login to search');
  return;
}
```
This saves mobile battery, eliminates wasted API quota, and delivers instantaneous feedback.

### 2.2 Not Found (404) vs. Server Faults
A 404 response from the 42 API does not represent a system failure; it is a valid business outcome indicating that the queried student username does not exist.

`user.js` intercepts 404 status codes and maps them to a friendly message:
```javascript
if (response.status === 404) {
  throw new Error(`User "${trimmed}" not found`);
}
```

---

## 3. Defensive Programming & Null Safety

### 3.1 Heterogeneous & Incomplete API Payloads
External REST APIs frequently return payloads that diverge from idealized schemas:
* Students who registered but never began a cursus have empty `cursus_users: []`.
* Piscine poolers lack 42cursus skills.
* Deleted or legacy projects may have `project: null`.
* Some user accounts omit profile images or campus location strings.

Accessing properties on undefined objects (e.g., `user.image.link` when `image` is `null`) produces JavaScript's fatal `TypeError: Cannot read properties of undefined`.

### 3.2 Optional Chaining & Nullish Fallbacks
Swifty Companion employs ECMAScript **Optional Chaining (`?.`)** and **Nullish Fallbacks (`||`)** defensively across every presentation layer:

#### Avatar Rendering:
```javascript
<Image
  source={{
    uri: user.image?.link || "https://via.placeholder.com/120",
  }}
  style={styles.avatar}
/>
```
If `user.image` is `null`, evaluation short-circuits gracefully and falls back to a neutral placeholder graphic.

#### Project Sorting & Rendering:
```javascript
// Sorting defensively against null project names:
.sort((a, b) => (a.project?.name || "").localeCompare(b.project?.name || ""));

// Rendering defensively:
<Text style={styles.projectName} numberOfLines={1}>
  {proj.project?.name || "Unknown Project"}
</Text>
```
Even if an API entity contains corrupted or missing project nodes, the sorting algorithm and list renderer remain stable.

---

## 4. Graceful Degradation & Non-Blocking UX

* **Keyboard Dismissal:** [`Keyboard.dismiss()`](file:///home/silvia/GitHub/swifty-companion/src/screens/SearchScreen.js#L25) collapses the virtual keyboard when searches begin, ensuring the loading indicator and error messages are unobstructed.
* **Inline Error Displays:** Errors are rendered as high-contrast red callouts directly beneath the search form without modal popups that block navigation.

---

## 5. Relevance to Subject Requirements

| Subject Requirement | Theoretical Concept Applied |
| :--- | :--- |
| **"You must handle all cases of errors (login not found, network error, etc.)"** | Multi-tier error handling (404 mapping, network catch blocks, empty input validation). |
| **"Application must still be able to work properly in any case"** | Defensive programming against null fields, optional chaining, and reactive token recovery. |
