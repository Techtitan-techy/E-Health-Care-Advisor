import React, { useState, useMemo } from 'react';
import { diseases, symptoms } from '../../utils/data';

// ── Natural Language Symptom Parser (improved) ──────────────────────────
const SYNONYM_MAP = {
    'head': 'headache', 'head hurts': 'headache', 'head pain': 'headache', 'migraine': 'headache',
    'stomach': 'abdominal_pain', 'stomach ache': 'abdominal_pain', 'tummy': 'abdominal_pain', 'belly': 'abdominal_pain', 'stomach pain': 'abdominal_pain',
    'throw up': 'vomiting', 'puke': 'vomiting', 'throwing up': 'vomiting',
    'dizzy': 'dizziness', 'lightheaded': 'dizziness', 'faint': 'dizziness', 'spinning': 'dizziness',
    'tired': 'fatigue', 'exhausted': 'fatigue', 'no energy': 'fatigue', 'weak': 'fatigue', 'drowsy': 'fatigue', 'lethargic': 'fatigue',
    'cant breathe': 'shortness_of_breath', 'breathing difficulty': 'shortness_of_breath', 'breathless': 'shortness_of_breath', 'hard to breathe': 'shortness_of_breath',
    'cold sweat': 'sweating', 'perspiring': 'sweating', 'sweat': 'sweating',
    'runny nose': 'runny_nose', 'blocked nose': 'runny_nose', 'stuffy nose': 'runny_nose', 'congestion': 'runny_nose', 'congested': 'runny_nose',
    'temperature': 'fever', 'hot': 'fever', 'feverish': 'fever', 'burning up': 'fever',
    'throat hurts': 'sore_throat', 'sore throat': 'sore_throat', 'throat pain': 'sore_throat', 'scratchy throat': 'sore_throat',
    'cant taste': 'loss_of_taste', 'cant smell': 'loss_of_taste', 'no taste': 'loss_of_taste', 'no smell': 'loss_of_taste',
    'chest hurts': 'chest_pain', 'chest pressure': 'chest_pain', 'tight chest': 'chest_tightness',
    'heart racing': 'rapid_heartbeat', 'heart pounding': 'rapid_heartbeat', 'palpitations': 'rapid_heartbeat',
    'cant sleep': 'irritability', 'insomnia': 'irritability',
    'anxious': 'nervousness', 'worried': 'nervousness', 'panic': 'nervousness', 'scared': 'nervousness',
    'blurry vision': 'blurred_vision', 'cant see': 'blurred_vision', 'vision problems': 'blurred_vision',
    'body ache': 'muscle_aches', 'body pain': 'muscle_aches', 'sore muscles': 'muscle_aches', 'aching': 'muscle_aches',
    'itchy eyes': 'watery_eyes', 'eyes watering': 'watery_eyes',
    'loose motions': 'diarrhea', 'loose stools': 'diarrhea', 'watery stools': 'diarrhea',
    'acidity': 'heartburn', 'acid reflux': 'heartburn', 'burning chest': 'heartburn',
    'feel sick': 'nausea', 'nauseous': 'nausea', 'queasy': 'nausea',
    'cant swallow': 'difficulty_swallowing', 'hard to swallow': 'difficulty_swallowing',
    'confused': 'confusion', 'disoriented': 'confusion',
    'face drooping': 'facial_droop', 'face numb': 'facial_droop',
    'arm weak': 'arm_weakness', 'cant lift arm': 'arm_weakness',
    'cant talk': 'slurred_speech', 'speech problems': 'slurred_speech',
    'thirsty': 'excessive_thirst', 'very thirsty': 'excessive_thirst', 'drinking a lot': 'excessive_thirst',
    'peeing a lot': 'frequent_urination', 'urinating frequently': 'frequent_urination',
    'light bothering': 'light_sensitivity', 'light hurts': 'light_sensitivity', 'photophobia': 'light_sensitivity',
    'shivering': 'chills', 'shaking': 'chills', 'cold': 'chills',
    'phlegm': 'productive_cough', 'mucus': 'productive_cough',
    'jaw hurts': 'jaw_pain', 'neck pain': 'jaw_pain',
    'arm hurts': 'arm_pain', 'left arm': 'arm_pain',
    'burning pee': 'burning_urination', 'hurts to pee': 'burning_urination',
    'swollen glands': 'swollen_lymph_nodes', 'swollen neck': 'swollen_lymph_nodes',
    'wounds not healing': 'slow_healing_sores', 'slow healing': 'slow_healing_sores',
    'bloody urine': 'cloudy_urine', 'dark urine': 'cloudy_urine',
    'pelvic': 'pelvic_pain', 'lower abdomen': 'pelvic_pain',
    'coughing': 'cough', 'dry cough': 'mild_cough',
    'sneeze': 'sneezing',
    'wheeze': 'wheezing',
    'moody': 'irritability', 'mood swings': 'irritability', 'irritable': 'irritability',
    'cant focus': 'difficulty_concentrating', 'brain fog': 'difficulty_concentrating',
    'itchy throat': 'itchy_throat', 'scratchy': 'itchy_throat',
};

