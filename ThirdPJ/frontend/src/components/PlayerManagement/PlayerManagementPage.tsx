
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../Modal/Modal';
import PlayerDetails from './PlayerDetails';
import './PlayerManagementPage.css';

interface Player {
    id: string; // user_idx
    userIndex: string; // user_idx
    charIndex: string; // char_idx
    nickname: string;
    status: string;
    lastIp: string;
    banStatus: string;
}

const PlayerManagementPage: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

    useEffect(() => {
        const fetchPlayers = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/api/players?search=${searchTerm}`, {
                    headers: { 'x-auth-token': token }
                });
                // API 응답에서 user_idx를 id로, char_idx를 charIndex로 매핑
                setPlayers(response.data.map((p: any) => ({
                    id: p.id, // user_idx
                    userIndex: p.id,
                    charIndex: p.charIndex || 'N/A', // char_info가 없을 경우 대비
                    nickname: p.nickname,
                    status: p.status,
                    lastIp: p.lastIp,
                    banStatus: p.banStatus,
                })));
            } catch (error) {
                console.error('Failed to fetch players', error);
            }
            setLoading(false);
        };

        const timerId = setTimeout(() => {
            fetchPlayers();
        }, 500);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    const handleDetailsClick = async (userIndex: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/api/players/${userIndex}`, {
                headers: { 'x-auth-token': token }
            });
            // API 응답에서 user_idx를 id로, char_idx를 charIndex로 매핑
            setSelectedPlayer({
                id: response.data.id, // user_idx
                userIndex: response.data.id,
                charIndex: response.data.charIndex || 'N/A',
                nickname: response.data.nickname,
                status: response.data.status,
                lastIp: response.data.lastIp,
                banStatus: response.data.banStatus,
                level: response.data.level,
                class: response.data.class,
                creationDate: response.data.creationDate,
            });
            setIsModalOpen(true);
        } catch (error) {
            console.error('Failed to fetch player details', error);
            alert('Could not fetch player details.');
        }
    };

    return (
        <div className="player-management-page">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by UserIndex or Nickname..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="player-table-container">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="player-table">
                        <thead>
                            <tr>
                                <th>UserIndex</th>
                                <th>CharIndex</th>
                                <th>Nickname</th>
                                <th>Status</th>
                                <th>Last IP</th>
                                <th>Ban Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map(player => (
                                <tr key={player.id}>
                                    <td>{player.userIndex}</td>
                                    <td>{player.charIndex}</td>
                                    <td>{player.nickname}</td>
                                    <td>{player.status}</td>
                                    <td>{player.lastIp}</td>
                                    <td>{player.banStatus}</td>
                                    <td>
                                        <button onClick={() => handleDetailsClick(player.id)} className="action-button">Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <PlayerDetails 
                    player={selectedPlayer} 
                    onStatusChange={(updatedPlayer) => {
                        setSelectedPlayer(updatedPlayer);
                        setPlayers(prevPlayers => 
                            prevPlayers.map(p => p.id === updatedPlayer.id ? updatedPlayer : p)
                        );
                    }}
                />
            </Modal>
        </div>
    );
};

export default PlayerManagementPage;
