import { Chess } from "chess.js";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { useParams } from "react-router-dom";
import { useHistory, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Chat2 from "../Components/Chat";
import { GameContext } from "../Components/GameContext";
import copy from "../Images/copy-text-svgrepo-com.svg";
import { joinGame } from "../api";

const WS_URL = `${
  import.meta.env.VITE_API_WS_URL ? import.meta.env.VITE_API_WS_URL : ""
}`;

let ws;

const Game = () => {
  const clientSet = useRef(false);
  const [messages, setMessages] = useState(null);
  const { id: gameID } = useParams();
  const location = useLocation();
  const [socketStatus, setSocketStatus] = useState("closing");
  const [gameUpdated, setGameUpdated] = useState(false);
  const [correctGameID, setCorrectGameID] = useState(true);
  const [gameReady, setGameReady] = useState(false);
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(null);
  const [playerNames, setPlayerNames] = useState([]);
  const hist = useHistory();
  const {
    game,
    onSquareClick,
    onSquareRightClick,
    onDrop,
    squareStyles,
    checkStyle,
    prevMoveStyle,
    updateCheckStyle,
    color,
    setColor,
    setWebSocket,
    setSelectedSquare,
    setPossibleMoves,
    setSquareStyles,
    setCheckStyle,
    setPrevMoveStyle,
    setGame,
    history,
    setHistory,
    showPromotionModal,
    setShowPromotionModal,
    setPromotionFromTo,
    setPromotionPiece,
  } = useContext(GameContext);

  // Define styles for the chessboard
  const boardStyle = {
    borderRadius: "5px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
  };
  const assignColor = async (token) => {
    const playerDetails = await joinGame(token, gameID);
    if (playerDetails.msg) {
      console.log("Incorrect gameID");
      toast.error("Incorrect Game ID");
      setCorrectGameID(false);
      return new Chess();
    }
    if (playerDetails.type === "player") {
      setColor(playerDetails.player.color);
    }
    setChat(playerDetails.chat);
    return new Chess(playerDetails.fen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!msg) {
      return;
    }
    ws.send(JSON.stringify({ type: "chat", payload: msg }));
    setMsg("");
  };

  useEffect(() => {
    console.log("socket status", socketStatus, clientSet.current, gameUpdated);
    if (socketStatus == "closing" && !clientSet.current && gameUpdated) {
      const token = localStorage.getItem("token");
      connectSocket(token);
      console.log("setting client");
      clientSet.current = true;
      setSocketStatus("opening");
    }
  }, [socketStatus, gameUpdated]);

  function connectSocket(token) {
    ws = new WebSocket(
      `ws${WS_URL ? "" : "s"}://${
        WS_URL ? WS_URL : window.location.host
      }/${gameID}?token=${token}`
    );
    setWebSocket(ws);

    ws.addEventListener("open", function (m) {
      console.log("WebSocket connection established.");
      toast.success("Connection Successful");
      console.log("sending message");
    });

    ws.onmessage = function (e) {
      const message = JSON.parse(e.data);
      switch (message.type) {
        case "move":
          // Handle move message
          const { from, to } = message.payload;
          const newHistory = [...history, game];
          setSelectedSquare("");
          setPossibleMoves([]);
          setSquareStyles({});
          setCheckStyle({});
          const updateprevStyle = {};
          updateprevStyle[from] = {
            backgroundColor: "rgba(172, 255, 47, 0.4)",
          };
          updateprevStyle[to] = {
            backgroundColor: "rgba(172, 255, 47, 0.55)",
          };
          setPrevMoveStyle(updateprevStyle);
          const chess = new Chess(message.gameStatefen);
          setGame(chess);
          setHistory(newHistory);
          break;
        case "joined":
          if (message.gameStatus === "ongoing") {
            setGameReady(true);
            console.log("someone joined");
            const arr = [...message.players];
            arr.forEach((element) => {
              let color;
              if (element.color === "white") color = "w";
              else if (element.color === "black") color = "b";
            });
          }
          let players = {};
          if (message.players?.length === 2) {
            for (let i = 0; i < 2; i++) {
              let color;
              if (message.players[i].color === "white") color = "w";
              else if (message.players[i].color === "black") color = "b";
              players[color] = message.players[i].playerName;
            }
            setPlayerNames(players);
          }
          break;
        case "chat":
          setChat((prevChat) => [...prevChat, message.payload]);
          break;
        default:
          console.log(`Unknown message type: ${message.type}`);
      }
    };
    ws.onclose = function (e) {
      setTimeout(() => {
        setSocketStatus("closing");
        clientSet.current = false;
      }, 10);
    };

    ws.onerror = function (err) {
      ws.close();
      console.error(err);
    };
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      hist.replace("/login");
    }
    assignColor(token).then((newChess) => {
      setGame(newChess);
      setGameUpdated(true);
    });
  }, []);

  // Define effect to update checkStyle when game is in check
  useEffect(() => {
    if (game && color && !game.isGameOver() && gameReady) {
      if ((game.turn() === "w" ? "white" : "black") === color) {
        toast("Your turn");
      }
    }
    updateCheckStyle();
    if (game.isGameOver()) {
      setGameReady(true);
      let st;
      if (game.isCheckmate()) {
        const winner = game.turn() === "w" ? "Black" : "White";
        st = `${winner} wins by checkmate!`;
      }
      if (game.isStalemate()) {
        st = "The game is drawn by a stalemate position!";
      }
      if (game.isThreefoldRepetition()) {
        st = "The game is drawn by threefold repetition!";
      }
      if (game.isInsufficientMaterial()) {
        st = "The game is drawn by insufficient material!";
      }
      if (game.isDraw()) {
        st = "The game is drawn!";
      }
      setStatus(st);
      toast.info(st, {
        autoClose: 5000,
      });
    }
  }, [game]);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {!correctGameID && <h2>404 - Game not found</h2>}
      {correctGameID && !gameReady && (
        <div className="waiting">
          <h2>waiting for other player to join</h2>
          <p>Send this link to your friend to start the game</p>
          <span
            className="game-link"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast("Link copied to clipboard");
            }}
          >
            Click to copy link
            <img src={copy} />
          </span>
        </div>
      )}
      {correctGameID && gameUpdated && gameReady && (
        <>
          <div className="game-details">
            {color && <h2>You play as {color}</h2>}
            {!color && <h2>You are spectating</h2>}
            {status && <h2>{status}</h2>}
          </div>
          <section className="game-comp">
            <div className="chess">
              {/* show player name here */}
              <div
                className="hide-modal"
                style={{ display: showPromotionModal ? "block" : "none" }}
              ></div>
              <div
                className="promotion-modal"
                style={{ display: showPromotionModal ? "block" : "none" }}
              >
                <div className="modal-content">
                  <button
                    className="close-promotion-modal btn"
                    onClick={() => {
                      setShowPromotionModal(false);
                      setPromotionFromTo(null);
                      setPromotionPiece(null);
                    }}
                  >
                    &times;
                  </button>
                  <p>Choose promotion piece</p>
                  <button
                    className="btn promotion-piece"
                    onClick={() => {
                      setPromotionPiece("q");
                    }}
                  >
                    Queen
                  </button>
                  <button
                    className="btn promotion-piece"
                    onClick={() => {
                      setPromotionPiece("r");
                    }}
                  >
                    Rook
                  </button>
                  <button
                    className="btn promotion-piece"
                    onClick={() => {
                      setPromotionPiece("b");
                    }}
                  >
                    Bishop
                  </button>
                  <button
                    className="btn promotion-piece"
                    onClick={() => {
                      setPromotionPiece("n");
                    }}
                  >
                    Knight
                  </button>
                </div>
              </div>
              <span>
                {playerNames[color ? (color[0] === "w" ? "b" : "w") : "b"]}
              </span>
              <Chessboard
                boardOrientation={color}
                position={game.fen()}
                onSquareClick={onSquareClick}
                onSquareRightClick={onSquareRightClick}
                onPieceDrop={onDrop}
                boardStyle={boardStyle}
                squareStyles={squareStyles}
                customSquareStyles={{
                  ...squareStyles,
                  ...checkStyle,
                  ...prevMoveStyle,
                }}
                playerNames={playerNames}
              />
              <span>{playerNames[color ? color[0] : "w"]}</span>
            </div>
            <Chat2
              chat={chat}
              msg={msg}
              setMsg={setMsg}
              handleSubmit={handleSubmit}
              showTurn={
                !game.isGameOver() &&
                (game.turn() === "w" ? "white" : "black") === color
              }
              isSpec={!color}
            />
          </section>
        </>
      )}
    </>
  );
};
export default Game;
