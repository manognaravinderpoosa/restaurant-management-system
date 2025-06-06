import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ExpensesManagement.css';

const ExpensesManagement = () => {
    const [expenses, setExpenses] = useState([]);
    const [form, setForm] = useState({ category: '', amount: '', note: '', date: '' });
    const user_id = localStorage.getItem('user_id');

    const fetchExpenses = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/expenses/get', { user_id });
            setExpenses(res.data.expenses);
        } catch (err) {
            console.error("Error fetching expenses:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/expenses/add', {
                ...form,
                user_id
            });
            setForm({ category: '', amount: '', note: '', date: '' });
            fetchExpenses();
        } catch (err) {
            console.error("Error adding expense:", err);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    return (
        <div className="expenses-container">
            <h2>Expenses Management</h2>

            <form className="expense-form" onSubmit={handleSubmit}>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                    <option value="">Select Category</option>
                    <option value="Staff Salaries">Staff Salaries</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Rent">Rent</option>
                    <option value="Inventory">Inventory</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                </select>
                <input type="number" placeholder="Amount (₹)" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                <input type="text" placeholder="Note (optional)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
                <button type="submit">Add Expense</button>
            </form>

            <div className="expense-list">
                <h3>Expense History</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Amount (₹)</th>
                            <th>Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((exp, index) => (
                            <tr key={index}>
                                <td>{new Date(exp.date).toLocaleDateString()}</td>
                                <td>{exp.category}</td>
                                <td>{exp.amount}</td>
                                <td>{exp.note}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExpensesManagement;
