import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import EmergencyOverlay from './components/EmergencyOverlay';
import Dashboard from './components/tabs/Dashboard';
import Diagnosis from './components/tabs/Diagnosis';
import Profile from './components/tabs/Profile';
import HealthPulse from './components/tabs/HealthPulse';
import Reports from './components/tabs/Reports';
import Hospitals from './components/tabs/Hospitals';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEmergency, setIsEmergency] = useState(false);
  
  // App state
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem('patientProfile')) || null);
  const [diagnosisHistory, setDiagnosisHistory] = useState(() => JSON.parse(localStorage.getItem('diagnosisHistory')) || []);
  const [wellnessData, setWellnessData] = useState(() => JSON.parse(localStorage.getItem('wellnessData')) || { mood: [], energy: [], sleep: [], stress: [], dates: [] });
  const [activities, setActivities] = useState(() => JSON.parse(localStorage.getItem('activityLog')) || []);

  // Save to local storage when state changes
  useEffect(() => {
    if (profile) localStorage.setItem('patientProfile', JSON.stringify(profile));
    else localStorage.removeItem('patientProfile');
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('diagnosisHistory', JSON.stringify(diagnosisHistory));
  }, [diagnosisHistory]);

  useEffect(() => {
    localStorage.setItem('wellnessData', JSON.stringify(wellnessData));
  }, [wellnessData]);

  useEffect(() => {
    localStorage.setItem('activityLog', JSON.stringify(activities));
  }, [activities]);

  const logActivity = (action) => {
    const newActivity = {
      action,
      date: new Date().toISOString()
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 10)); // Keep last 10
  };

  const triggerEmergency = () => {
    setIsEmergency(true);
  };

  const dismissEmergency = () => {
    setIsEmergency(false);
  };

  return (
    <>
      <EmergencyOverlay isEmergency={isEmergency} dismissEmergency={dismissEmergency} />
      
      <div className="container">
        <Header />
        
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="tab-content">
          <div className={`tab-pane ${activeTab === 'dashboard' ? 'active' : ''}`}>
             {activeTab === 'dashboard' && <Dashboard profile={profile} diagnosisHistory={diagnosisHistory} wellnessData={wellnessData} activities={activities} setActiveTab={setActiveTab} />}
          </div>
          <div className={`tab-pane ${activeTab === 'diagnosis' ? 'active' : ''}`}>
             {activeTab === 'diagnosis' && <Diagnosis profile={profile} setDiagnosisHistory={setDiagnosisHistory} logActivity={logActivity} triggerEmergency={triggerEmergency} setActiveTab={setActiveTab} />}
          </div>
          <div className={`tab-pane ${activeTab === 'profile' ? 'active' : ''}`}>
             {activeTab === 'profile' && <Profile profile={profile} setProfile={setProfile} logActivity={logActivity} />}
          </div>
          <div className={`tab-pane ${activeTab === 'health-pulse' ? 'active' : ''}`}>
             {activeTab === 'health-pulse' && <HealthPulse wellnessData={wellnessData} setWellnessData={setWellnessData} logActivity={logActivity} />}
          </div>
          <div className={`tab-pane ${activeTab === 'reports' ? 'active' : ''}`}>
             {activeTab === 'reports' && <Reports diagnosisHistory={diagnosisHistory} />}
          </div>
          <div className={`tab-pane ${activeTab === 'hospitals' ? 'active' : ''}`}>
             {activeTab === 'hospitals' && <Hospitals />}
          </div>
        </main>

        <footer className="footer">
            <p>&copy; 2026 E-Healthcare Advisor. Educational Simulation Only.</p>
            <p>Always consult with healthcare professionals for medical advice.</p>
        </footer>
      </div>
    </>
  );
}

export default App;
