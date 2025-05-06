
import React from 'react';

interface EmptyMatchesStateProps {
  message: string;
}

const EmptyMatchesState: React.FC<EmptyMatchesStateProps> = ({ message }) => {
  return (
    <div className="text-center py-4">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};

export default EmptyMatchesState;
