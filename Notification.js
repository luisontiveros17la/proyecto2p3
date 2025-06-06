import React, { useEffect } from 'react';

function Notification({ message, type, visible, onClose }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className={`alert alert-${type} fixed-top m-3`} style={{ zIndex: 9999 }}>
      {message}
    </div>
  );
}

export default Notification;
