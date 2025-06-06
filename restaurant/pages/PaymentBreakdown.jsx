// pages/PaymentBreakdown.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PaymentBreakdown.css';

const PaymentBreakdown = () => {
    const [payments, setPayments] = useState([]);
    const user_id = localStorage.getItem("user_id");

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await axios.post('http://localhost:5000/api/payments/get', { user_id });
                setPayments(res.data.payments);
            } catch (err) {
                console.error('Error fetching payments:', err);
            }
        };
        fetchPayments();
    }, [user_id]);

    return (
        <div className="payment-breakdown-container">
            <h2>Payment Breakdown</h2>
            <table className="payment-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Method</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment, index) => (
                        <tr key={index}>
                            <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                            <td>₹{payment.amount}</td>
                            <td>{payment.method || "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentBreakdown;
