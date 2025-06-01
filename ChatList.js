// src/components/ChatList.js
import React, { useState } from 'react';
import './ChatList.css';

function ChatList({ contacts, setSelectedContact }) {
  const [search, setSearch] = useState('');
  const filteredContacts = contacts.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <input
          type="text"
          placeholder="Buscar o empezar un chat"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="contact-list">
        {filteredContacts.map((contact, idx) => (
          <div key={idx} className="chat-list-item" onClick={() => setSelectedContact(contact)}>
            <div className="contact-info">
              <span className="contact-name">{contact}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatList;
