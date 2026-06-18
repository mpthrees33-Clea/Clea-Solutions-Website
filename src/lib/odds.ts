/* ── Odds math + shared types for the Fight Night dashboard ── */

export type WinMethods = { ko: number; sub: number; dec: number }; // percentages, ~sum 100

export type Fighter = {
  name: string;
  nickname?: string;
  record: string;
  flag: string;
  country: string;
  odds: number; // American moneyline, e.g. -470 or +360
  photo?: string;
  rank?: string; // "C" | "iC" | "#1" | "NR"
  age?: number;
  height?: string; // 5'11"
  reach?: string; // 70"
  stance?: string;
  style?: string;
  streak?: string; // "W7" | "L2"
  methods?: WinMethods;
};

export type Fight = {
  bout: string; // weight class / title label
  ribbon?: string; // "MAIN EVENT" | "CO-MAIN"
  rounds: string;
  insight?: string; // betting note
  red: Fighter; // left corner
  blue: Fighter; // right corner
};

export type Selection = {
  id: string;
  fighter: string;
  bout: string;
  odds: number;
};

/* American odds → implied probability (0–1, includes the book's vig) */
export function impliedProb(odds: number): number {
  return odds < 0 ? -odds / (-odds + 100) : 100 / (odds + 100);
}

/* Strip the vig: normalise both fighters' implied probs to sum to 1 */
export function noVig(a: number, b: number): [number, number] {
  const pa = impliedProb(a);
  const pb = impliedProb(b);
  const sum = pa + pb;
  return [pa / sum, pb / sum];
}

/* Profit (not incl. stake) on a given stake at American odds */
export function payoutProfit(odds: number, stake: number): number {
  return odds < 0 ? (100 / -odds) * stake : (odds / 100) * stake;
}

export function americanToDecimal(odds: number): number {
  return odds < 0 ? 1 + 100 / -odds : 1 + odds / 100;
}

export function decimalToAmerican(dec: number): number {
  return dec >= 2 ? Math.round((dec - 1) * 100) : Math.round(-100 / (dec - 1));
}

/* Combine selections into a parlay → returns combined American odds */
export function parlayOdds(selections: Selection[]): number {
  const dec = selections.reduce((acc, s) => acc * americanToDecimal(s.odds), 1);
  return decimalToAmerican(dec);
}

export function fmtOdds(odds: number): string {
  return odds > 0 ? `+${odds}` : `${odds}`;
}

export function fmtMoney(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
