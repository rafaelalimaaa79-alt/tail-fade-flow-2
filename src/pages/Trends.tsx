
import React, { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import TrendsHeader from "@/components/trends/TrendsHeader";
import TrendsTitle from "@/components/trends/TrendsTitle";
import TrendsList from "@/components/trends/TrendsList";
import TrendsNotificationHandler from "@/components/trends/TrendsNotificationHandler";
import BadgeAnimationHandler from "@/components/dashboard/BadgeAnimationHandler";
import TopTenReveal from "@/components/trends/TopTenReveal";
import ProfileIcon from "@/components/common/ProfileIcon";
import HeaderChatIcon from "@/components/common/HeaderChatIcon";
import InlineSmackTalk from "@/components/InlineSmackTalk";
import { useInlineSmackTalk } from "@/hooks/useInlineSmackTalk";
import { trendData } from "@/data/trendData";
import { useNavigate } from "react-router-dom";
import FloatingSyncButton from "@/components/common/FloatingSyncButton";

const Trends = () => {
  const [betSlips, setBetSlips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const SharpSportKey = "969e890a2542ae09830c54c7c5c0eadb29138c00";
  const internalId = "b3ee8956-c455-4ae8-8410-39df182326dc";
  
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [showTopTen, setShowTopTen] = useState(false);
  const { isOpen, smackTalkData, closeSmackTalk } = useInlineSmackTalk();
  
  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    const fetchBetSlips = async () => {
      try {
        const response = await fetch(
          `https://api.sharpsports.io/v1/bettors/${internalId}/betSlips?status=pending&limit=50`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Token ${SharpSportKey}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        // const data = await response.json();
        // console.log("BetSlips Response:", data);
        const data = [
  {
    "id": "SLIP_be83339e62bb4dceb8837bd2e0aaaad6",
    "bettor": "BTTR_6a8450e9c29944a2a82f8e2a3b41c5fa",
    "book": {
      "id": "BOOK_f9661d9af5764404a8d21233467511b1",
      "name": "HardRock",
      "abbr": "hr"
    },
    "bettorAccount": "BACT_119195b6baab4850bddcf128d0b4d13a",
    "bookRef": "1100169254809633072",
    "timePlaced": "2025-09-25T14:39:09Z",
    "type": "parlay",
    "subtype": null,
    "oddsAmerican": 20000,
    "atRisk": 500,
    "toWin": 100000,
    "status": "pending",
    "outcome": null,
    "refreshResponse": "RRES_4c3fb5f507e24827b08a3280306c052b",
    "incomplete": true,
    "netProfit": null,
    "dateClosed": null,
    "timeClosed": null,
    "typeSpecial": null,
    "bets": [
      {
        "id": "BET_bf0159797dbf445bb0332bcc1b737ff7",
        "type": null,
        "event": {
          "id": "EVNT_c91e8292d72b49aba9336bded0c22cbd",
          "sportsdataioId": "19115",
          "sportradarId": "b421b804-dcb1-4177-b8ca-6940a125ee91",
          "oddsjamId": "39341-25327-25-38",
          "theOddsApiId": "4a08b89f07a4a395620f6df5c1d239f4",
          "sport": "Football",
          "league": "NFL",
          "name": "Seattle Seahawks @ Arizona Cardinals",
          "nameSpecial": null,
          "startTime": "2025-09-26T00:15:00Z",
          "startDate": "2025-09-26",
          "seasonType": "REG",
          "sportId": "SPRT_americanfootball",
          "leagueId": "LGUE_nfl",
          "contestantAway": {
            "id": "TEAM_a3b3866ec31647b48802557f60ea41b1",
            "fullName": "Seattle Seahawks",
            "abbr": "SEA"
          },
          "contestantHome": {
            "id": "TEAM_9095865374204017a249dceb3b916636",
            "fullName": "Arizona Cardinals",
            "abbr": "ARI"
          },
          "neutralVenue": null
        },
        "segment": null,
        "proposition": null,
        "segmentDetail": null,
        "position": null,
        "line": null,
        "oddsAmerican": 275,
        "status": "pending",
        "outcome": null,
        "live": null,
        "incomplete": true,
        "bookDescription": "Cardinals vs Seahawks - Cooper Kupp - Anytime TD - Yes",
        "marketSelection": null,
        "autoGrade": false,
        "segmentId": null,
        "positionId": null,
        "propDetails": null
      },
      {
        "id": "BET_0a80726722a248c889cb2976e52f7a84",
        "type": null,
        "event": {
          "id": "EVNT_c91e8292d72b49aba9336bded0c22cbd",
          "sportsdataioId": "19115",
          "sportradarId": "b421b804-dcb1-4177-b8ca-6940a125ee91",
          "oddsjamId": "39341-25327-25-38",
          "theOddsApiId": "4a08b89f07a4a395620f6df5c1d239f4",
          "sport": "Football",
          "league": "NFL",
          "name": "Seattle Seahawks @ Arizona Cardinals",
          "nameSpecial": null,
          "startTime": "2025-09-26T00:15:00Z",
          "startDate": "2025-09-26",
          "seasonType": "REG",
          "sportId": "SPRT_americanfootball",
          "leagueId": "LGUE_nfl",
          "contestantAway": {
            "id": "TEAM_a3b3866ec31647b48802557f60ea41b1",
            "fullName": "Seattle Seahawks",
            "abbr": "SEA"
          },
          "contestantHome": {
            "id": "TEAM_9095865374204017a249dceb3b916636",
            "fullName": "Arizona Cardinals",
            "abbr": "ARI"
          },
          "neutralVenue": null
        },
        "segment": null,
        "proposition": null,
        "segmentDetail": null,
        "position": null,
        "line": null,
        "oddsAmerican": 475,
        "status": "pending",
        "outcome": null,
        "live": null,
        "incomplete": true,
        "bookDescription": "Cardinals vs Seahawks - Kenneth Walker III - First TD - Yes",
        "marketSelection": null,
        "autoGrade": false,
        "segmentId": null,
        "positionId": null,
        "propDetails": null
      },
      {
        "id": "BET_e6d2f90f248d4e29961233e3bad16183",
        "type": "straight",
        "event": {
          "id": "EVNT_c91e8292d72b49aba9336bded0c22cbd",
          "sportsdataioId": "19115",
          "sportradarId": "b421b804-dcb1-4177-b8ca-6940a125ee91",
          "oddsjamId": "39341-25327-25-38",
          "theOddsApiId": "4a08b89f07a4a395620f6df5c1d239f4",
          "sport": "Football",
          "league": "NFL",
          "name": "Seattle Seahawks @ Arizona Cardinals",
          "nameSpecial": null,
          "startTime": "2025-09-26T00:15:00Z",
          "startDate": "2025-09-26",
          "seasonType": "REG",
          "sportId": "SPRT_americanfootball",
          "leagueId": "LGUE_nfl",
          "contestantAway": {
            "id": "TEAM_a3b3866ec31647b48802557f60ea41b1",
            "fullName": "Seattle Seahawks",
            "abbr": "SEA"
          },
          "contestantHome": {
            "id": "TEAM_9095865374204017a249dceb3b916636",
            "fullName": "Arizona Cardinals",
            "abbr": "ARI"
          },
          "neutralVenue": null
        },
        "segment": null,
        "proposition": "moneyline",
        "segmentDetail": null,
        "position": "Arizona Cardinals",
        "line": null,
        "oddsAmerican": 105,
        "status": "pending",
        "outcome": null,
        "live": false,
        "incomplete": false,
        "bookDescription": "Cardinals vs Seahawks - To Win - Cardinals",
        "marketSelection": null,
        "autoGrade": false,
        "segmentId": "SEGM_M",
        "positionId": "TEAM_9095865374204017a249dceb3b916636",
        "propDetails": null
      },
      {
        "id": "BET_bd5de9b8a0544310a12d46fb439471e1",
        "type": null,
        "event": {
          "id": "EVNT_c91e8292d72b49aba9336bded0c22cbd",
          "sportsdataioId": "19115",
          "sportradarId": "b421b804-dcb1-4177-b8ca-6940a125ee91",
          "oddsjamId": "39341-25327-25-38",
          "theOddsApiId": "4a08b89f07a4a395620f6df5c1d239f4",
          "sport": "Football",
          "league": "NFL",
          "name": "Seattle Seahawks @ Arizona Cardinals",
          "nameSpecial": null,
          "startTime": "2025-09-26T00:15:00Z",
          "startDate": "2025-09-26",
          "seasonType": "REG",
          "sportId": "SPRT_americanfootball",
          "leagueId": "LGUE_nfl",
          "contestantAway": {
            "id": "TEAM_a3b3866ec31647b48802557f60ea41b1",
            "fullName": "Seattle Seahawks",
            "abbr": "SEA"
          },
          "contestantHome": {
            "id": "TEAM_9095865374204017a249dceb3b916636",
            "fullName": "Arizona Cardinals",
            "abbr": "ARI"
          },
          "neutralVenue": null
        },
        "segment": null,
        "proposition": null,
        "segmentDetail": null,
        "position": null,
        "line": null,
        "oddsAmerican": -130,
        "status": "pending",
        "outcome": null,
        "live": null,
        "incomplete": true,
        "bookDescription": "Cardinals vs Seahawks - Trey Benson - Anytime TD - Yes",
        "marketSelection": null,
        "autoGrade": false,
        "segmentId": null,
        "positionId": null,
        "propDetails": null
      },
      {
        "id": "BET_9b7b88a3a9814a6e9aefe97f2bf39c3d",
        "type": null,
        "event": {
          "id": "EVNT_c91e8292d72b49aba9336bded0c22cbd",
          "sportsdataioId": "19115",
          "sportradarId": "b421b804-dcb1-4177-b8ca-6940a125ee91",
          "oddsjamId": "39341-25327-25-38",
          "theOddsApiId": "4a08b89f07a4a395620f6df5c1d239f4",
          "sport": "Football",
          "league": "NFL",
          "name": "Seattle Seahawks @ Arizona Cardinals",
          "nameSpecial": null,
          "startTime": "2025-09-26T00:15:00Z",
          "startDate": "2025-09-26",
          "seasonType": "REG",
          "sportId": "SPRT_americanfootball",
          "leagueId": "LGUE_nfl",
          "contestantAway": {
            "id": "TEAM_a3b3866ec31647b48802557f60ea41b1",
            "fullName": "Seattle Seahawks",
            "abbr": "SEA"
          },
          "contestantHome": {
            "id": "TEAM_9095865374204017a249dceb3b916636",
            "fullName": "Arizona Cardinals",
            "abbr": "ARI"
          },
          "neutralVenue": null
        },
        "segment": null,
        "proposition": null,
        "segmentDetail": null,
        "position": null,
        "line": null,
        "oddsAmerican": 185,
        "status": "pending",
        "outcome": null,
        "live": null,
        "incomplete": true,
        "bookDescription": "Cardinals vs Seahawks - Trey McBride - Anytime TD - Yes",
        "marketSelection": null,
        "autoGrade": false,
        "segmentId": null,
        "positionId": null,
        "propDetails": null
      }
    ],
    "adjusted": {
      "odds": false,
      "line": null,
      "atRisk": 0
    }
  },
  {
    "id": "SLIP_9a2ddda0f7c64131bbc7b73fc845c2d8",
    "bettor": "BTTR_6a8450e9c29944a2a82f8e2a3b41c5fa",
    "book": {
      "id": "BOOK_f9661d9af5764404a8d21233467511b1",
      "name": "HardRock",
      "abbr": "hr"
    },
    "bettorAccount": "BACT_119195b6baab4850bddcf128d0b4d13a",
    "bookRef": "5324168297648488726",
    "timePlaced": "2025-09-23T15:00:09Z",
    "type": "single",
    "subtype": null,
    "oddsAmerican": 100,
    "atRisk": 1000,
    "toWin": 1000,
    "status": "pending",
    "outcome": null,
    "refreshResponse": "RRES_4c3fb5f507e24827b08a3280306c052b",
    "incomplete": false,
    "netProfit": null,
    "dateClosed": null,
    "timeClosed": null,
    "typeSpecial": null,
    "bets": [
      {
        "id": "BET_83e1a7e9c1b9440ebe1c47542afc5b87",
        "type": "straight",
        "event": {
          "id": "EVNT_40585c45e41645ce993bae7a701de4de",
          "sportsdataioId": "50015682",
          "sportradarId": "15a49ff4-282a-4826-9b53-45b2037042d0",
          "oddsjamId": null,
          "theOddsApiId": "0aa30bdb9295af4b13475b7aabb2cfea",
          "sport": "Football",
          "league": "NCAAF",
          "name": "Florida State Seminoles @ Virginia Cavaliers",
          "nameSpecial": null,
          "startTime": "2025-09-26T23:00:00Z",
          "startDate": "2025-09-26",
          "seasonType": "REG",
          "sportId": "SPRT_americanfootball",
          "leagueId": "LGUE_ncaaf",
          "contestantAway": {
            "id": "TEAM_19b2757469d34ce5b258bd6867f16da9",
            "fullName": "Florida State Seminoles",
            "abbr": "FLST"
          },
          "contestantHome": {
            "id": "TEAM_6029b8cd20c2428eb6dab58e1565a55c",
            "fullName": "Virginia Cavaliers",
            "abbr": "VIR"
          },
          "neutralVenue": false
        },
        "segment": null,
        "proposition": "spread",
        "segmentDetail": null,
        "position": "Florida State Seminoles",
        "line": -7.5,
        "oddsAmerican": 100,
        "status": "pending",
        "outcome": null,
        "live": false,
        "incomplete": false,
        "bookDescription": "Virginia vs. Florida State - Spread - Florida State -7.5",
        "marketSelection": null,
        "autoGrade": false,
        "segmentId": "SEGM_M",
        "positionId": "TEAM_19b2757469d34ce5b258bd6867f16da9",
        "propDetails": null
      }
    ],
    "adjusted": {
      "odds": false,
      "line": null,
      "atRisk": null
    }
  }
]"
        setBetSlips(data.betSlips || []);
      } catch (err: any) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBetSlips();
  }, []);
  
  return (
    <div className="flex min-h-screen flex-col bg-background font-rajdhani">
      <div className={`max-w-md mx-auto w-full px-2 ${isMobile ? "pb-24" : ""}`}>
        <div className="flex justify-between items-center pt-2 mb-4">
          <img 
            src="/lovable-uploads/7b63dfa5-820d-4bd0-82f2-9e01001a0364.png" 
            alt="NoShot logo" 
            className="h-40 cursor-pointer"
            onClick={handleLogoClick}
          />
          <div className="flex items-center gap-2">
            <HeaderChatIcon />
            <ProfileIcon />
          </div>
        </div>
        
        <TrendsTitle />
        
        {showTopTen ? (
          <TopTenReveal isRevealed={showTopTen} />
        ) : (
          <TrendsList trendData={trendData} />
        )}
        
        {isOpen && (
          <InlineSmackTalk
            isOpen={isOpen}
            onClose={closeSmackTalk}
            itemId={smackTalkData?.itemId || ""}
            itemTitle={smackTalkData?.itemTitle}
          />
        )}
      </div>
      
      <TrendsNotificationHandler />
      <BadgeAnimationHandler />
      <FloatingSyncButton />
      <BottomNav />
    </div>
  );
};

export default Trends;
