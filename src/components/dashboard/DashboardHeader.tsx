
import React from "react";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  getPortfolioRect?: () => DOMRect | null;
}

const DashboardHeader = ({ getPortfolioRect }: DashboardHeaderProps) => {
  return null; // This component is no longer needed since we moved the header to the main page
};

export default DashboardHeader;
