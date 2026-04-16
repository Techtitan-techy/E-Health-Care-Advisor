// API Abuse Detection - Security Layer
class SecurityLayer {
    static async validateAction(actionName, dataText) {
        try {
            const profileStr = localStorage.getItem('patientProfile');
            const username = profileStr ? JSON.parse(profileStr).name : "anonymous";
            
            // Build the payload expected by your Render ML detector
            const payload = {
                user_id: username,
                ip: "127.0.0.1", // DOM cannot get real IP, fallback used
                endpoint: "/" + actionName,
                method: "POST",
                body: dataText,
                user_agent: navigator.userAgent,
                timestamp: Date.now() / 1000
            };

            const response = await fetch("https://api-abuse-detection.onrender.com/detect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) return true; // Fail open if API is offline

            const result = await response.json();
            
            if (result.action === 'block') {
                this.showBlockOverlay(result.reason);
                return false;
            }
            return true;
        } catch (e) {
            console.warn("Security layer bypass due to network error:", e);
            return true; // Fail open
        }
    }

    static showBlockOverlay(reason) {
        // Create emergency blocking overlay
        document.body.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; background:#fee2e2; color:#991b1b; font-family:'Outfit', sans-serif; text-align:center;">
                <h1 style="font-size:3rem; margin-bottom:1rem;">🚫 SECURITY BLOCK</h1>
                <p style="font-size:1.2rem;">Our AI security layer has identified malicious or abusive activity.</p>
                <p style="margin-top:1rem; padding: 1rem; background: rgba(153, 27, 27, 0.1); border-radius: 8px;"><b>Reason:</b> ${reason.replace(/_/g, " ").toUpperCase()}</p>
                <button onclick="location.reload()" style="margin-top:2rem; padding:0.75rem 1.5rem; background:#991b1b; color:white; border:none; border-radius:4px; font-size: 1rem; cursor:pointer;">Reload Page</button>
            </div>
        `;
    }
}

// Simple Chart.js-like implementation for wellness tracking
class SimpleChart {
    constructor(canvasId, data) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.data = data;
        this.draw();
    }

    draw() {
        const { mood, energy, sleep, stress } = this.data;
        const width = this.canvas.offsetWidth;
        const height = this.canvas.offsetHeight;

        this.canvas.width = width;
        this.canvas.height = height;

        if (!mood.length) return;

        const padding = 40;
        const graphWidth = width - padding * 2;
        const graphHeight = height - padding * 2;
        const step = graphWidth / (mood.length - 1 || 1);

        // Draw axes
        this.ctx.strokeStyle = '#e5e7eb';
        this.ctx.beginPath();
        this.ctx.moveTo(padding, padding);
        this.ctx.lineTo(padding, height - padding);
        this.ctx.lineTo(width - padding, height - padding);
        this.ctx.stroke();

        // Draw grid
        this.ctx.strokeStyle = '#f3f4f6';
        for (let i = 1; i < 10; i++) {
            const y = padding + (graphHeight / 10) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(padding, y);
            this.ctx.lineTo(width - padding, y);
            this.ctx.stroke();
        }

        // Draw lines
        const datasets = [
            { data: mood, color: '#3b82f6', label: 'Mood' },
            { data: energy, color: '#10b981', label: 'Energy' },
            { data: sleep, color: '#f59e0b', label: 'Sleep' },
            { data: stress, color: '#ef4444', label: 'Stress' }
        ];

        datasets.forEach(dataset => {
            this.ctx.strokeStyle = dataset.color;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();

            dataset.data.forEach((point, index) => {
                const x = padding + index * step;
                const y = height - padding - (point / 10) * graphHeight;
                if (index === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            });
            this.ctx.stroke();
        });

        // Draw legend
        let legendY = 20;
        datasets.forEach(dataset => {
            this.ctx.fillStyle = dataset.color;
            this.ctx.fillRect(20, legendY, 10, 10);
            this.ctx.fillStyle = '#1f2937';
            this.ctx.font = '12px Outfit';
            this.ctx.fillText(dataset.label, 35, legendY + 8);
            legendY += 15;
        });
    }
}

// Production-Ready Validation and Error Handling
class ValidationManager {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validateName(name) {
        return name && name.trim().length >= 2 && name.trim().length <= 100;
    }

    static validateAge(age) {
        const ageNum = parseInt(age);
        return ageNum >= 0 && ageNum <= 150;
    }

    static validatePhone(phone) {
        const phoneRegex = /^[\d\s\-+()]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }

    static sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    static formatPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `+1-${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }
        return phone;
    }
}

// Notification System
class NotificationManager {
    static show(message, type = 'info', duration = 4000) {
        const id = `notification-${Date.now()}`;
        const notification = document.createElement('div');
        notification.id = id;
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button onclick="document.getElementById('${id}').remove()" aria-label="Close notification">✕</button>
            </div>
        `;

        const container = document.getElementById('notifications-container');
        if (!container) {
            const newContainer = document.createElement('div');
            newContainer.id = 'notifications-container';
            newContainer.setAttribute('aria-live', 'polite');
            document.body.appendChild(newContainer);
            newContainer.appendChild(notification);
        } else {
            container.appendChild(notification);
        }

        if (duration > 0) {
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.remove();
            }, duration);
        }
    }

    static success(message) {
        this.show(message, 'success', 4000);
    }

    static error(message) {
        this.show(message, 'error', 6000);
    }

    static warning(message) {
        this.show(message, 'warning', 5000);
    }
}

// Data Export/Import Manager
class DataExportManager {
    static exportData() {
        const data = {
            profile: JSON.parse(localStorage.getItem('patientProfile')),
            reports: JSON.parse(localStorage.getItem('diagnosisReports')),
            wellness: JSON.parse(localStorage.getItem('wellnessData')),
            weights: JSON.parse(localStorage.getItem('diseaseWeights')),
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `healthcare-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        NotificationManager.success('✓ Data exported successfully');
    }

