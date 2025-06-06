// pages/GraphicalAnalysis.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';
import './GraphicalAnalysis.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const GraphicalAnalysis = () => {
    const [monthlyData, setMonthlyData] = useState([]);
    const user_id = localStorage.getItem("user_id");

    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                const res = await axios.post('http://localhost:5000/api/accountant/monthly-report', { user_id });
                setMonthlyData(res.data.monthlyReport);
            } catch (err) {
                console.error("Error fetching graph data:", err);
            }
        };
        fetchGraphData();
    }, [user_id]);

    const labels = monthlyData.map(item => item.month);
    const revenueData = monthlyData.map(item => item.revenue);
    const expenseData = monthlyData.map(item => item.expense);
    const profitData = monthlyData.map(item => item.revenue - item.expense);

    const data = {
        labels,
        datasets: [
            {
                label: 'Revenue',
                data: revenueData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Expenses',
                data: expenseData,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
            {
                label: 'Profit',
                data: profitData,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: { mode: 'index', intersect: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return '₹' + value;
                    }
                }
            }
        }
    };

    return (
        <div className="graphical-analysis-container">
            <h2>Graphical Financial Analysis</h2>
            <div className="bar-chart">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default GraphicalAnalysis;
