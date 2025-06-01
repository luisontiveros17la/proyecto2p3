// src/components/ChatList.js
import React, { useState } from 'react';
import './ChatList.css';
// Importamos los íconos
import { FiSettings } from 'react-icons/fi';
import { MdDonutLarge } from 'react-icons/md';
import { BsArchiveFill } from 'react-icons/bs';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { RiInboxUnarchiveFill } from 'react-icons/ri';

function ChatList({
  contacts,
  setSelectedContact,
  handleToggleFavorite,
  handleToggleArchive,
}) {
  const [search, setSearch] = useState('');
  // Estado para el filtro: 'none' (normal), 'archived' o 'favorites'
  const [filterMode, setFilterMode] = useState('none');
  // Estado para mostrar u ocultar el menú de configuración
  const [showSettings, setShowSettings] = useState(false);

  // Filtrado por búsqueda:
  let filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );

  // Se aplica el filtro según el modo seleccionado:
  if (filterMode === 'archived') {
    filteredContacts = filteredContacts.filter((contact) => contact.archived);
  } else if (filterMode === 'favorites') {
    filteredContacts = filteredContacts.filter(
      (contact) => contact.favorite && !contact.archived
    );
  } else {
    // Modo normal: mostrar sólo contactos no archivados.
    filteredContacts = filteredContacts.filter(
      (contact) => !contact.archived
    );
  }

  // Funciones para alternar el filtro en el footer
  const toggleArchiveFilter = () => {
    setFilterMode((prevMode) =>
      prevMode === 'archived' ? 'none' : 'archived'
    );
    // Cerrar el menú de configuración si estuviera abierto
    setShowSettings(false);
  };

  const toggleFavoriteFilter = () => {
    setFilterMode((prevMode) =>
      prevMode === 'favorites' ? 'none' : 'favorites'
    );
    setShowSettings(false);
  };

  // Función para alternar el menú de configuración
  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
    // Al abrir el menú, reiniciamos el filtro (opcional)
    // setFilterMode('none');
  };

  // Función para "cerrar sesión". Se intenta cerrar la ventana.
  const handleLogout = () => {
    // Intenta cerrar la ventana; si no es posible, redirige a una página en blanco.
    window.close();
    // Si window.close() no funciona (por restricciones del navegador), también se puede:
    // window.location.href = 'about:blank';
  };

  // Función para manejar opciones no implementadas
  const handleNotImplemented = (option) => {
    alert(`La opción ${option} no está implementada todavía.`);
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
      </div>
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

      {/* Menú de configuración */}
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
            onClick={handleLogout}
          >
            Cerrar sesión
          </div>
        </div>
      )}

      {/* Footer con iconos (configuración, estado, filtro archivados y filtro favoritos) */}
      <div className="chat-list-footer">
        <button className="footer-icon" onClick={toggleSettings}>
          <FiSettings />
        </button>
        <button className="footer-icon" onClick={() => { setShowSettings(false); }}>
          <MdDonutLarge />
        </button>
        <button
          className={`footer-icon ${
            filterMode === 'archived' ? 'active' : ''
          }`}
          onClick={toggleArchiveFilter}
        >
          <BsArchiveFill />
        </button>
        <button
          className={`footer-icon ${
            filterMode === 'favorites' ? 'active' : ''
          }`}
          onClick={toggleFavoriteFilter}
        >
          <AiFillStar />
        </button>
      </div>
    </div>
  );
}

export default ChatList;
