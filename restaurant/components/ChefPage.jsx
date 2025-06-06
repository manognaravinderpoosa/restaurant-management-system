import React, { useEffect, useState } from "react";
import axios from "axios";
import './ChefPage.css';
import Navbar1 from "./Navbar1";

const ChefPage = () => {
    const [orders, setOrders] = useState([]);
    const [servedOrderIds, setServedOrderIds] = useState([]);
    const user_id = localStorage.getItem("user_id");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.post("http://localhost:5000/api/orders/getKitchenOrders", {
                    user_id
                });

                // Filter out orders already served (in frontend)
                const filteredOrders = res.data.orders.filter(
                    order => !servedOrderIds.includes(order._id)
                );

                setOrders(filteredOrders);
            } catch (err) {
                console.error("Error fetching kitchen orders:", err);
            }
        };

        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, [user_id, servedOrderIds]); // include servedOrderIds to re-filter on update

    const groupItemsByCategory = (items) => {
        const grouped = {};
        items.forEach(item => {
            if (!grouped[item.category]) {
                grouped[item.category] = [];
            }
            grouped[item.category].push(item);
        });
        return grouped;
    };

    const handleServed = async (orderId) => {
        try {
            await axios.post("http://localhost:5000/api/order/markServed", { orderId });
            setServedOrderIds(prev => [...prev, orderId]);
            alert("Order marked as served. Revenue updated.");
        } catch (err) {
            console.error("Error serving order:", err);
            alert("Failed to serve order.");
        }
    };


    return (
        <>
            <Navbar1 />
            <div className="chef-page">
                <h2>Kitchen Orders</h2>
                {orders.length === 0 ? (
                    <p>No orders yet.</p>
                ) : (
                    orders.map((order, index) => {
                        const groupedItems = groupItemsByCategory(order.items);
                        const orderTotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

                        return (
                            <div key={index} className="order-card">
                                <h3>Table {order.table_number}</h3>
                                {Object.entries(groupedItems).map(([category, items]) => (
                                    <div key={category} className="category-group">
                                        <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                                        <ul>
                                            {items.map(item => (
                                                <li key={item._id}>
                                                    item: {item.name}, quantity: {item.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                                <p><strong>Total: ₹{orderTotal}</strong></p>
                                <button onClick={() => handleServed(order._id)}>
                                    Served
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </>);
};

export default ChefPage;
