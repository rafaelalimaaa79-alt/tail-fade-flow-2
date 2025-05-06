
import React from "react";
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
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-bold">Bet History</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <BettorTimeFilter
            activeFilter={timeframe}
            onChange={onTimeframeChange}
            className="mb-4"
          />
          
          <div className="max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-onetime-purple border-t-transparent"></div>
              </div>
            ) : bets.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Bet</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead className="text-right">Units</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bets.map((bet) => (
                    <TableRow key={bet.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(bet.timestamp), 'MM/dd/yy')}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{bet.betType}</div>
                          <div className="text-xs text-gray-500">{bet.odds}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                          bet.result === 'W' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {bet.result}
                        </span>
                      </TableCell>
                      <TableCell className={`text-right font-medium ${
                        bet.unitsWonLost >= 0 ? 'text-onetime-green' : 'text-onetime-red'
                      }`}>
                        {bet.unitsWonLost >= 0 ? '+' : ''}{bet.unitsWonLost}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
