import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

const socket = io('http://localhost:5000');
const userId = uuidv4();

const contactos = ['DimaselGei', 'Contacto 2', 'Contacto 3'];

function App() {
  const [chats, setChats] = useState({});
  const [selectedChat, setSelectedChat] = useState(contactos[0]);
  const [message, setMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    // Agrega la clase para la transición y espera 300ms antes de cambiar el modo
    document.body.classList.add('transitioning');
    setTimeout(() => {
      setDarkMode(!darkMode);
      document.body.classList.remove('transitioning');
    }, 300);
  };

  useEffect(() => {
    socket.on('message', ({ contact, msg }) => {
      setChats((prevChats) => ({
        ...prevChats,
        [contact]: [...(prevChats[contact] || []), msg],
      }));
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const horaActual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const mensajeConHora = { userId, text: message, time: horaActual };

      socket.emit('message', { contact: selectedChat, msg: mensajeConHora });
      setMessage('');
    }
  };

  return (
    <div className={`main-container ${darkMode ? 'dark-mode' : ''}`}>
      <button className="toggle-dark-mode" onClick={toggleDarkMode}>
        {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
      </button>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4">
            <ChatList contactos={contactos} setSelectedChat={setSelectedChat} />
          </div>
          <div className="col-md-8">
            <ChatWindow messages={chats[selectedChat] || []} userId={userId} selectedChat={selectedChat} />
            <ChatInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
