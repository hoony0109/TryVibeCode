
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
    const [currentSearchTerm, setCurrentSearchTerm] = useState(''); // New state for actual search
    const [loading, setLoading] = useState(false); // Set initial loading to false
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [selectedDbId, setSelectedDbId] = useState('w07_gamedb'); // Default DB ID
    const [availableDbIds, setAvailableDbIds] = useState<string[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 30;
    const [totalPlayers, setTotalPlayers] = useState(0);
    const totalPages = Math.ceil(totalPlayers / itemsPerPage);

    // Calculate page numbers to display
    const pageRange = 10; // Number of pages to show at once
    const startPage = Math.floor((currentPage - 1) / pageRange) * pageRange + 1;
    const endPage = Math.min(startPage + pageRange - 1, totalPages);

    useEffect(() => {
        // Fetch available DB IDs from backend
        const fetchDbIds = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/players/db-ids', {
                    headers: { 'x-auth-token': token }
                });
                setAvailableDbIds(response.data);
                if (response.data.length > 0 && !response.data.includes(selectedDbId)) {
                    setSelectedDbId(response.data[0]); // Set first available as default if current is invalid
                }
            } catch (error: any) {
                console.error('Failed to fetch available DB IDs', error);
                if (error.response && error.response.status === 401) {
                    alert('Session expired or unauthorized. Please log in again.');
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };
        fetchDbIds();
    }, []);

    useEffect(() => {
        if (!selectedDbId) return; // Don't fetch if no DB is selected

        const fetchPlayers = async () => {
            // Only fetch if there's a search term
            if (currentSearchTerm.trim() === '') {
                setPlayers([]); // Clear players if search term is empty
                setTotalPlayers(0);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/api/players?search=${currentSearchTerm}&dbId=${selectedDbId}&page=${currentPage}&limit=${itemsPerPage}`, {
                    headers: { 'x-auth-token': token }
                });
                // API 응답에서 user_idx를 id로, char_idx를 charIndex로 매핑
                setPlayers(response.data.players.map((p: any) => ({
                    id: p.id, // user_idx
                    userIndex: p.userIndex,
                    charIndex: p.charIndex || 'N/A', // char_info가 없을 경우 대비
                    nickname: p.nickname,
                    status: p.status,
                    lastIp: p.lastIp,
                    banStatus: p.banStatus,
                })));
                setTotalPlayers(response.data.totalPlayers);
            } catch (error: any) {
                console.error('Failed to fetch players', error);
                if (error.response && error.response.status === 401) {
                    alert('Session expired or unauthorized. Please log in again.');
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
            setLoading(false);
        };

        fetchPlayers();
    }, [currentSearchTerm, selectedDbId, currentPage]); // currentSearchTerm으로 변경

    const handleDetailsClick = async (userIndex: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/api/players/${userIndex}?dbId=${selectedDbId}`, {
                headers: { 'x-auth-token': token }
            });
            // API 응답에서 user_idx를 id로, char_idx를 charIndex로 매핑
            setSelectedPlayer({
                id: response.data.id, // user_idx
                userIndex: response.data.userIndex,
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
        } catch (error: any) {
            console.error('Failed to fetch player details', error);
            if (error.response && error.response.status === 401) {
                alert('Session expired or unauthorized. Please log in again.');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                alert('Could not fetch player details.');
            }
        }
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = () => {
        setCurrentSearchTerm(searchTerm);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handleDownloadCSV = async () => {
        if (!selectedDbId) {
            alert('Please select a Game DB first.');
            return;
        }
        if (currentSearchTerm.trim() === '') {
            alert('Please enter a search term to download CSV.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/api/players?search=${currentSearchTerm}&dbId=${selectedDbId}&all=true`, {
                headers: { 'x-auth-token': token }
            });
            const allPlayers = response.data.players;

            if (allPlayers.length === 0) {
                alert('No players found for the current search term to download.');
                return;
            }

            // Convert JSON to CSV
            const headers = ['UserIndex', 'CharIndex', 'Nickname', 'Status', 'Last IP', 'Ban Status'];
            const csvRows = [];
            csvRows.push(headers.join(',')); // Add headers

            for (const player of allPlayers) {
                csvRows.push([
                    player.userIndex,
                    player.charIndex,
                    `"${player.nickname.replace(/"/g, '""')}"`,
                    player.status,
                    player.lastIp,
                    player.banStatus,
                ].join(','));
            }

            const csvString = csvRows.join('\n');
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `players_${selectedDbId}_${currentSearchTerm}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            alert('CSV downloaded successfully!');

        } catch (error: any) {
            console.error('Failed to download CSV', error);
            if (error.response && error.response.status === 401) {
                alert('Session expired or unauthorized. Please log in again.');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                alert(`Failed to download CSV: ${error.response?.data?.msg || error.message}`);
            }
        }
    };

    return (
        <div className="player-management-page">
            <div className="search-controls">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by UserIndex or Nickname..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }} // Add Enter key support
                    />
                    <button className="search-button" onClick={handleSearch}>Search</button>
                </div>
                <div className="db-selector">
                    <label htmlFor="db-select">Select Game DB:</label>
                    <select 
                        id="db-select"
                        value={selectedDbId}
                        onChange={(e) => setSelectedDbId(e.target.value)}
                    >
                        {availableDbIds.map(dbId => (
                            <option key={dbId} value={dbId}>{dbId}</option>
                        ))}
                    </select>
                </div>
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

            <div className="pagination">
                <button 
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="pagination-first-last"
                >
                    First
                </button>
                <button 
                    onClick={() => handlePageChange(Math.max(1, currentPage - pageRange))}
                    disabled={currentPage === 1}
                    className="pagination-block-move"
                >
                    Previous {pageRange}
                </button>
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-single-move"
                >
                    Previous
                </button>
                {startPage > 1 && <span className="pagination-ellipsis">...</span>}
                {[...Array(endPage - startPage + 1)].map((_, index) => (
                    <button 
                        key={startPage + index}
                        onClick={() => handlePageChange(startPage + index)}
                        className={currentPage === startPage + index ? 'active' : ''}
                    >
                        {startPage + index}
                    </button>
                ))}
                {endPage < totalPages && <span className="pagination-ellipsis">...</span>}
                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-single-move"
                >
                    Next
                </button>
                <button 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + pageRange))}
                    disabled={currentPage === totalPages}
                    className="pagination-block-move"
                >
                    Next {pageRange}
                </button>
                <button 
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="pagination-first-last"
                >
                    Last
                </button>
            </div>

            <div className="download-section">
                <button className="action-button" onClick={handleDownloadCSV}>Download CSV</button>
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
                    selectedDbId={selectedDbId} // Pass selectedDbId to PlayerDetails
                />
            </Modal>
        </div>
    );
};

export default PlayerManagementPage;
