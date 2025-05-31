import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import './App.css';

const socket = io('http://localhost:5000');
const userId = uuidv4();

// Definimos solo 3 contactos: "Contacto 1", "Contacto 2" y "Contacto 3"
const contactos = [
  'Contacto 1', 
  'Contacto 2', 
  'Contacto 3'
];

// Estado simulado para cada contacto (true = "En línea", false = "Desconectado")
const contactStatuses = {
  'Contacto 1': true,
  'Contacto 2': false,
  'Contacto 3': true
};

function App() {
  const [chats, setChats] = useState({});
  const [selectedChat, setSelectedChat] = useState(contactos[0]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Escucha de mensajes provenientes del servidor.
    socket.on('message', ({ contact, msg }) => {
      // Solo agregamos el mensaje si no existe ya (comprobamos por id)
      setChats((prevChats) => {
        const currentMessages = prevChats[contact] || [];
        if (currentMessages.some(m => m.id === msg.id)) {
          return prevChats;
        }
        return {
          ...prevChats,
          [contact]: [...currentMessages, msg]
        };
      });
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const horaActual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      // Creamos un mensaje con un id único y estado inicial "sent"
      const newMessage = { 
        id: uuidv4(), 
        userId, 
        text: message, 
        time: horaActual, 
        status: 'sent' 
      };
      // Emitir el mensaje al servidor
      socket.emit('message', { contact: selectedChat, msg: newMessage });
      
      // Actualización local optimista
      setChats((prevChats) => ({
        ...prevChats,
        [selectedChat]: [...(prevChats[selectedChat] || []), newMessage]
      }));
      
      // Limpiamos el campo de mensaje
      setMessage('');

      // Simula que a los 2 segundos el mensaje cambia a "delivered"
      setTimeout(() => {
        setChats((prevChats) => {
          const updatedMessages = [...(prevChats[selectedChat] || [])];
          if (updatedMessages.length > 0) {
            updatedMessages[updatedMessages.length - 1].status = 'delivered';
          }
          return { ...prevChats, [selectedChat]: updatedMessages };
        });
      }, 2000);

      // Simula que a los 4 segundos el mensaje cambia a "read"
      setTimeout(() => {
        setChats((prevChats) => {
          const updatedMessages = [...(prevChats[selectedChat] || [])];
          if (updatedMessages.length > 0) {
            updatedMessages[updatedMessages.length - 1].status = 'read';
          }
          return { ...prevChats, [selectedChat]: updatedMessages };
        });
      }, 4000);
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <ChatList 
          contactos={contactos} 
          setSelectedChat={setSelectedChat} 
        />
      </div>
      <div className="chat-area">
        <ChatWindow 
          messages={chats[selectedChat] || []} 
          userId={userId} 
          selectedChat={selectedChat}
          status={contactStatuses[selectedChat] ? 'En línea' : 'Desconectado'}
        />
        <ChatInput 
          message={message} 
          setMessage={setMessage} 
          sendMessage={sendMessage} 
        />
      </div>
    </div>
  );
}

export default App;
