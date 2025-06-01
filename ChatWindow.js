// src/components/ChatWindow.js
import React from 'react';
import './ChatWindow.css';

function ChatWindow({ messages, userId, contactName, status }) {
  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="header-info">
          <span className="contact-name">{contactName}</span>
          <span className="contact-status">{status}</span>
        </div>
      </div>
      <div className="chat-content">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-bubble ${msg.userId === userId ? 'sent' : 'received'}`}
          >
            <div className="bubble-text">{msg.text}</div>
            <div className="bubble-info">
              <span className="bubble-time">{msg.time}</span>
              {msg.userId === userId && (
                <span className="bubble-status">
                  {msg.status === 'sent' && <span className="check sent-check">&#10003;</span>}
                  {msg.status === 'delivered' && <span className="check delivered-check">&#10003;&#10003;</span>}
                  {msg.status === 'read' && <span className="check read-check">&#10003;&#10003;</span>}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatWindow;
