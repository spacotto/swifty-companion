# Swifty Companion

**Swifty Companion** is a mobile directory application. It allows users to look up intra profiles within the global 42 school network and view an up-to-date summary of their academic journey, technical skills, and project accomplishments.

## Key Features

* Profile Search
* Profile Overview
* Competency & Skill Breakdown
* Project Portfolio & History
* Reliable & Secure by Design

>[!NOTE]
>For a detailed breakdown of each feature and its underlying components, see [features.md](assets/man/features.md).

## Instructions

>[!WARNING]
>Concerning the prerequisites, check the [project setup documentation](/assets/man/project_setup.md). 

1. Run `make` to prepare the working environment and launch the app.
2. Populate the `.env` with your API keys.
3. Press `w` in your terminal to open the app directly in your web browser.
4. Alternatively, scan the terminal's QR code using the **Expo Go** mobile app on your iOS or Android phone.

## Technical Stack

| Layer | Technology | Details / Version |
| :--- | :--- | :--- |
| **Core Framework** | [React Native](https://reactnative.dev/) / [Expo](https://expo.dev/) | React Native v0.86.3, Expo SDK ~57 |
| **Language & Runtime** | JavaScript (ES6+) | Node.js runtime |
| **UI & Layout** | [React](https://react.dev/) | React v19.2.3, `react-native-safe-area-context` |
| **Navigation** | [React Navigation](https://reactnavigation.org/) | Native Stack v7 |
| **Networking** | Native Fetch API | HTTPS, REST endpoints |
| **Authentication** | OAuth 2.0 | `client_credentials` grant flow |
| **Data Provider** | [42 Intra API](https://api.intra.42.fr/apidoc) | REST API v2 (`/v2/users`, `/oauth/token`) |
| **Configuration** | Expo Environment Variables | `.env` file (`EXPO_PUBLIC_*`) |

## Resources

* [Feature Specifications](assets/man/features.md)
* [42 API Documentation](https://api.intra.42.fr/apidoc)
* [42 OAuth Application Portal](https://profile.intra.42.fr/oauth/applications)
* [42 Network](https://42.fr/)
* [Expo Documentation](https://docs.expo.dev/)
* [React Native](https://reactnative.dev/)
* [React Navigation](https://reactnavigation.org/)
* [RFC 6749 (OAuth 2.0)](https://datatracker.ietf.org/doc/html/rfc6749)

### AI Usage
Artificial Intelligence assistance tools were utilized throughout the project lifecycle in the following capacities:
- Research
- Bug fixing
- Audit
- Documentation Assistance
