const isDev = import.meta.env.MODE === 'development';
const API_URL = import.meta.env.VITE_API_URL || (isDev ? 'http://localhost:3001/api' : '/api');
const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || (isDev ? 'http://localhost:3001' : '');

export const api = {
    // Auth
    login: async (username, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) throw new Error('Invalid credentials');
        return res.json();
    },

    // Experience
    getExperiences: async () => {
        const res = await fetch(`${API_URL}/experience`);
        return res.json();
    },

    createExperience: async (formData, token) => {
        const res = await fetch(`${API_URL}/experience`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        return res.json();
    },

    updateExperience: async (id, formData, token) => {
        const res = await fetch(`${API_URL}/experience/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        return res.json();
    },

    deleteExperience: async (id, token) => {
        const res = await fetch(`${API_URL}/experience/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.json();
    },

    // Education
    getEducation: async () => {
        const res = await fetch(`${API_URL}/education`);
        return res.json();
    },

    createEducation: async (formData, token) => {
        const res = await fetch(`${API_URL}/education`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        return res.json();
    },

    updateEducation: async (id, formData, token) => {
        const res = await fetch(`${API_URL}/education/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        return res.json();
    },

    deleteEducation: async (id, token) => {
        const res = await fetch(`${API_URL}/education/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.json();
    },

    // Projects
    getProjects: async () => {
        const res = await fetch(`${API_URL}/projects`);
        return res.json();
    },

    createProject: async (formData, token) => {
        const res = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        return res.json();
    },

    updateProject: async (id, formData, token) => {
        const res = await fetch(`${API_URL}/projects/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        return res.json();
    },

    deleteProject: async (id, token) => {
        const res = await fetch(`${API_URL}/projects/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.json();
    }
};

export const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${BASE_URL}${path}`;
};
