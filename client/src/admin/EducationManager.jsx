import { useState, useEffect } from 'react';
import { api, getImageUrl } from '../api';

function EducationManager() {
    const [education, setEducation] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        degree: '',
        institution: '',
        location: '',
        year: ''
    });
    const [logo, setLogo] = useState(null);

    useEffect(() => {
        loadEducation();
    }, []);

    const loadEducation = async () => {
        const data = await api.getEducation();
        setEducation(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const data = new FormData();
        data.append('degree', formData.degree);
        data.append('institution', formData.institution);
        data.append('location', formData.location);
        data.append('year', formData.year);
        if (logo) data.append('logo', logo);

        try {
            if (editingId) {
                await api.updateEducation(editingId, data, token);
            } else {
                await api.createEducation(data, token);
            }
            closeModal();
            loadEducation();
        } catch (error) {
            console.error('Error saving education:', error);
        }
    };

    const handleEdit = (edu) => {
        setEditingId(edu.id);
        setFormData({
            degree: edu.degree,
            institution: edu.institution,
            location: edu.location || '',
            year: edu.year || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this education?')) return;
        const token = localStorage.getItem('token');
        await api.deleteEducation(id, token);
        loadEducation();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ degree: '', institution: '', location: '', year: '' });
        setLogo(null);
    };

    return (
        <div>
            <div className="admin-header">
                <h1 className="admin-title">Education</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    + Add Education
                </button>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Logo</th>
                        <th>Degree</th>
                        <th>Institution</th>
                        <th>Year</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {education.map((edu) => (
                        <tr key={edu.id}>
                            <td>
                                {edu.logo ? (
                                    <img src={getImageUrl(edu.logo)} alt={edu.institution} />
                                ) : (
                                    <div style={{ width: 48, height: 48, background: 'var(--color-bg-alt)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎓</div>
                                )}
                            </td>
                            <td>{edu.degree}</td>
                            <td>{edu.institution}</td>
                            <td>{edu.year}</td>
                            <td>
                                <div className="action-buttons">
                                    <button className="btn-icon" onClick={() => handleEdit(edu)}>✏️</button>
                                    <button className="btn-icon btn-danger" onClick={() => handleDelete(edu.id)}>🗑️</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{editingId ? 'Edit' : 'Add'} Education</h2>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Institute Logo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setLogo(e.target.files[0])}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Degree / Program</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.degree}
                                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                    placeholder="e.g., Bachelor of Science in Computer Science"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Institution</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.institution}
                                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                    placeholder="e.g., BRAC University"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g., Dhaka"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Year</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    placeholder="e.g., 2023"
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    {editingId ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EducationManager;
