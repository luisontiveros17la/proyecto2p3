// src/App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import './App.css';

const socket = io('http://localhost:5000');
const userId = uuidv4();

// Contactos iniciales
const initialContacts = [
  { name: 'Contacto 1', favorite: false, archived: false },
  { name: 'Contacto 2', favorite: false, archived: false },
  { name: 'Contacto 3', favorite: false, archived: false },
];

// Estados simulados de cada contacto
const contactStatuses = {
  'Contacto 1': true,
  'Contacto 2': false,
  'Contacto 3': true,
};

function App() {
  const [contacts, setContacts] = useState(initialContacts);
  const [selectedContact, setSelectedContact] = useState(initialContacts[0].name);
  const [chats, setChats] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('message', ({ contact, msg }) => {
      setChats((prevChats) => {
        const currentMessages = prevChats[contact] || [];
        if (currentMessages.some((m) => m.id === msg.id)) return prevChats;
        return { ...prevChats, [contact]: [...currentMessages, msg] };
      });
    });
    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMsg = { id: uuidv4(), userId, text: message, time, status: 'sent' };
      socket.emit('message', { contact: selectedContact, msg: newMsg });
      setChats((prevChats) => {
        const msgs = prevChats[selectedContact] || [];
        return { ...prevChats, [selectedContact]: [...msgs, newMsg] };
      });
      setMessage('');

      // Simulación de actualización de estado
      setTimeout(() => {
        setChats((prevChats) => {
          const msgs = prevChats[selectedContact] || [];
          if (msgs.length === 0) return prevChats;
          msgs[msgs.length - 1].status = 'delivered';
          return { ...prevChats, [selectedContact]: [...msgs] };
        });
      }, 2000);
      setTimeout(() => {
        setChats((prevChats) => {
          const msgs = prevChats[selectedContact] || [];
          if (msgs.length === 0) return prevChats;
          msgs[msgs.length - 1].status = 'read';
          return { ...prevChats, [selectedContact]: [...msgs] };
        });
      }, 4000);
    }
  };

  // Alterna favorito
  const handleToggleFavorite = (contactName) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) => {
        if (contact.name === contactName) {
          const newFav = !contact.favorite;
          alert(`Contacto ${contactName} ${newFav ? 'marcado como favorito' : 'desmarcado de favoritos'}`);
          return { ...contact, favorite: newFav };
        }
        return contact;
      })
    );
  };

  // Archiva o desarchiva un contacto
  const handleToggleArchive = (contactName) => {
    setContacts((prevContacts) => {
      const updatedContacts = prevContacts.map((contact) => {
        if (contact.name === contactName) {
          const newArchived = !contact.archived;
          alert(`Contacto ${contactName} ${newArchived ? 'archivado' : 'desarchivado'}`);
          return { ...contact, archived: newArchived };
        }
        return contact;
      });
      if (updatedContacts.find((c) => c.name === contactName)?.archived && selectedContact === contactName) {
        const activeContacts = updatedContacts.filter((c) => !c.archived);
        setSelectedContact(activeContacts.length ? activeContacts[0].name : '');
      }
      return updatedContacts;
    });
  };

  // Función para agregar nuevo contacto (se mantiene igual)
  const handleAddContact = () => {
    const newName = prompt('Ingrese el nombre del nuevo contacto:');
    if (newName && newName.trim()) {
      setContacts((prev) => [...prev, { name: newName.trim(), favorite: false, archived: false }]);
      alert(`Contacto ${newName.trim()} agregado`);
    }
  };

  // Actualizamos la función de crear grupo para que reciba el nombre del grupo y los contactos seleccionados
  const handleCreateGroup = (groupName, selectedContacts) => {
    if (!groupName.trim()) {
      alert('Debe ingresar un nombre para el grupo.');
      return;
    }
    if (selectedContacts.length === 0) {
      alert('Seleccione al menos un contacto para crear un grupo.');
      return;
    }
    setContacts((prev) => [...prev, { name: groupName.trim(), favorite: false, archived: false }]);
    alert(`Grupo creado: ${groupName.trim()}`);
  };

  return (
    <div className="app-container">
      <ChatList
        contacts={contacts}
        setSelectedContact={setSelectedContact}
        handleToggleFavorite={handleToggleFavorite}
        handleToggleArchive={handleToggleArchive}
        handleAddContact={handleAddContact}
        handleCreateGroup={handleCreateGroup}
      />
      <div className="chat-panel">
        <ChatWindow
          messages={chats[selectedContact] || []}
          userId={userId}
          contactName={selectedContact}
          status={contactStatuses[selectedContact] ? 'En línea' : 'Desconectado'}
        />
        <ChatInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
    </div>
  );
}

export default App;