    static importData(fileInput) {
        const file = fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                if (confirm('This will replace your current data. Continue?')) {
                    if (data.profile) localStorage.setItem('patientProfile', JSON.stringify(data.profile));
                    if (data.reports) localStorage.setItem('diagnosisReports', JSON.stringify(data.reports));
                    if (data.wellness) localStorage.setItem('wellnessData', JSON.stringify(data.wellness));
                    if (data.weights) localStorage.setItem('diseaseWeights', JSON.stringify(data.weights));

                    NotificationManager.success('✓ Data imported successfully');
                    location.reload();
                }
            } catch (error) {
                NotificationManager.error('✗ Invalid file format: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
}

// Enhanced AI Diagnosis Engine - Naive Bayes-like classifier
class DiagnosisAI {
    constructor() {
        this.diseaseWeights = {};
        this.symptomFrequency = {};
        this.diseaseSymptomStrength = this.initializeSymptomStrengths();
    }

    // Initialize symptom-to-disease strength matrix (importance weights)
    initializeSymptomStrengths() {
        return {
            'flu': {
                'cough': 0.95, 'fever': 0.90, 'sore_throat': 0.85, 'fatigue': 0.80, 'runny_nose': 0.90, 'muscle_aches': 0.85
            },
            'covid': {
                'fever': 0.95, 'cough': 0.92, 'fatigue': 0.88, 'loss_of_taste': 0.98, 'shortness_of_breath': 0.90, 'muscle_aches': 0.85
            },
            'cold': {
                'sneezing': 0.98, 'runny_nose': 0.95, 'sore_throat': 0.80, 'mild_cough': 0.70, 'watery_eyes': 0.85
            },
            'strep_throat': {
                'sore_throat': 0.99, 'difficulty_swallowing': 0.95, 'fever': 0.85, 'swollen_lymph_nodes': 0.90
            },
            'asthma': {
                'shortness_of_breath': 0.98, 'wheezing': 0.95, 'chest_tightness': 0.90, 'cough': 0.80
            },
            'pneumonia': {
                'productive_cough': 0.95, 'fever': 0.90, 'chills': 0.85, 'shortness_of_breath': 0.88, 'chest_pain': 0.80, 'fatigue': 0.85
            },
            'food_poisoning': {
                'nausea': 0.95, 'vomiting': 0.98, 'diarrhea': 0.95, 'abdominal_pain': 0.90, 'fever': 0.60
            },
            'allergies': {
                'sneezing': 0.95, 'runny_nose': 0.90, 'watery_eyes': 0.95, 'itchy_throat': 0.85, 'fatigue': 0.60
            },
            'uti': {
                'burning_urination': 0.99, 'frequent_urination': 0.95, 'pelvic_pain': 0.85, 'cloudy_urine': 0.90
            },
            'migraine': {
                'headache': 0.99, 'nausea': 0.85, 'light_sensitivity': 0.92, 'fatigue': 0.75, 'blurred_vision': 0.60
            },
            'gerd': {
                'heartburn': 0.98, 'chest_pain': 0.75, 'nausea': 0.80, 'difficulty_swallowing': 0.70
            },
            'hypertension': {
                'headache': 0.70, 'dizziness': 0.75, 'chest_pain': 0.65, 'fatigue': 0.60, 'blurred_vision': 0.50
            },
            'diabetes': {
                'excessive_thirst': 0.95, 'fatigue': 0.85, 'frequent_urination': 0.90, 'blurred_vision': 0.80, 'slow_healing_sores': 0.85
            },
            'heart_attack': {
                'chest_pain': 0.99, 'shortness_of_breath': 0.90, 'nausea': 0.70, 'sweating': 0.85, 'arm_pain': 0.80, 'jaw_pain': 0.75
            },
            'stroke': {
                'facial_droop': 0.99, 'arm_weakness': 0.98, 'slurred_speech': 0.98, 'confusion': 0.90, 'headache': 0.70, 'blurred_vision': 0.85
            },
            'anxiety': {
                'nervousness': 0.95, 'rapid_heartbeat': 0.85, 'sweating': 0.80, 'difficulty_concentrating': 0.85
            },
            'insomnia': {
                'fatigue': 0.85, 'difficulty_concentrating': 0.75, 'irritability': 0.80
            }
        };
    }

    // Calculate confidence with advanced scoring
    calculateConfidence(disease, selectedSymptoms, patientProfile) {
        const strengths = this.diseaseSymptomStrength[disease.id] || {};

        // 1. Symptom match score (weighted by importance)
        let weightedMatch = 0;
        let totalStrength = 0;

        disease.symptoms.forEach(symptom => {
            const strength = strengths[symptom] || 0.5;
            totalStrength += strength;
            if (selectedSymptoms.includes(symptom)) {
                weightedMatch += strength;
            }
        });

        let confidence = (weightedMatch / (totalStrength || 1)) * 100;

        // 2. Penalty for missing key symptoms
        const missingKeySymptoms = disease.symptoms.length - selectedSymptoms.filter(s => disease.symptoms.includes(s)).length;
        const missingPenalty = (missingKeySymptoms / disease.symptoms.length) * 15;
        confidence -= missingPenalty;

        // 3. Age factor consideration
        if (patientProfile && patientProfile.age) {
            const age = parseInt(patientProfile.age);
            const ageBoost = this.getAgeBoost(disease.id, age);
            confidence *= (1 + ageBoost);
        }

        // 4. Existing conditions boost
        if (patientProfile && patientProfile.conditions) {
            const conditionsBoost = this.getConditionsBoost(disease.id, patientProfile.conditions);
            confidence *= (1 + conditionsBoost);
        }

        // 5. Apply learned weights from user feedback
        const weight = this.diseaseWeights[disease.id] || 1;
        confidence *= weight;

        // 6. Symptom co-occurrence bonus for common patterns
        const cooccurrenceBonus = this.getCooccurrenceBonus(disease.id, selectedSymptoms);
        confidence += cooccurrenceBonus;

        return Math.max(0, Math.min(100, Math.round(confidence)));
    }

    // Get age-based probability adjustment
    getAgeBoost(diseaseId, age) {
        const ageFactors = {
            'flu': age >= 65 ? 0.2 : age < 5 ? 0.1 : 0,
            'covid': age >= 60 ? 0.25 : 0,
            'cold': age < 10 ? 0.1 : 0,
            'strep_throat': (age >= 5 && age <= 15) ? 0.2 : 0,
            'asthma': age < 18 ? 0.15 : 0,
            'pneumonia': (age >= 65 || age < 5) ? 0.25 : 0,
            'migraine': (age >= 20 && age <= 45) ? 0.15 : 0,
            'gerd': age >= 40 ? 0.15 : 0,
            'hypertension': age >= 50 ? 0.3 : 0,
            'diabetes': (age >= 45) ? 0.25 : 0,
            'heart_attack': age >= 50 ? 0.3 : 0,
            'stroke': age >= 55 ? 0.35 : 0,
            'anxiety': (age >= 18 && age <= 65) ? 0.1 : 0,
            'insomnia': age >= 50 ? 0.1 : 0
        };
        return ageFactors[diseaseId] || 0;
    }

    // Get boost based on existing conditions
    getConditionsBoost(diseaseId, conditions) {
        if (!conditions) return 0;
        const condLower = conditions.toLowerCase();
        const relationshipMap = {
            'hypertension': ['high blood pressure', 'hbp'],
            'diabetes': ['diabetes', 'blood sugar'],
            'anxiety': ['anxiety', 'stress', 'depression'],
            'gerd': ['acid reflux', 'heartburn', 'gerd']
        };

        const relatedConditions = relationshipMap[diseaseId] || [];
        const hasRelated = relatedConditions.some(cond => condLower.includes(cond));
        return hasRelated ? 0.25 : 0;
    }

    // Symptom co-occurrence bonus
    getCooccurrenceBonus(diseaseId, selectedSymptoms) {
        const patterns = {
            'covid': ['fever', 'cough', 'loss_of_taste', 'shortness_of_breath'],
            'migraine': ['headache', 'nausea', 'light_sensitivity'],
            'gerd': ['heartburn', 'chest_pain', 'difficulty_swallowing'],
            'anxiety': ['nervousness', 'rapid_heartbeat', 'sweating'],
            'heart_attack': ['chest_pain', 'shortness_of_breath', 'sweating', 'arm_pain'],
            'stroke': ['facial_droop', 'arm_weakness', 'slurred_speech'],
            'flu': ['fever', 'cough', 'muscle_aches', 'fatigue'],
            'cold': ['sneezing', 'runny_nose', 'watery_eyes'],
            'uti': ['burning_urination', 'frequent_urination', 'pelvic_pain']
        };

        const pattern = patterns[diseaseId] || [];
        const matchedPattern = pattern.filter(s => selectedSymptoms.includes(s));

        if (pattern.length > 0 && matchedPattern.length >= pattern.length * 0.6) {
            return 15; // Bonus for matching known patterns
        }
        return 0;
    }

    // Record feedback and update weights
    recordFeedback(diseaseId, helpful) {
        const currentWeight = this.diseaseWeights[diseaseId] || 1;
        const learningRate = 0.15;

        if (helpful) {
            // Increase weight for correct diagnosis
            this.diseaseWeights[diseaseId] = currentWeight * (1 + learningRate);
        } else {
            // Decrease weight for incorrect diagnosis
            this.diseaseWeights[diseaseId] = Math.max(0.5, currentWeight * (1 - learningRate));
        }

        // Cap weights to prevent extreme values
        this.diseaseWeights[diseaseId] = Math.min(2, Math.max(0.5, this.diseaseWeights[diseaseId]));
    }

    // Track symptom frequency for analytics
    trackSymptomFrequency(symptoms) {
        symptoms.forEach(symptom => {
            this.symptomFrequency[symptom] = (this.symptomFrequency[symptom] || 0) + 1;
        });
    }
}

// Main Application
const app = {
    // Enhanced AI diagnosis engine
    ai: new DiagnosisAI(),

    // Initialize application
    init() {
        this.setupEventListeners();
        this.renderSymptoms();
        this.loadAllData();
        this.updateDashboard();
        this.initializeSymptomKeywords();
    },

    // Map keywords to symptom IDs
    symptomKeywords: {},

    initializeSymptomKeywords() {
        this.symptomKeywords = {
            'cough': ['cough', 'coughing', 'coughs', 'hacking'],
            'fever': ['fever', 'feverish', 'hot', 'temperature', 'temp', 'high temperature'],
            'sore_throat': ['sore throat', 'throat pain', 'scratchy throat', 'pain in throat'],
            'fatigue': ['fatigue', 'tired', 'exhausted', 'exhaustion', 'weakness', 'weak', 'lethargy'],
            'runny_nose': ['runny nose', 'runny', 'nasal congestion', 'stuffy nose', 'congestion', 'nose'],
            'loss_of_taste': ['loss of taste', 'can\'t taste', 'no taste', 'taste loss', 'anosmia', 'loss of smell'],
            'shortness_of_breath': ['shortness of breath', 'difficulty breathing', 'breathless', 'short of breath', 'difficulty breathing', 'gasping'],
            'headache': ['headache', 'head pain', 'head ache', 'migraine', 'throbbing', 'pounding head'],
            'nausea': ['nausea', 'nauseous', 'feeling sick', 'queasy', 'want to vomit', 'vomit', 'vomiting', 'sick to stomach'],
            'light_sensitivity': ['light sensitivity', 'sensitive to light', 'bright light', 'light hurt'],
            'heartburn': ['heartburn', 'acid reflux', 'indigestion', 'stomach acid', 'burning chest'],
            'chest_pain': ['chest pain', 'chest discomfort', 'pain in chest', 'heart pain', 'pressure in chest'],
            'difficulty_swallowing': ['difficulty swallowing', 'hard to swallow', 'swallowing pain', 'can\'t swallow'],
            'dizziness': ['dizzy', 'dizziness', 'vertigo', 'light headed', 'lightheaded', 'spinning'],
            'excessive_thirst': ['excessive thirst', 'very thirsty', 'constant thirst', 'drinking lots', 'thirsty all the time'],
            'frequent_urination': ['frequent urination', 'urinate often', 'going to bathroom', 'pee often', 'peeing a lot'],
            'blurred_vision': ['blurred vision', 'vision blurry', 'can\'t see clearly', 'vision problem', 'double vision'],
            'nervousness': ['nervousness', 'nervous', 'anxious', 'anxiety', 'worried', 'worry'],
            'rapid_heartbeat': ['rapid heartbeat', 'heart racing', 'racing heart', 'palpitations', 'heart pounding'],
            'sweating': ['sweating', 'sweat', 'perspiring', 'perspiration', 'cold sweats'],
            'difficulty_concentrating': ['difficulty concentrating', 'can\'t concentrate', 'focus problem', 'trouble focusing', 'can\'t think'],
            'muscle_aches': ['muscle aches', 'body aches', 'sore muscles', 'muscle pain', 'body pain'],
            'sneezing': ['sneezing', 'sneeze', 'sneezed'],
            'watery_eyes': ['watery eyes', 'itchy eyes', 'eyes watering'],
            'wheezing': ['wheezing', 'wheeze', 'whistling breath'],
            'chest_tightness': ['chest tightness', 'tight chest', 'tightness'],
            'productive_cough': ['productive cough', 'coughing up phlegm', 'coughing up mucus', 'mucus cough'],
            'chills': ['chills', 'shaking', 'shivering', 'cold flashes'],
            'abdominal_pain': ['abdominal pain', 'stomach ache', 'stomach pain', 'cramps', 'belly ache'],
            'diarrhea': ['diarrhea', 'loose stools', 'upset stomach'],
            'vomiting': ['vomiting', 'threw up', 'throwing up'],
            'itchy_throat': ['itchy throat', 'scratchy throat'],
            'burning_urination': ['burning urination', 'painful urination', 'burns when I pee'],
            'pelvic_pain': ['pelvic pain', 'lower belly pain'],
            'cloudy_urine': ['cloudy urine', 'smelly urine', 'dark urine'],
            'arm_pain': ['arm pain', 'pain in arm', 'shooting pain in arm'],
            'jaw_pain': ['jaw pain', 'neck pain'],
            'facial_droop': ['facial droop', 'face drooping', 'numb face'],
            'arm_weakness': ['arm weakness', 'can\'t lift arm', 'weak arm'],
            'slurred_speech': ['slurred speech', 'trouble talking', 'hard to speak'],
            'confusion': ['confusion', 'confused', 'disoriented', 'don\'t know where I am'],
            'slow_healing_sores': ['slow healing sores', 'sores that won\'t heal', 'cuts not healing'],
            'swollen_lymph_nodes': ['swollen lymph nodes', 'swollen glands', 'lump in neck'],
            'mild_cough': ['mild cough', 'dry cough', 'slight cough']
        };
    },

    // Parse symptom description with better error handling
    async parseSymptomDescription() {
        const descriptionRaw = document.getElementById('symptom-description').value;
        
        // --- API Abuse Security Check ---
        const isSafe = await SecurityLayer.validateAction('parseSymptom', descriptionRaw);
        if (!isSafe) return;
        // --------------------------------

        const description = descriptionRaw.toLowerCase().trim();

        if (!description) {
            NotificationManager.warning('⚠ Please describe how you\'re feeling');
            return;
        }

        if (description.length < 10) {
            NotificationManager.warning('⚠ Please provide more details about your symptoms');
            return;
        }

        // Reset checkboxes first
        document.querySelectorAll('#symptoms-grid input:checked').forEach(cb => {
            cb.checked = false;
        });

        let matchedCount = 0;
        const matchedSymptoms = [];

        // Check each symptom keyword mapping
        Object.entries(this.symptomKeywords).forEach(([symptomId, keywords]) => {
            keywords.forEach(keyword => {
                if (description.includes(keyword)) {
                    const checkbox = document.getElementById(`symptom-${symptomId}`);
                    if (checkbox && !checkbox.checked) {
                        checkbox.checked = true;
                        matchedCount++;
                        const symptomLabel = symptoms.find(s => s.id === symptomId)?.label;
                        if (symptomLabel) matchedSymptoms.push(symptomLabel);
                    }
                }
            });
        });

        if (matchedCount === 0) {
            NotificationManager.warning('⚠ No matching symptoms detected. Please select them manually or use different keywords.');
        } else {
            NotificationManager.success(`✓ Found ${matchedCount} symptoms: ${matchedSymptoms.join(', ')}`);
            document.getElementById('symptoms-grid').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    },

    // Setup event listeners
    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Profile form
        document.getElementById('profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
        });

        // Wellness tracking
        document.getElementById('mood-input').addEventListener('input', (e) => {
            document.getElementById('mood-value').textContent = e.target.value;
        });
        document.getElementById('energy-input').addEventListener('input', (e) => {
            document.getElementById('energy-value').textContent = e.target.value;
        });
        document.getElementById('stress-input').addEventListener('input', (e) => {
            document.getElementById('stress-value').textContent = e.target.value;
        });

        // Reports search and filter
        document.getElementById('report-search').addEventListener('input', () => {
            this.filterReports();
        });
        document.getElementById('severity-filter').addEventListener('change', () => {
            this.filterReports();
        });

        // Hospitals search and filter
        document.getElementById('hospital-search').addEventListener('input', () => {
            this.filterHospitals();
        });
        document.getElementById('emergency-filter').addEventListener('change', () => {
            this.filterHospitals();
        });
    },

    // Tab switching
    switchTab(tabName) {
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        if (tabName === 'health-pulse') {
            this.renderWellnessChart();
        }
    },

    // Render symptoms grid grouped by category
    renderSymptoms() {
        const grid = document.getElementById('symptoms-grid');
        grid.innerHTML = '';
        grid.className = 'symptoms-categories-container';

        const categories = {
            'respiratory': '🫁 Respiratory',
            'general': '🌡️ General / Flu-like',
            'neurological': '🧠 Neurological',
            'digestive': '🍴 Digestive / Stomach',
            'cardiovascular': '❤️ Cardiovascular',
            'mental': '😌 Mental Health'
        };

        Object.entries(categories).forEach(([key, title]) => {
            const categorySymptoms = symptoms.filter(s => s.category === key);
            if (categorySymptoms.length === 0) return;

            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'symptom-category-group';
            categoryDiv.innerHTML = `
                <h4>${title}</h4>
                <div class="category-symptoms-grid">
                </div>
            `;

            const symptomsGrid = categoryDiv.querySelector('.category-symptoms-grid');
            categorySymptoms.forEach(symptom => {
                const div = document.createElement('div');
                div.className = 'symptom-checkbox';
                div.innerHTML = `
                    <input type="checkbox" id="symptom-${symptom.id}" value="${symptom.id}">
                    <label for="symptom-${symptom.id}">${symptom.label}</label>
                `;
                symptomsGrid.appendChild(div);
            });

            grid.appendChild(categoryDiv);
        });
    },

    // Run diagnosis with error handling
    runDiagnosis() {
        try {
            const selectedSymptoms = Array.from(
                document.querySelectorAll('#symptoms-grid input:checked')
            ).map(cb => cb.value);

            if (selectedSymptoms.length === 0) {
                NotificationManager.warning('⚠ Please select at least one symptom');
                return;
            }

            if (selectedSymptoms.length > 15) {
                NotificationManager.warning('⚠ Please select no more than 15 symptoms for accuracy');
                return;
            }

            const results = this.diagnosisEngine(selectedSymptoms);

            if (results.length === 0) {
                NotificationManager.warning('⚠ No matching conditions found. Please try different symptoms.');
                return;
            }

            this.displayResults(results, selectedSymptoms);
            this.saveReport(results, selectedSymptoms);
            this.checkEmergency(results);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            NotificationManager.error('✗ Error running diagnosis: ' + error.message);
            console.error('Diagnosis error:', error);
        }
    },

    // Diagnosis engine with enhanced AI
    diagnosisEngine(selectedSymptoms) {
        const patientProfile = JSON.parse(localStorage.getItem('patientProfile'));

        // Track symptom frequency for learning
        this.ai.trackSymptomFrequency(selectedSymptoms);

        const results = diseases
            .map(disease => {
                // Use enhanced AI confidence calculation
                const confidence = this.ai.calculateConfidence(disease, selectedSymptoms, patientProfile);

                const matchedSymptoms = disease.symptoms.filter(s =>
                    selectedSymptoms.includes(s)
                );

                return {
                    ...disease,
                    confidence,
                    matchedSymptoms: matchedSymptoms.length,
                    totalSymptoms: disease.symptoms.length,
                    matchPercentage: Math.round((matchedSymptoms.length / disease.symptoms.length) * 100)
                };
            })
            .filter(d => d.confidence > 15) // Increased threshold for relevance
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 5); // Top 5 results

        return results;
    },

