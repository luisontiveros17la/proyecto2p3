import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import Notification from './components/Notification';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { MdBuild } from 'react-icons/md';

const socket = io('http://localhost:5000');
const userId = uuidv4();

// Contactos iniciales
const initialContacts = [
  { name: 'Contacto 1', favorite: false, archived: false },
  { name: 'Contacto 2', favorite: false, archived: false },
  { name: 'Contacto 3', favorite: false, archived: false },
];

// Estados simulados de conexión de cada contacto
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
  const [notification, setNotification] = useState({
    message: '',
    type: 'info',
    visible: false,
  });

  // Función para mostrar notificaciones (usando Bootstrap)
  const showNotification = useCallback((msg, type = 'info') => {
    setNotification({ message: msg, type, visible: true });
  }, []);

  // Función para las opciones no implementadas (mostrando un ícono de mantenimiento y texto en rojo)
  const handleNotImplemented = (option) => {
    showNotification(
      <span>
        <MdBuild style={{ marginRight: '5px' }} />
        La opción "{option}" no está disponible en este momento.
      </span>,
      'danger'
    );
  };

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
      const time = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      const newMsg = { id: uuidv4(), userId, text: message, time, status: 'sent' };
      socket.emit('message', { contact: selectedContact, msg: newMsg });
      setChats((prevChats) => {
        const msgs = prevChats[selectedContact] || [];
        return { ...prevChats, [selectedContact]: [...msgs, newMsg] };
      });
      setMessage('');

      // Simulación: Actualización del estado del mensaje a "delivered" y "read"
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

  const handleToggleFavorite = (contactName) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) => {
        if (contact.name === contactName) {
          const newFav = !contact.favorite;
          showNotification(
            `Contacto ${contactName} ${newFav ? 'marcado como favorito' : 'desmarcado de favoritos'}`,
            'success'
          );
          return { ...contact, favorite: newFav };
        }
        return contact;
      })
    );
  };

  const handleToggleArchive = (contactName) => {
    setContacts((prevContacts) => {
      const updatedContacts = prevContacts.map((contact) => {
        if (contact.name === contactName) {
          const newArchived = !contact.archived;
          showNotification(
            `Contacto ${contactName} ${newArchived ? 'archivado' : 'desarchivado'}`,
            newArchived ? 'warning' : 'info'
          );
          return { ...contact, archived: newArchived };
        }
        return contact;
      });
      if (
        updatedContacts.find((c) => c.name === contactName)?.archived &&
        selectedContact === contactName
      ) {
        const activeContacts = updatedContacts.filter((c) => !c.archived);
        setSelectedContact(activeContacts.length ? activeContacts[0].name : '');
      }
      return updatedContacts;
    });
  };

  // Función actualizada para agregar un nuevo contacto (recibe el nombre)
  const handleAddContact = (newContactName) => {
    if (newContactName && newContactName.trim()) {
      setContacts((prev) => [
        ...prev,
        { name: newContactName.trim(), favorite: false, archived: false },
      ]);
      showNotification(`Contacto ${newContactName.trim()} agregado`, 'success');
    }
  };

  // Función para crear grupo que recibe el nombre del grupo y los contactos seleccionados
  const handleCreateGroup = (groupName, selectedContacts) => {
    if (!groupName.trim()) {
      showNotification('Debe ingresar un nombre para el grupo.', 'danger');
      return;
    }
    if (selectedContacts.length === 0) {
      showNotification('Seleccione al menos un contacto para crear un grupo.', 'danger');
      return;
    }
    setContacts((prev) => [
      ...prev,
      { name: groupName.trim(), favorite: false, archived: false },
    ]);
    showNotification(`Grupo creado: ${groupName.trim()}`, 'success');
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
        handleNotImplemented={handleNotImplemented}
      />
      <div className="chat-panel">
        <ChatWindow
          messages={chats[selectedContact] || []}
          userId={userId}
          contactName={selectedContact}
          status={contactStatuses[selectedContact] ? 'En línea' : 'Desconectado'}
        />
        <ChatInput
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <Notification
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() =>
          setNotification((prev) => ({ ...prev, visible: false }))
        }
      />
    </div>
  );
}

export default App;
