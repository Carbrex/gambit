import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { useHistory, useLocation } from "react-router-dom";
import { createGame } from "../api";

const Play = () => {
  const [gameID, setGameID] = useState(null);
  const [playWith, setPlayWith] = useState("computer");
  const history = useHistory();
  const getGameID = async (color) => {
    const token = localStorage.getItem("token");
    if (color !== "white" && color !== "black") {
      color = null;
    }
    const response = await createGame(token, playWith, color);
    if (response.ok) {
      const resjson = await response.json();
      const { status, gameID: id } = resjson;
      setGameID(id);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      history.replace("/login");
    }
  }, []);
  useEffect(() => {
    if (gameID) {
      history.push(`/play/${gameID}`);
    }
  }, [gameID, history]);

  return (
    <>
      <section className="modes-container">
        <div className="chessboard">
          <Chessboard arePiecesDraggable={false} />
        </div>
        <header>
          <h3 id="modes-heading">Play a game with</h3>
          <div className="play-with">
            <button
              className={`btn single-mode ${playWith === 'computer' ? 'active' : ''}`}
              onClick={() => setPlayWith("computer")}
              >
              <p>Computer</p>
            </button>
            <button
                className={`btn single-mode ${playWith === 'friend' ? 'active' : ''}`}
              onClick={() => setPlayWith("friend")}
            >
              <p>Friend</p>
            </button>
          </div>

          <p className="play-color">Play with {playWith} as</p>
          <div className="modes-list">
            <button
              className="btn single-mode"
              onClick={() => {
                getGameID("white");
              }}
            >
              <p>White</p>
            </button>
            <button
              className="btn single-mode"
              onClick={() => {
                getGameID("black");
              }}
            >
              <p>black</p>
            </button>
            <button
              className="btn single-mode"
              onClick={() => {
                getGameID();
              }}
            >
              <p>random</p>
            </button>
          </div>
        </header>
      </section>
    </>
  );
};

export default Play;
