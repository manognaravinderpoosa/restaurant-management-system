import React, { useState } from "react";
import axios from "axios";
import "./Payment.css";

const Payment = () => {
    const [formData, setFormData] = useState({
        user_id: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/api/payment", {
                user_id: formData.user_id,
                password: formData.password,
            });

            alert(response.data.message);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Payment failed");
        }
    };

    return (
        <div className="payment-container">
            <h2>Payment</h2>
            <form onSubmit={handleSubmit} className="payment-form">
                <input
                    type="text"
                    name="user_id"
                    placeholder="User ID"
                    value={formData.user_id}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Pay Now ₹1500</button>
                <div className="signup-link">
                    Don’t have an account? <a href="/signup">Sign Up</a>
                </div>
            </form>
        </div>
    );
};

export default Payment;
