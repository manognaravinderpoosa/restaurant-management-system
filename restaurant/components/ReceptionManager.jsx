import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ReceptionManager.css';
import Navbar1 from './Navbar1';

const ReceptionManager = () => {
    const [orders, setOrders] = useState([]);
    const user_id = localStorage.getItem("user_id");

    useEffect(() => {
        fetchOrders(); // Initial fetch

        const interval = setInterval(() => {
            fetchOrders(); // Fetch every 10 seconds
        }, 10000); // 10,000 ms = 10 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/orders/getKitchenOrders", { user_id });
            setOrders(res.data.orders);
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    };

    const handlePaymentComplete = async (orderId) => {
        try {
            await axios.post("http://localhost:5000/api/order/pay", { orderId });
            fetchOrders(); // Refresh immediately after payment
            alert("Payment confirmed. Order closed.");
        } catch (err) {
            console.error("Error processing payment:", err);
            alert("Failed to complete payment.");
        }
    };

    return (
        <>
            <Navbar1 />
            <div className="reception-container">
                <h2>Pending Payments (Pay at Counter)</h2>
                <table className="reception-table">
                    <thead>
                        <tr>
                            <th>Table No</th>
                            <th>Items Ordered</th>
                            <th>Total Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr><td colSpan="4">No pending payments</td></tr>
                        ) : (
                            orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order.table_number}</td>
                                    <td>
                                        <ul>
                                            {order.items.map((item, idx) => (
                                                <li key={idx}>
                                                    {item.name} × {item.quantity} — ₹{item.price * item.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>₹{order.totalAmount}</td>
                                    <td>
                                        <button onClick={() => handlePaymentComplete(order._id)}>Mark as Paid</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>);
};

export default ReceptionManager;
