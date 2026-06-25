import React, { useState } from 'react';

const Reports = ({ diagnosisHistory }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState('');

    const filteredReports = diagnosisHistory.filter(report => {
        const matchesSearch = report.topDisease.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              report.symptoms.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesSeverity = severityFilter === '' || report.topDisease.severity === severityFilter;

        return matchesSearch && matchesSeverity;
    });

    return (
        <section id="reports" className="tab-pane active">
            <h2>Diagnosis Reports</h2>
            <div className="reports-container">
                <div className="reports-filter" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <input 
                        type="text" 
                        placeholder="Search reports by disease or symptom..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                    />
                    <select 
                        value={severityFilter} 
                        onChange={(e) => setSeverityFilter(e.target.value)}
                        style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                    >
                        <option value="">All Severities</option>
                        <option value="low">Low</option>
                        <option value="moderate">Moderate</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>
                
                <div className="reports-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredReports.length > 0 ? (
                        filteredReports.map(report => (
                            <div key={report.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', background: '#fff' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0 }}>{report.topDisease.name}</h3>
                                    <span className={`severity-badge ${report.topDisease.severity}`}>
                                        {report.topDisease.severity.toUpperCase()}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>
                                    Date: {new Date(report.date).toLocaleString()}
                                </p>
                                <div>
                                    <strong>Reported Symptoms:</strong>
                                    <ul style={{ margin: '0.5rem 0 1rem 1.5rem' }}>
                                        {report.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                                <p><strong>Description:</strong> {report.topDisease.description}</p>
                                <div style={{ marginTop: '1rem' }}>
                                    <strong>Recommended Actions:</strong>
                                    <ul style={{ margin: '0.5rem 0 0 1.5rem' }}>
                                        {report.topDisease.otcMedicines.map((m, i) => <li key={i}>{m}</li>)}
                                    </ul>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="sub-text">No reports found matching your criteria.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Reports;
