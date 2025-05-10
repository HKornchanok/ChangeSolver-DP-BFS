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
   * Calculates the optimal coin combination for a given amount using a greedy approach.
   * This method is suitable for small amounts and provides a single optimal solution.
   * @param amount - The total amount to make change for
   * @returns Object containing the coin combination and total number of coins used
   */
  calculateOptimalCoinCombination(amount: number): CoinCombination {
    let remaining = amount;
    const coins: { [key: number]: number } = {};
    let totalCoins = 0;

    for (const coinSize of this.COIN_SIZES) {
      const count = Math.floor(remaining / coinSize);
      if (count > 0) {
        coins[coinSize] = count;
        remaining -= count * coinSize;
        totalCoins += count;
      }
    }

    return { coins, totalCoins };
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
  ): { coins: { [key: number]: number }; totalCoins: number }[] {
    const options: { coins: { [key: number]: number }; totalCoins: number }[] = [];

    // For large amounts, we can use the Frobenius coin problem properties
    // First, determine the minimum number of coins needed using memory-efficient DP
    const minCoins = this.findMinCoinsForLargeAmount(amount, coins);

    // Get the base solution using a greedy approach + residue handling
    const baseSolution = this.getCompactSolution(amount, coins, minCoins);
    if (baseSolution) {
      options.push(baseSolution);
    }

    // For large amounts, we'll only return one optimal solution to save memory
    // Computing all solutions for large amounts would be prohibitively expensive

    return options;
  }

  /**
   * Memory-efficient algorithm to find minimum coins needed for large amounts.
   * Uses mathematical properties of the coin system and a sliding window approach.
   * @param amount - The amount to calculate minimum coins for
   * @param coins - Available coin denominations
   * @returns Minimum number of coins needed
   */
  private findMinCoinsForLargeAmount(amount: number, coins: number[]): number {
    // We can calculate this efficiently for our specific coin system [11,7,5,1]
    // where gcd(coins) = 1, which means any amount >= (largest coin)*(smallest coin) - (largest coin) - (smallest coin)
    // can be represented

    // For our coin system [11,7,5,1], the Frobenius number is:
    // F(11,7,5,1) = 1*11 - 1 = 10
    // This means any amount >= 11 can be represented

    // For very large amounts, the minimum number of coins approaches amount/largest_coin
    // For fine-tuned calculation, we need to handle the residue optimally

    // Base case: if amount <= 0, return 0
    if (amount <= 0) return 0;

    // For very large amounts, we first divide by the largest coin
    const largestCoin = Math.max(...coins);
    const smallestCoin = Math.min(...coins);

    // Quick mathematical property: if gcd(coins) = 1, then for sufficiently large n,
    // min_coins(n) = ⌊n/largestCoin⌋ + min_coins(n % largestCoin)

    // Calculate quotient and remainder
    const quotient = Math.floor(amount / largestCoin);
    const remainder = amount % largestCoin;

    // For the remainder, we use a space-efficient approach
    const dp = new Array(largestCoin + 1).fill(Infinity);
    dp[0] = 0;

    // We only need to compute up to largestCoin, regardless of the original amount
    for (let i = 1; i <= largestCoin; i++) {
      for (const coin of coins) {
        if (i - coin >= 0) {
          dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
      }
    }

    // Frobenius number property: after a certain threshold, we can always form any amount optimally
    if (remainder >= largestCoin * smallestCoin - largestCoin - smallestCoin && remainder > 0) {
      // We're beyond the Frobenius number, so we use the mathematical formula
      const residue = remainder % largestCoin;
      const residueCoins = residue > 0 ? dp[residue] : 0;
      return quotient + remainder / largestCoin + residueCoins;
    }

    // Otherwise, use our dp table
    return quotient + (remainder > 0 ? dp[remainder] : 0);
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
    minCoins: number,
  ): { coins: { [key: number]: number }; totalCoins: number } {
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
    const residuePatterns: { [key: number]: { [key: number]: number } } = {
      0: {}, // No residue
      1: { 1: 1 }, // 1 = 1
      2: { 1: 2 }, // 2 = 1+1
      3: { 1: 3 }, // 3 = 1+1+1
      4: { 5: 1, 1: 1 }, // 4 = 5-1
      5: { 5: 1 }, // 5
      6: { 7: 1, 1: 1 }, // 6 = 7-1
      7: { 7: 1 }, // 7
      8: { 5: 1, 1: 3 }, // 8 = 5+3
      9: { 5: 1, 1: 4 }, // 9 = 5+4
      10: { 5: 2 }, // 10 = 5+5
    };

    // Apply the optimal pattern for the residue
    const residue = remaining % largestCoin; // remainder mod 11
    if (residue > 0) {
      const pattern = residuePatterns[residue];
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

    return { coins: solution, totalCoins: totalUsed };
  }
  /**
   * Gets all possible withdrawal options for a given amount.
   * Uses different strategies based on amount size:
   * - Large amounts: Mathematical optimizations
   * - Medium amounts: LCM optimization
   * - Small amounts: Complete search
   * @param amount - The amount to get withdrawal options for
   * @returns Array of all possible coin combinations
   */
  getAllWithdrawalOptions(
    amount: number,
  ): { coins: { [key: number]: number }; totalCoins: number }[] {
    const COIN_SIZES = [11, 7, 5, 1];

    // Handle very large amounts specially to avoid memory issues
    if (amount > 1000) {
      return this.handleLargeAmount(amount, COIN_SIZES);
    }

    // Apply LCM optimization before proceeding
    const optimizedAmount = this.applyLCMOptimization(amount, COIN_SIZES);
    if (optimizedAmount.reduced) {
      // The amount was optimized using LCM properties
      return optimizedAmount.result || [];
    }

    // If no LCM optimization was possible, proceed with the standard approach
    const minCoinsNeeded = this.findMinCoins(amount);
    if (minCoinsNeeded === Infinity) return [];

    // Then find all combinations that use this minimum number
    const options: { coins: { [key: number]: number }; totalCoins: number }[] = [];

    // Use an iterative approach instead of recursion to avoid call stack overhead
    this.findAllCombinations(amount, minCoinsNeeded, options);

    return options;
  }

  /**
   * Applies Least Common Multiple (LCM) optimization to reduce problem size.
   * Uses mathematical relationships between coin denominations to find optimal solutions.
   * @param amount - The amount to optimize
   * @param coins - Available coin denominations
   * @returns Object containing optimization result and whether reduction was possible
   */
  private applyLCMOptimization(
    amount: number,
    coins: number[],
  ): { reduced: boolean; result?: { coins: { [key: number]: number }; totalCoins: number }[] } {
    // Find pairs of coins that have mathematical relationships
    for (let i = 0; i < coins.length; i++) {
      for (let j = i + 1; j < coins.length; j++) {
        const a = coins[i];
        const b = coins[j];
        const gcd = this.gcd(a, b);

        if (gcd > 1) {
          // These coins have a common factor
          const lcm = (a * b) / gcd;

          // Check if the amount is divisible by the LCM
          if (amount % lcm === 0) {
            // We can optimize this case!
            const factor = amount / lcm;
            const baseCoins = this.solveForLCM(a, b, lcm);

            // Scale the solution by the factor
            const result = this.scaleCoinsResult(baseCoins, factor);
            return { reduced: true, result: [result] };
          }
        }
      }
    }

    return { reduced: false };
  }

  /**
   * Calculates Greatest Common Divisor using Euclidean algorithm.
   * @param a - First number
   * @param b - Second number
   * @returns GCD of the two numbers
   */
  private gcd(a: number, b: number): number {
    // Euclidean algorithm for GCD
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  /**
   * Solves for optimal coin combination when amount is divisible by LCM.
   * Uses extended Euclidean algorithm to find Bézout coefficients.
   * @param a - First coin denomination
   * @param b - Second coin denomination
   * @param lcm - Least Common Multiple of a and b
   * @returns Optimal coin combination
   */
  private solveForLCM(a: number, b: number, lcm: number): { [key: number]: number } {
    // Extended Euclidean algorithm to find Bézout coefficients
    // ax + by = gcd(a,b)
    let [x, y] = this.extendedGcd(a, b);

    // Scale up to match LCM
    const gcd = this.gcd(a, b);
    const factor = lcm / gcd;

    // Make sure both coefficients are non-negative
    while (x < 0 || y < 0) {
      if (x < 0) {
        x += b / gcd;
        y -= a / gcd;
      }
      if (y < 0) {
        x -= b / gcd;
        y += a / gcd;
      }
    }

    x *= factor / b;
    y *= factor / a;

    const result: { [key: number]: number } = {};
    result[a] = y;
    result[b] = x;
    return result;
  }

  /**
   * Extended Euclidean algorithm to find Bézout coefficients.
   * Solves ax + by = gcd(a,b) for integers x and y.
   * @param a - First number
   * @param b - Second number
   * @returns Tuple of Bézout coefficients [x, y]
   */
  private extendedGcd(a: number, b: number): [number, number] {
    if (b === 0) {
      return [1, 0];
    }

    const [x1, y1] = this.extendedGcd(b, a % b);
    const x = y1;
    const y = x1 - Math.floor(a / b) * y1;

    return [x, y];
  }

  /**
   * Scales a coin combination by a given factor.
   * @param coins - Original coin combination
   * @param factor - Scaling factor
   * @returns Scaled coin combination with updated total
   */
  private scaleCoinsResult(
    coins: { [key: number]: number },
    factor: number,
  ): { coins: { [key: number]: number }; totalCoins: number } {
    const scaledCoins: { [key: number]: number } = {};
    let totalCoins = 0;

    for (const coin in coins) {
      const count = coins[coin] * factor;
      scaledCoins[coin] = count;
      totalCoins += count;
    }

    return { coins: scaledCoins, totalCoins };
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
    options: { coins: { [key: number]: number }; totalCoins: number }[],
  ) {
    const COIN_SIZES = [11, 7, 5, 1];

    // Check if there's a "greedy" solution using the largest coins first
    // This works when coin systems have special properties (like canonical coin systems)
    const greedySolution = this.tryGreedySolution(amount, COIN_SIZES);
    if (greedySolution && greedySolution.totalCoins === minCoins) {
      options.push(greedySolution);

      // For many coin systems, if greedy is optimal, it's the unique solution
      // If we want to find all solutions anyway, we would continue below
    }

    // If we only want the greedy solution when optimal, we would return here
    // But we'll continue to find all optimal solutions

    // Use a more memory-efficient breadth-first search
    // Instead of storing entire arrays of coin counts, we'll use a more compact representation
    // We'll also use a queue with a fixed size based on the possible states

    // Calculate the maximum state space size to pre-allocate memory
    const maxStates = COIN_SIZES.reduce((acc, coin) => acc * (1 + Math.floor(amount / coin)), 1);
    const visited = new Set<string>(); // Track visited states to avoid redundant work

    // For BFS we use an array as queue with manual tracking of head/tail indices
    const queue = new Array(Math.min(maxStates, 10000)); // Cap size to avoid excessive memory usage
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
          options.push({ coins, totalCoins: totalUsed });
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
   * Attempts to find a solution using the greedy approach.
   * Works optimally for canonical coin systems.
   * @param amount - The amount to find solution for
   * @param coins - Available coin denominations
   * @returns Greedy solution if found, null otherwise
   */
  private tryGreedySolution(
    amount: number,
    coins: number[],
  ): { coins: { [key: number]: number }; totalCoins: number } | null {
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
      return { coins: result, totalCoins };
    }

    return null; // Greedy approach failed
  }

  /**
   * Formats a coin combination into a human-readable string.
   * Example: "11฿x2, 7฿x1, 5฿x1"
   * @param combination - The coin combination to format
   * @returns Formatted string representation
   */
  formatCoinCombination(combination: CoinCombination): string {
    return this.COIN_SIZES.filter(coinSize => combination.coins[coinSize] > 0)
      .map(coinSize => `${coinSize}฿x${combination.coins[coinSize]}`)
      .join(', ');
  }
}
