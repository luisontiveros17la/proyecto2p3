// src/components/ChatInput.js
import React from 'react';
import './ChatInput.css';

function ChatInput({ message, setMessage, sendMessage }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        placeholder="Escribe un mensaje..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
}

export default ChatInput;
