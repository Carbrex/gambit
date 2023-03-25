import { Chess } from 'chess.js';
import React, { useContext, useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { useParams } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Chat2 from '../Components/Chat';
import { GameContext } from '../Components/GameContext';

const URL = 'http://localhost:5000/game';
const Game = () => {
    const { id: gameID } = useParams();
    const location = useLocation();
    const [gameUpdated, setGameUpdated] = useState(false);
    const [correctGameID, setCorrectGameID] = useState(true);
    const [gameReady, setGameReady] = useState(false);
    const [chat, setChat] = useState([]);
    const [msg, setMsg] = useState('');
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
        console.log(playerDetails);
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
        setMsg('');
        webSocket.send(JSON.stringify({ type: 'chat', payload: msg }));
    }
    console.log(playerNames);
    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log(token);
        if (!token) {
            hist.replace('/login');
        }
        console.log(color);
        assignColor(token).then((newChess) => {
            setGame(newChess);
            setGameUpdated(true);
        });
        const ws = new WebSocket(`ws://localhost:5000/game/${gameID}?token=${token}`);
        setWebSocket(ws);
        ws.addEventListener('open', () => {
            console.log('WebSocket connection established.');
            toast.success('Connection Successful');
        });

        ws.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
            console.log("chat", chat);
            switch (message.type) {
                case 'move':
                    console.log('yes');
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
                    console.log(message);
                    const chess = new Chess(message.gameStatefen);
                    setGame(chess);
                    setHistory(newHistory);
                    break;
                case 'joined':
                    if (message.gameStatus === 'ongoing') {
                        setGameReady(true);
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
                    console.log(chat);
                    setChat((prevChat) => [...prevChat, message.payload]);
                    break;
                default:
                    console.log(`Unknown message type: ${message.type}`);
            }
        });
        ws.addEventListener('close', () => {
            toast.error('Connection failed');
            console.log('WebSocket connection closed.');
        });
        return () => {
            // ws.removeEventListener('open');
            // ws.removeEventListener('message');
            ws.close();
        };
    }, [])

    // Define effect to update checkStyle when game is in check
    useEffect(() => {
        updateCheckStyle();
        if (game.isGameOver()) {
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
                st = 'The game is drawn by fifty-move rule!';
            }
            setStatus(st);
            toast.info(st,{
                autoClose:5000
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
                correctGameID && !gameReady && <><h2>waiting for other player to join</h2>
                    <p>Send this link to your friend to start the game <br />Click to copy<br /><span onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast('Link copied to clipboard');
                    }}>{window.location.href}</span></p>
                </>
            }
            {
                correctGameID && gameUpdated && gameReady &&
                <>
                    <div className='game-details'>
                        {((game.turn() === 'w') ? 'white' : 'black') === color && toast('Your turn') && <h2>Its your turn to play</h2>}
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