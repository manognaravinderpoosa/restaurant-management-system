import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar1.css";
import { GiKnifeFork } from "react-icons/gi";

const Navbar1 = () => {
    const [showProfile, setShowProfile] = useState(false);
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
                const response = await axios.post("http://localhost:5000/api/getPaymentStatus", {
                    user_id: userId,
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

    const handlePayNow = () => {
        navigate("/Payment");
    };

    const handleLogout = () => {
        localStorage.removeItem("user_id");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="nav-brand"> <GiKnifeFork />Restro</div>

            <div className="nav-right">
                <div className="nav-items">
                    <Link to="/home" className="nav-link">Home</Link>
                    <Link to="/SpecialFeatures" className="nav-link">Special Features</Link>
                </div>

                <div className="nav-profile">
                    <div className="profile-icon" onClick={() => setShowProfile(!showProfile)}>
                        <i className="fas fa-user"></i>
                    </div>
                    {showProfile && (
                        <div className="profile-dropdown">
                            {paymentStatus === "paid" ? (
                                <p>✅ Paid<br />{daysLeft} days left</p>
                            ) : (
                                <div>
                                    <p>❌ Not Paid</p>
                                    <p>Complete your payment</p>
                                    <button onClick={handlePayNow}>Pay Now</button>
                                </div>
                            )}
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>


    );
};

export default Navbar1;
