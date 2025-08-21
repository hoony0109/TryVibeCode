
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../Modal/Modal';
import './CouponManagementPage.css'; // Import the new CSS file 

interface CouponEvent {
    id: number;
    event_name: string;
    quantity: number;
    start_date: string;
    end_date: string;
    author: string;
}

const CouponManagementPage: React.FC = () => {
    const [couponEvents, setCouponEvents] = useState<CouponEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCodesModalOpen, setIsCodesModalOpen] = useState(false);
    const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);

    useEffect(() => {
        fetchCouponEvents();
    }, []);

    const fetchCouponEvents = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/coupons', {
                headers: { 'x-auth-token': token }
            });
            setCouponEvents(response.data);
        } catch (error) {
            console.error('Failed to fetch coupon events', error);
            alert('Failed to fetch coupon events.');
        }
        setLoading(false);
    };

    const handleFormSubmit = () => {
        setIsModalOpen(false);
        fetchCouponEvents(); // Refresh the list after submission
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const handleViewCodes = (couponId: number) => {
        setSelectedCouponId(couponId);
        setIsCodesModalOpen(true);
    };

    return (
        <div className="coupon-management-page"> 
            <div className="toolbar">
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Create New Coupon Event</button>
            </div>
            {loading ? (
                <p>Loading coupon events...</p>
            ) : (
                <div className="coupon-table-container">
                    <table className="coupon-table"><thead><tr><th>ID</th><th>Event Name</th><th>Quantity</th><th>Author</th><th>Start Date</th><th>End Date</th><th>Actions</th></tr></thead><tbody>{couponEvents.map(event => (<tr key={event.id}><td>{event.id}</td><td>{event.event_name}</td><td>{event.quantity.toLocaleString()}</td><td>{event.author}</td><td>{formatDate(event.start_date)}</td><td>{formatDate(event.end_date)}</td><td><button className="btn btn-secondary" onClick={() => handleViewCodes(event.id)}>View Codes</button></td></tr>))}</tbody></table>
                </div>
            )}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <CouponForm onSubmit={handleFormSubmit} onClose={() => setIsModalOpen(false)} />
            </Modal>
            <Modal isOpen={isCodesModalOpen} onClose={() => setIsCodesModalOpen(false)} size="xlarge">
                <CouponCodesList couponId={selectedCouponId} onClose={() => setIsCodesModalOpen(false)} />
            </Modal>
        </div>
    );
};

// CouponForm Component (within the same file for simplicity)
interface CouponFormProps {
    onSubmit: () => void;
    onClose: () => void; // Add this line
}

const CouponForm: React.FC<CouponFormProps> = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        eventName: '',
        rewardItems: [{ itemId: '', quantity: 1 }],
        quantity: 100,
        usageLimit: 1,
        startDate: '',
        endDate: '',
    });

    const [isItemViewerOpen, setIsItemViewerOpen] = useState(false);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index: number, field: string, value: string) => {
        const newItems = [...formData.rewardItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData(prev => ({ ...prev, rewardItems: newItems }));
    };

    const addItem = () => {
        setFormData(prev => ({ ...prev, rewardItems: [...prev.rewardItems, { itemId: '', quantity: 1 }] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3000/api/coupons', formData, {
                headers: { 'x-auth-token': token }
            });
            alert('Coupon event created successfully!');
            onSubmit();
        } catch (error) {
            console.error('Failed to create coupon event', error);
            alert('Failed to create coupon event.');
        }
    };

    const handleItemSelect = (selectedItemId: string) => {
        handleItemChange(currentItemIndex, 'itemId', selectedItemId);
        setIsItemViewerOpen(false);
    };

    const openItemViewer = (index: number) => {
        setCurrentItemIndex(index);
        setIsItemViewerOpen(true);
    };

    return (
        <form onSubmit={handleSubmit} className="coupon-form">
            <h3>Create Coupon Event</h3>
            {/* ... other form groups ... */}
            <div className="form-group">
                <label>Event Name</label>
                <input type="text" name="eventName" value={formData.eventName} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Quantity</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required min="1" />
            </div>
            <div className="form-group">
                <label>Usage Limit per User</label>
                <input type="number" name="usageLimit" value={formData.usageLimit} onChange={handleChange} required min="1" />
            </div>
            <div className="form-group">
                <label>Start Date</label>
                <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>End Date</label>
                <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Reward Items</label>
                {formData.rewardItems.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <input type="text" placeholder="Item ID" value={item.itemId} onChange={(e) => handleItemChange(index, 'itemId', e.target.value)} required />
                        <input type="number" placeholder="Quantity" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} required min="1" style={{ maxWidth: '100px' }} />
                        <button type="button" onClick={() => openItemViewer(index)} className="btn btn-secondary">View Items</button>
                    </div>
                ))}
                <button type="button" onClick={addItem} className="btn btn-secondary">Add Another Item</button>
            </div>
            <div className="form-actions">
                <button type="submit" className="btn btn-primary">Create Event</button>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            </div>
            <Modal isOpen={isItemViewerOpen} onClose={() => setIsItemViewerOpen(false)}>
                <ItemListViewer onSelectItem={handleItemSelect} />
            </Modal>
        </form>
    );
};

