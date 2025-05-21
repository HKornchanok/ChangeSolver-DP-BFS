import { Injectable } from '@angular/core';
import { CoinCombination } from '../interfaces/coin.interface';

/**
 * Service for handling coin-related calculations and optimizations.
 * Provides methods for finding optimal coin combinations and withdrawal options
 * using various mathematical approaches including dynamic programming,
 * greedy algorithms, and mathematical optimizations.
 */
@Injectable({
  providedIn: 'root',
})
export class CoinService {
  /** Available coin denominations in descending order */
  private readonly COIN_SIZES = [11, 7, 5, 1];

  /**
   * Gets all possible withdrawal options for a given amount.
   * Uses different strategies based on amount size:
   * - Large amounts: Mathematical optimizations
   * - Small amounts: Complete search
   * @param amount - The amount to get withdrawal options for
   * @returns Array of all possible coin combinations
   */
  public getAllWithdrawalOptions(amount: number): CoinCombination[] {
    // Handle very large amounts specially to avoid memory issues

    if (amount > Math.max(...this.COIN_SIZES) * 1000) {
      return this.handleLargeAmount(amount, this.COIN_SIZES);
    }

    const minCoinsNeeded = this.findMinCoins(amount);
    if (minCoinsNeeded === Infinity) return [];

    // Then find all combinations that use this minimum number
    const options: CoinCombination[] = [];
    this.findAllCombinations(amount, minCoinsNeeded, options);

    return options;
  }

  /**
   * Handles large amounts (over 1000) using mathematical optimizations to avoid memory issues.
   * Uses properties of the Frobenius coin problem and residue patterns for efficient calculation.
   * @param amount - The large amount to process
   * @param coins - Array of available coin denominations
   * @returns Array of optimal coin combinations
   */
  private handleLargeAmount(amount: number, coins: number[]): CoinCombination[] {
    const options: CoinCombination[] = [];

    // For large amounts, we can use the Frobenius coin problem properties
    // First, determine the minimum number of coins needed using memory-efficient DP

    // Get the base solution using a residue handling
    const baseSolution = this.getCompactSolution(amount, coins);
    if (baseSolution) {
      options.push(...baseSolution);
    }

    return options;
  }

  /**
   * Generates an optimal solution for large amounts using precomputed residue patterns.
   * Uses a combination of greedy approach and mathematical optimizations.
   * @param amount - The amount to generate solution for
   * @param coins - Available coin denominations
   * @param minCoins - Minimum number of coins needed
   * @returns Optimal coin combination
   */
  private getCompactSolution(amount: number, coins: number[]): CoinCombination[] {
    let remaining = amount;

    const sortedCoins = [...coins].sort((a, b) => b - a); // e.g., [11,7,5,1]
    const largestCoin = sortedCoins[0]; // e.g., 11

    // Greedy subtract with buffer (e.g., subtract 20 to leave room for residue correction)
    const largestCount = Math.min(Math.floor(remaining / largestCoin) - 20, Math.floor(remaining / largestCoin));
    remaining -= largestCoin * largestCount;
    console.log('remaining', remaining);
    const smallAmountOptions: CoinCombination[] = [];
    const minCoinsNeeded = this.findMinCoins(remaining);
    this.findAllCombinations(remaining, minCoinsNeeded, smallAmountOptions);

    const options: CoinCombination[] = smallAmountOptions.map(opt => {
      const combinedCoins: { [key: number]: number } = { ...opt.coins };
      combinedCoins[largestCoin] = (combinedCoins[largestCoin] || 0) + largestCount;

      return {
        coins: combinedCoins,
        amount: amount, // total original amount
      };
    });

    return options;
  }

