import { Chess } from 'chess.js';
import React, { useContext, useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { useParams } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Chat2 from '../Components/Chat';
import { GameContext } from '../Components/GameContext';
import copy from '../Images/copy-text-svgrepo-com.svg';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;
const WS_URL = `${import.meta.env.VITE_API_WS_URL}`;
const URL = `${BASE_URL}/game`;

let ws;
let clientSet = false;

const Game = () => {
    const [messages, setMessages] = useState(null);
    const { id: gameID } = useParams();
    const location = useLocation();
    const [socketStatus, setSocketStatus] = useState('closing');
    const [gameUpdated, setGameUpdated] = useState(false);
    const [correctGameID, setCorrectGameID] = useState(true);
    const [gameReady, setGameReady] = useState(false);
    const [status, setStatus] = useState(null);
    const [playerNames, setPlayerNames] = useState([]);
    const hist = useHistory();
    const [chat, setChat] = useState([]);
    const [msg, setMsg] = useState('');
    const {
        game,
        onSquareClick,
        onSquareRightClick,
        onDrop,
        squareStyles,
        checkStyle,
        prevMoveStyle,
        handleReset,
        handleUndo,
        updateCheckStyle,
        color,
        setColor,
        webSocket,
        setWebSocket,
        setSelectedSquare,
        setPossibleMoves,
        setSquareStyles,
        setCheckStyle,
        setPrevMoveStyle,
        setGame,
        history,
        setHistory
    } = useContext(GameContext);

    // Define styles for the chessboard
    const boardStyle = {
        borderRadius: '5px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
    };
    const assignColor = async (token) => {
        const response = await fetch(`${URL}/${gameID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({}),
        });
        const playerDetails = await response.json();
        if (playerDetails.msg) {
            console.log('Incorrect gameID');
            toast.error('Incorrect Game ID');
            setCorrectGameID(false);
            return new Chess();
        }
        if (playerDetails.type === "player") {
            setColor(playerDetails.player.color);
        }
        setChat(playerDetails.chat);
        return new Chess(playerDetails.fen);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!msg) {
            return;
        }
        ws.send(JSON.stringify({ type: 'chat', payload: msg }));
        setMsg('');
    }

    useEffect(() => {
        if (socketStatus == 'closing' && !clientSet && gameUpdated) {
            const token = localStorage.getItem('token');
            connectSocket(token);
            clientSet = true;
            setSocketStatus('opening')
        }
    }, [socketStatus, gameUpdated])

    function connectSocket(token) {
        ws = new WebSocket(`ws://${(WS_URL ? (WS_URL) : (window.location.host))}/${gameID}?token=${token}`);
        setWebSocket(ws);

        ws.addEventListener('open', function (m) {
            console.log('WebSocket connection established.');
            toast.success('Connection Successful');
        });

        ws.onmessage = function (e) {
            const message = JSON.parse(e.data);
            switch (message.type) {
                case 'move':
                    // Handle move message
                    const { from, to } = message.payload;
                    const newHistory = [...history, game];
                    setSelectedSquare('');
                    setPossibleMoves([]);
                    setSquareStyles({});
                    setCheckStyle({});
                    const updateprevStyle = {};
                    updateprevStyle[from] = {
                        backgroundColor: 'rgba(172, 255, 47, 0.4)',
                    }
                    updateprevStyle[to] = {
                        backgroundColor: 'rgba(172, 255, 47, 0.55)',
                    }
                    setPrevMoveStyle(updateprevStyle);
                    const chess = new Chess(message.gameStatefen);
                    setGame(chess);
                    setHistory(newHistory);
                    break;
                case 'joined':
                    if (message.gameStatus === 'ongoing') {
                        setGameReady(true);
                        console.log('someone joined');
                        let players = {};
                        const arr = [...message.players];
                        arr.forEach(element => {
                            let color;
                            if (element.color === 'white')
                                color = 'w';
                            else if (element.color === 'black')
                                color = 'b';
                            players[color] = element.playerName;
                        });
                        setPlayerNames(players);
                    }
                    break;
                case 'chat':
                    setChat((prevChat) => [...prevChat, message.payload]);
                    break;
                default:
                    console.log(`Unknown message type: ${message.type}`);
            }
        };
        ws.onclose = function (e) {
            setTimeout(() => {
                setSocketStatus('closing')
            }, 10);
        };

        ws.onerror = function (err) {
            ws.close();
            console.error(err);
        };
    }

    // }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            hist.replace('/login');
        }
        assignColor(token).then((newChess) => {
            setGame(newChess);
            setGameUpdated(true);
        });
    }, [])

    // Define effect to update checkStyle when game is in check
    useEffect(() => {
        if (game && color && !game.isGameOver() && gameReady) {
            if (((game.turn() === 'w') ? 'white' : 'black') === color) {
                toast('Your turn');
            }
        }
        updateCheckStyle();
        if (game.isGameOver()) {
            setGameReady(true);
            let st;
            if (game.isCheckmate()) {
                const winner = game.turn() === 'w' ? 'Black' : 'White';
                st = `${winner} wins by checkmate!`;
            }
            if (game.isStalemate()) {
                st = 'The game is drawn by a stalemate position!';
            }
            if (game.isThreefoldRepetition()) {
                st = 'The game is drawn by threefold repetition!';
            }
            if (game.isInsufficientMaterial()) {
                st = 'The game is drawn by insufficient material!';
            }
            if (game.isDraw()) {
                st = 'The game is drawn.';
            }
            setStatus(st);
            toast.info(st, {
                autoClose: 5000
            });
        }
    }, [game])

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
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
            {
                correctGameID && !gameReady && <>
                    <h2>waiting for other player to join</h2>
                    <div>
                        <p>Send this link to your friend to start the game</p>
                        {/* <br />Click to copy<br /> */}
                        <span className='game-link' onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast('Link copied to clipboard');
                        }}>{window.location.href}<img src={copy}/></span>
                    </div>
                </>
            }
            {
                correctGameID && gameUpdated && gameReady &&
                <>
                    <div className='game-details'>
                        {color && <h2>You play as {color}</h2>}
                        {!color && <h2>You are spectating</h2>}
                        {!game.isGameOver() && ((game.turn() === 'w') ? 'white' : 'black') === color && <h2>Its your turn to play</h2>}
                        {status && <h2>{status}</h2>}
                    </div>
                    <section className='game-comp'>
                        <div className='chess'>
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
                                    ...prevMoveStyle
                                }}
                                playerNames={playerNames}
                            />
                        </div>
                        <Chat2 chat={chat} msg={msg} setMsg={setMsg} handleSubmit={handleSubmit} />
                    </section>
                </>
            }
        </>
    );
}
export default Game