import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CustomerEntry.css'; // Import the CSS

const CustomerEntry = () => {
    const { user_id } = useParams();
    const navigate = useNavigate();
    const [numTables, setNumTables] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTableCount = async () => {
            try {
                const res = await axios.post('http://localhost:5000/api/getTableCount', { user_id });
                setNumTables(res.data.num_tables);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching table count:', err);
                setLoading(false);
            }
        };
        fetchTableCount();
    }, [user_id]);

    const handleTableSelect = (tableNum) => {
        localStorage.setItem('selected_table', tableNum);
        localStorage.setItem('restaurant_user_id', user_id);
        navigate(`/menu/${user_id}`);
    };

    if (loading) return <p>Loading tables...</p>;

    return (
        <div className="customer-entry-container">
            <div className="outer-box">
                <h2>Select Your Table</h2>
                <div className="table-grid">
                    {Array.from({ length: numTables }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handleTableSelect(i + 1)}
                            className="table-button"
                        >
                            Table {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomerEntry;
