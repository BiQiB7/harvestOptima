// HelpButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HelpButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/help');
  };

  return (
    <button 
      onClick={handleClick}
      style={{
        position: 'fixed',
        marginTop:'20px',
        right: '20px',
        padding: '10px 15px',
        fontSize: '18px',
        backgroundColor: '#F33334',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      Help
    </button>
  );
};

export default HelpButton;