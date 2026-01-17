import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, NavLink } from 'react-router-dom';
import ExperienceManager from '../admin/ExperienceManager';
import EducationManager from '../admin/EducationManager';
import ProjectsManager from '../admin/ProjectsManager';

function AdminDashboard() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('username');

        if (!token) {
            navigate('/admin');
            return;
        }

        setUsername(user || 'Admin');
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/admin');
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-logo">Portfolio Admin</div>
                <nav className="admin-nav">
                    <NavLink
                        to="/admin/dashboard"
                        end
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        📊 Dashboard
                    </NavLink>
                    <NavLink
                        to="/admin/dashboard/experience"
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        💼 Experience
                    </NavLink>
                    <NavLink
                        to="/admin/dashboard/education"
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        🎓 Education
                    </NavLink>
                    <NavLink
                        to="/admin/dashboard/projects"
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        🚀 Projects
                    </NavLink>
                </nav>
                <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
                    <a href="/" className="admin-nav-item" target="_blank">
                        🌐 View Site
                    </a>
                    <button onClick={handleLogout} className="admin-nav-item" style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer' }}>
                        🚪 Logout
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <Routes>
                    <Route index element={<DashboardHome username={username} />} />
                    <Route path="experience" element={<ExperienceManager />} />
                    <Route path="education" element={<EducationManager />} />
                    <Route path="projects" element={<ProjectsManager />} />
                </Routes>
            </main>
        </div>
    );
}

function DashboardHome({ username }) {
    return (
        <div>
            <h1 className="admin-title">Welcome, {username}!</h1>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '16px' }}>
                Manage your portfolio content from here. Use the sidebar to navigate between sections.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '40px' }}>
                <NavLink to="/admin/dashboard/experience" className="service-card" style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>💼</div>
                    <h3 className="service-title">Experience</h3>
                    <p className="service-desc">Manage your work history</p>
                </NavLink>

                <NavLink to="/admin/dashboard/education" className="service-card" style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎓</div>
                    <h3 className="service-title">Education</h3>
                    <p className="service-desc">Manage your academic background</p>
                </NavLink>

                <NavLink to="/admin/dashboard/projects" className="service-card" style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>🚀</div>
                    <h3 className="service-title">Projects</h3>
                    <p className="service-desc">Manage your portfolio projects</p>
                </NavLink>
            </div>
        </div>
    );
}

export default AdminDashboard;
