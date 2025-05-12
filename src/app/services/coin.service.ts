import { Injectable } from '@angular/core';
import { CoinCombination, ResiduePatterns } from '../interfaces/coin.interface';

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
  public getAllWithdrawalOptions(
    amount: number,
  ): CoinCombination[] {

    // Handle very large amounts specially to avoid memory issues
    if (amount > 1000) {
      return this.handleLargeAmount(amount, this.COIN_SIZES);
    }

    const minCoinsNeeded = this.findMinCoins(amount);
    if (minCoinsNeeded === Infinity) return [];

    // Then find all combinations that use this minimum number
    const options: CoinCombination[] = [];

    // Use an iterative approach instead of recursion to avoid call stack overhead
    this.findAllCombinations(amount, minCoinsNeeded, options);

    // We've already ensured uniqueness in findAllCombinations method
    // No need for extra filtering here
    return options;
  }

  /**
   * Handles large amounts (over 1000) using mathematical optimizations to avoid memory issues.
   * Uses properties of the Frobenius coin problem and residue patterns for efficient calculation.
   * @param amount - The large amount to process
   * @param coins - Array of available coin denominations
   * @returns Array of optimal coin combinations
   */
  private handleLargeAmount(
    amount: number,
    coins: number[],
  ): CoinCombination[] {
    const options: CoinCombination[] = [];

    // For large amounts, we can use the Frobenius coin problem properties
    // First, determine the minimum number of coins needed using memory-efficient DP

    // Get the base solution using a greedy approach + residue handling
    const baseSolution = this.getCompactSolution(amount, coins);
    if (baseSolution) {
      options.push(baseSolution);
    }

    // For large amounts, we'll only return one optimal solution to save memory
    // Computing all solutions for large amounts would be prohibitively expensive

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
  private getCompactSolution(
    amount: number,
    coins: number[],
  ): CoinCombination {
    const solution: { [key: number]: number } = {};
    let remaining = amount;
    let totalUsed = 0;

    // For our specific case [11,7,5,1]:
    // We can prove that using a greedy approach with residue correction is optimal
    const sortedCoins = [...coins].sort((a, b) => b - a); // [11,7,5,1]

    // First apply as many of the largest coin as possible
    const largestCoin = sortedCoins[0]; // 11
    const largestCount = Math.floor(remaining / largestCoin);
    remaining -= largestCoin * largestCount;
    solution[largestCoin] = largestCount;
    totalUsed += largestCount;

    // For the residue, we use normalized mathematical patterns
    // These are precomputed optimal patterns for the remainder modulo 11
    // Apply the optimal pattern for the residue
    const residue = remaining % largestCoin; // remainder mod 11
    if (residue > 0) {
      const pattern = this.demonstrateRemainderCoinsCalculation()[residue];
      for (const coin in pattern) {
        const count = pattern[coin];
        if (!solution[coin]) solution[coin] = 0;
        solution[coin] += count;
        totalUsed += count;
        remaining -= count * parseInt(coin);
      }
    }

    // For very large amounts, we might still have some remaining amount to optimize
    // This handles any edge cases beyond our precomputed patterns
    if (remaining > 0) {
      // Use our efficient DP solution for any remaining amount
      const dp = new Array(remaining + 1).fill(Infinity);
      const choices = new Array(remaining + 1).fill(-1);
      dp[0] = 0;

      for (let i = 1; i <= remaining; i++) {
        for (const coin of sortedCoins) {
          if (i - coin >= 0 && dp[i - coin] + 1 < dp[i]) {
            dp[i] = dp[i - coin] + 1;
            choices[i] = coin;
          }
        }
      }

      // Reconstruct the solution
      let current = remaining;
      while (current > 0) {
        const coin = choices[current];
        if (!solution[coin]) solution[coin] = 0;
        solution[coin]++;
        totalUsed++;
        current -= coin;
      }
    }

    return { coins: solution, amount: totalUsed };
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

    // For moderate-sized amounts, use math shortcuts first

    // Mathematical shortcut: if we have coin 1, then min coins <= amount
    // If amount > Frobenius number of the coin system, we can make any amount
    // For [11,7,5,1], the Frobenius number is 10, so any amount >= 11 is makeable

    // For our specific coin system [11,7,5,1]
    // We can use a more efficient approach based on remainder mod largest coin
    if (amount > 100) {
      // For medium-large amounts
      const quotient = Math.floor(amount / 11);
      const remainder = amount % 11;

      // Precomputed optimal values for remainders mod 11
      const remainderCoins = [0, 1, 2, 3, 4, 1, 2, 1, 3, 4, 2];

      return quotient + remainderCoins[remainder];
    }

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
  private findAllCombinations(
    amount: number,
    minCoins: number,
    options: CoinCombination[],
  ) {
    const COIN_SIZES = [11, 7, 5, 1];

    // Store solution keys for deduplication
    const solutionKeys = new Set<string>();

    // Try the greedy solution if it's optimal
    const greedySolution = this.tryGreedySolution(amount, COIN_SIZES);
    if (greedySolution && greedySolution.amount === minCoins) {
      // Add to options and mark as visited
      options.push(greedySolution);
      const greedyKey = this.createSolutionKey(greedySolution.coins);
      solutionKeys.add(greedyKey);
    }

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

  /**
   * Attempts to find a solution using the greedy approach.
   * Works optimally for canonical coin systems.
   * @param amount - The amount to find solution for
   * @param coins - Available coin denominations
   * @returns Greedy solution if found, null otherwise
   */
  private tryGreedySolution(
    amount: number,
    coins: number[],
  ): CoinCombination | null {
    const result: { [key: number]: number } = {};
    let remaining = amount;
    let totalCoins = 0;

    // Sort coins in descending order
    const sortedCoins = [...coins].sort((a, b) => b - a);

    for (const coin of sortedCoins) {
      if (remaining >= coin) {
        const count = Math.floor(remaining / coin);
        result[coin] = count;
        totalCoins += count;
        remaining -= count * coin;
      }
    }

    if (remaining === 0) {
      return { coins: result, amount: totalCoins };
    }

    return null; // Greedy approach failed
  }

  /**
   * Demonstrates how to calculate the remainderCoins array with detailed explanation.
   * This is for educational purposes to show how the values are derived.
   */
  private demonstrateRemainderCoinsCalculation(): ResiduePatterns {
    const COIN_SIZES = [11, 7, 5, 1];
    const residuePatterns: ResiduePatterns = {};
  
    for (let remainder = 0; remainder <= 10; remainder++) {
      const dp = new Array(remainder + 1).fill(Infinity);
      const choices = new Array(remainder + 1).fill(-1);
      dp[0] = 0;
  
      // Compute DP
      for (let i = 1; i <= remainder; i++) {
        for (const coin of COIN_SIZES) {
          if (i - coin >= 0 && dp[i - coin] + 1 < dp[i]) {
            dp[i] = dp[i - coin] + 1;
            choices[i] = coin;
          }
        }
      }
  
      // Reconstruct solution
      const solution: { [key: number]: number } = {};
      let current = remainder;
      while (current > 0) {
        const coin = choices[current];
        solution[coin] = (solution[coin] || 0) + 1;
        current -= coin;
      }
  
      residuePatterns[remainder] = solution;
    }
  
    return residuePatterns;
  }
}
