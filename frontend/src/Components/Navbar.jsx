import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import image from "../Images/Gambit.png";
import { logout } from "../api";

const Navbar = () => {
  const [showLinks, setShowLinks] = React.useState(false);
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const hideLinks = () => {
    setShowLinks(false);
  };
  return (
    <nav className="navbar">
      <div className="nav-center">
        <div className="nav-header">
          <Link to="/">
            <div className="nav-logo">
              <img src={image} alt="gambit" />
            </div>
          </Link>
          <button
            className="btn nav-btn"
            onClick={() => setShowLinks(!showLinks)}
          >
            <i className="fas fa-align-justify"></i>
          </button>
        </div>
        <div
          type="button"
          className={`nav-links ${showLinks ? "show-links" : null}`}
        >
          <Link to="/" className="nav-link" onClick={hideLinks}>
            home
          </Link>
          <Link to="/play" className="nav-link" onClick={hideLinks}>
            play
          </Link>
          <Link to="/chess-tv" className="nav-link" onClick={hideLinks}>
            ChessTV
          </Link>
          <Link to="/about" className="nav-link" onClick={hideLinks}>
            about
          </Link>
          {!token && (
            <div className="nav-link contact-link" onClick={hideLinks}>
              <Link to="/login" className="btn">
                {token ? username : "Login"}
              </Link>
            </div>
          )}
          {token && (
            <div className="nav-link contact-link" onClick={hideLinks}>
              <Link to="/login" className="btn" onClick={logout}>
                Logout {username}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
