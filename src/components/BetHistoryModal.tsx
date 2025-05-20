
import React, { useRef, useEffect } from "react";
import { X } from "lucide-react";
import { format } from "date-fns";
import { BettorBet } from "@/types/bettor";
import BettorTimeFilter from "@/components/BettorTimeFilter";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

type BetHistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  bets: BettorBet[];
  timeframe: '1D' | '1W' | '1M' | '3M' | '1Y';
  onTimeframeChange: (timeframe: '1D' | '1W' | '1M' | '3M' | '1Y') => void;
  isLoading: boolean;
};

const BetHistoryModal: React.FC<BetHistoryModalProps> = ({
  isOpen,
  onClose,
  bets,
  timeframe,
  onTimeframeChange,
  isLoading
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div 
        ref={modalRef}
        className="max-h-[90vh] w-full max-w-md overflow-hidden rounded-xl bg-card border border-white/10 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-800 p-4 sticky top-0 bg-card">
          <h2 className="text-lg font-bold text-white">Bet History</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-800"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        
        <div className="p-4">
          <BettorTimeFilter
            activeFilter={timeframe}
            onChange={onTimeframeChange}
            className="mb-4"
          />
          
          <div className="max-h-[50vh] overflow-y-auto pb-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-onetime-purple border-t-transparent"></div>
              </div>
            ) : bets.length > 0 ? (
              <div className="overflow-x-auto -mx-4 px-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs">Bet</TableHead>
                      <TableHead className="text-xs">Result</TableHead>
                      <TableHead className="text-xs text-right">Units</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bets.map((bet) => (
                      <TableRow key={bet.id} className="border-b border-gray-800">
                        <TableCell className="py-2 px-2 text-xs whitespace-nowrap">
                          {format(new Date(bet.timestamp), 'MM/dd/yy')}
                        </TableCell>
                        <TableCell className="py-2 px-2">
                          <div className="text-xs">
                            <div>{bet.betType}</div>
                            <div className="text-xs text-gray-500">{bet.odds}</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 px-2">
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                            bet.result === 'W' 
                              ? 'bg-green-900/30 text-green-400' 
                              : 'bg-red-900/30 text-red-400'
                          }`}>
                            {bet.result}
                          </span>
                        </TableCell>
                        <TableCell className={`py-2 px-2 text-right font-medium text-xs ${
                          bet.unitsWonLost >= 0 ? 'text-onetime-green' : 'text-onetime-red'
                        }`}>
                          {bet.unitsWonLost >= 0 ? '+' : ''}{bet.unitsWonLost}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-10 text-center text-gray-500">
                No bet history found for this timeframe
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetHistoryModal;
