import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Login() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_URL}/api/login`, {
                user_id: userId,
                password: password
            });

            if (response.status === 200) {
                // Store user ID in localStorage
                localStorage.setItem("user_id", userId);
                navigate("/home");
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2 id="login">Login to Restro</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-box">
                        <label htmlFor="userId">User ID</label>
                        <input
                            type="text"
                            id="userId"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="Enter your User ID"
                            required
                        />
                    </div>
                    <div className="input-box">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your Password"
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                    <div className="signup-link">
                        Don't have an account? <a href="/signup">Sign Up</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;