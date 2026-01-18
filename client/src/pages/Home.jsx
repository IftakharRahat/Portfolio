import { useState, useEffect } from 'react';
import { api, getImageUrl } from '../api';

function Home() {
    const [experiences, setExperiences] = useState([]);
    const [education, setEducation] = useState([]);
    const [projects, setProjects] = useState([]);
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        // Load saved theme or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    useEffect(() => {
        loadData();
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const loadData = async () => {
        try {
            const [exp, edu, proj] = await Promise.all([
                api.getExperiences(),
                api.getEducation(),
                api.getProjects()
            ]);
            setExperiences(exp);
            setEducation(edu);
            setProjects(proj);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const skills = [
        { icon: '🎨', title: 'UX & UI', desc: 'Designing interfaces that are intuitive, efficient, and enjoyable to use.' },
        { icon: '📱', title: 'Web & Mobile App', desc: 'Transforming ideas into exceptional web and mobile app experiences.' },
        { icon: '✨', title: 'Design & Creative', desc: 'Bringing your vision to life with the latest technology and trends.' },
        { icon: '💻', title: 'Development', desc: 'Building robust, scalable solutions with modern frameworks.' }
    ];

    return (
        <div className="home">
            {/* Header */}
            <header className="header">
                <div className="container header-content">
                    <div className="header-left">
                        <span className="header-email">iftakharrahat71@gmail.com</span>
                        <div className="header-actions">
                            <button className="btn" onClick={() => navigator.clipboard.writeText('iftakharrahat71@gmail.com')}>
                                📋 Copy
                            </button>
                        </div>
                    </div>
                    <div className="social-links">
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        <a href="https://github.com/IftakharRahat" target="_blank" rel="noopener noreferrer">GitHub</a>
                        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="hero">
                <div className="container">
                    <img src="/Portfolio.jpg" alt="Iftakhar Rahat" className="hero-avatar" />
                    <p className="hero-name">
                        <span>👋</span> Iftakhar Rahat
                    </p>
                    <h1 className="hero-title">
                        Building digital <span>products, brands,</span> and experience.
                    </h1>
                    <div className="hero-cta">
                        <a href="#projects" className="btn btn-primary">
                            Latest Shots ↗
                        </a>
                    </div>
                </div>
            </section>

            {/* Brands/Companies */}
            <section className="brands">
                {experiences.slice(0, 5).map((exp) => (
                    <div key={exp.id} className="brand-item">
                        {exp.logo ? (
                            <img src={getImageUrl(exp.logo)} alt={exp.company} className="brand-logo" />
                        ) : (
                            <span style={{ fontWeight: 500, opacity: 0.6 }}>{exp.company}</span>
                        )}
                    </div>
                ))}
            </section>

            {/* Services */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-subtitle">✨ Services</span>
                        <h2 className="section-title">
                            Collaborate with brands and agencies to create impactful results.
                        </h2>
                    </div>
                    <div className="services-grid">
                        {skills.map((skill, index) => (
                            <div key={index} className="service-card">
                                <div className="service-icon">{skill.icon}</div>
                                <h3 className="service-title">{skill.title}</h3>
                                <p className="service-desc">{skill.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience */}
            <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-subtitle">💼 Experience</span>
                        <h2 className="section-title">Professional Journey</h2>
                    </div>
                    <div className="experience-list">
                        {experiences.map((exp) => (
                            <div key={exp.id} className="experience-card">
                                {exp.logo ? (
                                    <img src={getImageUrl(exp.logo)} alt={exp.company} className="experience-logo" />
                                ) : (
                                    <div className="experience-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                                        💼
                                    </div>
                                )}
                                <div className="experience-content">
                                    <div className="experience-header">
                                        <div>
                                            <h3 className="experience-title">{exp.title}</h3>
                                            <p className="experience-company">{exp.company} | {exp.location}</p>
                                        </div>
                                        <span className="experience-date">{exp.start_date} – {exp.end_date}</span>
                                    </div>
                                    {exp.description && exp.description.length > 0 && (
                                        <ul className="experience-desc">
                                            {exp.description.map((item, idx) => (
                                                <li key={idx}>{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Education */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-subtitle">🎓 Education</span>
                        <h2 className="section-title">Academic Background</h2>
                    </div>
                    <div className="education-list">
                        {education.map((edu) => (
                            <div key={edu.id} className="education-card">
                                {edu.logo ? (
                                    <img src={getImageUrl(edu.logo)} alt={edu.institution} className="education-logo" />
                                ) : (
                                    <div className="education-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                                        🎓
                                    </div>
                                )}
                                <div className="education-content">
                                    <h3 className="education-degree">{edu.degree}</h3>
                                    <p className="education-institution">{edu.institution}, {edu.location}</p>
                                    <p className="education-year">{edu.year}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects */}
            <section id="projects" className="section" style={{ background: 'var(--color-bg-alt)' }}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-subtitle">🚀 Recent Work</span>
                        <h2 className="section-title">Featured Projects</h2>
                    </div>
                    <div className="projects-grid">
                        {projects.map((project) => (
                            <a
                                key={project.id}
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-card"
                            >
                                {project.image ? (
                                    <img src={getImageUrl(project.image)} alt={project.title} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ fontSize: '48px' }}>🖼️</span>
                                    </div>
                                )}
                                <div className="project-overlay">
                                    <div>
                                        <h3 className="project-title">{project.title}</h3>
                                        <p className="project-desc">{project.description}</p>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section className="contact">
                <div className="container">
                    <div style={{ fontSize: '64px', marginBottom: '24px' }}>🤝</div>
                    <h2 className="contact-title">Tell me about your<br />next project</h2>
                    <a href="mailto:iftakharrahat71@gmail.com" className="btn btn-primary">
                        Get in Touch ↗
                    </a>
                    <div className="contact-info">
                        <span className="contact-item">📍 Dhaka, 1212, Bangladesh</span>
                        <span className="contact-item">📞 01716399471</span>
                        <span className="contact-item">✉️ iftakharrahat71@gmail.com</span>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container footer-content">
                    <p className="footer-copy">© 2024 Iftakhar Rahat. All rights reserved.</p>
                    <div className="social-links">
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
                        <a href="/admin">Admin</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;
