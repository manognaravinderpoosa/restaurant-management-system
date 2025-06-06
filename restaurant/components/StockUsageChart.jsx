import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import axios from 'axios'; // or any other method you're using to fetch data


const StockUsageChart = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Added error state

    useEffect(() => {
        // Fetch stock usage data from your API
        axios.get('http://localhost:5000/api/stock-usage') // Replace with your API endpoint
            .then(response => {
                console.log("API Response:", response.data); // Log the raw response data
                const data = response.data; // Assuming this returns the stock usage data
                processChartData(data);
            })
            .catch(error => {
                console.error("Error fetching stock usage data:", error);
                setError("Failed to load data"); // Set the error message
                setLoading(false);
            });
    }, []);

    const processChartData = (data) => {
        // Log the data before processing
        console.log("Raw Data to Process:", data);

        // Ensure data is in the correct format
        if (!Array.isArray(data)) {
            setError("Invalid data format");
            setLoading(false);
            return;
        }

        const aggregatedData = data.reduce((acc, entry) => {
            const { stockName, quantityUsed } = entry;

            // Log each entry
            console.log("Processing Entry:", entry);

            if (quantityUsed > 0) {  // Only include entries where quantityUsed is > 0
                const existing = acc.find(item => item.x === stockName);

                if (existing) {
                    existing.y += quantityUsed;
                } else {
                    acc.push({ x: stockName, y: quantityUsed });
                }
            }
            return acc;
        }, []);

        console.log("Aggregated Data:", aggregatedData); // Log the aggregated data

        setChartData(aggregatedData);
        setLoading(false);
    };

    const chartOptions = {
        chart: {
            type: 'bar',
        },
        xaxis: {
            categories: chartData.map(item => item.x),
        },
        yaxis: {
            title: {
                text: 'Quantity Used',
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
            },
        },
    };

    const chartSeries = [
        {
            name: 'Stock Usage',
            data: chartData.map(item => item.y),
        },
    ];

    return (
        <div className="chart-container">
            <h3>Stock Usage Overview</h3>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p> // Show error message if there is an issue
            ) : (
                <ApexCharts
                    options={chartOptions}
                    series={chartSeries}
                    type="bar"
                    height={350}
                />
            )}
        </div>
    );
};

export default StockUsageChart;