const CATEGORY_META = {
    respiratory:    { icon: '🫁', label: 'Respiratory', color: '#3b82f6' },
    general:        { icon: '🩺', label: 'General', color: '#6b7280' },
    neurological:   { icon: '🧠', label: 'Neurological', color: '#8b5cf6' },
    digestive:      { icon: '🫃', label: 'Digestive', color: '#f59e0b' },
    cardiovascular: { icon: '❤️', label: 'Cardiovascular', color: '#ef4444' },
    mental:         { icon: '🧘', label: 'Mental Health', color: '#10b981' },
};

const SEVERITY_COLORS = {
    low: '#10b981',
    moderate: '#f59e0b',
    high: '#f97316',
    critical: '#ef4444',
};

const DURATION_OPTIONS = [
    { value: 'today', label: 'Just today', weight: 0.8 },
    { value: '2-3days', label: '2–3 days', weight: 1.0 },
    { value: 'week', label: 'About a week', weight: 1.15 },
    { value: 'weeks', label: '2+ weeks', weight: 1.3 },
    { value: 'chronic', label: 'Months / Recurring', weight: 1.5 },
];

const INTENSITY_OPTIONS = [
    { value: 'mild', label: 'Mild', weight: 0.85 },
    { value: 'moderate', label: 'Moderate', weight: 1.0 },
    { value: 'severe', label: 'Severe', weight: 1.2 },
];

// ── Wizard Steps ────────────────────────────────────────────────────────
const STEPS = [
    { id: 'describe', label: 'Describe', icon: '📝' },
    { id: 'select',   label: 'Select',   icon: '☑️' },
    { id: 'context',  label: 'Context',  icon: '🔎' },
    { id: 'results',  label: 'Results',  icon: '📊' },
];

