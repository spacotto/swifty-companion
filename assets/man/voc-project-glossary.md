# Project Glossary
A conceptual glossary covering all essential technical terms, architecture concepts, and evaluation criteria required to understand, build, and defend the project.   

## System & Architecture

### API (Application Programming Interface)
A set of routines, protocols, endpoints, and tools that allows one software application to communicate with another. In this project, it represents the remote web services exposed by 42 to access student data.   

### REST (Representational State Transfer)
An architectural style for network services where entities are treated as stateless resources addressed via standard HTTP request methods (`GET`, `POST`) and standardized data payloads (`JSON`). 

### GET (HTTP Method)
An HTTP request method used to request data from a specified resource without altering the server's state. `GET` requests are intended to be safe and idempotent, meaning making the same request multiple times produces the identical outcome without side effects. Parameters and query data are appended directly to the URL query string rather than transmitted in the request body (e.g., retrieving a student record via `GET /v2/users/:login`).

### POST (HTTP Method)
An HTTP request method designed to submit entity data to an identified resource for processing. Unlike `GET`, a `POST` request carries its payload (such as JSON credentials or form inputs) inside the request body rather than visible in the URL. It is non-idempotent, meaning repeated identical requests may produce side effects, such as creating new database entries or generating a new access token (e.g., requesting credentials via `POST /oauth/token`).

### 42 Intra API (v2)
The OAuth2-secured REST interface provided by 42 ([https://api.intra.42.fr](https://api.intra.42.fr)). The project requires consuming its latest endpoints to look up student profiles, cursus progression, skills, and projects.   

### Client Credentials Flow
A standard OAuth 2.0 grant type where a confidential client application requests an access token directly using its `client_id` and `client_secret`, authenticating the application itself rather than an individual logged-in user.

### Bearer Token
The temporary cryptographic credential obtained from the OAuth endpoint that authorizes requests to protected resources. It must be provided in the HTTP header as `Authorization: Bearer <token>`.

### Token Caching & Lifespan (`expires_in`)
The duration (in seconds) for which an issued token remains valid. The subject explicitly forbids generating a token per query; the application must persist the active token in memory and reuse it across multiple searches until its expiration window is reached.

## Security & Environment Configuration

### Client ID & Client Secret
The unique identification key and confidential secret generated when registering an application on the 42 Intra portal.

### Environment File (`.env`)
A local text file used to store confidential credentials (`UID`, `SECRET`, API URLs) outside source code.   

### `.gitignore`
A Git configuration file that specifies intentionally untracked files. Committing `.env` or leaking API secrets to the repository results in an immediate project failure.   

## UI, Navigation & Layout

### Views & Screens
Independent UI states or pages in a mobile application. The subject mandates **at least 2 views**:   
* **View 1:** A search/entry view to input student identifiers.
* **View 2:** A detail/profile view rendering the retrieved student record, with the ability to navigate back to View 1.

### Back Navigation
A mechanism (navigation stack, top app bar back button, or native back gesture) allowing the user to return from View 2 back to View 1 without crashing or losing application state.   

### Flexible & Responsive Layout
UI architectures (such as `ConstraintLayout`, `Flexbox`, `Autolayout`, or modern declarative layout engines) that adapt dynamically to varied screen resolutions, aspect ratios, and orientations without clipping or overlapping content.   

### Skills & Level Bar
A graphical visual representation (such as a progress bar) displaying a student's acquired competence levels along with exact numerical values and percentage completion.   

## Student Domain Model (42 Intra Entities)

### Login
The unique alphanumeric username identifying a student on the 42 Intra.   

### Profile Picture
The remote avatar image associated with a student record (accessed via `image.link` in the user payload) that must be fetched and displayed on View 2.   

### User Details
Specific metadata fields required on the profile view (at least four must be displayed alongside the photo, such as email, wallet, correction/evaluation points, grade/level, or campus location).   

### Cursus
A distinct educational track within 42 (e.g., `C Piscine` or `42cursus`). Each cursus tracks its own level and skill tree independently.

### Projects & Validation Status
The student's project submissions. The view must list completed projects, explicitly reflecting passed marks, failed marks, and projects in progress.   

## Resilience & Error Handling

### Client-Side Validation Error
Handling invalid or empty search queries locally before making an unnecessary network call.   

### Resource Not Found (HTTP 404)
Handling scenarios where a queried login does not exist on the Intra, requiring an informative message rather than a crash or unhandled rejection.   

### Network & Transport Error
Handling physical connectivity loss, timeouts, DNS failures, or offline states gracefully with feedback in the UI.   

### Unauthorized & Forbidden (HTTP 401 / 403)
Handling invalid or expired application credentials when communicating with the authentication endpoints.

### Rate Limiting (HTTP 429)
The status returned when an application exceeds the 42 API's request-per-second or hourly quota limits.

## Resources
* [API (Application Programming Interface)](https://en.wikipedia.org/wiki/API)
* [REST (Representational State Transfer)](https://en.wikipedia.org/wiki/REST)
* [HTTP POST Method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)
* [OAuth 2.0](https://en.wikipedia.org/wiki/OAuth)
* [RFC 6749: The OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
* [RFC 6750: The OAuth 2.0 Authorization Framework: Bearer Token Usage](https://datatracker.ietf.org/doc/html/rfc6750)
* [Responsive Web Design](https://en.wikipedia.org/wiki/Responsive_web_design)
* [ConstraintLayout](https://developer.android.com/reference/androidx/constraintlayout/widget/ConstraintLayout)
* [Mobile Navigation Architecture](https://developer.android.com/guide/navigation)