    // Display diagnosis results
    displayResults(results, selectedSymptoms) {
        const container = document.getElementById('diagnosis-results');
        const content = document.getElementById('results-content');

        let html = '<div>';

        results.forEach((result, index) => {
            const severityClass = result.severity.toLowerCase();
            const confidenceQuality = result.confidence >= 80 ? 'High' : result.confidence >= 60 ? 'Moderate' : 'Low';

            html += `
                <div class="result-item ${severityClass}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h4>${index + 1}. ${result.name}</h4>
                        <span style="background: ${result.severity === 'critical' ? '#ef4444' : result.severity === 'high' ? '#f59e0b' : '#10b981'}; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">${result.severity.toUpperCase()}</span>
                    </div>
                    <p>${result.description}</p>

                    <div class="result-section">
                        <p><strong>AI Confidence Score:</strong> ${result.confidence}% (${confidenceQuality})</p>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${result.confidence}%"></div>
                        </div>
                    </div>

                    <div class="result-section">
                        <p><strong>Symptom Match:</strong> ${result.matchedSymptoms} of ${result.totalSymptoms} symptoms (${result.matchPercentage}%)</p>
                    </div>

                    <div class="result-section">
                        <p><strong>Recommended OTC Medicines:</strong> ${result.otcMedicines.join(', ')}</p>
                    </div>

                    <div class="result-section">
                        <p><strong>Prevention & Management Tips:</strong> ${result.prevention}</p>
                    </div>

                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
                        <p style="font-size: 0.9rem; color: #6b7280; margin-bottom: 0.5rem;">Was this diagnosis helpful?</p>
                        <button class="btn-small" onclick="app.recordFeedback('${result.id}', true)" style="margin-right: 0.5rem;">✓ Helpful</button>
                        <button class="btn-small" onclick="app.recordFeedback('${result.id}', false)">✗ Not Helpful</button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        content.innerHTML = html;
        container.classList.remove('hidden');
    },

    // Check for emergency symptoms - only if VERY HIGH confidence + critical
    checkEmergency(results) {
        // Only trigger emergency if:
        // 1. Top result has critical severity AND
        // 2. Confidence is VERY HIGH (>85%)
        const topResult = results[0];

        if (topResult && topResult.severity === 'critical' && topResult.confidence > 85) {
            document.body.classList.add('state-emergency');
            this.showEmergencyOverlay(topResult.name);
        } else if (topResult) {
            // For other conditions, set normal state
            document.body.classList.remove('state-emergency');
            if (topResult.confidence >= 70) {
                document.body.classList.add('state-healthy');
            } else {
                document.body.classList.add('state-neutral');
            }
        }
    },

    // Show emergency overlay
    showEmergencyOverlay(diseaseName) {
        const overlay = document.getElementById('emergency-overlay');
        const message = document.getElementById('emergency-message');
        message.textContent = `Critical condition detected: ${diseaseName}. Please seek immediate medical attention!`;
        overlay.classList.remove('hidden');
    },

    // Dismiss emergency overlay
    dismissEmergency() {
        document.getElementById('emergency-overlay').classList.add('hidden');
        document.body.classList.remove('state-emergency');
        document.body.classList.add('state-neutral');
    },

    // Record user feedback for AI learning with error handling
    recordFeedback(diseaseId, helpful) {
        try {
            this.ai.recordFeedback(diseaseId, helpful);
            localStorage.setItem('diseaseWeights', JSON.stringify(this.ai.diseaseWeights));
            const message = helpful ?
                '✓ Thank you! This helps improve diagnosis accuracy.' :
                '✓ Noted. We will adjust analysis for better accuracy.';
            NotificationManager.success(message);
        } catch (error) {
            NotificationManager.error('✗ Failed to save feedback: ' + error.message);
        }
    },

    // Reset diagnosis
    resetDiagnosis() {
        document.querySelectorAll('#symptoms-grid input:checked').forEach(cb => {
            cb.checked = false;
        });
        document.getElementById('symptom-description').value = '';
        document.getElementById('diagnosis-results').classList.add('hidden');
    },

    // Save profile with validation
    async saveProfile() {
        const nameRaw = document.getElementById('patient-name').value;
        const conditionsRaw = document.getElementById('patient-conditions').value;
        
        // --- API Abuse Security Check ---
        const isSafe = await SecurityLayer.validateAction('saveProfile', nameRaw + " " + conditionsRaw);
        if (!isSafe) return;
        // --------------------------------

        const name = nameRaw.trim();
        const age = document.getElementById('patient-age').value.trim();

        // Validation
        if (!ValidationManager.validateName(name)) {
            NotificationManager.error('✗ Name must be between 2-100 characters');
            return;
        }

        if (!ValidationManager.validateAge(age)) {
            NotificationManager.error('✗ Age must be between 0-150 years');
            return;
        }

        const profile = {
            name: ValidationManager.sanitizeInput(name),
            age,
            gender: document.getElementById('patient-gender').value,
            conditions: ValidationManager.sanitizeInput(document.getElementById('patient-conditions').value),
            allergies: ValidationManager.sanitizeInput(document.getElementById('patient-allergies').value),
            medications: ValidationManager.sanitizeInput(document.getElementById('patient-medications').value),
            createdAt: new Date().toISOString()
        };

        try {
            localStorage.setItem('patientProfile', JSON.stringify(profile));
            document.getElementById('delete-profile-btn').style.display = 'inline-block';
            this.showProfileDisplay();
            NotificationManager.success('✓ Profile saved successfully');
        } catch (error) {
            NotificationManager.error('✗ Failed to save profile: ' + error.message);
        }
    },

    // Show profile display
    showProfileDisplay() {
        const profile = JSON.parse(localStorage.getItem('patientProfile'));
        const display = document.getElementById('profile-display');
        const form = document.getElementById('profile-form');

        if (profile) {
            const html = `
                <div class="profile-info-item">
                    <span class="profile-info-label">Name:</span>
                    <span class="profile-info-value">${profile.name}</span>
                </div>
                <div class="profile-info-item">
                    <span class="profile-info-label">Age:</span>
                    <span class="profile-info-value">${profile.age} years</span>
                </div>
                <div class="profile-info-item">
                    <span class="profile-info-label">Gender:</span>
                    <span class="profile-info-value">${profile.gender || 'Not specified'}</span>
                </div>
                <div class="profile-info-item">
                    <span class="profile-info-label">Conditions:</span>
                    <span class="profile-info-value">${profile.conditions || 'None'}</span>
                </div>
                <div class="profile-info-item">
                    <span class="profile-info-label">Allergies:</span>
                    <span class="profile-info-value">${profile.allergies || 'None'}</span>
                </div>
                <div class="profile-info-item">
                    <span class="profile-info-label">Medications:</span>
                    <span class="profile-info-value">${profile.medications || 'None'}</span>
                </div>
            `;
            document.getElementById('profile-info').innerHTML = html;
            form.classList.add('hidden');
            display.classList.remove('hidden');
        }
    },

    // Edit profile
    editProfile() {
        document.getElementById('profile-display').classList.add('hidden');
        document.getElementById('profile-form').classList.remove('hidden');
    },

    // Delete profile with confirmation
    deleteProfile() {
        const profileName = JSON.parse(localStorage.getItem('patientProfile'))?.name || 'Profile';
        if (confirm(`Delete ${profileName}? This cannot be undone.`)) {
            try {
                localStorage.removeItem('patientProfile');
                document.getElementById('profile-form').reset();
                document.getElementById('profile-display').classList.add('hidden');
                document.getElementById('profile-form').classList.remove('hidden');
                document.getElementById('delete-profile-btn').style.display = 'none';
                NotificationManager.success('✓ Profile deleted successfully');
                this.updateDashboard();
            } catch (error) {
                NotificationManager.error('✗ Failed to delete profile');
            }
        }
    },

    // Log wellness entry with validation
    logWellness() {
        try {
            const mood = parseInt(document.getElementById('mood-input').value);
            const energy = parseInt(document.getElementById('energy-input').value);
            const sleep = parseFloat(document.getElementById('sleep-input').value);
            const stress = parseInt(document.getElementById('stress-input').value);

            if (isNaN(mood) || isNaN(energy) || isNaN(sleep) || isNaN(stress)) {
                NotificationManager.error('✗ Please fill in all wellness fields');
                return;
            }

            const entry = {
                date: new Date().toISOString(),
                mood,
                energy,
                sleep,
                stress
            };

            let wellnessData = JSON.parse(localStorage.getItem('wellnessData')) || [];
            wellnessData.push(entry);

            // Keep only last 30 days
            const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
            wellnessData = wellnessData.filter(e => new Date(e.date).getTime() > thirtyDaysAgo);

            localStorage.setItem('wellnessData', JSON.stringify(wellnessData));

            // Calculate health score
            const healthScore = Math.round((mood + energy) / 2 - (stress / 2));
            this.updateHealthState(healthScore);

            this.renderWellnessHistory();
            this.renderWellnessChart();
            NotificationManager.success('✓ Wellness entry logged successfully');
        } catch (error) {
            NotificationManager.error('✗ Failed to log wellness entry: ' + error.message);
        }
    },

    // Update health state based on score
    updateHealthState(score) {
        const body = document.body;
        body.classList.remove('state-emergency', 'state-healthy', 'state-neutral');

        if (score >= 7) {
            body.classList.add('state-healthy');
        } else if (score >= 4) {
            body.classList.add('state-neutral');
        } else {
            body.classList.add('state-emergency');
        }
    },

    // Render wellness chart
    renderWellnessChart() {
        const wellnessData = JSON.parse(localStorage.getItem('wellnessData')) || [];
        const noDataMsg = document.getElementById('no-wellness-data');
        const canvas = document.getElementById('wellness-canvas');

        if (wellnessData.length === 0) {
            noDataMsg.style.display = 'block';
            canvas.style.display = 'none';
            return;
        }

        canvas.style.display = 'block';
        noDataMsg.style.display = 'none';

        const chartData = {
            mood: wellnessData.map(e => e.mood),
            energy: wellnessData.map(e => e.energy),
            sleep: wellnessData.map(e => e.sleep),
            stress: wellnessData.map(e => e.stress)
        };

        new SimpleChart('wellness-canvas', chartData);
    },

    // Render wellness history
    renderWellnessHistory() {
        const wellnessData = JSON.parse(localStorage.getItem('wellnessData')) || [];
        const container = document.getElementById('wellness-entries');

        if (wellnessData.length === 0) {
            container.innerHTML = '<p class="sub-text">No wellness entries yet</p>';
            return;
        }

        const html = wellnessData.reverse().map(entry => `
            <div class="wellness-entry">
                <div class="wellness-date">${new Date(entry.date).toLocaleDateString()} ${new Date(entry.date).toLocaleTimeString()}</div>
                <div class="wellness-metrics">
                    <div class="wellness-metric">
                        <span class="wellness-metric-label">Mood</span>
                        <span class="wellness-metric-value">${entry.mood}/10</span>
                    </div>
                    <div class="wellness-metric">
                        <span class="wellness-metric-label">Energy</span>
                        <span class="wellness-metric-value">${entry.energy}/10</span>
                    </div>
                    <div class="wellness-metric">
                        <span class="wellness-metric-label">Sleep</span>
                        <span class="wellness-metric-value">${entry.sleep}h</span>
                    </div>
                    <div class="wellness-metric">
                        <span class="wellness-metric-label">Stress</span>
                        <span class="wellness-metric-value">${entry.stress}/10</span>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    },

    // Save diagnosis report
    saveReport(results, symptoms) {
        const report = {
            id: Date.now(),
            date: new Date().toISOString(),
            topResult: results[0],
            allResults: results,
            symptoms: symptoms,
            profile: JSON.parse(localStorage.getItem('patientProfile')) || {}
        };

        let reports = JSON.parse(localStorage.getItem('diagnosisReports')) || [];
        reports.push(report);
        localStorage.setItem('diagnosisReports', JSON.stringify(reports));

        this.updateDashboard();
    },

    // Filter reports
    filterReports() {
        const search = document.getElementById('report-search').value.toLowerCase();
        const severity = document.getElementById('severity-filter').value;
        const reports = JSON.parse(localStorage.getItem('diagnosisReports')) || [];

        const filtered = reports.filter(report => {
            const matchesSearch = report.topResult.name.toLowerCase().includes(search);
            const matchesSeverity = !severity || report.topResult.severity === severity;
            return matchesSearch && matchesSeverity;
        });

        this.renderReports(filtered);
    },

    // Render reports
    renderReports(reportsToShow = null) {
        const reports = reportsToShow || JSON.parse(localStorage.getItem('diagnosisReports')) || [];
        const container = document.getElementById('reports-list');

        if (reports.length === 0) {
            container.innerHTML = '<p class="sub-text">No reports yet</p>';
            return;
        }

        const html = reports.reverse().map(report => `
            <div class="report-item ${report.topResult.severity}">
                <div class="report-header">
                    <span class="report-disease">${report.topResult.name}</span>
                    <span class="report-severity ${report.topResult.severity}">${report.topResult.severity.toUpperCase()}</span>
                </div>
                <div class="report-details">
                    <p><strong>Date:</strong> ${new Date(report.date).toLocaleDateString()} ${new Date(report.date).toLocaleTimeString()}</p>
                    <p><strong>Confidence:</strong> ${report.topResult.confidence}%</p>
                    <p><strong>Symptoms:</strong> ${report.symptoms.join(', ')}</p>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    },

    // Filter hospitals
    filterHospitals() {
        const search = document.getElementById('hospital-search').value.toLowerCase();
        const emergencyOnly = document.getElementById('emergency-filter').checked;

        const filtered = hospitals.filter(hospital => {
            const matchesSearch = hospital.name.toLowerCase().includes(search) ||
                                 hospital.location.toLowerCase().includes(search);
            const matchesEmergency = !emergencyOnly || hospital.emergency;
            return matchesSearch && matchesEmergency;
        });

        this.renderHospitals(filtered);
    },

    // Render hospitals
    renderHospitals(hospitalsToShow = null) {
        const hospitalsData = hospitalsToShow || hospitals;
        const container = document.getElementById('hospitals-list');

        if (hospitalsData.length === 0) {
            container.innerHTML = '<p class="sub-text">No hospitals found</p>';
            return;
        }

        const html = hospitalsData.map(hospital => `
            <div class="hospital-card ${hospital.emergency ? 'emergency' : ''}">
                <div class="hospital-header">
                    <div>
                        <span class="hospital-name">${hospital.name}</span>
                        <span style="margin-left: 0.5rem; color: #6b7280; font-size: 0.85rem; font-weight: 500;">${hospital.type || 'Medical Center'}</span>
                        <span style="margin-left: 1rem; color: #f59e0b; font-weight: 600;">★ ${hospital.rating}</span>
                    </div>
                    ${hospital.emergency ? '<span class="emergency-badge">🚨 24/7 Emergency</span>' : ''}
                </div>
                <div class="hospital-info">
                    <p><strong>📍 Location:</strong> ${hospital.location}</p>
                    <p><strong>📮 Address:</strong> ${hospital.address}</p>
                    <p><strong>📞 Phone:</strong> <a href="tel:${hospital.phone}" style="color: #3b82f6; text-decoration: none; font-weight: 500;">${hospital.phone}</a></p>
                    ${hospital.website ? `<p><strong>🌐 Website:</strong> <a href="${hospital.website}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: none; font-weight: 500;">Visit Hospital Website</a></p>` : ''}
                    ${hospital.hours ? `<p><strong>⏰ Hours:</strong> ${hospital.hours}</p>` : ''}
                </div>
                <div class="hospital-departments">
                    <div class="departments-label">Departments & Services:</div>
                    <div class="departments-list">
                        ${hospital.departments.map(dept => `<span class="department-tag">${dept}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    },

    // Update dashboard
    updateDashboard() {
        const profile = JSON.parse(localStorage.getItem('patientProfile'));
        const reports = JSON.parse(localStorage.getItem('diagnosisReports')) || [];
        const wellnessData = JSON.parse(localStorage.getItem('wellnessData')) || [];

        // Update patient status
        if (profile) {
            document.getElementById('patient-status').textContent = `${profile.name}, ${profile.age} years old`;
        }

        // Update last diagnosis
        if (reports.length > 0) {
            const lastReport = reports[reports.length - 1];
            document.getElementById('last-diagnosis').textContent =
                `${lastReport.topResult.name} (${lastReport.topResult.confidence}% confidence)`;
        }

        // Update health score
        if (wellnessData.length > 0) {
            const lastEntry = wellnessData[wellnessData.length - 1];
            const healthScore = Math.round(((lastEntry.mood + lastEntry.energy) / 2 - (lastEntry.stress / 2)));
            document.getElementById('health-score').textContent = healthScore;
            const status = healthScore >= 7 ? '✅ Healthy' : healthScore >= 4 ? '🔵 Neutral' : '⚠️ Needs Attention';
            document.getElementById('health-status').textContent = status;
        }

        // Update activity list
        const activityList = document.getElementById('activity-list');
        if (reports.length > 0 || wellnessData.length > 0) {
            const activities = [];
            reports.slice(-3).forEach(r => {
                activities.push(`Diagnosis: ${r.topResult.name} - ${new Date(r.date).toLocaleDateString()}`);
            });
            wellnessData.slice(-2).forEach(w => {
                activities.push(`Wellness: Mood ${w.mood}/10 - ${new Date(w.date).toLocaleDateString()}`);
            });
            activityList.innerHTML = activities.reverse().slice(0, 5).map(a => `<li>${a}</li>`).join('');
        }

        // Render reports initial
        this.renderReports();

        // Render hospitals initial
        this.renderHospitals();

        // Render wellness history
        this.renderWellnessHistory();
    },

    // Load all data from localStorage with error handling
    loadAllData() {
        try {
            // Load disease weights into AI engine
            const weights = localStorage.getItem('diseaseWeights');
            if (weights) {
                this.ai.diseaseWeights = JSON.parse(weights);
            }

            // Load profile if exists
            const profile = localStorage.getItem('patientProfile');
            if (profile) {
                const profileData = JSON.parse(profile);
                document.getElementById('patient-name').value = profileData.name || '';
                document.getElementById('patient-age').value = profileData.age || '';
                document.getElementById('patient-gender').value = profileData.gender || '';
                document.getElementById('patient-conditions').value = profileData.conditions || '';
                document.getElementById('patient-allergies').value = profileData.allergies || '';
                document.getElementById('patient-medications').value = profileData.medications || '';
                document.getElementById('delete-profile-btn').style.display = 'inline-block';
                this.showProfileDisplay();
            }
        } catch (error) {
            NotificationManager.error('⚠ Error loading saved data: ' + error.message);
            console.error('Load error:', error);
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
