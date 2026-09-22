# Assets Directory Index

This directory contains all static graphics, application icons, setup guides, and theoretical computer science manuals for the **Swifty Companion** project.

## Directory Overview

```
assets/
├── README.md                                           # This assets index
├── imgs/                                               # Application icons, splash screens, and images
│   └── ...                    
└── man/                                                # Documentation, manuals, and theoretical topics
    ├── project_setup.md                                # Environment setup and VM provisioning manual
    ├── components.md                                   # Architecture breakdown and Mermaid relationship diagrams
    ├── features.md                                     # Feature specifications and component mappings
    ├── mobile_ui_architecture.md                       # Theory: Declarative UI, state, and LIFO navigation stacks
    ├── layout_and_responsive_design.md                 # Theory: Flexbox algorithm, constraints, and safe areas
    ├── rest_api_and_async_io.md                        # Theory: RESTful architecture, event loops, and async I/O
    ├── oauth2_and_security.md                          # Theory: OAuth 2.0 (RFC 6749), caching, and secret hygiene
    ├── fault_tolerance_and_defensive_programming.md    # Theory: Error taxonomy, offline recovery, null safety
    └── data_modeling_and_normalization.md              # Theory: Data transformation, 0–21 scaling, and heuristics
```

## Documentation & Manuals (`assets/man/`)

### Technical Setup & Architecture
* **[Project Setup Manual](man/project_setup.md)**. Step-by-step instructions for provisioning development environments (Arch Linux guest VM, OpenJDK 17, Expo toolchain, disk partition expansion, and local credential setup).
* **[Component Architecture & Relationships](man/components.md)**. Detailed explanation of every software module and component role, accompanied by Mermaid architecture graphs and end-to-end search sequence diagrams.
* **[Feature Specifications & Component Mapping](man/features.md)**. Exhaustive catalog of all 9 user-facing and architectural features, describing technical behaviors, edge cases, and direct code component linkages.

### Theoretical Computer Science Topics
* **[Mobile UI Paradigms & Architecture](man/mobile_ui_architecture.md)**. Examines declarative vs. imperative UI models ($\text{UI} = f(\text{State})$), unidirectional data flow, React hooks, and native LIFO stack navigation.
* **[Layout Constraints & Responsive Design](man/layout_and_responsive_design.md)**. Details the Yoga Flexbox layout algorithm, relative percentage scaling, hardware safe area handling (`SafeAreaProvider`), and scrollable containers.
* **[RESTful APIs & Asynchronous I/O](man/rest_api_and_async_io.md)**. Explores REST client-server separation, stateless HTTP methods, URI percent-encoding, and non-blocking asynchronous event loops using Promises.
* **[Protocol Engineering & Security: OAuth 2.0](man/oauth2_and_security.md)**. Covers RFC 6749 machine-to-machine Client Credentials flow, in-memory token caching, proactive time-based expiration buffers, reactive 401 recovery, and Twelve-Factor App credential hygiene.
* **[Fault Tolerance & Defensive Programming](man/fault_tolerance_and_defensive_programming.md)**. Analyzes the Fallacies of Distributed Computing in mobile networks, error taxonomy (404 mapping, offline detection), defensive null-safety with optional chaining (`?.`), and graceful degradation.
* **[Data Modeling & Metric Normalization](man/data_modeling_and_normalization.md)**. Details relational intranet JSON transformation, mathematical scaling from 42's 0–21 skill rank to 0–100% UI gauges, fractional level calculation, and regex-based project classification heuristics.

## Graphic Assets & Branding (`assets/imgs/`)

| File | Resolution / Type | Purpose |
| :--- | :--- | :--- |
| **`icon.png`** | PNG (1024×1024) | Primary mobile application icon used for iOS and legacy Android launchers. |
| **`favicon.png`** | PNG (48×48) | Browser tab icon displayed when testing or deploying on the web platform (`make web`). |
| **`splash-icon.png`** | PNG (200×200) | Center branding mark presented on application launch during bundle initialization. |
| **`android-icon-foreground.png`** | PNG (Adaptive) | Foreground vector/raster art for Android Adaptive Icons (Android 8.0+). |
| **`android-icon-background.png`** | PNG (Adaptive) | Solid background canvas layer for Android Adaptive Icons. |
| **`android-icon-monochrome.png`** | PNG (Themed) | Monochrome silhouette for Android 13+ Material You themed app icons. |
| **`api_app.png`** | PNG Screenshot | Visual reference showing how to register an OAuth application on the 42 Intranet portal. |
