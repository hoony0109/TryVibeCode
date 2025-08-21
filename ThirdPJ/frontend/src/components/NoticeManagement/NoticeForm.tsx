
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Notice {
    id: number;
    type: string;
    title: string;
    content: string;
    start_time: string;
    end_time: string;
    is_active: boolean;
    world_id?: string;
    is_repeating?: boolean;
    repeat_cycle?: number;
}

interface World {
    id: number;
    name: string;
}

interface NoticeFormProps {
    notice: Notice | null;
    onSubmit: (notice: Notice) => void;
    onClose: () => void; // Add onClose prop
}

const getInitialFormData = () => {
    const now = new Date();
    now.setSeconds(now.getSeconds() + 10);
    const adjustedDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    const formattedStartTime = adjustedDate.toISOString().slice(0, 16);

    const endDate = new Date(now.getTime());
    endDate.setHours(endDate.getHours() + 1);
    const adjustedEndDate = new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60000));
    const formattedEndTime = adjustedEndDate.toISOString().slice(0, 16);

    return {
        type: 'normal',
        title: '',
        content: '',
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        isActive: true,
        worldId: '',
        isRepeating: false,
        repeatCycle: 60,
    };
};

const NoticeForm: React.FC<NoticeFormProps> = ({ notice, onSubmit, onClose }) => {
    const [formData, setFormData] = useState(getInitialFormData());
    const [worlds, setWorlds] = useState<World[]>([]);

    useEffect(() => {
        const fetchWorlds = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/status/worlds', {
                    headers: { 'x-auth-token': token }
                });
                setWorlds(response.data);
            } catch (error) {
                console.error('Failed to fetch worlds', error);
            }
        };

        fetchWorlds();
    }, []);

    useEffect(() => {
        if (notice) {
            setFormData({
                type: notice.type,
                title: notice.title,
                content: notice.content,
                startTime: new Date(notice.start_time).toISOString().slice(0, 16),
                endTime: notice.end_time ? new Date(notice.end_time).toISOString().slice(0, 16) : '',
                isActive: notice.is_active,
                worldId: notice.world_id || '',
                isRepeating: notice.is_repeating || false,
                repeatCycle: notice.repeat_cycle || 60,
            });
        } else {
            setFormData(getInitialFormData());
        }
    }, [notice]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => {
            const newValues = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            };

            if (name === 'startTime') {
                const newStartDate = new Date(value);
                const newEndDate = new Date(newStartDate.getTime() + 60 * 60 * 1000); // Add 1 hour
                const adjustedEndDate = new Date(newEndDate.getTime() - (newEndDate.getTimezoneOffset() * 60000));
                newValues.endTime = adjustedEndDate.toISOString().slice(0, 16);
            }
            
            if (name === 'isRepeating' && type === 'checkbox' && !checked) {
                const newStartDate = new Date(newValues.startTime);
                const newEndDate = new Date(newStartDate.getTime() + 60 * 60 * 1000); // Add 1 hour
                const adjustedEndDate = new Date(newEndDate.getTime() - (newEndDate.getTimezoneOffset() * 60000));
                newValues.endTime = adjustedEndDate.toISOString().slice(0, 16);
            }

            return newValues;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            let response;
            if (notice) {
                // Update existing notice
                response = await axios.put(`http://localhost:3000/api/notices/${notice.id}`, formData, {
                    headers: { 'x-auth-token': token }
                });
            } else {
                // Create new notice
                response = await axios.post('http://localhost:3000/api/notices', formData, {
                    headers: { 'x-auth-token': token }
                });
            }
            onSubmit(response.data);
            alert(`Notice ${notice ? 'updated' : 'created'} successfully!`);
        } catch (error) {
            console.error('Failed to save notice', error);
            alert('Failed to save notice.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="notice-form">
            <h3>{notice ? 'Edit Notice' : 'Add New Notice'}</h3>
            <div className="form-group">
                <label>Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Content</label>
                <textarea name="content" value={formData.content} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>World ID</label>
                <select name="worldId" value={formData.worldId} onChange={handleChange}>
                    <option value="">All Servers</option>
                    {worlds.map((world: World) => (
                        <option key={world.id} value={world.id}>
                            {world.id}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group checkbox-group">
                <label>Repeat Notice</label>
                <input type="checkbox" name="isRepeating" checked={formData.isRepeating} onChange={handleChange} />
            </div>
            {formData.isRepeating && (
                <div className="form-group">
                    <label>Repeat Cycle (seconds)</label>
                    <input type="number" name="repeatCycle" value={formData.repeatCycle} onChange={handleChange} required />
                </div>
            )}
            <div className="form-group">
                <label>Start Time</label>
                <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} required />
            </div>
            {formData.isRepeating && (
                <div className="form-group">
                    <label>End Time</label>
                    <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} required />
                </div>
            )}
            <div className="form-group checkbox-group">
                <label>Active</label>
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
            </div>
            <div className="form-actions">
                <button type="submit" className="btn btn-primary">{notice ? 'Update' : 'Create'}</button>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            </div>
        </form>
    );
};

export default NoticeForm;
