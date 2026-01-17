import { useState, useEffect } from 'react';
import { api, getImageUrl } from '../api';

function ProjectsManager() {
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        link: ''
    });
    const [image, setImage] = useState(null);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        const data = await api.getProjects();
        setProjects(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('link', formData.link);
        if (image) data.append('image', image);

        try {
            if (editingId) {
                await api.updateProject(editingId, data, token);
            } else {
                await api.createProject(data, token);
            }
            closeModal();
            loadProjects();
        } catch (error) {
            console.error('Error saving project:', error);
        }
    };

    const handleEdit = (project) => {
        setEditingId(project.id);
        setFormData({
            title: project.title,
            description: project.description || '',
            link: project.link
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        const token = localStorage.getItem('token');
        await api.deleteProject(id, token);
        loadProjects();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ title: '', description: '', link: '' });
        setImage(null);
    };

    return (
        <div>
            <div className="admin-header">
                <h1 className="admin-title">Projects</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    + Add Project
                </button>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Link</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr key={project.id}>
                            <td>
                                {project.image ? (
                                    <img src={getImageUrl(project.image)} alt={project.title} />
                                ) : (
                                    <div style={{ width: 48, height: 48, background: 'var(--color-bg-alt)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🖼️</div>
                                )}
                            </td>
                            <td>{project.title}</td>
                            <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {project.description}
                            </td>
                            <td>
                                <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
                                    View ↗
                                </a>
                            </td>
                            <td>
                                <div className="action-buttons">
                                    <button className="btn-icon" onClick={() => handleEdit(project)}>✏️</button>
                                    <button className="btn-icon btn-danger" onClick={() => handleDelete(project.id)}>🗑️</button>
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
                            <h2 className="modal-title">{editingId ? 'Edit' : 'Add'} Project</h2>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Project Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    className="form-input"
                                />
                                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                                    This image will be clickable and redirect to the project link
                                </p>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Project Title</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., E-commerce Platform"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-textarea"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description of the project"
                                    style={{ minHeight: '80px' }}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Project Link</label>
                                <input
                                    type="url"
                                    className="form-input"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    placeholder="https://example.com"
                                    required
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

export default ProjectsManager;
