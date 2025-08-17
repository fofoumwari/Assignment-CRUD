// Card.jsx

import React from 'react';

// Define the props interface for the Card component
interface CardProps {
  children: React.ReactNode;
}

// Update the component to use the new CardProps interface
const Card = ({ children }: CardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md space-y-10 space-x-4 overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      {children}
    </div>
  );
};

export default Card;