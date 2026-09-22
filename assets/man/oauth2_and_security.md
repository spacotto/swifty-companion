# Theoretical Topic: Protocol Engineering & Security: OAuth 2.0

This document covers the authorization theory, protocol mechanics, and credential security practices implemented in **Swifty Companion** pursuant to **RFC 6749** and the 42 API specifications.

---

## 1. Delegated Authorization vs. Direct Authentication

### 1.1 The Inherent Security Flaw of Direct Credentials
In legacy systems, client applications frequently collected and stored long-lived user passwords, sending them over the network with every query. This introduced catastrophic vulnerabilities:
* If client application memory or storage is compromised, user master credentials are leaked.
* Revoking client access required the user to change their master account password.
* The client possessed unbounded, full permissions over the user's account.

### 1.2 The OAuth 2.0 Solution (RFC 6749)
OAuth 2.0 is a **delegated authorization framework**. Instead of exposing master credentials, clients authenticate to an **Authorization Server** to obtain a scoped, short-lived **Bearer Token**.

The token represents a capability key: possession of the token authorizes the client to make requests to the **Resource Server** (`api.intra.42.fr`) without ever seeing or transmitting user passwords.

---

## 2. The Client Credentials Grant Flow

### 2.1 Machine-to-Machine Architecture
OAuth 2.0 specifies several grant flows (Authorization Code, Implicit, Client Credentials, Refresh Token).

Because Swifty Companion queries public/peer directory information without impersonating a specific logged-in student, it utilizes the **Client Credentials Grant** (`grant_type: "client_credentials"`).

```text
+-------------------+                               +--------------------+
|                   |  (1) POST /oauth/token        |                    |
|                   |  (client_id & client_secret)  |    Authorization   |
|                   |------------------------------>|       Server       |
|                   |                               | (api.intra.42.fr)  |
|                   |  (2) Return access_token      |                    |
|                   |      & expires_in (7200s)     |                    |
|   Mobile Client   |<------------------------------+--------------------+
|  (Swifty Companion|
|                   |                               +--------------------+
|                   |  (3) GET /v2/users/:login     |                    |
|                   |  Authorization: Bearer <token>|   Resource Server  |
|                   |------------------------------>| (api.intra.42.fr)  |
|                   |                               |                    |
|                   |  (4) Return Student JSON      |                    |
|                   |<------------------------------+--------------------+
+-------------------+                               +--------------------+
```

### 2.2 Token Acquisition Implementation
In [`src/api/auth.js`](file:///home/silvia/GitHub/swifty-companion/src/api/auth.js):

```javascript
const response = await fetch(TOKEN_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  }),
});
```

---

## 3. Token Lifecycle & Cache Optimization

### 3.1 Why Creating a Token Per Query is Anti-Pattern
Every call to `/oauth/token` requires:
* DNS resolution and TLS handshake overhead.
* Cryptographic signature generation and database writes on the 42 OAuth server.
* Exceeding the strict rate-limits (e.g. 2 requests per second) enforced by 42 Intra.

The subject explicitly forbids creating tokens per query:
> *"Do not create a token for each query. Refer to the OAuth2 documentation."*

### 3.2 In-Memory Caching with Safety Window
In [`src/api/auth.js`](file:///home/silvia/GitHub/swifty-companion/src/api/auth.js), Swifty Companion stores the active token and its expiration timestamp:

```javascript
let cachedToken = null;
let tokenExpiresAt = 0;

export async function getAccessToken() {
  const now = Date.now() / 1000;
  if (cachedToken && now < tokenExpiresAt - 60) {
    return cachedToken; // Reuse cached token
  }
  // ... fetch new token ...
  cachedToken = data.access_token;
  tokenExpiresAt = (Date.now() / 1000) + data.expires_in;
  return cachedToken;
}
```
The `now < tokenExpiresAt - 60` logic provides a **60-second safety window**, accounting for clock skew or network latency and preventing in-flight expiration.

---

## 4. Proactive vs. Reactive Token Renewal (The Bonus)

### 4.1 Proactive Renewal (Time-Based)
As long as the application remains running, `getAccessToken()` automatically checks token expiration before issuing requests. Once the token has less than 60 seconds remaining, it silently fetches a replacement.

### 4.2 Reactive Renewal (Server-Driven / 401 Interception)
If the 42 server prematurely revokes the token or resets authentication sessions, a locally cached token will produce an `HTTP 401 Unauthorized` status.

To satisfy the subject's bonus requirement (*"If the token expires, the application must refresh it. The application must still be able to work properly in any case"*), Swifty Companion implements **reactive invalidation and retry**:

In [`src/api/auth.js`](file:///home/silvia/GitHub/swifty-companion/src/api/auth.js):
```javascript
export function invalidateToken() {
  cachedToken = null;
  tokenExpiresAt = 0;
}
```

In [`src/api/user.js`](file:///home/silvia/GitHub/swifty-companion/src/api/user.js):
```javascript
if (response.status === 401 && !isRetry) {
  invalidateToken(); // Purge invalid token
  return fetchUserProfile(login, true); // Automatically retry once with fresh token
}
```
This ensures the application never fails from expired credentials.

---

## 5. Secrets Management & Configuration Hygiene

### 5.1 The Twelve-Factor App Methodology
Modern software engineering follows the **Twelve-Factor App** guideline: *Strictly separate configuration from code*. Credentials should never be committed into source control.

### 5.2 Git Isolation
In Swifty Companion:
* [.env.example](file:///home/silvia/GitHub/swifty-companion/.env.example) is committed with placeholder values (`your_42_api_uid_here`).
* [.gitignore](file:///home/silvia/GitHub/swifty-companion/.gitignore#L8-L23) explicitly ignores `.env`, `*.env`, and certificate files.
* Secrets are loaded at runtime through `process.env`.
* A Makefile rule (`make env`) creates local `.env` files safely without exposing credentials.

---

## 6. Relevance to Subject Requirements

| Subject Requirement | Theoretical Concept Applied |
| :--- | :--- |
| **"Credentials saved locally in a .env file and ignored by git"** | Twelve-Factor configuration isolation, `.gitignore` filtering. |
| **"Do not create a token for each query"** | In-memory token caching with temporal validity verification. |
| **"Bonus: Recreate token at expiration date"** | Dual renewal strategy: Proactive temporal buffer (60s) + Reactive 401 invalidation and retry. |
| **"You must use intra oauth2"** | Implementation of RFC 6749 Client Credentials flow against `https://api.intra.42.fr/oauth/token`. |
