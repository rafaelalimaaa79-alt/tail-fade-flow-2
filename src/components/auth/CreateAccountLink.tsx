
import React from "react";

interface CreateAccountLinkProps {
  onClick: () => void;
}

const CreateAccountLink: React.FC<CreateAccountLinkProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-white/80 hover:text-white transition-colors"
    >
      Don't have an account? <span className="text-primary">Go to Home</span>
    </button>
  );
};

export default CreateAccountLink;
