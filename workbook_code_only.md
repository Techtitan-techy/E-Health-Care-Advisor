# E-Health Adviser: Ultra-Expanded Weekly Code Reference

This document provides a massive repository of project code, meticulously organized by week to fulfill the requirements of an extensive project workbook.

---

## 📅 WEEK 1: UI Foundation, Design Systems & Semantic Layout

### 1.1 Global Design System & Utility Framework (CSS)

```css
/* Core Design Tokens */
:root {
  --primary-blue: #1e3a8a;
  --primary-light: #3b82f6;
  --medical-green: #10b981;
  --warning-red: #ef4444;
  --caution-orange: #f59e0b;
  --bg-gradient: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  --shadow-sm: 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 12px 24px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Base Body & Layout */
body {
  font-family: "Outfit", sans-serif;
  background: var(--bg-gradient);
  min-height: 100vh;
}

/* Glassmorphism Header */
.header {
  background: rgba(30, 58, 138, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: white;
  padding: 2.5rem 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

/* Dynamic State Classes */
body.state-emergency {
  --primary-color: var(--warning-red);
}
body.state-healthy {
  --primary-color: var(--medical-green);
}

/* Animation Keyframes */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tab-pane {
  display: none;
}
.tab-pane.active {
  display: block;
  animation: slideUp 0.4s ease-out;
}
```

### 1.2 Main App Navigation & Dashboard (HTML Boilerplate)

```html
<div class="container">
  <nav class="nav-tabs" role="tablist">
    <button class="nav-btn active" data-tab="dashboard">Dashboard</button>
    <button class="nav-btn" data-tab="diagnosis">AI Diagnosis</button>
    <button class="nav-btn" data-tab="profile">Patient Profile</button>
    <button class="nav-btn" data-tab="health-pulse">Health Pulse</button>
    <button class="nav-btn" data-tab="reports">Reports</button>
    <button class="nav-btn" data-tab="hospitals">Hospitals</button>
  </nav>

  <main class="tab-content">
    <section id="dashboard" class="tab-pane active">
      <div class="dashboard-grid">
        <div class="dashboard-card status">
          <h3>🏥 System Ready</h3>
          <p id="patient-status">Initializing profile engine...</p>
        </div>
        <div class="dashboard-card diagnosis">
          <h3>📊 Last Analysis</h3>
          <div id="summary-view">No recent data detected.</div>
        </div>
        <!-- Additional Metric Cards -->
      </div>
    </section>

    <div id="notifications-container" aria-live="polite"></div>
  </main>
</div>
```

---

## 📅 WEEK 2: Medical Knowledge Base & Categorical Logic

### 2.1 Comprehensive Condition Database (js/data.js)

```javascript
const diseases = [
  {
    id: "flu",
    name: "Common Flu",
    symptoms: ["cough", "fever", "sore_throat", "fatigue", "muscle_aches"],
    severity: "moderate",
    description: "A viral infection affecting the respiratory tract.",
    otcMedicines: ["Ibuprofen", "Paracetamol"],
  },
  {
    id: "heart_attack",
    name: "Heart Attack",
    symptoms: [
      "chest_pain",
      "shortness_of_breath",
      "nausea",
      "sweating",
      "arm_pain",
    ],
    severity: "critical",
  },
  {
    id: "stroke",
    name: "Stroke",
    symptoms: ["facial_droop", "arm_weakness", "slurred_speech", "confusion"],
    severity: "critical",
  },
  {
    id: "uti",
    name: "Urinary Tract Infection",
    symptoms: ["burning_urination", "frequent_urination", "pelvic_pain"],
    severity: "moderate",
  },
];

const symptoms = [
  { id: "cough", label: "Persistent Coughing", category: "respiratory" },
  { id: "fever", label: "High Fever (>101°F)", category: "general" },
  {
    id: "chest_pain",
    label: "Chest Pressure/Pain",
    category: "cardiovascular",
  },
  {
    id: "facial_droop",
    label: "Facial Numbness/Droop",
    category: "neurological",
  },
  {
    id: "burning_urination",
    label: "Painful Urination",
    category: "digestive",
  },
];
```

