import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import "./ReportPage.css";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ReportPage = () => {
    const [reports, setReports] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchReports = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.get("/api/reports");
            // Ensure we always set an array
            setReports(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Failed to fetch reports:", error);
            setError("Failed to fetch reports. Please try again.");
            setReports([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const filteredReports = Array.isArray(reports) ? reports.filter((report) => {
        if (!startDate || !endDate) return true;
        const reportDate = new Date(report.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return reportDate >= start && reportDate <= end;
    }) : [];

    const exportToCSV = () => {
        if (filteredReports.length === 0) {
            alert("No data to export");
            return;
        }

        try {
            const headers = ["Date", "Revenue", "Expense", "Profit"];
            const csvData = filteredReports.map(report => [
                format(new Date(report.date), "yyyy-MM-dd"),
                report.revenue || 0,
                report.expense || 0,
                (report.revenue || 0) - (report.expense || 0)
            ]);

            const csvContent = [headers, ...csvData]
                .map(row => row.join(","))
                .join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            saveAs(blob, `Reports_${format(new Date(), "yyyy-MM-dd")}.csv`);
        } catch (error) {
            console.error("Export to CSV failed:", error);
            alert("Export failed. Please try again.");
        }
    };

    const exportToPDF = () => {
        if (filteredReports.length === 0) {
            alert("No data to export");
            return;
        }

        try {
            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text("Daily Financial Report", 14, 16);

            const tableData = filteredReports.map((r) => [
                format(new Date(r.date), "yyyy-MM-dd"),
                `₹${r.revenue || 0}`,
                `₹${r.expense || 0}`,
                `₹${(r.revenue || 0) - (r.expense || 0)}`,
            ]);

            doc.autoTable({
                head: [["Date", "Revenue", "Expense", "Profit"]],
                body: tableData,
                startY: 25,
                styles: { fontSize: 10 },
                headStyles: { fillColor: [22, 160, 133] },
            });

            doc.save(`Reports_${format(new Date(), "yyyy-MM-dd")}.pdf`);
        } catch (error) {
            console.error("Export to PDF failed:", error);
            alert("Export failed. Please try again.");
        }
    };

    const chartData = {
        labels: Array.isArray(filteredReports) ? filteredReports.map((r) =>
            format(new Date(r.date), "dd MMM")
        ) : [],
        datasets: [
            {
                label: "Revenue",
                data: Array.isArray(filteredReports) ? filteredReports.map((r) => r.revenue || 0) : [],
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
            {
                label: "Expense",
                data: Array.isArray(filteredReports) ? filteredReports.map((r) => r.expense || 0) : [],
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
            },
            {
                label: "Profit",
                data: Array.isArray(filteredReports) ? filteredReports.map((r) => (r.revenue || 0) - (r.expense || 0)) : [],
                backgroundColor: "rgba(153, 102, 255, 0.6)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Financial Overview',
            },
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

    useEffect(() => {
        fetchReports();
    }, []);

    return (
        <div className="report-container">
            <h2>Daily Reports</h2>

            {error && <div className="error-message">{error}</div>}

            <div className="filter-section">
                <div className="date-filters">
                    <label>
                        From:
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </label>
                    <span>to</span>
                    <label>
                        To:
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </label>
                </div>

                <div className="export-buttons">
                    <button
                        onClick={exportToCSV}
                        disabled={filteredReports.length === 0}
                    >
                        Export CSV
                    </button>
                    <button
                        onClick={exportToPDF}
                        disabled={filteredReports.length === 0}
                    >
                        Export PDF
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading reports...</div>
            ) : (
                <>
                    {filteredReports.length > 0 ? (
                        <>
                            <div className="report-chart">
                                <Bar data={chartData} options={chartOptions} />
                            </div>

                            <div className="table-container">
                                <table className="report-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Revenue (₹)</th>
                                            <th>Expense (₹)</th>
                                            <th>Profit (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredReports.map((r, index) => (
                                            <tr key={r.id || index}>
                                                <td>{format(new Date(r.date), "yyyy-MM-dd")}</td>
                                                <td>₹{r.revenue || 0}</td>
                                                <td>₹{r.expense || 0}</td>
                                                <td className={r.revenue - r.expense >= 0 ? 'profit' : 'loss'}>
                                                    ₹{(r.revenue || 0) - (r.expense || 0)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="summary">
                                <h3>Summary</h3>
                                <p>Total Revenue: ₹{Array.isArray(filteredReports) ? filteredReports.reduce((sum, r) => sum + (r.revenue || 0), 0) : 0}</p>
                                <p>Total Expense: ₹{Array.isArray(filteredReports) ? filteredReports.reduce((sum, r) => sum + (r.expense || 0), 0) : 0}</p>
                                <p>Net Profit: ₹{Array.isArray(filteredReports) ? filteredReports.reduce((sum, r) => sum + ((r.revenue || 0) - (r.expense || 0)), 0) : 0}</p>
                            </div>
                        </>
                    ) : (
                        <div className="no-data">
                            {startDate || endDate ? "No reports found for the selected date range." : "No reports available."}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ReportPage;