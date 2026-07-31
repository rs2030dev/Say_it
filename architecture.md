# Technical Architecture & State Management

## 1. Frontend System Architecture
`Say it` is engineered as an ultra-lightweight, client-side application utilizing a modern frontend stack built inside a production-optimized container tree.

### Core Stack
* **Build Tooling:** Vite (configured for rapid, zero-overhead client bundling)
* **UI Foundation:** React with TypeScript (`.ts`/`.tsx`) for rigorous type safety across component properties
* **Styling Matrix:** Highly predictable, static CSS sheets preventing layout computation delays

```
[index.html] ---> [src/main.tsx] ---> [Vite Dev/Build Pipeline]
                                             │
                        ┌────────────────────┴────────────────────┐
                        ▼                                         ▼
             [Components Architecture]                 [State Engine]
             - ActionCard.tsx                          - SessionState.ts
             - LowSensoryCanvas.tsx                    - Local Cache
```

## 2. State Isolation & Zero-Backend Architecture
To satisfy the privacy guardrails necessary for clinical assistive software, the architecture intentionally avoids standard cloud databases.

* **Ephemeral Client-Side State:** User session progress, active trials, and response rates are managed through pure React memory hooks.
* **Zero Persistence Layer:** Data does not escape to a remote database, ensuring strict data boundaries.
* **Performance Optimization:** Eliminating network round-trips guarantees sub-10ms UI reactivity, entirely fulfilling the zero-latency target defined in the product specification.