  /**
   * Memory-efficient implementation to find minimum coins needed.
   * Uses a sliding window approach to avoid creating large arrays.
   * @param amount - The amount to calculate minimum coins for
   * @returns Minimum number of coins needed
   */
  private findMinCoins(amount: number): number {
    const COIN_SIZES = [11, 7, 5, 1];

    // Handle base case
    if (amount === 0) return 0;
    if (amount < 0) return Infinity;

    // For small amounts, use an efficient DP solution with reduced memory
    // We only need to keep track of the last largest_coin values
    const largestCoin = Math.max(...COIN_SIZES);
    const dp = new Array(largestCoin + 1).fill(Infinity);

    // Base case
    dp[0] = 0;

    // Build up the solution for amount using a sliding window
    for (let target = 1; target <= amount; target++) {
      // Get the current position in our circular array
      const pos = target % (largestCoin + 1);
      // Reset the value before calculating
      dp[pos] = Infinity;

      // Try each coin
      for (const coin of COIN_SIZES) {
        if (target - coin >= 0) {
          const prevPos = (target - coin) % (largestCoin + 1);
          dp[pos] = Math.min(dp[pos], dp[prevPos] + 1);
        }
      }
    }
    console.log('dp', dp[amount % (largestCoin + 1)]);
    // Return the result from the final position
    return dp[amount % (largestCoin + 1)];
  }

  /**
   * Finds all possible coin combinations that use the minimum number of coins.
   * Uses breadth-first search with memory optimizations.
   * @param amount - The amount to find combinations for
   * @param minCoins - Minimum number of coins needed
   * @param options - Array to store found combinations
   */
  private findAllCombinations(amount: number, minCoins: number, options: CoinCombination[]) {
    const COIN_SIZES = [11, 7, 5, 1];

    // Store solution keys for deduplication
    const solutionKeys = new Set<string>();

    // Use a more memory-efficient breadth-first search
    // Calculate a reasonable size for the queue
    const maxStates = Math.min(10000, amount * COIN_SIZES.length);
    const visited = new Set<string>(); // Track visited states to avoid redundant work

    // For BFS we use an array as queue with manual tracking of head/tail indices
    const queue = new Array(maxStates);
    let head = 0;
    let tail = 0;

    // Start with the first coin
    queue[tail++] = {
      remaining: amount,
      index: 0,
      current: Array(COIN_SIZES.length).fill(0),
      totalUsed: 0,
    };

    while (head !== tail) {
      const { remaining, index, current, totalUsed } = queue[head++];
      if (head >= queue.length) head = 0; // Circular queue

      // Create a state key for this configuration
      const stateKey = `${remaining}:${index}:${totalUsed}`;
      if (visited.has(stateKey)) continue;
      visited.add(stateKey);

      // Base cases
      if (totalUsed > minCoins) continue; // Skip if we're using more than minimum coins
      if (remaining === 0) {
        // We found a solution with the minimum number of coins
        if (totalUsed === minCoins) {
          const coins: { [key: number]: number } = {};
          COIN_SIZES.forEach((c, i) => {
            if (current[i] > 0) {
              coins[c] = current[i];
            }
          });

          // Check if we've already found this solution
          const solutionKey = this.createSolutionKey(coins);
          if (!solutionKeys.has(solutionKey)) {
            options.push({ coins, amount: totalUsed });
            solutionKeys.add(solutionKey);
          }
        }
        continue;
      }
      if (index >= COIN_SIZES.length) continue; // Skip if we've gone through all coins

      const coin = COIN_SIZES[index];

      // Try taking 0 of this coin (move to next coin)
      if (index < COIN_SIZES.length - 1) {
        const nextState = {
          remaining,
          index: index + 1,
          current: [...current],
          totalUsed,
        };
        queue[tail++] = nextState;
        if (tail >= queue.length) tail = 0; // Circular queue
      }

      // Try taking 1 or more of this coin
      if (remaining >= coin && totalUsed + 1 <= minCoins) {
        const newCurrent = [...current];
        newCurrent[index] = newCurrent[index] + 1;
        const nextState = {
          remaining: remaining - coin,
          index,
          current: newCurrent,
          totalUsed: totalUsed + 1,
        };
        queue[tail++] = nextState;
        if (tail >= queue.length) tail = 0; // Circular queue
      }
    }
  }

  /**
   * Creates a unique string key for a coin combination to assist with deduplication.
   * @param coins - Coin combination object
   * @returns String key representing the combination
   */
  private createSolutionKey(coins: { [key: number]: number }): string {
    // Sort by coin denomination for consistent keys
    return this.COIN_SIZES.filter(coin => coins[coin] > 0)
      .map(coin => `${coin}:${coins[coin]}`)
      .join('|');
  }
}
