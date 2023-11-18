import React from 'react';

const Call = ({ phoneNumber }) => {
  const handleCall = () => {
    window.open(`tel:${phoneNumber}`);
  };

  return (
    <button className='btn call' onClick={handleCall}>
      <i className="fa fa-phone"></i>
    </button>
  );
};

export default Call;
