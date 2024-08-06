import React from 'react';
import { useNavigate } from 'react-router-dom';

const HelpButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/help');
  };

  return (
    // <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
      <button 
        onClick={handleClick}
        style={{
          padding: '10px 15px',
          backgroundColor: '#F33334',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Help
      </button>
    // </div>
  );
};

export default HelpButton;
