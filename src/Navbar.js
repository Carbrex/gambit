import React from 'react'
import { Link } from "react-router-dom";
import image from "./Gambit.png";

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
                    <button class="btn nav-btn" onClick={()=>setShowLinks(!showLinks)}><i class="fas fa-align-justify"></i></button>
                </div>
                <div type="button" class={`nav-links ${showLinks?'show-links':null}`}>
                    <Link to="/" class="nav-link">home</Link>
                    <Link to="/play" class="nav-link">play</Link>
                    <Link to="/chess-tv" class="nav-link">ChessTV</Link>
                    <Link to="/about" class="nav-link">about</Link>
                    {/* <Link to="/" class="nav-link">tags</Link> */}
                    {/* <Link to="/" class="nav-link">Home</Link> */}
                    <div class="nav-link contact-link">
                        <Link to="/" class="btn">Contact</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar