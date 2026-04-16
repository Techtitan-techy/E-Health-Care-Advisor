# E-Health Adviser: Project Workbook Documentation

This document provides a detailed 5-week breakdown of the E-Health Adviser project, designed to fill 3-4 pages of a physical workbook per week.

---

## 📅 Week 1: Project Foundation & UI Design
**Goal:** Establish the project scope and build a premium, responsive user interface.

### Page 1: Research & Planning
*   **Objective:** Define the core problem (lack of accessible preliminary health guidance) and target users.
*   **Platform Selection:** Choosing Vanilla Stack (HTML/CSS/JS) for high performance and zero-dependency reliability.
*   **Design Philosophy:** Implementation of "Glassmorphism" for a clean, professional medical aesthetic.
*   **Color Palette:**
    *   Primary: Medical Blue (`#1e3a8a`) for trust.
    *   Secondary: Emerald Green (`#10b981`) for health.
    *   Accent: Warning Red (`#ef4444`) for emergency states.

### Page 2: Core Semantic Structure (HTML)
*   **Task:** Building the multi-tab architecture.
*   **Key Components:**
    *   Header with dynamic disclaimer.
    *   Navigation system using data-attributes (`data-tab`).
    *   Tab panes for Dashboard, Diagnosis, Profile, and Hospitals.
*   **Accessibility:** Using semantic HTML5 tags like `<header>`, `<main>`, `<nav>`, and `<footer>` for SEO and screen readers.

### Page 3: Styling & Responsiveness (CSS)
*   **Key Logic:** CSS Variable system for theme switching (Emergency vs. Healthy states).
*   **Layout:** Using CSS Grid for the Dashboard cards and Flexbox for the navigation bar.
*   **Transitions:** implementing smooth `0.3s ease` transitions and `@keyframes fadeIn` for tab switching animations.
*   **MediaQuery Design:** Adapting the 3-column dashboard to a single-column layout for mobile devices.

### Page 4: Initial JavaScript Skeleton
*   **Task:** Setting up the `app` object and Tab Switching logic.
*   **Code Concept:**
    ```javascript
    switchTab(tabName) {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');
    }
    ```
*   **Challenges:** Managing state persistence during tab transitions.

---

## 📅 Week 2: Medical Knowledge Base & Data Layer
**Goal:** Designing the "brain" of the application via structured data.

### Page 1: Database Architecture
*   **Objective:** Designing a JSON-like schema for diseases and symptoms.
*   **Logical Relations:** Creating a many-to-many relationship between Symptoms and Diseases.
*   **Data Accuracy:** Researching real OTC medicines and prevention tips for common conditions like Flu, Migraine, and COVID-19.

### Page 2: Symptom Categorization
*   **Logic:** Dividing 45+ symptoms into 6 logical categories:
    1.  Respiratory (🫁)
    2.  General/Flu-like (🌡️)
    3.  Neurological (🧠)
    4.  Digestive (🍴)
    5.  Cardiovascular (❤️)
    6.  Mental Health (😌)
*   **Implementation:** Using the `category` attribute in `data.js` to drive the automated UI rendering.

### Page 3: Dynamic UI Rendering
*   **System:** Building the `renderSymptoms()` function.
*   **Logic:** Iterating through categories and appending checkboxes into their respective groupings.
*   **Code Detail:**
    ```javascript
    Object.entries(categories).forEach(([key, title]) => {
        const categorySymptoms = symptoms.filter(s => s.category === key);
        // Render category container and checkboxes
    });
    ```

### Page 4: Hospital Database & Filtering
*   **Task:** Setting up a database of 10+ major medical centers.
*   **Key Fields:** Name, Location, Emergency status, and Department tags.
*   **Functionality:** Implementing a basic live-search filter for the hospital list.

---

## 📅 Week 3: The Diagnosis AI Engine
**Goal:** Implementing the weighted diagnostic algorithm.

