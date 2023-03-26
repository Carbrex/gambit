import React from 'react'
import { Link } from "react-router-dom";
import image from "../Images/Gambit.png";

const Navbar = () => {
    const [showLinks, setShowLinks] = React.useState(false);
    return (
        <nav className="navbar">
            <div className="nav-center">
                <div className="nav-header">
                    <Link to="/">
                        <div className="nav-logo">
                            <img src={image} alt="gambit" />
                        </div>
                    </Link>
                    <button className="btn nav-btn" onClick={()=>setShowLinks(!showLinks)}><i className="fas fa-align-justify"></i></button>
                </div>
                <div type="button" className={`nav-links ${showLinks?'show-links':null}`}>
                    <Link to="/" className="nav-link">home</Link>
                    <Link to="/play" className="nav-link">play</Link>
                    <Link to="/chess-tv" className="nav-link">ChessTV</Link>
                    <Link to="/about" className="nav-link">about</Link>
                    <div className="nav-link contact-link">
                        <Link to="/login" className="btn">Login</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar