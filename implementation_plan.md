# E – Healthcare Advisor Implementation Plan

Build a fully functional front-end web application for symptom diagnosis, patient profile management, and hospital suggestions using HTML, CSS, and JavaScript.

## User Review Required

> [!IMPORTANT]
> This application is a **simulation** for educational purposes. It will include a prominent disclaimer that it does not replace professional medical advice.
> All data is stored locally in the browser's `localStorage`.

## Proposed Changes

### Core logic and Data
Store the disease database and hospital list in a separate JavaScript file for easy management.

#### [NEW] [data.js](file:///d:/PROJECTS/E-Health Advisor/js/data.js)
- Disease database with symptoms, descriptions, and OTC medicines.
- List of hospitals with names and locations.

### User Interface
Create a modern, responsive single-page application (SPA) layout using vanilla HTML/CSS.

#### [NEW] [index.html](file:///d:/PROJECTS/E-Health Advisor/index.html)
- Sections for: Dashboard, Diagnosis (Questionnaire), Profile, Reports, Hospitals, and **Health Pulse (Pulse/Mood Tracker)**.
- **Emergency Overlay**: High-visibility warning for critical symptoms.

#### [NEW] [style.css](file:///d:/PROJECTS/E-Health Advisor/css/style.css)
- Premium design system:
    - Font: **Outfit** (Google Fonts).
    - Palette: Deep blues, medical greens, and clean whites.
    - Effects: Glassmorphism headers, smooth transitions, and hover animations.
    - **Adaptive UI State**: UI changes color (Red for emergency, Green for healthy, Blue for neutral) based on the current health state.
    - Responsive layout for mobile/desktop.

### Application Logic
Handle all interactions, storage, and the "AI" feedback loop.

#### [NEW] [app.js](file:///d:/PROJECTS/E-Health Advisor/js/app.js)
- **Diagnosis Engine**: Logic to score symptoms against the disease database.
- **Profile Manager**: Create/Update patient profiles in `localStorage`.
- **History Tracker**: Save diagnosis reports with metadata.
- **Health Pulse Engine**: Track daily wellness metrics and display trends in a visual chart.
- **Smart Suggestion Engine**: Tailor prevention tips ("How to avoid XYZ in the future") alongside results.
- **AI Simulator**: Simple weight-based adjustment system based on user feedback.
- **Search & Filter**: Logic for the Reports and Hospitals sections.

## Open Questions
- Are there any specific regions you want the "Nearest Hospitals" to be from, or should I create a generic list of major cities?

## Verification Plan

### Automated Tests
- Check `localStorage` persistence after page reload.
- Verify diagnosis logic with predefined symptom combinations.

### Manual Verification
- Test responsiveness on different screen sizes.
- Verify the "AI" feedback loop correctly records and "learns" (adjusts weights).
- Ensure the search filters work as expected in the Reports section.
