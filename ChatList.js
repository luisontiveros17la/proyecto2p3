// src/components/ChatList.js
import React, { useState } from 'react';
import './ChatList.css';
// Importamos los íconos
import { FiSettings, FiPlus } from 'react-icons/fi';
import { MdDonutLarge } from 'react-icons/md';
import { BsArchiveFill } from 'react-icons/bs';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { RiInboxUnarchiveFill } from 'react-icons/ri';

function ChatList({
  contacts,
  setSelectedContact,
  handleToggleFavorite,
  handleToggleArchive,
  handleAddContact,
  handleCreateGroup,
  handleNotImplemented,  // Recibida como prop
}) {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState('none');
  const [showSettings, setShowSettings] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);

  // Estados para "Agregar Contacto"
  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const [newContactName, setNewContactName] = useState('');

  // Estados para crear grupo
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groupSelection, setGroupSelection] = useState({});
  const [groupName, setGroupName] = useState('');

  let filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );
  if (filterMode === 'archived') {
    filteredContacts = filteredContacts.filter((contact) => contact.archived);
  } else if (filterMode === 'favorites') {
    filteredContacts = filteredContacts.filter(
      (contact) => contact.favorite && !contact.archived
    );
  } else {
    filteredContacts = filteredContacts.filter((contact) => !contact.archived);
  }

  const toggleArchiveFilter = () => {
    setFilterMode((prev) => (prev === 'archived' ? 'none' : 'archived'));
    setShowSettings(false);
  };

  const toggleFavoriteFilter = () => {
    setFilterMode((prev) => (prev === 'favorites' ? 'none' : 'favorites'));
    setShowSettings(false);
  };

  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
    setShowPlusMenu(false);
  };

  const togglePlusMenu = () => {
    setShowPlusMenu((prev) => !prev);
    setShowSettings(false);
  };

  const handleAddContactClick = () => {
    setShowPlusMenu(false);
    setShowAddContactForm(true);
  };

  const submitAddContact = () => {
    if (!newContactName.trim()) {
      alert('Ingrese el nombre del contacto.');
      return;
    }
    handleAddContact(newContactName);
    setShowAddContactForm(false);
    setNewContactName('');
  };

  const cancelAddContact = () => {
    setShowAddContactForm(false);
    setNewContactName('');
  };

  const handleCreateGroupClick = () => {
    setShowPlusMenu(false);
    const selection = {};
    contacts.forEach((contact) => {
      if (!contact.archived) {
        selection[contact.name] = false;
      }
    });
    setGroupSelection(selection);
    setGroupName('');
    setShowGroupForm(true);
  };

  const handleGroupCheckboxChange = (contactName) => {
    setGroupSelection((prev) => ({
      ...prev,
      [contactName]: !prev[contactName],
    }));
  };

  const submitGroupCreation = () => {
    if (!groupName.trim()) {
      alert('Ingrese un nombre para el grupo.');
      return;
    }
    const selectedNames = Object.keys(groupSelection).filter(
      (name) => groupSelection[name]
    );
    if (selectedNames.length === 0) {
      alert('Seleccione al menos un contacto para crear el grupo.');
      return;
    }
    handleCreateGroup(groupName, selectedNames);
    setShowGroupForm(false);
    setGroupSelection({});
    setGroupName('');
  };

  const cancelGroupCreation = () => {
    setShowGroupForm(false);
    setGroupSelection({});
    setGroupName('');
  };

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <input
          type="text"
          placeholder="Buscar o empezar un chat"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="plus-btn" onClick={togglePlusMenu}>
          <FiPlus />
        </button>
        {showPlusMenu && (
          <div className="plus-menu">
            <div className="plus-menu-item" onClick={handleAddContactClick}>
              Agregar contacto
            </div>
            <div className="plus-menu-item" onClick={handleCreateGroupClick}>
              Crear grupo
            </div>
          </div>
        )}
      </div>

      {/* Formulario para agregar contacto */}
      {showAddContactForm && (
        <div className="add-contact-form">
          <h4>Agregar Contacto</h4>
          <input
            type="text"
            placeholder="Nombre del contacto"
            value={newContactName}
            onChange={(e) => setNewContactName(e.target.value)}
          />
          <div className="form-buttons">
            <button onClick={submitAddContact}>Agregar</button>
            <button onClick={cancelAddContact}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="contact-list">
        {filteredContacts.map((contact, idx) => (
          <div
            key={idx}
            className="chat-list-item"
            onClick={() => setSelectedContact(contact.name)}
          >
            <div className="contact-info">
              <span className="contact-name">{contact.name}</span>
            </div>
            <div
              className="contact-actions"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => handleToggleFavorite(contact.name)}
                className="action-btn"
              >
                {contact.favorite ? (
                  <AiFillStar color="#FFD700" />
                ) : (
                  <AiOutlineStar />
                )}
              </button>
              <button
                onClick={() => handleToggleArchive(contact.name)}
                className="action-btn"
              >
                {contact.archived ? (
                  <RiInboxUnarchiveFill color="green" />
                ) : (
                  <BsArchiveFill />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showGroupForm && (
        <div className="group-form">
          <h4>Crear Grupo</h4>
          <input
            type="text"
            className="group-name-input"
            placeholder="Nombre del grupo"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <div className="group-contacts">
            {contacts
              .filter((contact) => !contact.archived)
              .map((contact, idx) => (
                <div key={idx} className="group-contact-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={groupSelection[contact.name] || false}
                      onChange={() => handleGroupCheckboxChange(contact.name)}
                    />
                    {contact.name}
                  </label>
                </div>
              ))}
          </div>
          <div className="group-form-buttons">
            <button onClick={submitGroupCreation}>Crear grupo</button>
            <button onClick={cancelGroupCreation}>Cancelar</button>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="settings-menu">
          <div
            className="settings-menu-item"
            onClick={() => handleNotImplemented('Cuenta')}
          >
            Cuenta
          </div>
          <div
            className="settings-menu-item"
            onClick={() => handleNotImplemented('Chats')}
          >
            Chats
          </div>
          <div
            className="settings-menu-item"
            onClick={() => handleNotImplemented('Audio y Video')}
          >
            Audio y Video
          </div>
          <div
            className="settings-menu-item"
            onClick={() => handleNotImplemented('Notificaciones')}
          >
            Notificaciones
          </div>
          <div
            className="settings-menu-item"
            onClick={() => handleNotImplemented('Personalización de chats')}
          >
            Personalización de chats
          </div>
          <div
            className="settings-menu-item"
            onClick={() => handleNotImplemented('Almacenamiento')}
          >
            Almacenamiento
          </div>
          <div
            className="settings-menu-item"
            onClick={() => handleNotImplemented('Atajos')}
          >
            Atajos
          </div>
          <div
            className="settings-menu-item"
            onClick={() => handleNotImplemented('Ayuda')}
          >
            Ayuda
          </div>
          <div
            className="settings-menu-item logout"
            onClick={() => {
              window.close();
              // o window.location.href = 'about:blank';
            }}
          >
            Cerrar sesión
          </div>
        </div>
      )}

      <div className="chat-list-footer">
        <button className="footer-icon" onClick={toggleSettings}>
          <FiSettings />
        </button>
        <button
          className="footer-icon"
          onClick={() => setShowSettings(false)}
        >
          <MdDonutLarge />
        </button>
        <button
          className={`footer-icon ${
            filterMode === 'archived' ? 'active' : ''
          }`}
          onClick={() => {
            setShowSettings(false);
            toggleArchiveFilter();
          }}
        >
          <BsArchiveFill />
        </button>
        <button
          className={`footer-icon ${
            filterMode === 'favorites' ? 'active' : ''
          }`}
          onClick={() => {
            setShowSettings(false);
            toggleFavoriteFilter();
          }}
        >
          <AiFillStar />
        </button>
      </div>
    </div>
  );
}

export default ChatList;
