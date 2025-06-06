import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./HomePage.css";
import Navbar1 from "./Navbar1";
import API_URL from '../config.js';

const HomePage = () => {
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [daysLeft, setDaysLeft] = useState(0);
    const navigate = useNavigate();
    const userId = localStorage.getItem("user_id");

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }

        const fetchPaymentStatus = async () => {
            try {
                const response = await axios.post(`${API_URL}/api/getPaymentStatus`, {
                    user_id: userId
                });
                setPaymentStatus(response.data.status);

                if (response.data.status === "paid") {
                    setDaysLeft(response.data.daysLeft);
                }
            } catch (error) {
                console.error("Error fetching payment status", error);
            }
        };

        fetchPaymentStatus();
    }, [userId, navigate]);

    const handlePayNow = () => navigate("/Payment");
    const handleLogout = () => {
        localStorage.removeItem("user_id");
        navigate("/login");
    };

    const isDisabled = paymentStatus !== "paid";

    return (
        <div className="home-container">
            <Navbar1 />
            <main className="main-body">
                <h2>Select Whom You Are</h2>
                <div className="roles">
                    <div className={`role-card ${isDisabled ? "disabled" : ""}`}>
                        <Link to="/inventory" className="nav-link" style={{ color: 'black' }}>
                            Inventory Manager
                        </Link>
                    </div>

                    <div className={`role-card ${isDisabled ? "disabled" : ""}`}>

                        <Link to="/chef" className="nav-link" style={{ color: 'black' }}>
                            Chef Page
                        </Link>

                    </div>

                    <div className={`role-card ${isDisabled ? "disabled" : ""}`}>
                        <Link to="/reception" className="nav-link" style={{ color: 'black' }}>
                            Reception Manager
                        </Link>
                    </div>

                    <div className={`role-card ${isDisabled ? "disabled" : ""}`}>
                        <Link to="/dashboard" className="nav-link" style={{ color: 'black' }}>
                            Accountant Manager
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;