import React from "react";
import NotificationBell from "./NotificationBell";
import "./Topbar.css";
import { IoRestaurant } from "react-icons/io5";

const Topbar = () => {
    return (
        <div className="topbar">
            <div className="topbar-title"><IoRestaurant /> Restro  Inventory</div>
            <NotificationBell />
        </div>
    );
};

export default Topbar;