### 2.2 Advanced UI Rendering & DOM Management

```javascript
renderSymptoms() {
    const container = document.getElementById('symptoms-grid');
    container.innerHTML = '';

    // Grouping Strategy
    const categories = {
        'respiratory': '🫁 Pulmonary & Throat',
        'cardiovascular': '❤️ Cardiac & Blood',
        'neurological': '🧠 Nervous System',
        'general': '🌡️ Systemic/Flu-like'
    };

    for (const [key, label] of Object.entries(categories)) {
        const group = document.createElement('div');
        group.className = 'symptom-category-group';
        group.innerHTML = `<h4>${label}</h4><div class="symptom-subgrid"></div>`;

        const filtered = symptoms.filter(s => s.category === key);
        filtered.forEach(s => {
            const wrapper = document.createElement('div');
            wrapper.className = 'checkbox-wrapper';
            wrapper.innerHTML = `
                <input type="checkbox" id="sym-${s.id}" value="${s.id}">
                <label for="sym-${s.id}">${s.label}</label>
            `;
            group.querySelector('.symptom-subgrid').appendChild(wrapper);
        });
        container.appendChild(group);
    }
}
```

---

## 📅 WEEK 3: The AI Diagnosis Engine & Heuristic Analysis

### 3.1 DiagnosisAI Engine Class (The Brain)

```javascript
class DiagnosisAI {
  constructor() {
    this.weights = JSON.parse(localStorage.getItem("diseaseWeights")) || {};
    this.initializeStrengths();
  }

  initializeStrengths() {
    this.strengthMatrix = {
      flu: { cough: 0.9, fever: 0.85, fatigue: 0.8 },
      heart_attack: { chest_pain: 0.99, shortness_of_breath: 0.9 },
      stroke: { facial_droop: 0.98, slurred_speech: 0.95 },
    };
  }

  calculateScore(disease, userSymptoms, profile) {
    const matrix = this.strengthMatrix[disease.id] || {};
    let score = 0;
    let totalWeight = 0;

    disease.symptoms.forEach((s) => {
      const w = matrix[s] || 0.5;
      totalWeight += w;
      if (userSymptoms.includes(s)) score += w;
    });

    let baseConf = (score / totalWeight) * 100;

    // Apply Personalization Multipliers
    if (profile && profile.age > 50) {
      if (["stroke", "heart_attack"].includes(disease.id)) baseConf *= 1.2;
    }

    return Math.min(100, Math.round(baseConf));
  }
}
```

### 3.2 NLP Keyword Search & Result Display

```javascript
symptomKeywords: {
    'cough': ['cough', 'coughing', 'hacking'],
    'fever': ['fever', 'hot', 'temp', 'temperature'],
    'chest_pain': ['chest', 'heart hurts', 'pain in chest', 'pressure']
}

autoSelectSymptoms() {
    const input = document.getElementById('symptom-description').value.toLowerCase();
    let matches = 0;

    Object.entries(this.symptomKeywords).forEach(([id, terms]) => {
        if (terms.some(t => input.includes(t))) {
            const cb = document.getElementById(`sym-${id}`);
            if (cb) { cb.checked = true; matches++; }
        }
    });
    NotificationManager.success(`Detected ${matches} symptoms.`);
}
```

### 3.3 Differential Diagnosis Ranking, Explainability & Triage Layer

