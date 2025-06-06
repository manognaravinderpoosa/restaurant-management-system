import React, { useState, useEffect } from 'react';
import './StaffManagement.css';
import axios from 'axios';
import API_URL from '../config.js';

const StaffManager = () => {
    const [staff, setStaff] = useState([]);
    const [form, setForm] = useState({ name: '', category: '', salary: '' });
    const [totalSalary, setTotalSalary] = useState(0);
    const user_id = localStorage.getItem("user_id");
    
    const fetchStaff = async () => {
        try {
            const res = await axios.post(`${API_URL}/api/staff/get`, { user_id });
            setStaff(res.data.staff);
            const total = res.data.staff.reduce((acc, s) => acc + parseInt(s.salary), 0);
            setTotalSalary(total);
        } catch (error) {
            console.error("Error fetching staff:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/staff/add`, {
                ...form,
                user_id
            });
            setForm({ name: '', category: '', salary: '' });
            fetchStaff(); // Refresh list
        } catch (err) {
            console.error("Error adding staff:", err);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    return (
        <div className="staff-manager-container">
            <h2>Staff Management</h2>

            <form className="staff-form" onSubmit={handleSubmit}>
                <input type="text" placeholder="Staff Name" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <select value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                    <option value="">Select Category</option>
                    <option value="Chef">Chef</option>
                    <option value="Waiter">Waiter</option>
                    <option value="Cleaner">Cleaner</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Manager">Manager</option>
                    <option value="Security">Security</option>
                    <option value="Dishwasher">Dishwasher</option>
                </select>
                <input type="number" placeholder="Salary per month" value={form.salary}
                    onChange={(e) => setForm({ ...form, salary: e.target.value })} required />
                <button type="submit">Add Staff</button>
            </form>

            <h3>Staff List</h3>
            <ul className="staff-list">
                {staff.map((member, index) => (
                    <li key={index}>
                        {member.name} - {member.category} - ₹{member.salary}/month
                    </li>
                ))}
            </ul>
            <h4>Total Monthly Salary: ₹{totalSalary}</h4>
        </div>
    );
};

export default StaffManager;