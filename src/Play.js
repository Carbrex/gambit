import React, { useState, useEffect } from 'react'
import mode_data from './mode-data'

const Play = () => {
    const [mode, setMode] = useState(mode_data);

    const handleClick = (mode_type) => {
        if (mode_type === 'all') {
            setMode(mode_data);
            return;
        }
        const arr = mode_data.filter((item) => item.type === mode_type);
        setMode([...arr]);
    }
    useEffect(() => {
        handleClick('all');
    }, [])

    return (<>
        <h2 id='modes-heading'>Play a game</h2>
        <section className="modes-container">
            <div className="tags-container">
                <h4>modes</h4>
                <div className="tags-list">
                    <button className='btn' onClick={() => handleClick('all')}>All</button>
                    <button className='btn' onClick={() => handleClick('bullet')}>Bullet</button>
                    <button className='btn' onClick={() => handleClick('blitz')}>Blitz</button>
                    <button className='btn' onClick={() => handleClick('rapid')}>Rapid</button>
                    <button className='btn' onClick={() => handleClick('classical')}>Classical</button>
                </div>
            </div>
            <div class="modes-list">
                {
                    mode.map((item) => {
                        const { id, type, initial, increment } = item;
                        return <button key={id} className="btn single-mode">
                            <h3>{`${initial}+${increment}`}</h3>
                            <p>{type}</p>
                        </button>
                    })
                }
            </div>
        </section>
    </>
    )
}

export default Play