# Project Governance & Accessibility Matrix

This matrix establishes cross-functional ownership, complexity mapping, and strict accessibility guardrails for the `Say it` digital health application, optimizing for neurodivergent engagement (ages 3–7, ASD).

## 1. Cross-Functional Governance Matrix

| Feature Module | Core Discipline | Primary Owner | Complexity | Verification Metric / Guardrail |
| :--- | :--- | :--- | :--- | :--- |
| **Low-Sensory Core UI** | UX Design | UX Lead / Product Designer | Medium | AAA Contrast Compliance, No flashing elements, Zero autoplay |
| **Action-Verb Audio Engine** | Clinical Speech / Eng | Speech Pathologist / Eng Lead | Medium | High-fidelity, isolated acoustic tracks; zero background noise |
| **Client-Side State Engine** | Product Engineering | Frontend Engineer | Low | State resetting on session close; local-only browser storage |
| **Interactive Tap-Targets** | UX Design / Eng | UI Engineer | Medium | Target sizes $\ge$ 48px × 48px; explicit hitboxes for motor control |

## 2. Accessibility & Sensory Guardrails

### Sensory Architecture Guardrails
* **Visual Load:** Muted color palettes exclusively. Avoid bright, high-saturation primary colors (e.g., neon red/yellow) to minimize sensory overstimulation.
* **Acoustic Clarity:** Explicit verbal modeling of action-verbs with a flat, predictable tone to limit processing anxiety.

### Interaction Engineering Guardrails
* **Tap Zones:** Touch zones must incorporate micro-padding to accommodate variable motor coordination in pediatric populations.
* **Error States:** No punitive visual or auditory alerts (e.g., no buzzer sounds or red "X" symbols). Failures decay silently or reset to the baseline state.
