import React, { useState } from 'react';
import './Signup.css';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        mobile_number: '',
        email: '',
        restaurant_name: '',
        location: '',
        user_id: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/signup`, formData);
            alert("Account Created Successfully");
            console.log(response.data);
        } catch (error) {
            alert("Error creating account");
            console.error(error);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <h2>Restaurant Sign Up</h2>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="input-box">
                        <label>Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="input-box">
                        <label>Mobile Number</label>
                        <input type="text" name="mobile_number" value={formData.mobile_number} onChange={handleChange} />
                    </div>
                    <div className="input-box">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="input-box">
                        <label>Restaurant Name</label>
                        <input type="text" name="restaurant_name" value={formData.restaurant_name} onChange={handleChange} />
                    </div>
                    <div className="input-box">
                        <label>Location</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} />
                    </div>
                    <div className="input-box">
                        <label>User ID</label>
                        <input type="text" name="user_id" value={formData.user_id} onChange={handleChange} />
                    </div>
                    <div className="input-box">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} />
                    </div>
                    <button type="submit">Create Account</button>
                    <div className="login-link">
                        Already registered? <a href="/login">Login</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;