### Page 1: Algorithm Selection
*   **Research:** Why use a Weighted Naive Bayes approach instead of a simple match? 
*   **Conclusion:** Simple matching fails to account for the "importance" of a symptom. (e.g., Chest Pain is more critical than a Cough).
*   **Logic:** Assigning a "Strength" value (0.0 to 1.0) for every symptom relative to its disease.

### Page 2: Natural Language Processing (NLP)
*   **Objective:** Allowing users to type "My head hurts" instead of just checking a box.
*   **Implementation:** The `symptomKeywords` map.
*   **Logic:** Using `String.includes()` and array mapping to find matches in user descriptions.
*   **Code Detail:**
    ```javascript
    'headache': ['headache', 'head pain', 'throbbing', 'migraine']
    ```

### Page 3: The Scoring Formula
*   **Formula:** `Confidence = (Sum of Weighted Matches / Total Potential Strength) * 100`.
*   **Penalty Logic:** Implementing a "Missing Key Symptom" penalty to prevent false positives.
*   **Normalization:** Ensuring results always fall between 0% and 100%.

### Page 4: Results Visualization
*   **UI Task:** Building the Results Display card.
*   **Features:**
    *   Dynamic Color-coded confidence bars.
    *   Match percentage breakdown.
    *   Recommended OTC medications display.
    *   Prevention tips section.

---

## 📅 Week 4: Patient Personalization & Logic Refinement
**Goal:** Adding intelligence based on patient history and age.

### Page 1: LocalStorage Persistence
*   **Objective:** Making the app "remember" the user without a server.
*   **Task:** Building the `ValidationManager` and `localStorage` wrappers for the Patient Profile.
*   **Data Sanitization:** Implementing XSS protection during data input.

### Page 2: Advanced AI Boosts
*   **Age Factor Logic:** Increasing probability for certain diseases based on age (e.g., Asthma in children, Hypertension in seniors).
*   **Existing Conditions:** Checking if the user's pre-existing conditions (e.g., Diabetes) make certain diagnoses more likely.
*   **Code Detail:**
    ```javascript
    if (age >= 60) confidence *= 1.25; // COVID-19 age boost
    ```

### Page 3: Feedback & Learning
*   **Objective:** Improving the engine over time.
*   **Feature:** "Was this helpful?" buttons.
*   **Logic:** Adjusting `diseaseWeights` in the background based on user feedback to prioritize helpful results in future searches.

### Page 4: Wellness Tracker (Health Pulse)
*   **Task:** Daily mood, energy, and sleep logging.
*   **Visuals:** Implementing a custom HTML5 Canvas chart (`SimpleChart` class) to visualize wellness trends over 7 days.
*   **Mathematics:** Calculating a "Health Score" based on 7-day averages.

---

## 📅 Week 5: Safety, Data & Final Testing
**Goal:** Finalizing medical safety features and data portability.

### Page 1: Emergency Detection System
*   **Objective:** Safety first.
*   **Logic:** If `Severity == Critical` AND `Confidence > 85%`, trigger the Emergency Overlay.
*   **UI:** Full-screen red alert that blocks interaction until the user acknowledges the emergency.

### Page 2: Data Portability (Export/Import)
*   **Task:** Allowing users to take their data to a real doctor.
*   **Logic:** Binary Large Object (BLOB) generation.
*   **Code Detail:**
    ```javascript
    const dataBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    ```

### Page 3: Performance Optimization
*   **Task:** Reducing file size and improving render speed.
*   **Checklist:** 
    *   Minimize DOM manipulations in the symptoms loop.
    *   Optimize Chart.js-like canvas rendering.
    *   Lazy loading of the hospital tab data.

### Page 4: Deployment & Documentation
*   **Final Review:** Verification of medical disclaimers throughout the app.
*   **Manual Testing:** Running 50+ symptom combinations to verify accuracy.
*   **Conclusion:** Summary of how the project provides value while emphasizing that it is an "educational simulation."
