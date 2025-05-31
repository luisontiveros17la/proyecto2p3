import React from 'react';

function ChatList({ contactos, setSelectedChat }) {
  return (
    <ul className="list-group">
      {contactos.map((contact, index) => (
        <li 
          key={index} 
          className="list-group-item chat-item" 
          onClick={() => setSelectedChat(contact)}>
          {contact}
        </li>
      ))}
    </ul>
  );
}

export default ChatList;
