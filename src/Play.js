import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
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
                <header className='tags-header'>
                    <h4>modes</h4>
                    <hr />
                </header>
                <div className="tags-list">
                    <button className='btn' onClick={() => handleClick('all')}>All</button>
                    <button className='btn' onClick={() => handleClick('bullet')}>Bullet</button>
                    <button className='btn' onClick={() => handleClick('blitz')}>Blitz</button>
                    <button className='btn' onClick={() => handleClick('rapid')}>Rapid</button>
                    <button className='btn' onClick={() => handleClick('classical')}>Classical</button>
                </div>
            </div>
            <div className="modes-list">
                {
                    mode.map((item) => {
                        const { id, type, initial, increment } = item;
                        // return <button key={id} className="btn single-mode">
                        //     {/* <Link key={id} className="" to={`/play/t=${initial}&i=${increment}`}> */}
                        //     <h3>{`${initial}+${increment}`}</h3>
                        //     <p>{type}</p>
                        //     {/* </Link> */}
                        // </button>

                        return <Link key={id} className="btn single-mode" to={`/play/t=${initial}&i=${increment}`}>
                            {/* <button key={id} className="btn single-mode"> */}
                            <h3>{`${initial}+${increment}`}</h3>
                            <p>{type}</p>
                            {/* </button> */}
                        </Link>
                    })
                    // btn single-mode
                }
            </div>
        </section>
    </>
    )
}

export default Play