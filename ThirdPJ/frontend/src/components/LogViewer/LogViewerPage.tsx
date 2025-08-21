import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LogViewerPage.css';

const LogViewerPage: React.FC = () => {
  const [collectionNames, setCollectionNames] = useState<string[]>([]);
  const [collectionName, setCollectionName] = useState<string>('');
  const [collectionSchema, setCollectionSchema] = useState<{ name: string, type: string }[]>([]);
  const [dynamicFilters, setDynamicFilters] = useState<{field: string, value: string}[]>([]);
  
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(20);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [queriedDatabase, setQueriedDatabase] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState({ start: '', end: '' });

  // Fetch collection names on initial load
  useEffect(() => {
    const fetchCollectionNames = async () => {
        try {
            const response = await axios.get('/api/logs/collections', {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            const names = response.data;
            setCollectionNames(names);
            if (names.length > 0) {
                setCollectionName(names[0]);
            }
        } catch (err) {
            console.error('Error fetching collection names:', err);
            setError('Failed to load collection list.');
        }
    };
    fetchCollectionNames();
  }, []);

  // Fetch schema when collectionName changes
  useEffect(() => {
    const fetchSchema = async () => {
      if (!collectionName) return;
      try {
        const response = await axios.get(`/api/logs/schema/${collectionName}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setCollectionSchema(response.data.fields);
        setDynamicFilters([]); // Reset filters when schema changes
      } catch (err) {
        console.error('Error fetching schema:', err);
        setError('Failed to load collection schema.');
      }
    };

    fetchSchema();
  }, [collectionName]);

  // Fetch logs when schema is loaded or filters change
  const fetchLogs = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const commonFilters = dynamicFilters.reduce((acc, filter) => {
        if (filter.field && filter.value) {
          acc[filter.field] = filter.value;
        }
        return acc;
      }, {} as Record<string, string>);

      const filters = {
        timeRange: timeRange.start && timeRange.end ? timeRange : undefined,
        commonFilters,
      };

      const response = await axios.post('/api/logs/query', {
        collectionName,
        filters,
        pagination: { page, limit },
        sortBy: { field: '_time', order: 'desc' },
      });

      setLogs(response.data.documents);
      setPagination({
        page: response.data.pagination.page,
        totalPages: response.data.pagination.totalPages,
      });
      setQueriedDatabase(response.data.queriedDatabase);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.response?.data?.msg || 'Failed to fetch logs.';
      setError(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFilter = () => {
    setDynamicFilters([...dynamicFilters, { field: '', value: '' }]);
  };

  const handleFilterChange = (index: number, field: string, value: any) => {
    const newFilters = [...dynamicFilters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setDynamicFilters(newFilters);
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = [...dynamicFilters];
    newFilters.splice(index, 1);
    setDynamicFilters(newFilters);
  };

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTimeRange(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    fetchLogs(1);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
  };

  const handleExportCSV = () => {
    if (logs.length === 0) {
      alert('No data to export.');
      return;
    }
    let headers = collectionSchema.map(f => f.name).filter(name => name !== '_id');
    if (headers.length === 0 && logs.length > 0) {
        headers = Object.keys(logs[0]).filter(name => name !== '_id');
    }
    
    const csvRows = [headers.join(',')];
    logs.forEach(log => {
      const values = headers.map(header => {
        let value = log[header];
        if (value === null || value === undefined) {
          value = '';
        } else if (typeof value === 'object') {
          value = JSON.stringify(value);
        }
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${collectionName}_logs_${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      fetchLogs(newPage);
    }
  };

  const renderTable = () => {
    if (logs.length === 0) {
      return <p>No logs found for the selected criteria.</p>;
    }
    let headers = collectionSchema.map(f => f.name).filter(name => name !== '_id');
    if (headers.length === 0 && logs.length > 0) {
        headers = Object.keys(logs[0]).filter(name => name !== '_id');
    }

    return (
        <table>
          <thead>
            <tr>
              {headers.map(header => <th key={header}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                {headers.map(header => (
                  <td key={header}>
                    {typeof log[header] === 'object' ? JSON.stringify(log[header]) : log[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
    );
  };

  return (
    <div className="log-viewer-page">
      <div className="filters-card">
        <h3>Filters</h3>
        {queriedDatabase && <p className="queried-db-info">Querying Database: <strong>{queriedDatabase}</strong></p>}
        
        <div className="filter-controls">
          <div className="form-group">
            <label>Collection</label>
            <select value={collectionName} onChange={e => setCollectionName(e.target.value)}>
              {collectionNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Start Time</label>
            <input type="datetime-local" name="start" value={timeRange.start} onChange={handleTimeRangeChange} />
          </div>
          <div className="form-group">
            <label>End Time</label>
            <input type="datetime-local" name="end" value={timeRange.end} onChange={handleTimeRangeChange} />
          </div>
        </div>

        <div className="dynamic-filters">
            {dynamicFilters.map((filter, index) => (
                <div key={index} className="filter-row">
                    <select value={filter.field} onChange={(e) => handleFilterChange(index, 'field', e.target.value)}>
                        <option value="">Select Field</option>
                        {collectionSchema.filter(f => f.name !== '_id').map(field => (
                            <option key={field.name} value={field.name}>{field.name}</option>
                        ))}
                    </select>
                    <input type="text" value={filter.value} onChange={(e) => handleFilterChange(index, 'value', e.target.value)} placeholder="Enter value" />
                    <button onClick={() => handleRemoveFilter(index)}>Remove</button>
                </div>
            ))}
            <button onClick={handleAddFilter}>Add Filter</button>
        </div>

        <div className="search-controls">
            <div className="form-group">
                <label>Per Page</label>
                <select value={limit} onChange={handleLimitChange}>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
            </div>
            <button onClick={handleSearch} disabled={loading}>Search</button>
        </div>
      </div>

      {loading && <p>Loading logs...</p>}
      {error && <p className="error-message">{error}</p>}
      
      {!loading && !error && (
        <>
          <div className="table-container">
            {renderTable()}
          </div>
          <div className="pagination-controls">
            <button onClick={handleExportCSV} disabled={logs.length === 0} className="export-button">Export to CSV</button>
            <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page <= 1}>
              Previous
            </button>
            <span>Page {pagination.page} of {pagination.totalPages}</span>
            <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LogViewerPage;
