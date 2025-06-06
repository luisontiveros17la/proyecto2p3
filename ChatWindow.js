import React, { useState } from 'react';
import './ChatWindow.css';
import { BsThreeDotsVertical } from 'react-icons/bs';

function ChatWindow({ messages, userId, contactName, status, setEditContactModal }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const handleEditOption = () => {
    setEditContactModal({
      show: true,
      tempName: contactName,
      originalName: contactName,
    });
    setShowDropdown(false);
  };

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <div className="header-info">
          <span className="contact-name">{contactName}</span>
          <span className="contact-status">{status}</span>
        </div>
        <div className="dropdown-container">
          <button className="dropdown-btn" onClick={toggleDropdown}>
            <BsThreeDotsVertical />
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={handleEditOption}>
                Editar el nombre del contacto
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="chat-window-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.userId === userId ? 'sent' : 'received'}`}>
            <div className="bubble-text">{msg.text}</div>
            <div className="bubble-info">
              <span>{msg.time}</span>
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
