
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../Modal/Modal';
import ItemListViewer from './ItemListViewer'; // Import ItemListViewer from its new file
import './PlayerDetails.css';

interface Player {
    id: string; // user_idx
    userIndex: string; // user_idx
    charIndex: string; // char_idx
    nickname: string;
    status: string;
    lastIp: string;
    banStatus: string;
    // Add more fields as needed from your data
    level?: number;
    class?: string;
    creationDate?: string;
}

interface PlayerDetailsProps {
    player: Player | null;
    onStatusChange: (updatedPlayer: Player) => void; // Callback for status change
    selectedDbId: string; // Add selectedDbId prop
}

const PlayerDetails: React.FC<PlayerDetailsProps> = ({ player, onStatusChange, selectedDbId }) => {
    const [itemId, setItemId] = useState('');
    const [itemQuantity, setItemQuantity] = useState(1);
    const [itemType, setItemType] = useState('consumable'); // 'consumable' or 'equipment'
    const [itemInfo, setItemInfo] = useState<any>(null);
    const [itemLookupLoading, setItemLookupLoading] = useState(false);
    const [isItemViewerOpen, setIsItemViewerOpen] = useState(false); // State for ItemListViewer modal

    useEffect(() => {
        const lookupItem = async () => {
            if (!itemId) {
                setItemInfo(null);
                return;
            }
            setItemLookupLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/api/items/lookup/${itemId}`, {
                    headers: { 'x-auth-token': token }
                });
                setItemInfo(response.data);
                setItemType(response.data.type); // Set item type automatically
            } catch (error) {
                console.error('Item lookup failed', error);
                setItemInfo({ name: 'Not Found', description: '' });
            } finally {
                setItemLookupLoading(false);
            }
        };

        const timerId = setTimeout(() => {
            lookupItem();
        }, 500); // Debounce lookup

        return () => clearTimeout(timerId);
    }, [itemId]);

    if (!player) {
        return <div>Loading details...</div>;
    }

    const handleStatusChange = async (newStatus: string) => {
        if (!window.confirm(`Are you sure you want to change ${player.nickname}'s status to ${newStatus}?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:3000/api/players/${player.id}/status`,
                { status: newStatus, dbId: selectedDbId },
                { headers: { 'x-auth-token': token } }
            );
            alert(response.data.msg);
            onStatusChange(response.data.player); // Update parent state
        } catch (error) {
            console.error('Failed to update player status', error);
            alert('Failed to update player status.');
        }
    };

    const handleItemAction = async (action: 'give' | 'take') => {
        if (!itemId || itemQuantity <= 0) {
            alert('Please enter a valid Item ID and Quantity.');
            return;
        }

        if (!itemInfo || itemInfo.name === 'Not Found') {
            alert('Please lookup a valid Item ID first.');
            return;
        }

        if (!window.confirm(`Are you sure you want to ${action} ${itemQuantity} of ${itemInfo.name} (ID: ${itemId}) ${action === 'give' ? 'to' : 'from'} ${player.nickname}?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:3000/api/items/${action}`,
                {
                    userIndex: player.userIndex,
                    charIndex: player.charIndex,
                    dbId: selectedDbId,
                    itemId: parseInt(itemId),
                    itemType: itemInfo.type === 'consumable' || itemInfo.type === 'equipment' ? itemInfo.type : 'consumable', // Ensure valid type
                    quantity: itemQuantity,
                },
                { headers: { 'x-auth-token': token } }
            );
            alert(response.data.msg);
            // Optionally, refresh player inventory data here if implemented
        } catch (error: any) {
            console.error(`Failed to ${action} item`, error);
            alert(`Failed to ${action} item: ${error.response?.data?.msg || error.message}`);
        }
    };

    const handleItemSelect = (selectedItemId: string) => {
        setItemId(selectedItemId);
        setIsItemViewerOpen(false);
    };

    return (
        <div className="player-details">
            <h3>Player Details: {player.nickname}</h3>
            <div className="details-grid">
                <div className="detail-item"><strong>UserIndex:</strong> {player.userIndex}</div>
                <div className="detail-item"><strong>CharIndex:</strong> {player.charIndex}</div>
                <div className="detail-item"><strong>Nickname:</strong> {player.nickname}</div>
                <div className="detail-item"><strong>Status:</strong> {player.status}</div>
                <div className="detail-item"><strong>Ban Status:</strong> {player.banStatus}</div>
                <div className="detail-item"><strong>Last IP:</strong> {player.lastIp}</div>
                <div className="detail-item"><strong>Level:</strong> {player.level || 'N/A'}</div>
                <div className="detail-item"><strong>Class:</strong> {player.class || 'N/A'}</div>
                <div className="detail-item"><strong>Creation Date:</strong> {player.creationDate || 'N/A'}</div>
            </div>
            <div className="details-actions">
                <button
                    className="action-button"
                    onClick={() => handleStatusChange('Locked')}
                    disabled={player.status === 'Locked'}
                >
                    Lock Account
                </button>
                <button
                    className="action-button secondary"
                    onClick={() => handleStatusChange('Active')}
                    disabled={player.status === 'Active'}
                >
                    Unlock Account
                </button>
            </div>

            <div className="item-management-section">
                <h4>Item Management</h4>
                <div className="item-input-group">
                    <label htmlFor="itemId">Item ID:</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="number"
                            id="itemId"
                            value={itemId}
                            onChange={(e) => setItemId(e.target.value)}
                            placeholder="e.g., 1001"
                        />
                        <button type="button" className="btn btn-secondary" onClick={() => setIsItemViewerOpen(true)}>View Items</button>
                    </div>
                </div>
                {itemLookupLoading && <p>Loading item info...</p>}
                {itemInfo && itemInfo.name !== 'Not Found' && (
                    <div className="item-info-display">
                        <p><strong>Name:</strong> {itemInfo.name}</p>
                        <p><strong>Type:</strong> {itemInfo.type}</p>
                        <p><strong>Description:</strong> {itemInfo.description}</p>
                    </div>
                )}
                {itemInfo && itemInfo.name === 'Not Found' && (
                    <p className="error-message">Item ID not found.</p>
                )}
                <div className="item-input-group">
                    <label htmlFor="itemQuantity">Quantity:</label>
                    <input
                        type="number"
                        id="itemQuantity"
                        value={itemQuantity}
                        onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
                        min="1"
                    />
                </div>
                <div className="item-input-group">
                    <label htmlFor="itemType">Item Type:</label>
                    <select
                        id="itemType"
                        value={itemType}
                        onChange={(e) => setItemType(e.target.value)}
                        disabled={itemInfo && itemInfo.name !== 'Not Found'} // Disable if info is loaded
                    >
                        <option value="consumable">Consumable</option>
                        <option value="equipment">Equipment</option>
                    </select>
                </div>
                <div className="item-action-buttons">
                    <button onClick={() => handleItemAction('give')} className="btn btn-primary">Give Item</button>
                </div>
            </div>

            <Modal isOpen={isItemViewerOpen} onClose={() => setIsItemViewerOpen(false)}>
                <ItemListViewer onSelectItem={handleItemSelect} />
            </Modal>
        </div>
    );
};

export default PlayerDetails;
