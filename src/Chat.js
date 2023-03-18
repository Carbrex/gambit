import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const Chat = () => {
    const { id: chatID } = useParams();
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // console.log('hi');
    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:5000/chat/${chatID}`); // replace '123' with the actual chat ID
        // const ws = new WebSocket('ws://localhost:5000/chat/123');
        setSocket(ws);
        // console.log('hi');
        // Connection opened
        ws.addEventListener('open', function (event) {
            console.log('Connected to WS Server')
        });

        // Listen for messages
        ws.addEventListener('message', function (event) {
            console.log('Message from server ', event.data);
        });

        // ws.onmessage = (event) => {
            //     setMessages((messages) => [...messages, event.data]);
            // };
            return () => {
            // ws.removeEventListener('open');
            // ws.removeEventListener('message');
            ws.close();
        };
    }, []);
    useEffect(() => {
        console.log(`${chatID}`);
    }, [chatID])
    
    const sendMessage = () => {
        if (socket) {
            // console.log(message);
            socket.send(message);
            setMessage('');
        }
    };

    return (
        <div className="App">
            <h1>Chat App{`${chatID}`}</h1>
            <div className="Messages">
                {messages.map((message, index) => (
                    <div key={index}>{message}</div>
                    ))}
            </div>
            <div className="Input">
                <input type="text" value={message} onChange={(event) => setMessage(event.target.value)} />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}
export default Chat