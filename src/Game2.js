import React, { useEffect, useState } from 'react'
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useParams } from 'react-router-dom'

const Game = () => {
    const [game, setGame] = useState(new Chess());
    const [history, setHistory] = useState([]);
    // const [currentTimeout, setCurrentTimeout] = useState();

    // function safeGameMutate(modify) {
    //     setGame((g) => {
    //         const update = g;
    //         modify(update);
    //         return update;
    //     });
    // }

    // function makeRandomMove() {
    //     const possibleMoves = game.moves();
    //     console.log(possibleMoves);
    //     // exit if the game is over
    //     if (game.isGameOver || game.isDraw() || possibleMoves.length === 0) return;

    //     const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    //     safeGameMutate((game) => {
    //         game.move(possibleMoves[randomIndex]);
    //     });
    // }

    function onDrop(sourceSquare, targetSquare) {
        // console.log('yes', game.fen());
        // const gameCopy = game;
        // safeGameMutate((game) => {
        const gameCopy = new Chess(game.fen());
        let move = gameCopy.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q", // always promote to a queen for example simplicity
        });
        console.log(move.flags);
        // });
        // console.log('yes', gameCopy.fen());

        // illegal move
        if (move === null) return false;

        const newHistory = [...history, game];
        // Handle promotion
        // if (move.flags.includes('p')) {
        //     const promotionPiece = window.prompt('Choose promotion piece (q, r, b, n):');
        //     gameCopy.move({ from: move.to, to: move.to, promotion: promotionPiece });
        //     if (move === null) {
        //         return false;
        //     }
        //     // setGame(gameCopy); // Update game state with new position after promotion
        // }
        if (move.flags.includes('p')) {
            gameCopy.load(game.fen());
            const promotionPiece = window.prompt('Choose promotion piece (q, r, b, n):');
            gameCopy.move({ from: move.from, to: move.to, promotion: promotionPiece, noMove: true });
            setGame(gameCopy); // Update game state with new position after promotion
        }
        console.log(newHistory);
        setGame(gameCopy);
        setHistory(newHistory);

        // store timeout so it can be cleared on undo/reset so computer doesn't execute move
        // const newTimeout = setTimeout(makeRandomMove, 200);
        // setCurrentTimeout(newTimeout);
        // setTimeout(makeRandomMove, 200);
        return true;
    }

    function handleUndo() {
        if (history.length === 0) {
            return;
        }
        const lastGame = history[history.length - 1];
        const newHistory = history.slice(0, history.length - 1);
        setGame(lastGame);
        setHistory(newHistory);
    }
    // useEffect(()=>{},[game]);
    return (
        <div style={{
            margin: '3rem auto',
            maxWidth: '70vh',
            width: '70vw'
        }}>
            <Chessboard
                // id="PlayVsRandom"
                position={game.fen()}
                onPieceDrop={onDrop}
                customBoardStyle={{
                    borderRadius: "4px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                }}
            />
            <button
            // onClick={() => {
            //     // safeGameMutate((game) => {
            //     //     game.reset();
            //     // });
            //     // clearTimeout(currentTimeout);
            // }}
            >
                reset
            </button>
            <button
                onClick={handleUndo}
            >
                undo
            </button>
        </div>
    );
}
export default Game