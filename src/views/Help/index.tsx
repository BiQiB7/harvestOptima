import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HelpCard {
  title: string;
  icon: string;
  route: string;
}

const helpCards: HelpCard[] = [
  { title: 'Suggested Questions', icon: '❓', route: '/help/suggested-questions' },
  { title: 'Navigating the App', icon: '🧭', route: '/help/navigation-guide' },
  { title: 'Reporting Problems', icon: '🚩', route: '/help/report-problem' },
  { title: 'Additional Resources', icon: '📚', route: '/help/resources' },
  { title: 'Schedule a Call', icon: '📞', route: '/help/schedule-call' },
];

const HelpPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>How can we help you?</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {helpCards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.route)}
            style={{
              width: '150px',
              height: '150px',
              margin: '10px',
              padding: '20px',
              border: '1px solid #ddd',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f9f9f9',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>{card.icon}</div>
            <div>{card.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpPage;
