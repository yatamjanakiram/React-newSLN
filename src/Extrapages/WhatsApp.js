import React from 'react';
import "./Admin.css"

const WhatsApp = ({ phoneNumber, message }) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
    const handleWhatsAppClick = () => {
      window.open(whatsappUrl, '_blank');
    };
    return (
      <button className=' btn whatsapp' onClick={handleWhatsAppClick}>
        <i className="fa fa-whatsapp"></i>
      </button>
    );
  };
  
  export default WhatsApp;
