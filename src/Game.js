import { Chess } from 'chess.js';
import React, { useContext, useEffect, useState } from 'react';
// import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useParams } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router-dom';
import { GameContext } from './GameContext';

const URL = 'http://localhost:5000/game'; // or 'https://localhost:5000/game' if using HTTPS
const Game = () => {
    const { id: gameID } = useParams();
    const [gameUpdated, setGameUpdated] = useState(false);
    const [gameReady, setGameReady] = useState(false);
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
        console.log(playerDetails);
        if (playerDetails.type === "player") {
            setColor(playerDetails.player.color);
        }
        return new Chess(playerDetails.fen);
    }

    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     console.log(token);
    //     if (!token) {
    //         hist.replace('/login');
    //     }
    //     assignColor(token).then((newChess) => {
    //         setGame(newChess);
    //         setGameUpdated(true);
    //     });
    // }, [])
    // const sendJoinedMessage = () => {
    //     webSocket.send(JSON.stringify({ type: 'joined'}));
    // };
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
        // assignColor(token).then((newChess) => {
        //     setGame(newChess);
        // });
        const ws = new WebSocket(`ws://localhost:5000/game/${gameID}?token=${token}`);
        setWebSocket(ws);
        ws.addEventListener('open', () => {
            console.log('WebSocket connection established.');
        });

        ws.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
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
                    const chess = new Chess(message.gameState.gameStatefen);
                    setGame(chess);
                    setHistory(newHistory);
                    break;
                case 'joined':
                    if (message.gameStatus === 'ongoing') {
                        console.log('hi');
                        setGameReady(true);
                    }
                    break;
                //   case 'chat':
                //     // Handle chat message
                //     const { username, text } = message.payload;
                //     displayChatMessage(username, text);
                //     break;
                default:
                    console.log(`Unknown message type: ${message.type}`);
            }
            console.log(`Received message: ${event.data}`);
        });

        ws.addEventListener('close', () => {
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
    }, [game])

    // Return the JSX for the Game component
    return (
        <div style={{
            margin: '3rem auto',
            maxWidth: '70vh',
            width: '70vw'
        }}>
            {color}<br />
            {game.fen()}
            {!gameReady && <h2>waiting for other player to join</h2>}
            {gameUpdated &&gameReady&& <Chessboard
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
            />}
            <button onClick={handleReset}>reset</button>
            <button onClick={handleUndo}>undo</button>
        </div>
    );
}
export default Game