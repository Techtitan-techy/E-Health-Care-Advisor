# E-Healthcare Advisor - Comprehensive Project Documentation

This document provides a complete overview of the E-Healthcare Advisor project in its current state as a modern React application. It covers the architecture, component breakdown, key algorithms (like the diagnosis engine), and instructions for developers.

## 1. Project Overview

**E-Healthcare Advisor** is a client-side web application designed to act as a personal health dashboard and symptom checker. It allows users to:
- Log daily wellness metrics (heart rate, sleep, weight, stress).
- Track their overall health score dynamically.
- Input symptoms (via natural language or manual selection) to receive a simulated medical diagnosis.
- Maintain a local history of past diagnoses.
- Find nearby major medical centers (currently localized to Hyderabad).

The project was originally built in Vanilla JS and HTML, but was migrated to **React.js** using the **Vite** build tool to enable a robust Component-Based Architecture (CBA).

### Why React for a Summer Internship Project?
1. **Industry Standard**: React is the most widely adopted frontend library in the industry. Demonstrating proficiency in React is highly valuable for a web development internship.
2. **State Management**: React's unidirectional data flow and hooks (`useState`, `useEffect`) perfectly handle the complex state interactions required by a health dashboard (e.g., syncing local storage, recalculating scores on the fly).
3. **Component Reusability**: Breaking down a monolithic UI into modular components (Header, Dashboard, Modals) makes the codebase maintainable and scalable.
4. **Declarative UI**: Instead of manual DOM manipulation (which is error-prone), React declaratively updates the DOM based on the underlying data state.

---

## 2. Technical Stack

- **Framework**: React 18
- **Build Tool**: Vite (Lightning fast HMR and optimized production builds)
- **Styling**: Vanilla CSS (`index.css`) with a focus on Glassmorphism, responsive grids, and CSS variables for theme management.
- **Persistence**: Browser `localStorage` (No backend database required, ensuring user privacy).
- **Visualization**: HTML5 `<canvas>` API (integrated via React `useRef`).

---

## 3. Architecture & State Management

The application state is primarily hoisted to the `App.jsx` root component. This acts as the "Single Source of Truth".

**Global State in `App.jsx`:**
- `profile`: User demographics (name, age, weight, medical history).
- `wellnessData`: Array of daily logs (heart rate, sleep, stress).
- `diagnosisHistory`: Array of past diagnosis reports.
- `activities`: An activity log tracking user actions.

**Persistence Strategy:**
`App.jsx` uses lazy initialization in `useState` to pull data from `localStorage` on the first render. It then uses `useEffect` hooks to automatically write changes back to `localStorage` whenever these states change. This cleanly abstracts the database layer away from the UI components.

---

## 4. Component Breakdown

### Core Layout Components
- **`App.jsx`**: The main controller. Renders the layout and mounts the currently active tab based on the `activeTab` state.
- **`Header.jsx`**: A purely presentational component for the top branding and disclaimers.
- **`Navigation.jsx`**: Renders the tab buttons and dispatches state changes back to `App`.
- **`EmergencyOverlay.jsx`**: A conditional modal that triggers a red full-screen warning if a critical condition (like a Heart Attack or Stroke) is detected by the diagnosis engine.

### Tab Components (`/src/components/tabs/`)

#### `Dashboard.jsx`
- **Role**: The landing page. 
- **Logic**: It dynamically calculates a "Health Score" during render based on the user's `wellnessData` and `profile`. It doesn't store this score in state, ensuring it is always perfectly synchronized with the latest data.

#### `Profile.jsx`
- **Role**: Manages user data.
- **Logic**: Uses a local `formData` state to manage the form inputs independently. It only updates the global `profile` state (via the `setProfile` prop) when the user explicitly clicks "Save Profile". It also includes logic for importing/exporting user data as JSON.

#### `HealthPulse.jsx`
- **Role**: Wellness logging and data visualization.
- **Logic**: Features a form for new logs and a custom line chart. The chart rendering relies on an HTML5 `<canvas>`. The drawing logic is encapsulated inside a `useEffect` hook that depends on `wellnessData`. This guarantees the canvas is redrawn smoothly every time new data is added.

#### `Diagnosis.jsx` (The Core Engine)
- **Role**: A multi-step wizard for symptom checking.
- **Features**:
  - **Natural Language Processing (NLP)**: A custom synonym mapping engine (`SYNONYM_MAP`) parses plain English descriptions (e.g., "my head hurts and I feel sick") into structured symptom IDs.
  - **4-Step Wizard**: (1) Describe, (2) Select manually, (3) Add context (Duration/Intensity), (4) View Results.
  - **Algorithm**: The matching algorithm calculates a confidence score by weighting the base symptom overlap against how many of the user's selected symptoms the disease actually explains. It also factors in duration, intensity, and user age.
  - **Rich Results**: Displays confidence progress bars, matched vs unmatched symptoms, suggested OTC medicines, and prevention strategies.

#### `Reports.jsx`
- **Role**: A searchable history of past diagnoses.
- **Logic**: Implements "derived state" for filtering. It filters the `diagnosisHistory` array on the fly based on a `searchTerm` and a `severityFilter`, avoiding the need to maintain a separate filtered array in state.

#### `Hospitals.jsx`
- **Role**: Displays a directory of local medical centers.
- **Logic**: Currently populated with major multi-specialty hospitals in **Hyderabad** (e.g., Apollo Jubilee Hills, Yashoda Secunderabad, KIMS, CARE, AIG). Includes search and "Emergency Only" filtering.

---

## 5. Data Models (`/src/utils/data.js`)

The application relies on static, mock databases exported as ES modules:

1. **`diseases`**: An array of 17 common conditions ranging from the Common Cold to Myocardial Infarctions. Each contains a name, severity, list of symptom IDs, description, medicines, and prevention tactics.
2. **`symptoms`**: A dictionary mapping symptom IDs (e.g., `shortness_of_breath`) to human-readable labels and categories (Respiratory, Neurological, etc.).
3. **`hospitals`**: A localized database of major hospitals in Hyderabad with contact info, departments, and emergency capabilities.

---

## 6. CSS & Styling Methodology

The project uses Vanilla CSS (`src/index.css`) with a focus on modern design principles:
- **CSS Variables**: Extensive use of `:root` variables for colors (`--primary-blue`, `--warning-red`) and transitions, ensuring a consistent theme.
- **Glassmorphism**: Headers and navigation bars use `rgba()` backgrounds with `backdrop-filter: blur(10px)` for a premium, frosted-glass effect.
- **Responsive Grids**: `grid-template-columns: repeat(auto-fill, minmax(...))` ensures that hospital cards and symptom checklists adapt perfectly to mobile, tablet, and desktop screens without media queries.
- **Micro-animations**: Hover states, smooth transitions, and simple keyframe animations (`@keyframes fadeIn`) are used to make the UI feel responsive and alive.

---

## 7. Developer Guide

### Prerequisites
- Node.js (v18 or higher)

### Setup & Run
1. Navigate to the project directory: `cd "E-Health Adviser"`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. The application will be available at `http://localhost:5173`.

### Building for Production
Run `npm run build`. Vite will bundle the React application into optimized static HTML, CSS, and JS files located in the `/dist` directory, ready to be deployed to any static host (Vercel, Netlify, GitHub Pages).

---
*Disclaimer: This is an educational project. The diagnosis engine uses simplified mathematical matching and should not be used as a substitute for professional medical advice.*
