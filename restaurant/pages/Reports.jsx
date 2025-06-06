import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFileDownload, FaChartBar, FaCalendarDay, FaCalendarWeek, FaCalendarAlt } from "react-icons/fa";
import "./Reports.css";

const Report = () => {
  const [reportData, setReportData] = useState([]);
  const [reportType, setReportType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async (type) => {
    setLoading(true);
    setError("");
    try {
      // Using the correct API endpoint from your backend
      const response = await axios.get(`http://localhost:5000/api/reports/${type}`);
      setReportData(response.data);
      setReportType(type.charAt(0).toUpperCase() + type.slice(1));
    } catch (error) {
      console.error("Error fetching report:", error);
      setError(`Error fetching ${type} report. Please try again.`);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Stock Name", "Quantity Used", "Unit", "Date"];
    const tableRows = reportData.map(item => [
      item.stockName || item.name || "N/A",
      item.quantityUsed || item.usage || "N/A",
      item.unit || "units",
      item.date ? new Date(item.date).toLocaleDateString() : new Date().toLocaleDateString()
    ]);

    doc.text(`${reportType} Inventory Report`, 14, 15);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
    
    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [52, 73, 94] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    doc.save(`${reportType.toLowerCase()}_inventory_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>
          <FaChartBar /> Inventory Usage Reports
        </h2>
      </div>

      <div className="report-selector">
        <button 
          className="report-btn daily" 
          onClick={() => fetchReport("daily")}
          disabled={loading}
        >
          <FaCalendarDay /> Daily Report
        </button>
        <button 
          className="report-btn weekly" 
          onClick={() => fetchReport("weekly")}
          disabled={loading}
        >
          <FaCalendarWeek /> Weekly Report
        </button>
        <button 
          className="report-btn monthly" 
          onClick={() => fetchReport("monthly")}
          disabled={loading}
        >
          <FaCalendarAlt /> Monthly Report
        </button>
        {reportData.length > 0 && (
          <button className="download-btn" onClick={downloadPDF}>
            <FaFileDownload /> Download PDF
          </button>
        )}
      </div>

      {loading && (
        <div className="loading">
          <p>Loading {reportType.toLowerCase()} report...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {!loading && reportData.length === 0 && reportType && (
        <div className="no-data">
          <p>No data available for {reportType.toLowerCase()} report.</p>
        </div>
      )}

      {!loading && reportData.length > 0 && (
        <div className="report-table-container">
          <h3>{reportType} Report ({reportData.length} records)</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>Stock Name</th>
                <th>Quantity Used</th>
                <th>Unit</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={item._id || index}>
                  <td>{item.stockName || item.name || "N/A"}</td>
                  <td>{item.quantityUsed || item.usage || "N/A"}</td>
                  <td>{item.unit || "units"}</td>
                  <td>{item.date ? new Date(item.date).toLocaleDateString() : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Report;