```javascript
class DiagnosisAI {
  rankDiseases(userSymptoms, profile = null) {
    return diseases
      .map((disease) => {
        const confidence = this.calculateScore(disease, userSymptoms, profile);
        const explanation = this.generateExplanation(disease, userSymptoms);
        const triage = this.computeTriageLevel(disease, confidence, profile);

        return {
          id: disease.id,
          name: disease.name,
          severity: disease.severity,
          confidence,
          triage,
          explanation,
          matchedSymptoms: disease.symptoms.filter((s) =>
            userSymptoms.includes(s),
          ),
          missingSymptoms: disease.symptoms.filter(
            (s) => !userSymptoms.includes(s),
          ),
        };
      })
      .filter((item) => item.confidence >= 20)
      .sort((a, b) => {
        if (a.triage.priority !== b.triage.priority)
          return b.triage.priority - a.triage.priority;
        return b.confidence - a.confidence;
      });
  }

  generateExplanation(disease, userSymptoms) {
    const matrix = this.strengthMatrix[disease.id] || {};
    const matched = disease.symptoms
      .filter((sym) => userSymptoms.includes(sym))
      .map((sym) => ({
        symptom: sym,
        strength: matrix[sym] || 0.5,
      }))
      .sort((a, b) => b.strength - a.strength)
      .slice(0, 3);

    if (!matched.length) {
      return `Low match for ${disease.name}. Very few key indicators detected.`;
    }

    const topSignals = matched
      .map(
        (m) =>
          `${m.symptom.replaceAll("_", " ")} (${Math.round(m.strength * 100)}%)`,
      )
      .join(", ");

    return `Strongest indicators for ${disease.name}: ${topSignals}.`;
  }

  computeTriageLevel(disease, confidence, profile) {
    const age = profile?.age || 0;
    const seniorRiskBonus = age >= 60 ? 10 : 0;
    const adjusted = Math.min(100, confidence + seniorRiskBonus);

    const table = {
      critical:
        adjusted >= 75 ? "emergency" : adjusted >= 50 ? "urgent" : "monitor",
      severe:
        adjusted >= 70 ? "urgent" : adjusted >= 45 ? "priority" : "monitor",
      moderate:
        adjusted >= 75 ? "priority" : adjusted >= 55 ? "consult" : "self-care",
      mild: adjusted >= 80 ? "consult" : "self-care",
    };

    const level = table[disease.severity] || "monitor";
    const priorityMap = {
      emergency: 4,
      urgent: 3,
      priority: 2,
      consult: 1,
      monitor: 0,
      "self-care": 0,
    };

    return {
      level,
      priority: priorityMap[level] ?? 0,
      adjustedConfidence: adjusted,
    };
  }
}
```

### 3.4 Input Normalization, Synonym Expansion & Confidence Bands

```javascript
const SymptomTextEngine = {
  synonyms: {
    shortness_of_breath: ["breathless", "cant breathe", "difficulty breathing"],
    chest_pain: ["tight chest", "chest pressure", "heart pain"],
    fatigue: ["tired", "exhausted", "low energy"],
    slurred_speech: ["unclear speech", "cant talk properly"],
  },

  normalize(input) {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  },

  inferSymptoms(freeText) {
    const clean = this.normalize(freeText);
    const found = new Set();

    Object.entries(this.synonyms).forEach(([symptomId, terms]) => {
      if (terms.some((term) => clean.includes(this.normalize(term)))) {
        found.add(symptomId);
      }
    });

    symptoms.forEach((symptom) => {
      if (clean.includes(this.normalize(symptom.label))) {
        found.add(symptom.id);
      }
    });

    return Array.from(found);
  },

  toConfidenceBand(score) {
    if (score >= 85) return { band: "very-high", label: "Very High" };
    if (score >= 65) return { band: "high", label: "High" };
    if (score >= 45) return { band: "medium", label: "Medium" };
    return { band: "low", label: "Low" };
  },
};

function runDiagnosisFromFreeText(app, profile) {
  const narrative = document.getElementById("symptom-description").value;
  const inferred = SymptomTextEngine.inferSymptoms(narrative);
  const checked = Array.from(
    document.querySelectorAll("#symptoms-grid input:checked"),
  ).map((cb) => cb.value);
  const combined = Array.from(new Set([...checked, ...inferred]));

  const results = app.ai.rankDiseases(combined, profile).map((item) => ({
    ...item,
    confidenceBand: SymptomTextEngine.toConfidenceBand(item.confidence),
  }));

  app.renderDiagnosisResults(results, combined);
}
```

