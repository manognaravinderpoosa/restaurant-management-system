// components/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./DashBoard.css";

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-container">
            <h2>Account Manager Dashboard</h2>
            <div className="dashboard-options">
                <div className="dashboard-card" onClick={() => navigate("/account-management")}>
                    <div className="card-icon">💼</div>
                    <h3>Account Management</h3>
                    <p>Track daily revenues, expenses, and performance.</p>
                </div>

                <div className="dashboard-card" onClick={() => navigate("/staffmanagement")}>
                    <div className="card-icon">👥</div>
                    <h3>Staff Management</h3>
                    <p>View and manage your restaurant staff and salaries.</p>
                </div>

                <div className="dashboard-card" onClick={() => navigate("/expenses-management")}>
                    <div className="card-icon">💰</div>
                    <h3>Expenses Management</h3>
                    <p>Log and view daily/monthly operational expenses.</p>
                </div>

                <div className="dashboard-card" onClick={() => navigate("/graphical-analysis")}>
                    <div className="card-icon">📊</div>
                    <h3>Graphical Analysis</h3>
                    <p>View performance graphs of your restaurant.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;