
import React from 'react';
import axios from 'axios'; // Add this line
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
}

const PlayerDetails: React.FC<PlayerDetailsProps> = ({ player, onStatusChange }) => {
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
                { status: newStatus },
                { headers: { 'x-auth-token': token } }
            );
            alert(response.data.msg);
            onStatusChange(response.data.player); // Update parent state
        } catch (error) {
            console.error('Failed to update player status', error);
            alert('Failed to update player status.');
        }
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
                {/* Example of other potential fields */}
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
                {/* Add more action buttons as needed */}
            </div>
        </div>
    );
};

export default PlayerDetails;