---

## 📅 WEEK 4: Persistence, Validation & Feedback Systems

### 4.1 State Management & Validation Modules

```javascript
class ValidationManager {
  static validateAge(val) {
    const n = parseInt(val);
    return !isNaN(n) && n >= 0 && n <= 125;
  }
  static validateName(val) {
    return val.trim().length >= 2;
  }
  static sanitize(str) {
    return str.replace(
      /[<>&"']/g,
      (m) =>
        ({
          "<": "&lt;",
          ">": "&gt;",
          "&": "&amp;",
          '"': "&quot;",
          "'": "&#39;",
        })[m],
    );
  }
}

class NotificationManager {
  static show(msg, type = "info") {
    const div = document.createElement("div");
    div.className = `notif notif-${type}`;
    div.textContent = msg;
    document.getElementById("notifications-container").appendChild(div);
    setTimeout(() => div.remove(), 4000);
  }
}
```

### 4.2 LocalStorage Profile Integration

```javascript
app.saveProfile = function () {
  const rawName = document.getElementById("p-name").value;
  const rawAge = document.getElementById("p-age").value;

  if (!ValidationManager.validateName(rawName)) throw new Error("Invalid Name");

  const profile = {
    name: ValidationManager.sanitize(rawName),
    age: parseInt(rawAge),
    gender: document.getElementById("p-gender").value,
    conditions: document.getElementById("p-cond").value,
  };

  localStorage.setItem("patientProfile", JSON.stringify(profile));
  this.updateDashboard();
  NotificationManager.show("Profile Updated!", "success");
};
```

### 4.3 Versioned Storage, Recovery & Migration Strategy

```javascript
class StorageManager {
  static CURRENT_SCHEMA = 2;

  static read(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (err) {
      console.error(`Storage read failed for ${key}:`, err);
      return fallback;
    }
  }

  static write(key, value) {
    const backupKey = `${key}:backup`;
    const prev = localStorage.getItem(key);

    try {
      if (prev) localStorage.setItem(backupKey, prev);
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`Storage write failed for ${key}:`, err);
      if (prev) localStorage.setItem(key, prev);
      return false;
    }
  }

  static migrateProfileSchema(profile) {
    if (!profile) return null;
    const schema = profile.schemaVersion || 1;
    let migrated = { ...profile };

    if (schema < 2) {
      migrated = {
        ...migrated,
        emergencyContact: migrated.emergencyContact || "",
        allergies: Array.isArray(migrated.allergies) ? migrated.allergies : [],
        schemaVersion: 2,
      };
    }

    return migrated;
  }

  static bootProfile() {
    const profile = this.read("patientProfile");
    const migrated = this.migrateProfileSchema(profile);

    if (migrated && migrated.schemaVersion !== this.CURRENT_SCHEMA) {
      migrated.schemaVersion = this.CURRENT_SCHEMA;
    }

    if (migrated) this.write("patientProfile", migrated);
    return migrated;
  }
}
```

### 4.4 Debounced Auto-Save, Form Snapshotting & Audit Trail

