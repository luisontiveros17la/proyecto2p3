import React, { useState } from 'react';
import './ChatList.css';
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
  onShowAddContactModal,
  onShowCreateGroupModal,
  handleNotImplemented,
}) {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState('none');
  const [showSettings, setShowSettings] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);

  let filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );
  if (filterMode === 'archived') {
    filteredContacts = filteredContacts.filter(contact => contact.archived);
  } else if (filterMode === 'favorites') {
    filteredContacts = filteredContacts.filter(contact => contact.favorite && !contact.archived);
  } else {
    filteredContacts = filteredContacts.filter(contact => !contact.archived);
  }

  const toggleArchiveFilter = () => {
    setFilterMode(prev => (prev === 'archived' ? 'none' : 'archived'));
    setShowSettings(false);
  };

  const toggleFavoriteFilter = () => {
    setFilterMode(prev => (prev === 'favorites' ? 'none' : 'favorites'));
    setShowSettings(false);
  };

  const toggleSettings = () => {
    setShowSettings(prev => !prev);
    setShowPlusMenu(false);
  };

  const togglePlusMenu = () => {
    setShowPlusMenu(prev => !prev);
    setShowSettings(false);
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
            <div
              className="plus-menu-item"
              onClick={() => {
                onShowAddContactModal();
                setShowPlusMenu(false);
              }}
            >
              Agregar contacto
            </div>
            <div
              className="plus-menu-item"
              onClick={() => {
                onShowCreateGroupModal();
                setShowPlusMenu(false);
              }}
            >
              Crear grupo
            </div>
          </div>
        )}
      </div>
      <div className="contact-list">
        {filteredContacts.map((contact, index) => (
          <div
            key={index}
            className="chat-list-item"
            onClick={() => setSelectedContact(contact.name)}
          >
            <div className="contact-info">
              <span className="contact-name">{contact.name}</span>
            </div>
            <div className="contact-actions" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => handleToggleFavorite(contact.name)} className="action-btn">
                {contact.favorite ? <AiFillStar color="#FFD700" /> : <AiOutlineStar />}
              </button>
              <button onClick={() => handleToggleArchive(contact.name)} className="action-btn">
                {contact.archived ? <RiInboxUnarchiveFill color="green" /> : <BsArchiveFill />}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-list-footer">
        <button className="footer-icon" onClick={toggleSettings}>
          <FiSettings />
        </button>
        <button className="footer-icon" onClick={() => setShowSettings(false)}>
          <MdDonutLarge />
        </button>
        <button className={`footer-icon ${filterMode === 'archived' ? 'active' : ''}`} onClick={toggleArchiveFilter}>
          <BsArchiveFill />
        </button>
        <button className={`footer-icon ${filterMode === 'favorites' ? 'active' : ''}`} onClick={toggleFavoriteFilter}>
          <AiFillStar />
        </button>
      </div>
      {showSettings && (
        <div className="settings-menu">
          <div className="settings-menu-item" onClick={() => handleNotImplemented('Cuenta')}>
            Cuenta
          </div>
          <div className="settings-menu-item" onClick={() => handleNotImplemented('Chats')}>
            Chats
          </div>
          <div className="settings-menu-item" onClick={() => handleNotImplemented('Audio y Video')}>
            Audio y Video
          </div>
          <div className="settings-menu-item" onClick={() => handleNotImplemented('Notificaciones')}>
            Notificaciones
          </div>
          <div className="settings-menu-item" onClick={() => handleNotImplemented('Personalización de chats')}>
            Personalización de chats
          </div>
          <div className="settings-menu-item" onClick={() => handleNotImplemented('Almacenamiento')}>
            Almacenamiento
          </div>
          <div className="settings-menu-item" onClick={() => handleNotImplemented('Atajos')}>
            Atajos
          </div>
          <div className="settings-menu-item" onClick={() => handleNotImplemented('Ayuda')}>
            Ayuda
          </div>
          <div className="settings-menu-item logout" onClick={() => window.close()}>
            Cerrar sesión
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatList;
