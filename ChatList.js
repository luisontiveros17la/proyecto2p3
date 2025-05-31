// src/components/ChatList.js
import React, { useState } from 'react';
import './ChatList.css';

function ChatList({ contactos, setSelectedChat }) {
  const [search, setSearch] = useState("");

  const filteredContacts = contactos.filter(contact =>
    contact.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="chat-list">
      <div className="chat-list-search">
        <input 
          type="text" 
          placeholder="Buscar contacto..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {filteredContacts.map((contact, index) => (
        <div 
          key={index} 
          className="chat-list-item" 
          onClick={() => setSelectedChat(contact)}
        >
          {contact}
        </div>
      ))}
    </div>
  );
}

export default ChatList;
