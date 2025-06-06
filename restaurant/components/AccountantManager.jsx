import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./AccountantManager.css";
import Navbar1 from "./Navbar1";
import API_URL from '../config.js';

const AccountantManager = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [revenue, setRevenue] = useState(null);
    const [itemSales, setItemSales] = useState({});
    const [loading, setLoading] = useState(false);

    const user_id = localStorage.getItem("user_id");

    useEffect(() => {
        const fetchRevenueAndItems = async () => {
            setLoading(true);
            try {
                const response = await axios.post(`${API_URL}/api/accountant/revenue`, {
                    user_id,
                    date: selectedDate
                });
                setRevenue(response.data.totalRevenue);
                setItemSales(response.data.itemSales || {});
            } catch (err) {
                console.error("Error fetching data:", err);
                setRevenue(null);
                setItemSales({});
            } finally {
                setLoading(false);
            }
        };

        if (user_id && selectedDate) {
            fetchRevenueAndItems();
        }
    }, [selectedDate, user_id]);

    return (
        <>
            <Navbar1 />
            <div className="accountant-manager-container">
                <h2>Reports</h2>

                <div className="calendar-section">
                    <h3>Select a date to view revenue and item sales</h3>
                    <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                    />
                </div>

                <div className="revenue-display">
                    <h3>Revenue for: {selectedDate.toDateString()}</h3>
                    {loading ? (
                        <p>Loading...</p>
                    ) : revenue !== null ? (
                        <>
                            <p className="revenue-amount">₹ {revenue}</p>
                            <h4>Item-wise Sales</h4>
                            {Object.keys(itemSales).length === 0 ? (
                                <p className="no-revenue">No items sold on this day.</p>
                            ) : (
                                <ul className="item-sales-list">
                                    {Object.entries(itemSales).map(([item, quantity]) => (
                                        <li key={item}>
                                            {item.charAt(0).toUpperCase() + item.slice(1)}: <strong>{quantity}</strong>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    ) : (
                        <p className="no-revenue">No revenue recorded on this day.</p>
                    )}
                </div>
            </div>
        </>);
};

export default AccountantManager;