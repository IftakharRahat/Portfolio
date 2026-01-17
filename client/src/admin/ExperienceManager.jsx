import { useState, useEffect } from 'react';
import { api, getImageUrl } from '../api';

function ExperienceManager() {
    const [experiences, setExperiences] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        start_date: '',
        end_date: '',
        description: ''
    });
    const [logo, setLogo] = useState(null);

    useEffect(() => {
        loadExperiences();
    }, []);

    const loadExperiences = async () => {
        const data = await api.getExperiences();
        setExperiences(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const data = new FormData();
        data.append('title', formData.title);
        data.append('company', formData.company);
        data.append('location', formData.location);
        data.append('start_date', formData.start_date);
        data.append('end_date', formData.end_date);
        data.append('description', JSON.stringify(formData.description.split('\n').filter(line => line.trim())));
        if (logo) data.append('logo', logo);

        try {
            if (editingId) {
                await api.updateExperience(editingId, data, token);
            } else {
                await api.createExperience(data, token);
            }
            closeModal();
            loadExperiences();
        } catch (error) {
            console.error('Error saving experience:', error);
        }
    };

    const handleEdit = (exp) => {
        setEditingId(exp.id);
        setFormData({
            title: exp.title,
            company: exp.company,
            location: exp.location || '',
            start_date: exp.start_date || '',
            end_date: exp.end_date || '',
            description: Array.isArray(exp.description) ? exp.description.join('\n') : ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this experience?')) return;
        const token = localStorage.getItem('token');
        await api.deleteExperience(id, token);
        loadExperiences();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ title: '', company: '', location: '', start_date: '', end_date: '', description: '' });
        setLogo(null);
    };

    return (
        <div>
            <div className="admin-header">
                <h1 className="admin-title">Experience</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    + Add Experience
                </button>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Logo</th>
                        <th>Title</th>
                        <th>Company</th>
                        <th>Duration</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {experiences.map((exp) => (
                        <tr key={exp.id}>
                            <td>
                                {exp.logo ? (
                                    <img src={getImageUrl(exp.logo)} alt={exp.company} />
                                ) : (
                                    <div style={{ width: 48, height: 48, background: 'var(--color-bg-alt)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💼</div>
                                )}
                            </td>
                            <td>{exp.title}</td>
                            <td>{exp.company}</td>
                            <td>{exp.start_date} - {exp.end_date}</td>
                            <td>
                                <div className="action-buttons">
                                    <button className="btn-icon" onClick={() => handleEdit(exp)}>✏️</button>
                                    <button className="btn-icon btn-danger" onClick={() => handleDelete(exp.id)}>🗑️</button>
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
                            <h2 className="modal-title">{editingId ? 'Edit' : 'Add'} Experience</h2>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Company Logo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setLogo(e.target.files[0])}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Job Title</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Company Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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
                                    placeholder="e.g., Dhaka, Bangladesh"
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Start Date</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                        placeholder="e.g., Oct 2023"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">End Date</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                        placeholder="e.g., Present"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description (one bullet point per line)</label>
                                <textarea
                                    className="form-textarea"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter each responsibility on a new line"
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

export default ExperienceManager;
