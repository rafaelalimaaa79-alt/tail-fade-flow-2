
import React from 'react';

interface ErrorStateProps {
  message: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message }) => {
  return <div className="text-center text-red-500 py-8">{message}</div>;
};

export default ErrorState;
