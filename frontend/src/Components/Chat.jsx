import React from "react";

const Chat = ({ chat, msg, setMsg, handleSubmit, showTurn }) => {
  return (
    <footer>
      <div className="message-container">
        <h4>{showTurn?'Its your turn to play':'Waiting for opponent...'}</h4>
        <div className="messages">
          <h4>Chat:</h4>
          <div className="chat-box">
            <ul className="chat-list">
              {chat.map((message, i) => {
                return (
                  <li
                    key={i}
                    className={i % 2 ? "lighter" : "darker"}
                  >{`${message.name}: ${message.text}`}</li>
                );
              })}
            </ul>
          </div>
        </div>
        <form className="chatbox" onSubmit={handleSubmit}>
          <div className="send-msg">
            <input
              type="text"
              className="chat form-input"
              placeholder="Send a message"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
            <button type="submit" className="btn">
              send
            </button>
          </div>
        </form>
      </div>
    </footer>
  );
};

export default Chat;
