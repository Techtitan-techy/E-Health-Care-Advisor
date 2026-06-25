import React from 'react';

const Navigation = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'diagnosis', label: 'Diagnosis' },
        { id: 'profile', label: 'Profile' },
        { id: 'health-pulse', label: 'Health Pulse' },
        { id: 'reports', label: 'Reports' },
        { id: 'hospitals', label: 'Hospitals' }
    ];

    return (
        <nav className="nav-tabs">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    );
};

export default Navigation;
