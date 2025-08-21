
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../Modal/Modal';
import NoticeForm from './NoticeForm'; // We will create this component next

interface Notice {
    id: number;
    type: string;
    title: string;
    author: string;
    start_time: string;
    end_time: string;
    is_active: boolean;
}

const NoticeManagementPage: React.FC = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

    useEffect(() => {
        const fetchNotices = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/notices', {
                    headers: { 'x-auth-token': token }
                });
                setNotices(response.data);
            } catch (error) {
                console.error('Failed to fetch notices', error);
                alert('Failed to fetch notices. Please try again.');
            }
            setLoading(false);
        };

        fetchNotices();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const handleAddNewNotice = () => {
        setSelectedNotice(null);
        setIsModalOpen(true);
    };

    const handleEditNotice = (notice: Notice) => {
        setSelectedNotice(notice);
        setIsModalOpen(true);
    };

    const handleDeleteNotice = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this notice?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/api/notices/${id}`, {
                headers: { 'x-auth-token': token }
            });
            setNotices(notices.filter(n => n.id !== id));
            alert('Notice deleted successfully.');
        } catch (error) {
            console.error('Failed to delete notice', error);
            alert('Failed to delete notice.');
        }
    };

    const handleFormSubmit = (notice: Notice) => {
        if (selectedNotice) {
            // Update existing notice
            setNotices(notices.map(n => n.id === notice.id ? notice : n));
        } else {
            // Add new notice
            setNotices([notice, ...notices]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="notice-management-page">
            
            <div className="toolbar">
                <button className="btn btn-primary" onClick={handleAddNewNotice}>Add New Notice</button>
            </div>
            {loading ? (
                <p>Loading notices...</p>
            ) : (
                <div className="notice-table-container">
                    <table className="notice-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Type</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notices.map(notice => (
                                <tr key={notice.id}>
                                    <td>{notice.id}</td>
                                    <td>{notice.type}</td>
                                    <td>{notice.title}</td>
                                    <td>{notice.author}</td>
                                    <td>{formatDate(notice.start_time)}</td>
                                    <td>{formatDate(notice.end_time)}</td>
                                    <td>
                                        <span className={`status-badge ${notice.is_active ? 'active' : 'inactive'}`}>
                                            {notice.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-secondary" onClick={() => handleEditNotice(notice)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDeleteNotice(notice.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <NoticeForm 
                    notice={selectedNotice} 
                    onSubmit={handleFormSubmit} 
                    onClose={() => setIsModalOpen(false)} // Pass onClose prop
                />
            </Modal>
        </div>
    );
};

export default NoticeManagementPage;
