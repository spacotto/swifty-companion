# RESTful APIs & Asynchronous I/O

This document examines the networking architecture, communication protocols, and asynchronous concurrency models utilized by **Swifty Companion** to interface with the 42 Intranet API.

## REST (Representational State Transfer) Architecture

### Core Principles of REST
The 42 Intranet API adheres to RESTful architectural constraints:
1. **Client-Server Separation:** The mobile application (client) manages user interaction, rendering, and transient UI state. The 42 backend (server) manages database persistence, evaluation records, and academic business logic.
2. **Statelessness:** Every HTTP request sent by the client must contain all the contextual information necessary for the server to understand and authorize it. The server stores no session state between client queries. Each query to `/v2/users/:login` must carry an explicit `Authorization: Bearer <token>` header.
3. **Resource-Oriented URIs:** Endpoints represent nouns (resources) rather than procedural verbs:
   * `/v2/users/norminet` represents the student resource identified by login `norminet`.
   * `/oauth/token` represents the authorization token exchange resource.

### Semantic HTTP Verbs & Status Codes
Swifty Companion uses standard HTTP methods:
* **`POST`:** Submits client credentials in request body to create an authentication session token (`/oauth/token`).
* **`GET`:** Idempotently retrieves user profile representations without modifying server state (`/v2/users/:login`).

The application normalizes and handles semantic status codes:
* **`200 OK`:** Successful response returning requested JSON entity.
* **`401 Unauthorized`:** Token is missing, expired, or rejected by the server.
* **`404 Not Found`:** The requested student username does not exist in the 42 database.
* **`5xx Server Errors`:** Backend service failure.

## Asynchronous I/O & Non-Blocking Event Loops

### The Mobile Concurrency Challenge
Mobile devices run graphical user interfaces at 60 or 120 frames per second (FPS). This gives the rendering engine approximately **16.6 milliseconds** per frame to calculate layouts, process touch gestures, and paint pixels.

Network operations over cellular or Wi-Fi connections can take anywhere from **100ms to several seconds**. If network requests were synchronous (blocking), the UI thread would freeze completely, causing frame drops and triggering OS-level "Application Not Responding" (ANR) warnings.

### The JavaScript Event Loop & Promises
React Native runs application code on a dedicated JavaScript engine (e.g., Hermes). JavaScript utilizes a single-threaded **event loop** with a non-blocking I/O model:

1. Asynchronous I/O operations (`fetch()`) are offloaded to native operating system worker threads.
2. The JavaScript engine continues executing synchronous code (e.g., rendering the loading spinner).
3. When the network response returns, the native thread enqueues the Promise callback into JavaScript's microtask queue.
4. The event loop executes the callback when the call stack is clear.

### Implementation in Swifty Companion
In [`src/screens/SearchScreen.js`](/src/screens/SearchScreen.js), `async/await` syntax allows clean asynchronous orchestration without blocking:

```javascript
const handleSearch = async () => {
  const login = query.trim().toLowerCase();
  if (!login) {
    setErrorMsg('Please enter a 42 login to search');
    return;
  }

  Keyboard.dismiss();
  setLoading(true); // Triggers immediate UI render with spinner
  setErrorMsg(null);

  try {
    const userData = await fetchUserProfile(login); // Non-blocking asynchronous await
    setLoading(false);
    navigation.navigate('Profile', { user: userData });
  } catch (err) {
    setLoading(false);
    setErrorMsg(err.message); // Displays error banner cleanly
  }
};
```

## URI Encoding & Query Sanitization

### Special Character Escaping
Usernames entered into search fields may contain spaces, non-ASCII characters, or reserved URL symbols (such as `/`, `?`, or `#`). Directly concatenating raw strings into URL paths can corrupt HTTP headers or lead to malformed requests.

In [`src/api/user.js`](/src/api/user.js), user input is sanitized and URI-encoded:

```javascript
const trimmed = login.trim().toLowerCase();
const response = await fetch(`${BASE_URL}/v2/users/${encodeURIComponent(trimmed)}`, ...);
```
`encodeURIComponent()` transforms reserved characters into standard percent-encoded sequences (e.g. spaces become `%20`), ensuring RFC 3986 compliance.

## Relevance to Subject Requirements

| Subject Requirement | Theoretical Concept Applied |
| :--- | :--- |
| **"Retrieve the information of 42 students, using the 42 API"** | RESTful HTTP `GET` resource queries against `/v2/users/:login`. |
| **"Handle all cases of errors (login not found, network error, etc.)"** | HTTP status code normalization (404 mapping, try/catch network interception). |
| **"Latest available version of the 42 API"** | Integrated with 42 Intra API v2 endpoints and JSON data models. |
