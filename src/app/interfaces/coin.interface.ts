export interface CoinCombination {
  coins: { [key: number]: number };
  amount: number;
}

export interface ResiduePatterns {
  [key: number]: { [key: number]: number };
}