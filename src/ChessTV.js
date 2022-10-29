import React, { useState, useEffect } from 'react'

const ChessTV = () => {
    const [size, setSize] = useState(window.innerWidth);
    const checkSize = () => {
        setSize(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', checkSize);
    }, [])
    return (
        <article className="chess-tv">
            <h2>Chess TV</h2>
            {
                (size < 350) && <iframe title='lichessTV' src="https://lichess.org/tv/frame?theme=blue2&bg=dark&pieceSet=pirouetti" style={{ width: '177px', height: '222px' }} allowtransparency="true" frameborder="0"></iframe>
            }
            {
                (size < 500 && size >= 350) && <iframe title='lichessTV' src="https://lichess.org/tv/frame?theme=blue2&bg=dark&pieceSet=pirouetti" style={{ width: '290px', height: '333px' }} allowtransparency="true" frameborder="0"></iframe>
            }
            {
                (size >= 500 && size < 800) && <iframe title='lichessTV' src="https://lichess.org/tv/frame?theme=blue2&bg=dark&pieceSet=pirouetti" style={{ width: `400px`, height: '444px' }} allowtransparency="true" frameborder="0"></iframe>
            }
            {
                (size >= 800) && <iframe title='lichessTV' src="https://lichess.org/tv/frame?theme=blue2&bg=dark&pieceSet=pirouetti" style={{ width: `600px`, height: '640px' }} allowtransparency="true" frameborder="0"></iframe>
            }
        </article>
    )
}

export default ChessTV