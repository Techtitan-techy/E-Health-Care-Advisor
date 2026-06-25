import React from 'react';

const EmergencyOverlay = ({ isEmergency, dismissEmergency }) => {
    if (!isEmergency) return null;

    return (
        <div id="emergency-overlay" className="emergency-overlay">
            <div className="emergency-content">
                <h1>⚠️ EMERGENCY ALERT</h1>
                <p id="emergency-message">Critical symptoms detected. Seek immediate medical attention!</p>
                <button className="emergency-btn" onClick={dismissEmergency}>DISMISS</button>
            </div>
        </div>
    );
};

export default EmergencyOverlay;
