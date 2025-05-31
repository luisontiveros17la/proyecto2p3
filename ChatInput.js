import React from 'react';
import './ChatInput.css';

function ChatInput({ message, setMessage, sendMessage }) {
  return (
    <div className="input-group">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="form-control"
        placeholder="Escribe un mensaje..."
      />
      <button className="btn-send" type="button" onClick={sendMessage}>
        Enviar
      </button>
    </div>
  );
}

export default ChatInput;
