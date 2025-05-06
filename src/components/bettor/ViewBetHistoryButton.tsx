
import React from "react";
import { List } from "lucide-react";
import { Button } from "@/components/ui/button";

type ViewBetHistoryButtonProps = {
  onClick: () => void;
};

const ViewBetHistoryButton: React.FC<ViewBetHistoryButtonProps> = ({ onClick }) => {
  return (
    <Button 
      onClick={onClick}
      variant="outline"
      className="mt-4 w-full border-onetime-purple py-6 text-onetime-purple hover:bg-onetime-purple hover:text-white"
    >
      <List className="mr-2 h-5 w-5" />
      View Bet History
    </Button>
  );
};

export default ViewBetHistoryButton;
