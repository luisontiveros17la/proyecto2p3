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

const socket = io('http://192.168.0.124:5000'); // Se conecta a la IP proporcionada
const userId = uuidv4();

// Contactos iniciales
const initialContacts = [
  { name: 'Contacto 1', favorite: false, archived: false },
  { name: 'Contacto 2', favorite: false, archived: false },
  { name: 'Contacto 3', favorite: false, archived: false },
];

// Estados simulados de conexión ("En línea" o "Desconectado")
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
  const [notification, setNotification] = useState({ message: '', type: 'info', visible: false });
  
  // Estado de los modales
  const [editModal, setEditModal] = useState({ show: false, tempName: '', originalName: '' });
  const [addContactModal, setAddContactModal] = useState({ show: false, contactName: '' });
  const [createGroupModal, setCreateGroupModal] = useState({ show: false, groupName: '', selections: {} });

  // Función para mostrar notificaciones
  const showNotification = useCallback((msg, type = 'info') => {
    setNotification({ message: msg, type, visible: true });
  }, []);

  useEffect(() => {
    socket.on('message', ({ contact, msg }) => {
      setChats(prevChats => {
        const currentMessages = prevChats[contact] || [];
        if (currentMessages.some(m => m.id === msg.id)) return prevChats;
        return { ...prevChats, [contact]: [...currentMessages, msg] };
      });
    });
    return () => socket.off('message');
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMsg = { id: uuidv4(), userId, text: message, time, status: 'sent' };
      socket.emit('message', { contact: selectedContact, msg: newMsg });
      setChats(prevChats => {
        const msgs = prevChats[selectedContact] || [];
        return { ...prevChats, [selectedContact]: [...msgs, newMsg] };
      });
      setMessage('');
      setTimeout(() => {
        setChats(prevChats => {
          const msgs = prevChats[selectedContact] || [];
          if (!msgs.length) return prevChats;
          msgs[msgs.length - 1].status = 'delivered';
          return { ...prevChats, [selectedContact]: [...msgs] };
        });
      }, 2000);
      setTimeout(() => {
        setChats(prevChats => {
          const msgs = prevChats[selectedContact] || [];
          if (!msgs.length) return prevChats;
          msgs[msgs.length - 1].status = 'read';
          return { ...prevChats, [selectedContact]: [...msgs] };
        });
      }, 4000);
    }
  };

  return (
    <div className="app-container">
      <ChatList
        contacts={contacts}
        setSelectedContact={setSelectedContact}
        onShowAddContactModal={() => setAddContactModal({ show: true, contactName: '' })}
        onShowCreateGroupModal={() => setCreateGroupModal({ show: true, groupName: '', selections: {} })}
      />
      <div className="chat-panel">
        <ChatWindow
          messages={chats[selectedContact] || []}
          userId={userId}
          contactName={selectedContact}
          status={contactStatuses[selectedContact] ? 'En línea' : 'Desconectado'}
          setEditContactModal={setEditModal}
        />
        <ChatInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <Notification
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification(prev => ({ ...prev, visible: false }))}
      />

      {/* Modal Editar Contacto */}
      {editModal.show && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Editar Contacto</h5>
                <button type="button" className="close" onClick={() => setEditModal({ show: false })}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  value={editModal.tempName}
                  onChange={(e) => setEditModal({ ...editModal, tempName: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => {
                  setContacts(prevContacts => prevContacts.map(contact =>
                    contact.name === editModal.originalName ? { ...contact, name: editModal.tempName.trim() } : contact));
                  setSelectedContact(editModal.tempName.trim());
                  setEditModal({ show: false });
                }}>Guardar</button>
                <button className="btn btn-secondary" onClick={() => setEditModal({ show: false })}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
