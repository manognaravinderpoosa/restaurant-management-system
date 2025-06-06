import React from "react";

export const CardContent = ({ children }) => {
    return <div className="p-4">{children}</div>;
};

const Card = ({ children, bgColor }) => {
    return (
        <div className={`p-4 text-white rounded-lg shadow-md ${bgColor}`}>
            {children}
        </div>
    );
};

export default Card;
