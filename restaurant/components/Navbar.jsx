import "./Navbar1.css";
import { Link } from "react-router-dom";
import { GiKnifeFork } from "react-icons/gi";
function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-logo"> <GiKnifeFork />Restro</div>
            <ul className="navbar-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/signup">Sign Up</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/paynow">Pay Now</Link></li>
                <li><Link to="/about">About Us</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
