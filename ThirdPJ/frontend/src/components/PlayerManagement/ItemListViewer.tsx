
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
            console.log('[DEBUG - ItemListViewer] Fetching all items...');
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/items/all', {
                    headers: { 'x-auth-token': token }
                });
                console.log('[DEBUG - ItemListViewer] API Response Data:', response.data);
                setAllItems(response.data);
                setFilteredItems(response.data);
            } catch (error) {
                console.error('[DEBUG - ItemListViewer] Failed to fetch all items', error);
                alert('Failed to fetch all items.');
            }
            setLoading(false);
            console.log('[DEBUG - ItemListViewer] Loading finished. Total items:', allItems.length);
        };
        fetchAllItems();
    }, []);

    useEffect(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filteredData = allItems.filter(item =>
            (item.name_kor ?? '').toLowerCase().includes(lowercasedFilter) ||
            (item.id ?? '').toString().includes(lowercasedFilter)
        );
        setFilteredItems(filteredData);
        console.log('[DEBUG - ItemListViewer] Filtered items count:', filteredItems.length);
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
                    {filteredItems.length === 0 ? (
                        <p>No items found.</p>
                    ) : (
                        filteredItems.map((item, index) => (
                            <li key={`${item.id}-${index}`} onClick={() => onSelectItem(item.id)}>
                                <span>{item.name_kor || '[No Name]'}</span>
                                <span className="item-id">({item.id})</span>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

export default ItemListViewer;
