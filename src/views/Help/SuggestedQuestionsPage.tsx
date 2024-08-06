import React from 'react';

interface Question {
  topic: string;
  questions: string[];
}

const suggestedQuestions: Question[] = [
  {
    topic: 'Water Management',
    questions: [
      'How often should I water my crops?',
      'What are signs of overwatering?',
      'How can I conserve water in farming?',
    ]
  },
  {
    topic: 'Soil Management',
    questions: [
      'How do I test my soil quality?',
      'What crops are best for sandy soil?',
      'How can I improve soil fertility naturally?',
    ]
  },
  {
    topic: 'Pest Control',
    questions: [
      'What are natural ways to control pests?',
      'How do I identify common crop pests?',
      'When should I use pesticides?',
    ]
  },
];

const SuggestedQuestionsPage: React.FC = () => {
  return (
    <div style={{ padding: '20px'}}>
      <h1>Suggested Questions</h1>
      {suggestedQuestions.map((category, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <h2>{category.topic}</h2>
          <ul>
            {category.questions.map((question, qIndex) => (
              <li key={qIndex} style={{ marginBottom: '10px'}}>{question}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SuggestedQuestionsPage;