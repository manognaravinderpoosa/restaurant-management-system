import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SpecialFeatures.css";
import Navbar1 from "../components/Navbar1";
import { Link } from "react-router-dom";
import UpdateMenu from "./UpdateMenu";
import API_URL from '../config.js';

const SpecialFeatures = () => {
  const [qrData, setQrData] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [message, setMessage] = useState("");
  const [numTables, setNumTables] = useState("");
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  const handleGenerateQR = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/generateQR`, { user_id: userId });
      if (response.data.qrValue) {
        setQrData(response.data.qrValue);
        setMessage("QR code generated successfully!");
      }
    } catch (error) {
      setMessage("Error generating QR code.");
      console.error(error);
    }
  };

  const handleViewQR = async () => {
    try {
      if (!qrData) {
        const response = await axios.post(`${API_URL}/api/viewQR`, {
          user_id: userId,
        });
        if (response.data.qrValue) {
          setQrData(response.data.qrValue);
        } else {
          setMessage("Please generate the QR code first.");
          return;
        }
      }
      setShowQR((prev) => !prev); // Toggle visibility
    } catch (error) {
      setMessage("Failed to fetch QR code");
      console.error(error);
    }
  };

  const handleSaveTableCount = async () => {
    if (!numTables || isNaN(numTables) || Number(numTables) <= 0) {
      setMessage("Please enter a valid number of tables.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/setTables`, {
        user_id: userId,
        num_tables: Number(numTables),
      });

      if (response.data.success) {
        setMessage("Number of tables saved successfully.");
      } else {
        setMessage(response.data.message || "Failed to save table count.");
      }
    } catch (error) {
      setMessage("Error saving table count.");
      console.error(error);
    }
  };

  return (
    <>
      <Navbar1 />
      <div className="special-container">
        <h2 className="main-heading">Special Features</h2>

        <div className="feature-block">
          <h3>1. Set Number of Tables</h3>
          <input
            type="number"
            value={numTables}
            onChange={(e) => setNumTables(e.target.value)}
            placeholder="e.g. 10"
          />
          <button onClick={handleSaveTableCount}>Save Table Count</button>
        </div>

        <div className="feature-block">
          <h3>2. Generate QR</h3>
          <button onClick={handleGenerateQR}>Generate QR</button>
        </div>

        <div className="feature-block">
          <h3>3. View QR</h3>
          <button onClick={handleViewQR}>{showQR ? "Hide QR" : "View QR"}</button>
        </div>
        <div className="feature-block">
          <h3>4. Update Menu</h3>
          <Link to="/update-menu">
            <button className="nav-link" style={{ color: 'white' }}>Update Menu</button>
          </Link>
        </div>

        {message && <p className="message">{message}</p>}
        {showQR && qrData && (
          <div className="qr-container">
            <QRCode value={qrData} size={200} />
            <p className="qr-text">Scan this QR to access your restaurant tables</p>
          </div>
        )}
      </div>
    </>
  );
};

export default SpecialFeatures;