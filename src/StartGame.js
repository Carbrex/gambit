import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
const url = 'http://localhost:5000/game'; // or 'https://localhost:5000/game' if using HTTPS

const StartGame = (color) => {
    const [gameID, setGameID] = useState(null);
    const history = useHistory();
    const getGameID = async (token) => {
        const response = await fetch(`${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({}),
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
        getGameID(token);
    }, [])
    useEffect(() => {
        console.log(history);
        if (gameID) {
            history.push(`/play/${gameID}`);
        }
    }, [gameID, history]);
    return (
        <div>
            <h2>
                Initializing game....
                What side do you want
            </h2>
            <button onClick={() => getGameID(0)}>White</button>
            <button onClick={() => getGameID(1)}>Black</button>
            <button onClick={() => getGameID(Math.floor(Math.random() * 2))}>Random</button>
        </div>
    )
}

export default StartGame