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

// Conexión al servidor usando la IP indicada
const socket = io('http://192.168.0.124:5000');
const userId = uuidv4();

// Contactos iniciales
const initialContacts = [
  { name: 'Contacto 1', favorite: false, archived: false },
  { name: 'Contacto 2', favorite: false, archived: false },
  { name: 'Contacto 3', favorite: false, archived: false },
];

// Estados simulados de conexión (para mostrar "En línea" o "Desconectado")
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

  // Estado para el modal de edición de contacto: { show, tempName, originalName }
  const [editModal, setEditModal] = useState({ show: false, tempName: '', originalName: '' });
  // Modal para agregar contacto
  const [addContactModal, setAddContactModal] = useState({ show: false, contactName: '' });
  // Modal para crear grupo: { show, groupName, selections }
  const [createGroupModal, setCreateGroupModal] = useState({ show: false, groupName: '', selections: {} });

  // Función para mostrar notificaciones (Bootstrap)
  const showNotification = useCallback((msg, type = 'info') => {
    setNotification({ message: msg, type, visible: true });
  }, []);

  // Función para opciones no implementadas
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

  const handleToggleFavorite = (contactName) => {
    setContacts(prevContacts =>
      prevContacts.map(contact => {
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
    setContacts(prevContacts => {
      const updatedContacts = prevContacts.map(contact => {
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
      if (updatedContacts.find(c => c.name === contactName)?.archived && selectedContact === contactName) {
        const activeContacts = updatedContacts.filter(c => !c.archived);
        setSelectedContact(activeContacts.length ? activeContacts[0].name : '');
      }
      return updatedContacts;
    });
  };

  // Modal para agregar contacto
  const openAddContactModal = () => {
    setAddContactModal({ show: true, contactName: '' });
  };

  const handleAddContactModal = (name) => {
    if (name && name.trim()) {
      setContacts(prev => [...prev, { name: name.trim(), favorite: false, archived: false }]);
      showNotification(`Contacto ${name.trim()} agregado`, 'success');
      setAddContactModal({ show: false, contactName: '' });
    }
  };

  // Modal para crear grupo
  const openCreateGroupModal = () => {
    const selections = {};
    contacts.forEach(contact => {
      if (!contact.archived) {
        selections[contact.name] = false;
      }
    });
    setCreateGroupModal({ show: true, groupName: '', selections });
  };

  const handleCreateGroupModal = (groupName, selectedContacts) => {
    if (!groupName.trim()) {
      showNotification('Debe ingresar un nombre para el grupo.', 'danger');
      return;
    }
    if (!selectedContacts.length) {
      showNotification('Seleccione al menos un contacto para crear un grupo.', 'danger');
      return;
    }
    setContacts(prev => [...prev, { name: groupName.trim(), favorite: false, archived: false }]);
    showNotification(`Grupo creado: ${groupName.trim()}`, 'success');
    setCreateGroupModal({ show: false, groupName: '', selections: {} });
  };

  // Modal para editar contacto (se abre desde ChatWindow)
  const handleEditContact = (oldName, newName) => {
    if (!newName.trim()) return;
    setContacts(prevContacts =>
      prevContacts.map(contact =>
        contact.name === oldName ? { ...contact, name: newName.trim() } : contact
      )
    );
    if (selectedContact === oldName) {
      setSelectedContact(newName.trim());
    }
    showNotification(`Contacto actualizado a ${newName.trim()}`, 'success');
    setEditModal({ show: false, tempName: '', originalName: '' });
  };

  return (
    <div className="app-container">
      <ChatList
        contacts={contacts}
        setSelectedContact={setSelectedContact}
        handleToggleFavorite={handleToggleFavorite}
        handleToggleArchive={handleToggleArchive}
        onShowAddContactModal={openAddContactModal}
        onShowCreateGroupModal={openCreateGroupModal}
        handleNotImplemented={handleNotImplemented}
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
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Contacto</h5>
                <button type="button" className="close" onClick={() => setEditModal({ show: false, tempName: '', originalName: '' })}>
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
                <button className="btn btn-primary" onClick={() => handleEditContact(editModal.originalName, editModal.tempName)}>
                  Guardar cambios
                </button>
                <button className="btn btn-secondary" onClick={() => setEditModal({ show: false, tempName: '', originalName: '' })}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Agregar Contacto */}
      {addContactModal.show && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Contacto</h5>
                <button type="button" className="close" onClick={() => setAddContactModal({ show: false, contactName: '' })}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre del contacto"
                  value={addContactModal.contactName}
                  onChange={(e) => setAddContactModal({ ...addContactModal, contactName: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => handleAddContactModal(addContactModal.contactName)}>
                  Agregar
                </button>
                <button className="btn btn-secondary" onClick={() => setAddContactModal({ show: false, contactName: '' })}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear Grupo */}
      {createGroupModal.show && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ maxWidth: '400px' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crear Grupo</h5>
                <button type="button" className="close" onClick={() => setCreateGroupModal({ show: false, groupName: '', selections: {} })}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <input 
                  type="text" 
                  className="form-control mb-3"
                  placeholder="Nombre del grupo"
                  value={createGroupModal.groupName}
                  onChange={(e) => setCreateGroupModal({ ...createGroupModal, groupName: e.target.value })}
                />
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {Object.keys(createGroupModal.selections).map(name => (
                    <div key={name} className="form-check">
                      <input 
                        className="form-check-input"
                        type="checkbox"
                        id={`chk-${name}`}
                        checked={createGroupModal.selections[name] || false}
                        onChange={() =>
                          setCreateGroupModal({
                            ...createGroupModal,
                            selections: { 
                              ...createGroupModal.selections,
                              [name]: !createGroupModal.selections[name]
                            },
                          })
                        }
                      />
                      <label className="form-check-label" htmlFor={`chk-${name}`}>
                        {name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    const selected = Object.keys(createGroupModal.selections).filter(
                      name => createGroupModal.selections[name]
                    );
                    handleCreateGroupModal(createGroupModal.groupName, selected);
                  }}
                >
                  Crear Grupo
                </button>
                <button className="btn btn-secondary" onClick={() => setCreateGroupModal({ show: false, groupName: '', selections: {} })}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