// ── Component ───────────────────────────────────────────────────────────
const Diagnosis = ({ profile, setDiagnosisHistory, logActivity, triggerEmergency, setActiveTab }) => {
    const [step, setStep] = useState(0);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('2-3days');
    const [intensity, setIntensity] = useState('moderate');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [results, setResults] = useState(null);
    const [parsedCount, setParsedCount] = useState(null);

    // ── Derived ─────────────────────────────────────────────────────────
    const categories = useMemo(() => {
        const cats = new Set(symptoms.map(s => s.category));
        return ['all', ...Array.from(cats)];
    }, []);

    const filteredSymptoms = useMemo(() => {
        if (categoryFilter === 'all') return symptoms;
        return symptoms.filter(s => s.category === categoryFilter);
    }, [categoryFilter]);

    // ── Handlers ────────────────────────────────────────────────────────
    const handleSymptomToggle = (symptomId) => {
        setSelectedSymptoms(prev =>
            prev.includes(symptomId)
                ? prev.filter(id => id !== symptomId)
                : [...prev, symptomId]
        );
    };

    const parseDescription = () => {
        if (!description.trim()) return;
        const text = description.toLowerCase().replace(/['']/g, '');
        const found = new Set();

        // 1. Match synonym phrases (longest first)
        const sortedPhrases = Object.keys(SYNONYM_MAP).sort((a, b) => b.length - a.length);
        for (const phrase of sortedPhrases) {
            if (text.includes(phrase)) {
                found.add(SYNONYM_MAP[phrase]);
            }
        }

        // 2. Match symptom labels
        symptoms.forEach(s => {
            const keywords = s.label.toLowerCase().split(/[\s/()+]+/).filter(kw => kw.length > 3);
            if (keywords.some(kw => text.includes(kw))) {
                found.add(s.id);
            }
        });

        // 3. Match symptom IDs directly (e.g. "fever" in the text)
        symptoms.forEach(s => {
            const raw = s.id.replace(/_/g, ' ');
            if (text.includes(raw)) found.add(s.id);
        });

        if (found.size > 0) {
            setSelectedSymptoms(prev => Array.from(new Set([...prev, ...found])));
            setParsedCount(found.size);
        } else {
            setParsedCount(0);
        }
    };

    const runDiagnosis = () => {
        if (selectedSymptoms.length === 0) return;

        const durationWeight = DURATION_OPTIONS.find(d => d.value === duration)?.weight || 1;
        const intensityWeight = INTENSITY_OPTIONS.find(i => i.value === intensity)?.weight || 1;
        let isEmergency = false;

        const scoredDiseases = diseases.map(disease => {
            const matchingSymptoms = disease.symptoms.filter(s => selectedSymptoms.includes(s));
            if (matchingSymptoms.length === 0) return null;

            // Base score: % of disease symptoms matched
            const baseScore = matchingSymptoms.length / disease.symptoms.length;
            // Coverage: how many of the user's symptoms does this disease explain?
            const coverageScore = matchingSymptoms.length / selectedSymptoms.length;
            // Combined weighted confidence
            const rawConfidence = (baseScore * 0.6 + coverageScore * 0.4) * durationWeight * intensityWeight;
            const confidence = Math.min(rawConfidence * 100, 99); // cap at 99

            // Age-based bonus (if profile exists)
            let ageFactor = 1;
            if (profile?.age) {
                const age = parseInt(profile.age);
                if (disease.severity === 'critical' && age > 50) ageFactor = 1.1;
                if (disease.id === 'diabetes' && age > 40) ageFactor = 1.1;
            }

            const finalConfidence = Math.min(confidence * ageFactor, 99);

            if (finalConfidence > 15 && disease.severity === 'critical') {
                isEmergency = true;
            }

            return {
                ...disease,
                matchingSymptoms,
                matchPercentage: Math.round(baseScore * 100),
                coveragePercentage: Math.round(coverageScore * 100),
                confidence: Math.round(finalConfidence),
            };
        })
        .filter(Boolean)
        .sort((a, b) => b.confidence - a.confidence);

        if (isEmergency) triggerEmergency();

        const report = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            symptoms: selectedSymptoms.map(id => symptoms.find(s => s.id === id)?.label || id),
            symptomIds: selectedSymptoms,
            duration,
            intensity,
            topDisease: scoredDiseases[0] || null,
            allMatches: scoredDiseases,
            severity: scoredDiseases[0]?.severity || 'low',
        };

        setResults(report);
        setDiagnosisHistory(prev => [report, ...prev]);
        logActivity(`Diagnosis: ${scoredDiseases[0]?.name || 'No match'}`);
        setStep(3);
    };

    const resetDiagnosis = () => {
        setSelectedSymptoms([]);
        setDescription('');
        setDuration('2-3days');
        setIntensity('moderate');
        setCategoryFilter('all');
        setResults(null);
        setParsedCount(null);
        setStep(0);
    };

    const canAdvance = () => {
        if (step === 0) return true; // can always skip description
        if (step === 1) return selectedSymptoms.length > 0;
        if (step === 2) return selectedSymptoms.length > 0;
        return false;
    };

    // ── Render helpers ──────────────────────────────────────────────────
    const renderProgressBar = () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '2rem' }}>
            {STEPS.map((s, i) => (
                <React.Fragment key={s.id}>
                    <button
                        onClick={() => { if (i < step || (i <= 2 && results === null)) setStep(i); }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.5rem 1rem', borderRadius: '999px', border: 'none',
                            fontFamily: 'Outfit', fontWeight: 600, fontSize: '0.85rem',
                            cursor: i <= step ? 'pointer' : 'default',
                            background: i === step ? 'var(--primary-blue)' : i < step ? 'var(--medical-green)' : '#e5e7eb',
                            color: i <= step ? '#fff' : 'var(--text-light)',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <span>{i < step ? '✓' : s.icon}</span>
                        <span style={{ display: 'none' }}>{s.label}</span>
                        <span>{s.label}</span>
                    </button>
                    {i < STEPS.length - 1 && (
                        <div style={{ flex: 1, height: '3px', borderRadius: '2px', background: i < step ? 'var(--medical-green)' : '#e5e7eb', transition: 'background 0.3s ease' }} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );

    const renderStep0 = () => (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>📝 Describe How You're Feeling</h3>
            <p className="sub-text" style={{ marginBottom: '1rem' }}>
                Tell us in your own words. Our NLP engine understands phrases like <em>"my head hurts and I feel nauseous"</em>, <em>"I'm dizzy and breathless"</em>, or <em>"I've been throwing up."</em>
            </p>
            <textarea
                className="symptom-description"
                placeholder="Example: I have a terrible headache, I feel nauseous and the light is bothering my eyes. I'm also very tired and my body is aching..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                style={{ width: '100%', fontFamily: 'Outfit', fontSize: '1rem', padding: '1rem', borderRadius: '8px', border: '1px solid #d1d5db', resize: 'vertical' }}
            />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn-secondary" onClick={() => { parseDescription(); }}>🧠 Analyze Description</button>
                {parsedCount !== null && (
                    <span style={{
                        padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600,
                        background: parsedCount > 0 ? '#dcfce7' : '#fef2f2',
                        color: parsedCount > 0 ? '#166534' : '#991b1b',
                        animation: 'fadeIn 0.3s ease',
                    }}>
                        {parsedCount > 0 ? `✅ ${parsedCount} symptom${parsedCount > 1 ? 's' : ''} detected` : '❌ No symptoms detected — try rewording or skip to manual selection'}
                    </span>
                )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button className="btn-primary" onClick={() => setStep(1)}>
                    {selectedSymptoms.length > 0 ? `Continue with ${selectedSymptoms.length} symptom${selectedSymptoms.length > 1 ? 's' : ''} →` : 'Skip to Manual Selection →'}
                </button>
            </div>
        </div>
    );

    const renderStep1 = () => (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                    <h3 style={{ marginBottom: '0.25rem' }}>☑️ Select Symptoms</h3>
                    <p className="sub-text">Check all that apply. Use category filters to narrow the list.</p>
                </div>
                {selectedSymptoms.length > 0 && (
                    <span style={{ padding: '0.4rem 1rem', borderRadius: '999px', background: '#dbeafe', color: '#1e40af', fontSize: '0.85rem', fontWeight: 600 }}>
                        {selectedSymptoms.length} selected
                    </span>
                )}
            </div>

            {/* Category filter chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {categories.map(cat => {
                    const meta = CATEGORY_META[cat];
                    const isActive = categoryFilter === cat;
                    return (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            style={{
                                padding: '0.4rem 0.75rem', borderRadius: '999px', border: 'none', fontFamily: 'Outfit',
                                fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s ease',
                                background: isActive ? (meta?.color || 'var(--primary-blue)') : '#f3f4f6',
                                color: isActive ? '#fff' : 'var(--text-dark)',
                            }}
                        >
                            {meta ? `${meta.icon} ${meta.label}` : '🔘 All'}
                        </button>
                    );
                })}
            </div>

            {/* Symptoms grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fafafa' }}>
                {filteredSymptoms.map(s => {
                    const isChecked = selectedSymptoms.includes(s.id);
                    const meta = CATEGORY_META[s.category];
                    return (
                        <label
                            key={s.id}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem',
                                borderRadius: '6px', cursor: 'pointer', transition: 'all 0.15s ease', userSelect: 'none',
                                background: isChecked ? '#eff6ff' : '#fff',
                                border: `1.5px solid ${isChecked ? '#3b82f6' : '#e5e7eb'}`,
                                fontSize: '0.9rem',
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleSymptomToggle(s.id)}
                                style={{ accentColor: meta?.color || '#3b82f6', width: '1rem', height: '1rem' }}
                            />
                            <span>{s.label}</span>
                        </label>
                    );
                })}
            </div>

            {/* Selected symptom tags */}
            {selectedSymptoms.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                    <p style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Selected Symptoms:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {selectedSymptoms.map(id => {
                            const s = symptoms.find(s => s.id === id);
                            const meta = CATEGORY_META[s?.category];
                            return (
                                <span
                                    key={id}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                        padding: '0.3rem 0.7rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 500,
                                        background: `${meta?.color || '#3b82f6'}15`, color: meta?.color || '#3b82f6',
                                        border: `1px solid ${meta?.color || '#3b82f6'}40`,
                                    }}
                                >
                                    {s?.label || id}
                                    <button
                                        onClick={(e) => { e.preventDefault(); handleSymptomToggle(id); }}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700, fontSize: '0.9rem', padding: 0, lineHeight: 1 }}
                                    >×</button>
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button className="btn-secondary" onClick={() => setStep(0)}>← Back</button>
                <button className="btn-primary" disabled={selectedSymptoms.length === 0} onClick={() => setStep(2)}
                    style={{ opacity: selectedSymptoms.length === 0 ? 0.5 : 1 }}>
                    Continue →
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>🔎 Additional Context</h3>
            <p className="sub-text" style={{ marginBottom: '1.5rem' }}>
                Help us provide a better assessment by sharing how long you've had these symptoms and how intense they are.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Duration */}
                <div>
                    <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>⏱️ How long have you had these symptoms?</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {DURATION_OPTIONS.map(d => (
                            <label key={d.value} style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem',
                                borderRadius: '6px', cursor: 'pointer', transition: 'all 0.15s ease',
                                background: duration === d.value ? '#eff6ff' : '#fff',
                                border: `1.5px solid ${duration === d.value ? '#3b82f6' : '#e5e7eb'}`,
                            }}>
                                <input type="radio" name="duration" value={d.value} checked={duration === d.value}
                                    onChange={() => setDuration(d.value)} style={{ accentColor: '#3b82f6' }} />
                                {d.label}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Intensity */}
                <div>
                    <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>💪 Overall intensity?</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {INTENSITY_OPTIONS.map(i => (
                            <label key={i.value} style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem',
                                borderRadius: '6px', cursor: 'pointer', transition: 'all 0.15s ease',
                                background: intensity === i.value ? '#eff6ff' : '#fff',
                                border: `1.5px solid ${intensity === i.value ? '#3b82f6' : '#e5e7eb'}`,
                            }}>
                                <input type="radio" name="intensity" value={i.value} checked={intensity === i.value}
                                    onChange={() => setIntensity(i.value)} style={{ accentColor: '#3b82f6' }} />
                                {i.label}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Summary before running */}
            <div style={{ marginTop: '2rem', padding: '1.25rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>📋 Summary before analysis:</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                    <strong>{selectedSymptoms.length}</strong> symptoms selected · Duration: <strong>{DURATION_OPTIONS.find(d => d.value === duration)?.label}</strong> · Intensity: <strong>{INTENSITY_OPTIONS.find(i => i.value === intensity)?.label}</strong>
                    {profile && <> · Patient: <strong>{profile.name}</strong>, Age {profile.age}</>}
                </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-primary" onClick={runDiagnosis}>🔍 Run Diagnosis</button>
            </div>
        </div>
    );

    const renderStep3 = () => {
        if (!results) return null;
        const top = results.topDisease;

        return (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>📊 Diagnosis Results</h3>

                {results.allMatches.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', background: '#fefce8', borderRadius: '12px', border: '1px solid #fde68a' }}>
                        <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🤷</p>
                        <p style={{ fontWeight: 600 }}>No matching conditions found</p>
                        <p className="sub-text" style={{ marginTop: '0.5rem' }}>Your symptoms didn't match any conditions in our database. Please consult a healthcare professional for a proper evaluation.</p>
                    </div>
                ) : (
                    <>
                        {/* Top match card */}
                        <div style={{
                            borderRadius: '12px', overflow: 'hidden',
                            border: `2px solid ${SEVERITY_COLORS[top.severity] || '#3b82f6'}`,
                            marginBottom: '1.5rem',
                        }}>
                            {/* Header bar */}
                            <div style={{
                                padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                background: `${SEVERITY_COLORS[top.severity]}15`,
                            }}>
                                <div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '0.05em' }}>Most Likely Condition</span>
                                    <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.3rem' }}>{top.name}</h3>
                                </div>
                                <span style={{
                                    padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700,
                                    background: SEVERITY_COLORS[top.severity], color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em',
                                }}>{top.severity}</span>
                            </div>

                            <div style={{ padding: '1.5rem' }}>
                                {/* Confidence bar */}
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                                        <span style={{ fontWeight: 600 }}>Confidence Score</span>
                                        <span style={{ fontWeight: 700, color: SEVERITY_COLORS[top.severity] }}>{top.confidence}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${top.confidence}%`, height: '100%', borderRadius: '4px',
                                            background: `linear-gradient(90deg, ${SEVERITY_COLORS[top.severity]}cc, ${SEVERITY_COLORS[top.severity]})`,
                                            transition: 'width 0.8s ease',
                                        }} />
                                    </div>
                                </div>

                                <p style={{ color: 'var(--text-light)', lineHeight: 1.7, marginBottom: '1.25rem' }}>{top.description}</p>

                                {/* Matched symptoms */}
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Matched Symptoms ({top.matchingSymptoms.length}/{top.symptoms.length}):</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                        {top.symptoms.map(sid => {
                                            const matched = top.matchingSymptoms.includes(sid);
                                            const label = symptoms.find(s => s.id === sid)?.label || sid;
                                            return (
                                                <span key={sid} style={{
                                                    padding: '0.25rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 500,
                                                    background: matched ? '#dcfce7' : '#f3f4f6',
                                                    color: matched ? '#166534' : '#9ca3af',
                                                    textDecoration: matched ? 'none' : 'line-through',
                                                }}>
                                                    {matched ? '✓' : '✗'} {label}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Medicines & Prevention */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                                        <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>💊 Suggested Medicines</p>
                                        <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.85rem', lineHeight: 1.8 }}>
                                            {top.otcMedicines.map((m, i) => <li key={i}>{m}</li>)}
                                        </ul>
                                    </div>
                                    <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                                        <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>🛡️ Prevention</p>
                                        <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--text-light)' }}>{top.prevention}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Other matches */}
                        {results.allMatches.length > 1 && (
                            <div>
                                <h4 style={{ marginBottom: '1rem' }}>Other Possible Conditions</h4>
                                <div style={{ display: 'grid', gap: '0.75rem' }}>
                                    {results.allMatches.slice(1, 5).map((d, i) => (
                                        <div key={i} style={{
                                            padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem',
                                        }}>
                                            <div>
                                                <span style={{ fontWeight: 600 }}>{d.name}</span>
                                                <span style={{
                                                    marginLeft: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '999px',
                                                    fontSize: '0.7rem', fontWeight: 600, background: `${SEVERITY_COLORS[d.severity]}20`, color: SEVERITY_COLORS[d.severity],
                                                }}>{d.severity}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: '80px', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${d.confidence}%`, height: '100%', borderRadius: '3px', background: SEVERITY_COLORS[d.severity], transition: 'width 0.6s ease' }} />
                                                </div>
                                                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: SEVERITY_COLORS[d.severity], minWidth: '35px' }}>{d.confidence}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Disclaimer */}
                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fefce8', borderRadius: '8px', border: '1px solid #fde68a', fontSize: '0.85rem', color: '#854d0e' }}>
                            ⚠️ <strong>Important:</strong> This is an educational simulation only. These results are based on a simplified symptom-matching algorithm and should never replace professional medical advice. Always consult a qualified healthcare provider for diagnosis and treatment.
                        </div>
                    </>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                    <button className="btn-secondary" onClick={resetDiagnosis}>🔄 New Diagnosis</button>
                    <button className="btn-primary" onClick={() => setActiveTab('reports')}>📄 View All Reports</button>
                </div>
            </div>
        );
    };

    // ── Main render ─────────────────────────────────────────────────────
    return (
        <section id="diagnosis" className="tab-pane active">
            <h2>Symptom Diagnosis</h2>
            <div className="diagnosis-container">
                {renderProgressBar()}
                {step === 0 && renderStep0()}
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
};

export default Diagnosis;
