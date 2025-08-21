import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../Modal/Modal'; // Import the Modal component
import './OperationManagementPage.css';

interface Admin {
  id: number;
  username: string;
  role: string;
  created_at: string;
}

const OperationManagementPage: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [newRole, setNewRole] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get<Admin[]>('/api/operations/admins');
      setAdmins(response.data);
    } catch (err) {
      console.error('Failed to fetch admins:', err);
      setError('운영자 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleRowClick = (admin: Admin) => {
    setSelectedAdmin(admin);
    setNewRole(admin.role); // Set initial role to current admin's role
    setIsModalOpen(true);
    setMessage(null); // Clear previous messages
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAdmin(null);
    setNewRole('');
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewRole(e.target.value);
  };

  const handleUpdateRole = async () => {
    if (!selectedAdmin) return;

    try {
      const response = await axios.put(`/api/operations/admins/${selectedAdmin.id}/role`, { role: newRole });
      setMessage(response.data.message || '권한이 성공적으로 업데이트되었습니다.');
      fetchAdmins(); // Re-fetch admins to update the list
      handleCloseModal();
    } catch (err: any) {
      console.error('Failed to update admin role:', err);
      setMessage(err.response?.data?.message || '권한 업데이트에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className="operation-management-page">로딩 중...</div>;
  }

  if (error) {
    return <div className="operation-management-page error-message">오류: {error}</div>;
  }

  return (
    <div className="operation-management-page">
      {message && <div className={`message ${message.includes('실패') ? 'error' : 'success'}`}>{message}</div>}
      <div className="admin-list-container">
        
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} onClick={() => handleRowClick(admin)} className="clickable-row">
                <td>{admin.id}</td>
                <td>{admin.username}</td>
                <td>{admin.role}</td>
                <td>{new Date(admin.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedAdmin && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <h3>Change Admin Role</h3>
          <p><strong>Username:</strong> {selectedAdmin.username}</p>
          <p><strong>Current Role:</strong> {selectedAdmin.role}</p>
          <div className="form-group">
            <label htmlFor="newRole">New Role:</label>
            <select id="newRole" value={newRole} onChange={handleRoleChange}>
              <option value="admin">admin</option>
              <option value="superadmin">superadmin</option>
            </select>
          </div>
          <div className="modal-actions">
            <button onClick={handleUpdateRole} className="save-button">Save</button>
            <button onClick={handleCloseModal} className="cancel-button">Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OperationManagementPage;
