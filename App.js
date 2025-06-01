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

// Usamos tres contactos genéricos (esto es lo que “no copias” de tu celular)
const contacts = ['Contacto 1', 'Contacto 2', 'Contacto 3'];

// Estado simulado para cada contacto: true = "En línea", false = "Desconectado"
const contactStatuses = {
  'Dimas': true,
  'Contacto 2': false,
  'Contacto 3': true,
};

function App() {
  const [chats, setChats] = useState({});
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('message', ({ contact, msg }) => {
      setChats((prevChats) => {
        const currentMessages = prevChats[contact] || [];
        // Si ya existe el mensaje (por id único) no se vuelve a agregar
        if (currentMessages.some((m) => m.id === msg.id)) return prevChats;
        return {
          ...prevChats,
          [contact]: [...currentMessages, msg],
        };
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
      // Emitir el mensaje al servidor
      socket.emit('message', { contact: selectedContact, msg: newMsg });
      // Actualización local (optimista) del chat
      setChats((prevChats) => {
        const msgs = prevChats[selectedContact] || [];
        return { ...prevChats, [selectedContact]: [...msgs, newMsg] };
      });
      setMessage('');

      // Simulación: a los 2 segundos se actualiza el estado a "delivered"
      setTimeout(() => {
        setChats((prevChats) => {
          const msgs = prevChats[selectedContact] || [];
          if (msgs.length === 0) return prevChats;
          msgs[msgs.length - 1].status = 'delivered';
          return { ...prevChats, [selectedContact]: [...msgs] };
        });
      }, 2000);
      // Simulación: a los 4 segundos se actualiza el estado a "read"
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

  return (
    <div className="app-container">
      {/* Panel lateral de chats */}
      <ChatList contacts={contacts} setSelectedContact={setSelectedContact} />
      {/* Panel del chat */}
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
