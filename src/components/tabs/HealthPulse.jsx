import React, { useState, useEffect, useRef } from 'react';

const HealthPulse = ({ wellnessData, setWellnessData, logActivity }) => {
    const [logForm, setLogForm] = useState({
        mood: 5,
        energy: 5,
        sleep: 7,
        stress: 5
    });
    
    const canvasRef = useRef(null);

    const handleLog = () => {
        const today = new Date().toISOString().split('T')[0];
        if (wellnessData.dates.includes(today)) {
            alert('You have already logged your wellness today!');
            return;
        }

        const newData = {
            mood: [...wellnessData.mood, logForm.mood].slice(-7),
            energy: [...wellnessData.energy, logForm.energy].slice(-7),
            sleep: [...wellnessData.sleep, logForm.sleep].slice(-7),
            stress: [...wellnessData.stress, logForm.stress].slice(-7),
            dates: [...wellnessData.dates, today].slice(-7)
        };
        
        setWellnessData(newData);
        logActivity('Logged Daily Wellness');
    };

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Setup canvas size
        const width = canvas.parentElement.offsetWidth || 600;
        const height = 300;
        canvas.width = width;
        canvas.height = height;

        if (wellnessData.dates.length === 0) {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#6b7280';
            ctx.font = '14px Outfit';
            ctx.fillText('No wellness data logged yet', width / 2 - 80, height / 2);
            return;
        }

        const { mood, energy, sleep, stress } = wellnessData;
        const padding = 40;
        const graphWidth = width - padding * 2;
        const graphHeight = height - padding * 2;
        const step = graphWidth / (Math.max(mood.length - 1, 1));

        ctx.clearRect(0, 0, width, height);

        // Draw axes
        ctx.strokeStyle = '#e5e7eb';
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // Draw grid
        ctx.strokeStyle = '#f3f4f6';
        for (let i = 1; i < 10; i++) {
            const y = padding + (graphHeight / 10) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        const datasets = [
            { data: mood, color: '#3b82f6', label: 'Mood (1-10)', max: 10 },
            { data: energy, color: '#10b981', label: 'Energy (1-10)', max: 10 },
            { data: sleep, color: '#f59e0b', label: 'Sleep (hrs)', max: 12 },
            { data: stress, color: '#ef4444', label: 'Stress (1-10)', max: 10 }
        ];

        datasets.forEach(dataset => {
            ctx.strokeStyle = dataset.color;
            ctx.lineWidth = 2;
            ctx.beginPath();

            dataset.data.forEach((point, index) => {
                const x = padding + index * step;
                const normalizedY = (point / dataset.max) * graphHeight;
                const y = height - padding - normalizedY;
                if (index === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
        });

        // Draw legend
        let legendY = 20;
        datasets.forEach(dataset => {
            ctx.fillStyle = dataset.color;
            ctx.fillRect(20, legendY, 10, 10);
            ctx.fillStyle = '#1f2937';
            ctx.font = '12px Outfit';
            ctx.fillText(dataset.label, 35, legendY + 8);
            legendY += 15;
        });

    }, [wellnessData]);

    return (
        <section id="health-pulse" className="tab-pane active">
            <h2>Health Pulse - Wellness Tracker</h2>
            <div className="health-pulse-container">
                <div className="wellness-input">
                    <h3>Log Daily Wellness</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Mood (1-10)</label>
                            <input type="range" min="1" max="10" value={logForm.mood} onChange={(e) => setLogForm({...logForm, mood: Number(e.target.value)})} />
                            <span>{logForm.mood}</span>
                        </div>
                        <div className="form-group">
                            <label>Energy Level (1-10)</label>
                            <input type="range" min="1" max="10" value={logForm.energy} onChange={(e) => setLogForm({...logForm, energy: Number(e.target.value)})} />
                            <span>{logForm.energy}</span>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Sleep Hours (0-12)</label>
                            <input type="number" min="0" max="12" step="0.5" value={logForm.sleep} onChange={(e) => setLogForm({...logForm, sleep: Number(e.target.value)})} />
                        </div>
                        <div className="form-group">
                            <label>Stress Level (1-10)</label>
                            <input type="range" min="1" max="10" value={logForm.stress} onChange={(e) => setLogForm({...logForm, stress: Number(e.target.value)})} />
                            <span>{logForm.stress}</span>
                        </div>
                    </div>
                    <button className="btn-primary" onClick={handleLog}>Log Entry</button>
                </div>
                
                <div className="wellness-chart" style={{ marginTop: '2rem' }}>
                    <h3>Wellness Trends (Last 7 Days)</h3>
                    <canvas ref={canvasRef} style={{ width: '100%', maxWidth: '800px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}></canvas>
                </div>

                <div className="wellness-history" style={{ marginTop: '2rem' }}>
                    <h3>Wellness History</h3>
                    <div className="history-grid" style={{ display: 'grid', gap: '1rem' }}>
                        {wellnessData.dates.length > 0 ? (
                            wellnessData.dates.map((date, idx) => (
                                <div key={idx} style={{ padding: '1rem', background: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                                    <strong>{date}</strong>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                        <span>Mood: {wellnessData.mood[idx]}</span>
                                        <span>Energy: {wellnessData.energy[idx]}</span>
                                        <span>Sleep: {wellnessData.sleep[idx]}h</span>
                                        <span>Stress: {wellnessData.stress[idx]}</span>
                                    </div>
                                </div>
                            ))
                        ).reverse() : (
                            <p className="sub-text">No history available.</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HealthPulse;
