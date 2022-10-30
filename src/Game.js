import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const Game = () => {
    const {timeControl} = useParams();
    // useState
    console.log('params');
    // useEffect
    console.log(timeControl);
    return (
        <div>Game</div>
    )
}

export default Game