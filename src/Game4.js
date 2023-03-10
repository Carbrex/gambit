import React, { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useParams } from 'react-router-dom';

const Game = () => {
  // Initialize state using the useState hook
  const [game, setGame] = useState(new Chess()); // Chess.js game instance
  const [selectedSquare, setSelectedSquare] = useState(''); // The currently selected square
  const [possibleMoves, setPossibleMoves] = useState([]); // The squares that can be moved to from the selected square
  const [squareStyles, setSquareStyles] = useState({}); // Styling for squares on the board
  const [checkStyle, setCheckStyle] = useState({}); // Styling for the king that is in check
  const [prevMoveStyle, setPrevMoveStyle] = useState({}); // Styling for the previous move
  const [history, setHistory] = useState([]); // Array of previous game positions

  // Function that gets called when a square is clicked
  function onSquareClick(square) {
    if (selectedSquare !== '') {
      // If there is already a selected square, check if the clicked square is a valid move
      const moves = game.moves({ square: selectedSquare, verbose: true });
      if (moves.filter((move) => move.to === square).length) {
        return onDrop(selectedSquare, square);
      }
      // If not, clear the selected square and possible moves
      setSelectedSquare('');
      setPossibleMoves([]);
      setSquareStyles({});
      return;
    }
    // If there is no selected square, get the moves for the clicked square
    const moves = game.moves({ square: square, verbose: true });

    // Highlight possible moves
    const squaresToHighlight = moves.map((move) => {
      return move.to;
    });

    // Styling for highlighted squares
    const updatedSquareStyles = {};
    squaresToHighlight.forEach((sq) => {
      updatedSquareStyles[sq] = {
        background:
          game.get(sq) && game.get(square).color !== game.get(sq).color
            ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%',
      };
    });

    // Set the selected square and possible moves
    setSelectedSquare(square);
    setPossibleMoves(squaresToHighlight);
    setSquareStyles(updatedSquareStyles);
  }

  // Function that gets called when a square is right-clicked
  function onSquareRightClick(square) {
    setSelectedSquare('');
    setPossibleMoves([]);
    setSquareStyles({});
  }

  // Function that gets called when a piece is dropped on the board
  function onDrop(sourceSquare, targetSquare) {
    // Create a copy of the game object to manipulate
    const gameCopy = new Chess(game.fen());

    // Make the move on the copy
    let move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // always promote to a queen for example simplicity
    });

    // Illegal move
    if (move === null) return false;

    // Add the previous game state to the history array
    const newHistory = [...history, game];
    setSelectedSquare('');
    setPossibleMoves([]);
    setSquareStyles({});
    setCheckStyle({});
    const updateprevStyle = {};
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
// Define styles for the chessboard
const boardStyle = {
    borderRadius: '5px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
  };
  
  // Define function to handle undo
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
  
  // Define function to handle reset
  function handleReset() {
    if (history.length === 0) {
      return;
    }
    const newGame = new Chess();
    setHistory([]);
    setGame(newGame);
  }
  
  // Define function to get current player's king position
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
  
  // Define effect to update checkStyle when game is in check
  useEffect(() => {
    console.log('hi');
    if (game.inCheck()) {
      console.log('oops');
      const pos = getCurrentPlayerKingPosition();
      console.log('pos',pos);
      if (pos) {
        const styleObj = {};
        styleObj[pos] = {
          background: 'rgba(255, 0, 0, 0.800)',
        }
        setCheckStyle(styleObj);
      }
    }
  }, [game])
  
  // Return the JSX for the Game component
  return (
    <div style={{
      margin: '3rem auto',
      maxWidth: '70vh',
      width: '70vw'
    }}>
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