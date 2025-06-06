import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from '../config.js';

const StockOverview = () => {
    const [overviewData, setOverviewData] = useState({});

    useEffect(() => {
        axios.get(`${API_URL}/api/dashboard`)
            .then(response => {
                setOverviewData(response.data);  // Store the data in state
            })
            .catch(error => console.error('Error fetching stock overview:', error));
    }, []);

    return (
        <div>
            {/* Your component JSX here */}
        </div>
    );
};

export default StockOverview;