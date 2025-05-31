// src/components/ChatWindow.js
import React from 'react';
import './ChatWindow.css';

function ChatWindow({ messages, userId, selectedChat, status }) {
  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-info">
          <h4>{selectedChat}</h4>
          <span className="contact-status">{status}</span>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.userId === userId ? 'sent' : 'received'}`}
          >
            <div className="message-text">{msg.text}</div>
            <div className="message-info">
              <span className="message-time">{msg.time}</span>
              {msg.userId === userId && (
                <span className="message-status">
                  {msg.status === 'sent' && <span className="check sent-check">✓</span>}
                  {msg.status === 'delivered' && <span className="check delivered-check">✓✓</span>}
                  {msg.status === 'read' && <span className="check read-check">✓✓</span>}
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
