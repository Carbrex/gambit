import React, { useState, useEffect } from 'react'

const ChessTV = () => {
    const [size, setSize] = useState(window.innerWidth);
    const [boardSize, setBoardSize] = useState({width:'0px', height:'0px'});
    const checkSize = () => {
        setSize(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', checkSize);
    }, [])
    useEffect(() => {
        if (size < 350) {
            setBoardSize({width:'177px',height:'222px'});
        }
        else if (size < 500 && size >= 350) {
            setBoardSize({width:'290px',height:'333px'});
        }
        else if (size >= 500 && size < 800) {
            setBoardSize({width:'400px',height:'444px'});  
        }
        else {
            setBoardSize({width:'600px',height:'640px'});  
        }
    }, [size])
    return (
        <article className="chess-tv">
            <h2>Chess TV</h2>
            <ChessTVBoard boardSize={boardSize}/>
        </article>
    )
}
const ChessTVBoard=({boardSize})=>{
    const {width,height}=boardSize;
    return <iframe title='lichessTV' src="https://lichess.org/tv/frame?theme=blue2&bg=dark&pieceSet=pirouetti" style={{ width: `${width}`, height: `${height}` }} allowtransparency="true" frameBorder="0"/>
}
export default ChessTV