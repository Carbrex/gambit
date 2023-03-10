import React, { useEffect, useState } from 'react'
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useParams } from 'react-router-dom'

const Game = () => {
    // const {timeControl} = useParams();
    // useState
    // console.log('params');
    // useEffect
    // console.log(timeControl);
    const [game, setGame] = useState(new Chess());
    // const [currentTimeout, setCurrentTimeout] = useState<NodeJS.Timeout>();

    function safeGameMutate(modify) {
        setGame((g) => {
            const update = { ...g };
            modify(update);
            return update;
        });
    }

    function makeRandomMove() {
        const possibleMoves = game.moves();

        // exit if the game is over
        if (game.game_over() || game.in_draw() || possibleMoves.length === 0) return;

        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        safeGameMutate((game) => {
            game.move(possibleMoves[randomIndex]);
        });
    }

    function onDrop(sourceSquare, targetSquare) {
        const gameCopy = { ...game };
        const move = gameCopy.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q", // always promote to a queen for example simplicity
        });
        setGame(gameCopy);

        // illegal move
        if (move === null) return false;

        // store timeout so it can be cleared on undo/reset so computer doesn't execute move
        //   const newTimeout = setTimeout(makeRandomMove, 200);
        //   setCurrentTimeout(newTimeout);
        return true;
    }

    return (
        <div
            style={{
                margin: '3rem auto',
                maxWidth: '70vh',
                width: '70vw'
            }}
        >
            <Chessboard
                id="PlayVsRandom"
                position={game.fen()}
                onPieceDrop={onDrop}
                customBoardStyle={{
                    borderRadius: "4px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                }}
            />
            <button
                //   style={buttonStyle}
                onClick={() => {
                    safeGameMutate((game) => {
                        game.reset();
                    });
                    // clearTimeout(currentTimeout);
                }}
            >
                reset
            </button>
            <button
                //   style={buttonStyle}
                onClick={() => {
                    safeGameMutate((game) => {
                        game.undo();
                    });
                    // clearTimeout(currentTimeout);
                }}
            >
                undo
            </button>
        </div>
    );

}

export default Game