# Swifty Companion

A cross-platform mobile companion application built for the **42 Network** coding school community.

## What is Swifty Companion?

**Swifty Companion** is a mobile talent and student directory application. It allows users—such as peers, recruiters, mentors, and campus staff—to quickly look up any student within the global 42 school network and view an up-to-date summary of their academic journey, technical skills, and project accomplishments.

At 42, education is project-based and peer-driven: there are no traditional professors, lectures, or letter grades. Instead, students advance through experience levels by completing complex software projects and evaluating one another. **Swifty Companion** translates this unique educational model into an intuitive, visual mobile dashboard.

## Key Features (At a Glance)

* 🔍 **Student Directory Search**  
  Quickly search for any student across campuses using their school username.

* 👤 **Comprehensive Student Overview**  
  Instantly view key student metrics at a glance:
  * Profile photo and full display name
  * Current curriculum progress and overall level
  * On-campus availability and physical workstation location
  * Community participation credits (Evaluation Points and School Wallet)

* 📊 **Competency & Skill Breakdown**  
  Inspect a student's technical strengths across core domains (such as Algorithms, System Administration, Graphics, and Web Development) represented with visual progress meters showing both mastery level and percentage toward maximum proficiency.

* 📁 **Project Portfolio & History**  
  Browse an organized record of every project the student has undertaken—including validated successes, projects currently in progress, and failed attempts—giving a complete, honest picture of their learning curve and persistence. Filter seamlessly between the core curriculum (*42 Cursus*) and intensive bootcamps (*Piscine*).

* 🛡️ **Reliable & Secure by Design**  
  * **Privacy First:** Connects securely to the official 42 platform using industry-standard authorization protocols without exposing sensitive school credentials.
  * **Resilient:** Automatically recovers and refreshes expired sessions in the background so the user experience is never interrupted.
  * **Adaptive:** Designed to look and feel natural across all screen sizes, from compact smartphones to tablets and desktop previews.

## Business & Practical Value

| For Recruiters & Hiring Managers | For Students & Peers | For Campus Staff |
| :--- | :--- | :--- |
| Instantly verify a candidate's genuine skill level, completed projects, and scores directly from the school's verified database. | Conveniently check a classmate's campus desk location to collaborate on group projects or schedule peer evaluations. | Quickly look up student status and curriculum progression on mobile without needing a workstation. |

## Getting Started

If you have a developer environment installed and wish to run the app locally:

1. **Prerequisites:** [Node.js](https://nodejs.org/)
2. **Setup:**
   ```bash
   make env     # Initializes the local configuration file (.env)
   make install # Installs dependencies
   make         # Launches the development server
   ```
3. **Preview:**
   * Press `w` in your terminal to open the app directly in your web browser.
   * Or scan the terminal's QR code using the **Expo Go** mobile app on your iOS or Android phone.

---

## Resources

* [Project Setup Manual](assets/man/project_setup.md) — Comprehensive guide for configuring development environments, Arch Linux VM setup, Java 17, and Expo dependencies.
* [Component Architecture](assets/man/components.md) — Technical breakdown of every module, component purpose, and Mermaid relationship diagrams.
* [Subject Specification](subject/en.subject.pdf) — Official 42 Network curriculum guidelines and evaluation criteria.
* [42 API Documentation](https://api.intra.42.fr/apidoc) — Official API v2 endpoint schemas and data models.
* [42 OAuth Application Portal](https://profile.intra.42.fr/oauth/applications) — Intranet console for generating and managing API credentials.
* [42 Network](https://42.fr/) — Official portal for the global 42 campus ecosystem.
* [Expo Documentation](https://docs.expo.dev/) — Framework and tooling ecosystem for universal React Native applications.
* [React Native](https://reactnative.dev/) — Core mobile library for cross-platform iOS and Android user interfaces.
* [React Navigation](https://reactnavigation.org/) — Routing and stack navigation for React Native.
* [RFC 6749 (OAuth 2.0)](https://datatracker.ietf.org/doc/html/rfc6749) — The official specification for client credentials and token authorization.


