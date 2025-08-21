import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContentAccessManagementPage.css'; // Create this CSS file later

interface ContentControl {
    id: number;
    content_name: string;
    is_enabled: boolean;
    last_updated_by: string;
    last_updated_at: string;
}

const ContentAccessManagementPage: React.FC = () => {
    const [contentControls, setContentControls] = useState<ContentControl[]>([]);
    const [loading, setLoading] = useState(true);
    const [newContentName, setNewContentName] = useState('');

    const fetchContentControls = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/content-access', {
                headers: { 'x-auth-token': token }
            });
            setContentControls(response.data);
        } catch (error) {
            console.error('Failed to fetch content controls', error);
            alert('Failed to fetch content controls. Please try again.');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchContentControls();
    }, []);

    const handleToggleEnabled = async (control: ContentControl) => {
        const newIsEnabled = !control.is_enabled;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:3000/api/content-access/${control.id}`, 
                { is_enabled: newIsEnabled },
                { headers: { 'x-auth-token': token } }
            );
            setContentControls(prevControls => 
                prevControls.map(c => c.id === control.id ? response.data : c)
            );
            alert(`Content '${control.content_name}' ${newIsEnabled ? 'enabled' : 'disabled'} successfully.`);
        } catch (error) {
            console.error('Failed to toggle content enabled status', error);
            alert('Failed to toggle content enabled status. Please try again.');
        }
    };

    const handleAddContent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newContentName.trim()) {
            alert('Content name cannot be empty.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            // This is a placeholder for adding new content. 
            // In a real scenario, you might have a dedicated API for adding new content types.
            // For now, we'll simulate adding it directly to the DB via a backend route if it doesn't exist.
            // This part needs a backend API to insert new content_name into content_access_control table.
            // For simplicity, we will assume a POST endpoint for adding new content.
            const response = await axios.post('http://localhost:3000/api/content-access/add', 
                { content_name: newContentName },
                { headers: { 'x-auth-token': token } }
            );
            setContentControls(prevControls => [...prevControls, response.data]);
            setNewContentName('');
            alert(`Content '${newContentName}' added successfully.`);
        } catch (error) {
            console.error('Failed to add new content', error);
            alert('Failed to add new content. Please ensure it does not already exist.');
        }
    };

    return (
        <div className="content-access-management-page">
            

            <form onSubmit={handleAddContent} className="add-content-form">
                <input
                    type="text"
                    placeholder="New Content Name (e.g., Dungeon A)"
                    value={newContentName}
                    onChange={(e) => setNewContentName(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-primary">Add New Content</button>
            </form>

            {loading ? (
                <p>Loading content controls...</p>
            ) : (
                <table className="content-control-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Content Name</th>
                            <th>Status</th>
                            <th>Last Updated By</th>
                            <th>Last Updated At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contentControls.map(control => (
                            <tr key={control.id}>
                                <td>{control.id}</td>
                                <td>{control.content_name}</td>
                                <td>
                                    <span className={`status-badge ${control.is_enabled ? 'active' : 'inactive'}`}>
                                        {control.is_enabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                </td>
                                <td>{control.last_updated_by}</td>
                                <td>{new Date(control.last_updated_at).toLocaleString()}</td>
                                <td>
                                    <button 
                                        className={`btn ${control.is_enabled ? 'btn-danger' : 'btn-success'}`}
                                        onClick={() => handleToggleEnabled(control)}
                                    >
                                        {control.is_enabled ? 'Disable' : 'Enable'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ContentAccessManagementPage;
