import { Chess } from 'chess.js';
import React, { useContext, useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { useParams } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Chat2 from '../Components/Chat';
import { GameContext } from '../Components/GameContext';

const URL = '/game';

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
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            hist.replace('/login');
        }
        assignColor(token).then((newChess) => {
            setGame(newChess);
            setGameUpdated(true);
        });
        const ws = new WebSocket(`ws://${window.location.host}/game/${gameID}?token=${token}`);
        setWebSocket(ws);
        ws.addEventListener('open', () => {
            console.log('WebSocket connection established.');
            toast.success('Connection Successful');
        });

        ws.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);
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
        });
        ws.addEventListener('close', () => {
            console.log('Connection failed');
            toast.error('Connection failed');
        });
        return () => {
            // ws.removeEventListener('open');
            // ws.removeEventListener('message');
            ws.close();
        };
    }, [])

    // Define effect to update checkStyle when game is in check
    useEffect(() => {
        if (game && color &&!game.isGameOver()) {
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
                st = 'The game is drawn by fifty-move rule!';
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
                correctGameID && !gameReady && <><h2>waiting for other player to join</h2>
                    <p>Send this link to your friend to start the game <br />Click to copy<br /><span className='game-link' onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast('Link copied to clipboard');
                    }}>{window.location.href}</span></p>
                </>
            }
            {
                correctGameID && gameUpdated && gameReady &&
                <>
                    <div className='game-details'>
                        {color && <h2>You play as {color}</h2>}
                        {!color && <h2>You are spectating</h2>}
                        {!game.isGameOver()&&((game.turn() === 'w') ? 'white' : 'black') === color && <h2>Its your turn to play</h2>}
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