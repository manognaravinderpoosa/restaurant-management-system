import React, { useEffect, useState } from "react";
import axios from "axios";

const StockOverview = () => {
    const [overviewData, setOverviewData] = useState({});

    useEffect(() => {
        axios.get('http://localhost:5000/api/dashboard')
            .then(response => {
                setOverviewData(response.data);  // Store the data in state
            })
            .catch(error => console.error('Error fetching stock overview:', error));
    }, []);

    return
};

export default StockOverview;