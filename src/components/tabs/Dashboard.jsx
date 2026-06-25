import React from 'react';

const Dashboard = ({ profile, diagnosisHistory, wellnessData, activities, setActiveTab }) => {
    
    const lastDiagnosis = diagnosisHistory.length > 0 ? diagnosisHistory[0] : null;
    
    let healthScore = '--';
    let healthStatus = 'No data available';
    
    if (profile && wellnessData.mood.length > 0) {
        // Simple health score calculation based on wellness data
        const recentMood = parseInt(wellnessData.mood[wellnessData.mood.length - 1]);
        const recentEnergy = parseInt(wellnessData.energy[wellnessData.energy.length - 1]);
        const recentSleep = parseFloat(wellnessData.sleep[wellnessData.sleep.length - 1]);
        const recentStress = parseInt(wellnessData.stress[wellnessData.stress.length - 1]);
        
        let score = 50; // base score
        score += (recentMood - 5) * 2;
        score += (recentEnergy - 5) * 2;
        score += (recentSleep - 7) * 2;
        score -= (recentStress - 5) * 2;
        
        // penalties for diseases
        if (lastDiagnosis && lastDiagnosis.severity === 'critical') score -= 20;
        if (lastDiagnosis && lastDiagnosis.severity === 'high') score -= 10;

        score = Math.max(0, Math.min(100, Math.round(score)));
        healthScore = `${score}/100`;
        
        if (score >= 80) healthStatus = 'Good condition';
        else if (score >= 60) healthStatus = 'Fair condition';
        else healthStatus = 'Needs attention';
    }

    return (
        <section id="dashboard" className="tab-pane active">
            <h2>Dashboard</h2>
            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>👤 Patient Status</h3>
                    <p id="patient-status">{profile ? `Welcome, ${profile.name}` : 'No profile created yet'}</p>
                    {!profile && <button className="btn-small" onClick={() => setActiveTab('profile')}>Create Profile</button>}
                </div>
                <div className="dashboard-card">
                    <h3>📊 Last Diagnosis</h3>
                    <p id="last-diagnosis">{lastDiagnosis ? `Risk: ${lastDiagnosis.topDisease.name}` : 'No diagnosis yet'}</p>
                    <button className="btn-small" onClick={() => setActiveTab('diagnosis')}>Start Diagnosis</button>
                </div>
                <div className="dashboard-card">
                    <h3>💚 Health Score</h3>
                    <p id="health-score" className="health-score" style={{ color: parseInt(healthScore) < 60 ? '#ef4444' : '#10b981' }}>{healthScore}</p>
                    <small id="health-status">{healthStatus}</small>
                </div>
                <div className="dashboard-card">
                    <h3>📈 Recent Activity</h3>
                    <ul id="activity-list" className="activity-list">
                        {activities.length > 0 ? (
                            activities.map((act, idx) => (
                                <li key={idx}>
                                    {act.action} - <small>{new Date(act.date).toLocaleDateString()}</small>
                                </li>
                            ))
                        ) : (
                            <li>No activity yet</li>
                        )}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