// CouponCodesList Component
interface CouponCode {
    id: number;
    code: string;
    is_used: boolean;
    used_by_user_id: string | null;
    used_at: string | null;
}

interface CouponCodesListProps {
    couponId: number | null;
    onClose: () => void; // Add this line
}

const CouponCodesList: React.FC<CouponCodesListProps> = ({ couponId, onClose }) => {
    const [codes, setCodes] = useState<CouponCode[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!couponId) return;

        const fetchCodes = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/api/coupons/${couponId}/codes`, {
                    headers: { 'x-auth-token': token }
                });
                setCodes(response.data);
            } catch (error) {
                console.error('Failed to fetch coupon codes', error);
                alert('Failed to fetch coupon codes.');
            }
            setLoading(false);
        };

        fetchCodes();
    }, [couponId]);

    const downloadCSV = () => {
        if (codes.length === 0) return;
        const headers = ['Code', 'Is Used', 'Used By', 'Used At'];
        const csvRows = [headers.join(',')];
        codes.forEach(c => {
            csvRows.push([c.code, c.is_used, c.used_by_user_id || '', c.used_at || ''].join(','));
        });
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `coupon_codes_${couponId}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="coupon-form">
            <h3>Coupon Codes (Event ID: {couponId})</h3>
            <div className="form-actions" style={{ justifyContent: 'space-between', marginBottom: '15px' }}>
                <button onClick={downloadCSV} className="btn btn-primary">Download as CSV</button>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            </div>
            {loading ? (
                <p>Loading codes...</p>
            ) : (
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <table className="coupon-table"><thead><tr><th>Code</th><th>Is Used?</th><th>Used By</th><th>Used At</th></tr></thead><tbody>{codes.map(c => (<tr key={c.id}><td>{c.code}</td><td>{c.is_used ? 'Yes' : 'No'}</td><td>{c.used_by_user_id || 'N/A'}</td><td>{c.used_at ? new Date(c.used_at).toLocaleString() : 'N/A'}</td></tr>))}</tbody></table>
                </div>
            )}
        </div>
    );
};

// ItemListViewer Component
interface ItemInfo {
    id: string;
    name_kor: string;
}

interface ItemListViewerProps {
    onSelectItem: (itemId: string) => void;
}

const ItemListViewer: React.FC<ItemListViewerProps> = ({ onSelectItem }) => {
    const [allItems, setAllItems] = useState<ItemInfo[]>([]);
    const [filteredItems, setFilteredItems] = useState<ItemInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAllItems = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/items/all', {
                    headers: { 'x-auth-token': token }
                });
                setAllItems(response.data);
                setFilteredItems(response.data);
            } catch (error) {
                console.error('Failed to fetch all items', error);
                alert('Failed to fetch all items.');
            }
            setLoading(false);
        };
        fetchAllItems();
    }, []);

    useEffect(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filteredData = allItems.filter(item =>
            item.name_kor.toLowerCase().includes(lowercasedFilter) ||
            item.id.toString().includes(lowercasedFilter)
        );
        setFilteredItems(filteredData);
    }, [searchTerm, allItems]);

    return (
        <div className="item-viewer-container">
            <h3>Item List</h3>
            <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="item-search-input"
            />
            {loading ? (
                <p>Loading items...</p>
            ) : (
                <ul className="item-list">
                    {filteredItems.map(item => (
                        <li key={item.id} onClick={() => onSelectItem(item.id)}>
                            <span>{item.name_kor}</span>
                            <span className="item-id">({item.id})</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CouponManagementPage;
