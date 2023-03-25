import React, { useState, useEffect } from 'react'
import { Chessboard } from 'react-chessboard';
import { useHistory, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
const url = 'http://localhost:5000/game'; // or 'https://localhost:5000/game' if using HTTPS

const Play = () => {
    const [gameID, setGameID] = useState(null);
    const location = useLocation();
    const history = useHistory();
    const getGameID = async (color) => {
        const token = localStorage.getItem('token');
        if (color !== 'white' && color !== 'black') {
            color = null;
        }
        const response = await fetch(`${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ color }),
        });
        // const resjson = await response.json();
        // console.log(resjson);
        if (response.ok) {
            const resjson = await response.json();
            console.log(resjson);
            const { status, gameID: id } = resjson;
            setGameID(id);
        }
    }
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            history.replace('/login');
        }
    }, [])
    useEffect(() => {
        console.log(history);
        if (gameID) {
            history.push(`/play/${gameID}`);
        }
    }, [gameID, history]);

    return (<>
        <section className="modes-container">
            <div className='chessboard'>
                <Chessboard
                    arePiecesDraggable={false}
                />
            </div>
            <header>
                <h2 id='modes-heading'>Play a game</h2>
                <h4 id='modes-heading'>Play with your friends as</h4>
                <div className="modes-list">
                    <button className="btn single-mode" onClick={() => { getGameID('white') }}>
                        <h3>White</h3>
                    </button>
                    <button className="btn single-mode" onClick={() => { getGameID('black') }}>
                        <h3>black</h3>
                    </button>
                    <button className="btn single-mode" onClick={() => { getGameID() }}>
                        <h3>random</h3>
                    </button>
                </div>
            </header>
        </section>
    </>
    )
}

export default Play