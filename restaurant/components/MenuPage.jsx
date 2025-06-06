import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './MenuPage.css';
import { GiKnifeFork } from "react-icons/gi";
import API_URL from '../config.js';

const categories = ["Soups", "Starters", "Main Course", "Soft Drinks", "Desserts"];

const MenuPage = () => {
    const { user_id } = useParams();
    const table_no = localStorage.getItem("selected_table");

    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(true);
    const [visibleCategories, setVisibleCategories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await axios.post(`${API_URL}/api/menu/getMenuItems`, { user_id });
                const allItems = res.data.items;
                setMenu(allItems);

                const nonEmpty = categories.filter(cat =>
                    allItems.some(item => item.category === cat)
                );
                setVisibleCategories(nonEmpty);
            } catch (err) {
                console.error("Error fetching menu:", err);
            }
        };
        fetchMenu();
    }, [user_id]);

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i._id === item._id);
            if (existing) {
                return prev.map(i =>
                    i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
                );
            } else {
                return [...prev, { ...item, quantity: 1 }];
            }
        });
    };

    const decreaseFromCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i._id === item._id);
            if (!existing) return prev;
            if (existing.quantity === 1) {
                return prev.filter(i => i._id !== item._id);
            }
            return prev.map(i =>
                i._id === item._id ? { ...i, quantity: i.quantity - 1 } : i
            );
        });
    };

    const getTotal = () => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };
    const handlePayNow = async (type) => {
        if (!user_id || !table_no || cart.length === 0) {
            alert("Missing user ID, table number, or cart is empty.");
            return;
        }

        const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        if (type === "later") {
            // Pay at Counter
            const order = {
                table_number: table_no,
                user_id,
                items: cart,
                totalAmount,
                paymentStatus: "not paid"
            };

            try {
                await axios.post(`${API_URL}/api/order/place`, order);
                alert(`Order sent to kitchen for Table ${table_no} (Pay at Counter)`);
                setCart([]);
            } catch (err) {
                console.error("Error placing order:", err);
                alert("Failed to send order.");
            }
        } else {
            // Pay Now
            const order = {
                table_number: table_no,
                user_id,
                items: cart,
                totalAmount,
                paymentStatus: "paid" // Important
            };

            try {
                await axios.post(`${API_URL}/api/order/place`, order);
                alert(`Order placed and paid for Table ${table_no}`);
                setCart([]);
            } catch (err) {
                console.error("Error placing paid order:", err);
                alert("Failed to place paid order.");
            }
        }
    };

    const handlePayAtCounter = async () => {
        if (!user_id || !table_no || cart.length === 0) {
            alert("Missing user ID, table number, or cart is empty.");
            return;
        }

        const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        try {
            const response = await axios.post(`${API_URL}/api/order/place`, {
                user_id,
                table_number: table_no,
                items: cart,
                totalAmount,
            });

            alert(`Order placed successfully for Table ${table_no} (Pay at Counter)!`);
            setCart([]); // Clear cart after placing order
        } catch (err) {
            console.error('Error placing order:', err);
            alert('Failed to place order. Please try again.');
        }
    };

    const toggleCart = () => {
        setShowCart(prev => !prev);
    };

    const currentCategory = visibleCategories[currentIndex];
    const currentItems = menu.filter(item => item.category === currentCategory);

    const getItemQuantity = (id) => {
        const item = cart.find(i => i._id === id);
        return item ? item.quantity : 0;
    };

    return (
        <div className="menu-page">
            <nav className="navbar">
            <div className="navbar-logo"> <GiKnifeFork />Restro</div>
                <h2 className="logo"> </h2>
                <div className="cart-icon" onClick={toggleCart}>
                    🛒 {cart.reduce((total, item) => total + item.quantity, 0)}
                </div>
            </nav>

            <div className="main-content">
                <div className="category-slide-container">
                    <button className="arrow-btn" onClick={() => setCurrentIndex(i => Math.max(i - 1, 0))} disabled={currentIndex === 0}>⭠</button>
                    <div className="slide-content">
                        <h3 className="category-title">{currentCategory}</h3>
                        <div className="menu-grid">
                            {currentItems.map(item => (
                                <div key={item._id} className="menu-card">
                                    <div className="image-container">
                                        {item.image_url ? (
                                            <img
                                                src={`${API_URL}${item.image_url}`}
                                                alt={item.name}
                                                className="menu-image"
                                            />
                                        ) : (
                                            <div className="placeholder-image"></div>
                                        )}
                                    </div>
                                    <h4>{item.name}</h4>
                                    <p>₹{item.price}</p>
                                    <div className="quantity-controls">
                                        <button onClick={() => decreaseFromCart(item)}>-</button>
                                        <span>{getItemQuantity(item._id)}</span>
                                        <button onClick={() => addToCart(item)}>+</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className="arrow-btn" onClick={() => setCurrentIndex(i => Math.min(i + 1, visibleCategories.length - 1))} disabled={currentIndex === visibleCategories.length - 1}>⭢</button>
                </div>

                <div className={`cart-drawer ${showCart ? 'open' : ''}`}>
                    <h3>🛒 Your Cart - Table {table_no}</h3>
                    {cart.length === 0 ? (
                        <p>Your cart is empty</p>
                    ) : (
                        <>
                            <ul>
                                {cart.map(item => (
                                    <li key={item._id}>
                                        {item.name} x {item.quantity} — ₹{item.price * item.quantity}
                                    </li>
                                ))}
                            </ul>
                            <hr />
                            <p className="total-amount">Total: ₹{getTotal()}</p>
                            <div className="cart-actions">
                                <button onClick={handlePayNow}>Pay Now</button>
                                <button onClick={handlePayAtCounter}>Pay at Counter</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuPage;