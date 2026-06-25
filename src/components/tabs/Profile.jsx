import React, { useState, useEffect } from 'react';

const Profile = ({ profile, setProfile, logActivity }) => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        conditions: '',
        allergies: '',
        medications: ''
    });

    const [isEditing, setIsEditing] = useState(!profile);

    useEffect(() => {
        if (profile) {
            setFormData(profile);
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    }, [profile]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = () => {
        if (!formData.name || !formData.age) {
            alert('Please fill in all required fields (*)');
            return;
        }
        setProfile(formData);
        logActivity(profile ? 'Profile Updated' : 'Profile Created');
        setIsEditing(false);
    };

    const handleDelete = () => {
        if(window.confirm('Are you sure you want to delete your profile? All data will be lost.')) {
            setProfile(null);
            setFormData({ name: '', age: '', gender: '', conditions: '', allergies: '', medications: '' });
            setIsEditing(true);
            logActivity('Profile Deleted');
        }
    };

    const handleExport = () => {
        const data = {
            profile: JSON.parse(localStorage.getItem('patientProfile')),
            wellnessData: JSON.parse(localStorage.getItem('wellnessData')),
            diagnosisHistory: JSON.parse(localStorage.getItem('diagnosisHistory')),
            activityLog: JSON.parse(localStorage.getItem('activityLog'))
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ehealth_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.profile) localStorage.setItem('patientProfile', JSON.stringify(data.profile));
                if (data.wellnessData) localStorage.setItem('wellnessData', JSON.stringify(data.wellnessData));
                if (data.diagnosisHistory) localStorage.setItem('diagnosisHistory', JSON.stringify(data.diagnosisHistory));
                if (data.activityLog) localStorage.setItem('activityLog', JSON.stringify(data.activityLog));
                alert('Data imported successfully! The page will now reload.');
                window.location.reload();
            } catch (err) {
                alert('Invalid file format. Please upload a valid JSON backup.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <section id="profile" className="tab-pane active">
            <h2>Patient Profile</h2>
            <div className="profile-container">
                {isEditing ? (
                    <form id="profile-form" className="profile-form">
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Age *</label>
                                <input type="number" name="age" min="0" max="120" value={formData.age} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Existing Conditions</label>
                            <textarea name="conditions" rows="3" value={formData.conditions} onChange={handleChange} placeholder="e.g., Diabetes, Hypertension..."></textarea>
                        </div>
                        <div className="form-group">
                            <label>Allergies</label>
                            <textarea name="allergies" rows="3" value={formData.allergies} onChange={handleChange} placeholder="e.g., Penicillin, Peanuts..."></textarea>
                        </div>
                        <div className="form-group">
                            <label>Current Medications</label>
                            <textarea name="medications" rows="3" value={formData.medications} onChange={handleChange} placeholder="List current medications..."></textarea>
                        </div>
                        <button type="button" className="btn-primary" onClick={handleSave}>Save Profile</button>
                        {profile && <button type="button" className="btn-danger" onClick={handleDelete} style={{ marginLeft: '10px' }}>Delete Profile</button>}
                    </form>
                ) : (
                    <div id="profile-display" className="profile-display">
                        <h3>Current Profile</h3>
                        <div id="profile-info">
                            <p><strong>Name:</strong> {profile.name}</p>
                            <p><strong>Age:</strong> {profile.age}</p>
                            <p><strong>Gender:</strong> {profile.gender}</p>
                            <p><strong>Conditions:</strong> {profile.conditions || 'None'}</p>
                            <p><strong>Allergies:</strong> {profile.allergies || 'None'}</p>
                            <p><strong>Medications:</strong> {profile.medications || 'None'}</p>
                        </div>
                        <button className="btn-secondary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                    </div>
                )}

                <div className="data-management" style={{ marginTop: '2rem' }}>
                    <h3>📊 Data Management</h3>
                    <p className="sub-text">Export or import your health data for backup and sharing.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <button className="btn-secondary" onClick={handleExport}>📥 Export Data</button>
                        <label className="btn-secondary" style={{ cursor: 'pointer', margin: 0, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            📤 Import Data
                            <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
                        </label>
                    </div>
                    <p className="sub-text" style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#ef4444' }}>
                        ⚠️ Disclaimer: This app is for educational purposes only and should not replace professional medical advice.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Profile;