```javascript
class AuditTrail {
  static record(event, payload = {}) {
    const history = StorageManager.read("auditTrail", []);
    history.push({
      ts: new Date().toISOString(),
      event,
      payload,
    });

    const clipped = history.slice(-200);
    StorageManager.write("auditTrail", clipped);
  }
}

function debounce(fn, wait = 300) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

class ProfileFormController {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.saveDraftDebounced = debounce(() => this.saveDraft(), 500);
  }

  init() {
    if (!this.form) return;
    this.restoreDraft();

    this.form.addEventListener("input", () => this.saveDraftDebounced());
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.commitProfile();
    });
  }

  getSnapshot() {
    return {
      name: this.form.querySelector("#p-name")?.value || "",
      age: this.form.querySelector("#p-age")?.value || "",
      gender: this.form.querySelector("#p-gender")?.value || "",
      conditions: this.form.querySelector("#p-cond")?.value || "",
    };
  }

  saveDraft() {
    const snapshot = this.getSnapshot();
    StorageManager.write("profileDraft", snapshot);
    AuditTrail.record("profile_draft_saved", {
      fields: Object.keys(snapshot).length,
    });
  }

  restoreDraft() {
    const draft = StorageManager.read("profileDraft");
    if (!draft) return;

    this.form.querySelector("#p-name").value = draft.name || "";
    this.form.querySelector("#p-age").value = draft.age || "";
    this.form.querySelector("#p-gender").value = draft.gender || "";
    this.form.querySelector("#p-cond").value = draft.conditions || "";
    AuditTrail.record("profile_draft_restored");
  }

  commitProfile() {
    const snapshot = this.getSnapshot();
    if (!ValidationManager.validateName(snapshot.name)) {
      NotificationManager.show("Please enter a valid name.", "error");
      return;
    }

    const payload = {
      ...snapshot,
      age: parseInt(snapshot.age || "0", 10),
      schemaVersion: StorageManager.CURRENT_SCHEMA,
    };

    const ok = StorageManager.write("patientProfile", payload);
    if (ok) {
      localStorage.removeItem("profileDraft");
      AuditTrail.record("profile_committed", { profileName: payload.name });
      NotificationManager.show("Profile saved successfully.", "success");
    } else {
      NotificationManager.show(
        "Could not save profile. Please retry.",
        "error",
      );
    }
  }
}
```

---

## 📅 WEEK 5: Safety Sentinels, Charts & Data Portability

### 5.1 Trend Analytics (HTML5 Canvas Implementation)

```javascript
class SimpleChart {
  constructor(canvasId, dataset) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.data = dataset; // [mood, energy, sleep]
  }

  render() {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);

    // Render Axis
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#cbd5e1";
    this.ctx.moveTo(40, 20);
    this.ctx.lineTo(40, height - 40);
    this.ctx.lineTo(width - 20, height - 40);
    this.ctx.stroke();

    // Data Plotting Logic
    const colors = ["#3b82f6", "#10b981", "#f59e0b"];
    this.data.forEach((series, idx) => {
      this.ctx.strokeStyle = colors[idx];
      this.ctx.beginPath();
      series.forEach((val, i) => {
        const x = 40 + (i * (width - 60)) / 6;
        const y = height - 40 - (val * (height - 60)) / 10;
        if (i === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      });
      this.ctx.stroke();
    });
  }
}
```

### 5.2 Emergency SENTINEL & Data Portability

```javascript
checkEmergencyCriticality(results) {
    const primary = results[0];
    const isLethal = primary.severity === 'critical';

    if (isLethal && primary.confidence >= 85) {
        const overlay = document.getElementById('emergency-overlay');
        overlay.innerHTML = `<h1>CRITICAL ALERT</h1><p>Possibility of ${primary.name} detected.</p>`;
        overlay.classList.remove('hidden');
        document.body.classList.add('emergency-flash');
    }
}

class DataBank {
    static export() {
        const bundle = {
            profile: JSON.parse(localStorage.getItem('patientProfile')),
            reports: JSON.parse(localStorage.getItem('diagnosisReports')),
            wellness: JSON.parse(localStorage.getItem('wellnessData'))
        };
        const blob = new Blob([JSON.stringify(bundle, null, 2)], {type: 'application/json'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `EHealth_Backup_${Date.now()}.json`;
        link.click();
    }
}
```
