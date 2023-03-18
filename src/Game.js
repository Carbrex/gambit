import React, { useContext, useEffect, useState } from 'react';
// import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useParams } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router-dom';
import { GameContext } from './GameContext';

const URL = 'http://localhost:5000/game'; // or 'https://localhost:5000/game' if using HTTPS
const Game = () => {
    const { id: gameID } = useParams();
    const history = useHistory();
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
        setColor
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
    }
    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log(token);
        if (!token) {
            history.replace('/login');
        }
        assignColor(token);
        console.log(color);
        const ws = new WebSocket(`ws://localhost:5000/game/${gameID}?token=${token}`);

        ws.addEventListener('open', () => {
            console.log('WebSocket connection established.');
        });

        ws.addEventListener('message', (event) => {
            console.log(`Received message: ${event.data}`);
        });

        ws.addEventListener('close', () => {
            console.log('WebSocket connection closed.');
        });

        // ws.send('Hello, server!');
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
            {color}
            <Chessboard
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
            />
            <button onClick={handleReset}>reset</button>
            <button onClick={handleUndo}>undo</button>
        </div>
    );
}
export default Game