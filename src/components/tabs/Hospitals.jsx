import React, { useState } from 'react';
import { hospitals } from '../../utils/data';

const Hospitals = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [emergencyOnly, setEmergencyOnly] = useState(false);

    const filteredHospitals = hospitals.filter(hospital => {
        const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              hospital.location.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesEmergency = emergencyOnly ? hospital.emergency : true;

        return matchesSearch && matchesEmergency;
    });

    return (
        <section id="hospitals" className="tab-pane active">
            <h2>Nearby Hospitals & Clinics</h2>
            <div className="hospitals-container">
                <div className="hospitals-filter" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                    <input 
                        type="text" 
                        placeholder="Search hospitals by name or location..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input 
                            type="checkbox" 
                            checked={emergencyOnly}
                            onChange={(e) => setEmergencyOnly(e.target.checked)}
                            style={{ width: '1.2rem', height: '1.2rem' }}
                        />
                        Emergency Only
                    </label>
                </div>
                
                <div className="hospitals-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {filteredHospitals.length > 0 ? (
                        filteredHospitals.map(hospital => (
                            <div key={hospital.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>{hospital.name}</h3>
                                <p style={{ margin: '0 0 0.5rem 0', color: '#4b5563', fontSize: '0.95rem' }}>📍 {hospital.location}</p>
                                <p style={{ margin: '0 0 0.5rem 0', color: '#4b5563', fontSize: '0.95rem' }}>🏠 {hospital.address}</p>
                                <p style={{ margin: '0 0 0.5rem 0', color: '#4b5563', fontSize: '0.95rem' }}>📞 {hospital.phone}</p>
                                
                                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                        {hospital.emergency && <span style={{ background: '#fee2e2', color: '#991b1b', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>Emergency Dept</span>}
                                        <span style={{ background: '#f3f4f6', color: '#374151', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>⭐ {hospital.rating}</span>
                                        <span style={{ background: '#f3f4f6', color: '#374151', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>🕒 {hospital.hours}</span>
                                    </div>
                                    <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                                        Visit Website
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="sub-text">No hospitals found matching your criteria.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Hospitals;
