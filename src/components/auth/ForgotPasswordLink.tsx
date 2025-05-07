
import React from "react";

interface ForgotPasswordLinkProps {
  onClick: () => void;
}

const ForgotPasswordLink: React.FC<ForgotPasswordLinkProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-white/80 hover:text-white transition-colors"
    >
      Forgot password?
    </button>
  );
};

export default ForgotPasswordLink;
