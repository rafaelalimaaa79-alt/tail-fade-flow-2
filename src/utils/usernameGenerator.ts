
const randomNames = [
  "FadeKing", "SharpSlayer", "ColdHunter", "PublicFader", "BetBuster",
  "LineChaser", "FadeZoneHero", "SharpKiller", "ColdStreak", "FadeMaster",
  "PublicEnemy", "BetSniper", "LineReader", "FadeGod", "SharpBane"
];

export const generateRandomUsername = (): string => {
  const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
  const randomNumber = Math.floor(Math.random() * 999) + 1;
  return `${randomName}${randomNumber}`;
};
