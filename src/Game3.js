import React, { useEffect, useState } from 'react'
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useParams } from 'react-router-dom'
import { logDOM } from '@testing-library/react';

const Game = () => {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState('');
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [squareStyles, setSquareStyles] = useState({});
  const [checkStyle, setCheckStyle] = useState({});
  const [prevMoveStyle, setPrevMoveStyle] = useState({});
  const [history, setHistory] = useState([]);

  function onSquareClick(square) {
    if (selectedSquare !== '') {
      const moves = game.moves({ square: selectedSquare, verbose: true });
      if (moves.filter((move) => move.to === square).length) {
        return onDrop(selectedSquare, square);
      }
      setSelectedSquare('');
      setPossibleMoves([]);
      setSquareStyles({});
      return;
    }
    const moves = game.moves({ square: square, verbose: true });
    // console.log(square,'moves', moves);
    // console.log(typeof(square));

    // Highlight possible moves
    const squaresToHighlight = moves.map((move) => {
      return move.to;
    });

    const updatedSquareStyles = {};
    squaresToHighlight.forEach(sq => {
      console.log(game.get(sq));
      updatedSquareStyles[sq] = {
        background:
          game.get(sq) && game.get(square).color !== game.get(sq).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
    });

    setPossibleMoves(squaresToHighlight);
    setSelectedSquare(square);
    setSquareStyles(updatedSquareStyles);
  }

  function onSquareRightClick(square) {
    setSelectedSquare('');
    setPossibleMoves([]);
    setSquareStyles({});
  }

  function onDrop(sourceSquare, targetSquare) {
    const gameCopy = new Chess(game.fen());
    let move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });
    // console.log(move.flags);

    // illegal move
    if (move === null) return false;

    const newHistory = [...history, game];
    console.log(newHistory);
    setSelectedSquare('');
    setPossibleMoves([]);
    setSquareStyles({});
    setCheckStyle({});
    const updateprevStyle={};
    updateprevStyle[sourceSquare]={ 
      backgroundColor: 'rgba(172, 255, 47, 0.4)',
    }
    updateprevStyle[targetSquare]={
      backgroundColor: 'rgba(172, 255, 47, 0.55)',
    }
    setPrevMoveStyle(updateprevStyle);
    // Handle promotion
    if (move.flags.includes('p')) {
      gameCopy.load(game.fen());
      const promotionPiece = window.prompt('Choose promotion piece (q, r, b, n):');
      gameCopy.move({ from: move.from, to: move.to, promotion: promotionPiece, noMove: true });
      setGame(gameCopy); // Update game state with new position after promotion
    }
    setGame(gameCopy);
    setHistory(newHistory);
    return true;
  }
  const boardStyle = {
    borderRadius: '5px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
  };

  // console.log('squareStyles:', squareStyles); // log statement


  function handleUndo() {
    console.log(history);
    if (history.length === 0) {
      return;
    }
    const lastGame = history[history.length - 1];
    const newHistory = history.slice(0, history.length - 1);
    setGame(lastGame);
    setHistory(newHistory);
  }
  function handleReset() {
    if (history.length === 0) {
      return;
    }
    const newGame = new Chess();
    setHistory([]);
    setGame(newGame);
  }
  function getCurrentPlayerKingPosition() {
    const board = game.board();
    const currCol = game.turn();
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (piece && piece.type === 'k' && piece.color === currCol) {
          return piece.square;
        }
      }
    }
    // King not found (should not happen in a legal game)
    return null;
  }
  useEffect(() => {
    console.log('hi');
    if (game.inCheck()) {
      console.log('oops');
      const pos = getCurrentPlayerKingPosition();
      console.log('pos',pos);
      if (pos) {
        const styleObj = {};
        styleObj[pos]={
          // background: 
          // "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)",
          // "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
          background: 'rgba(255, 0, 0, 0.800)',
            // borderRadius: "50%",
              // backgroundColor: 'red'
        }
        setCheckStyle(styleObj);
      }
    }
  }, [game])

  return (
    <div style={{
      margin: '3rem auto',
      maxWidth: '70vh',
      width: '70vw'
    }}>
      <Chessboard
        // id="PlayVsRandom"
        position={game.fen()}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
        onPieceDrop={onDrop}
        // onDrop={onDrop}
        boardStyle={boardStyle}
        squareStyles={squareStyles}
        customSquareStyles={{
          ...squareStyles,
          ...checkStyle,
          ...prevMoveStyle
        }}
      // selectedSquare={selectedSquare}
      // customBoardStyle={{
      //   borderRadius: "4px",
      //   boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
      // }}
      />
      <button
        onClick={handleReset}
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