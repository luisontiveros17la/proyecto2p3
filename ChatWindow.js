import React from 'react';
import { IoLogoWhatsapp } from "react-icons/io";
import './ChatWindow.css';

function ChatWindow({ messages, userId, selectedChat }) {
  return (
    <div className="chat-window">
      <div className="chat-header">
        <IoLogoWhatsapp size={30} color="#25D366" />
        <span className="chat-title">{selectedChat}</span>
      </div>
      {messages.map((msg, index) => (
        <div key={index} className={`message-container ${msg.userId === userId ? 'sent' : 'received'}`}>
          <div className="message-bubble">{msg.text}</div>
          <div className="timestamp">{msg.time}</div>
        </div>
      ))}
    </div>
  );
}

export default ChatWindow;
