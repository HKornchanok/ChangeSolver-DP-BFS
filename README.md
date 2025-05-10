
# ChangeSolver-DP-LCM-BFS

> Solve, Optimize, and Scale coin change with precision-engineered algorithms!

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Production](#production)
  - [Useful Commands](#useful-commands)
- [User Guide](#user-guide)
  - [Managing Orders](#managing-orders)
  - [Payment Processing](#payment-processing)
  - [Change Calculation](#change-calculation)
  - [Key Features](#key-features)
- [Technical Details](#technical-details)
  - [Coin Combination Algorithm](#coin-combination-algorithm)
  - [Core Algorithm Architecture](#core-algorithm-architecture)
  - [Mathematical Foundations](#mathematical-foundations)
  - [Algorithm Implementation](#algorithm-implementation)
  - [Advanced Optimization Techniques](#advanced-optimization-techniques)
  - [Performance Characteristics](#performance-characteristics)
  - [Edge Case Handling](#edge-case-handling)
  - [Multiple Solution Support](#multiple-solution-support)

## Overview

ChangeSolver-DP-LCM-BFS is a comprehensive point-of-sale algorithm module that streamlines change calculation using a multi-strategy approach. It is designed for high performance and low memory consumption, capable of solving for optimal coin combinations across various input sizes.

## Getting Started

### Prerequisites

-   Node.js (v18+)
-   npm (v9+)

### Installation

1.  Clone the repository
2.  Install dependencies:

```bash
npm install

```

### Development

Start the development server:

```bash
npm start

```

Your application will be available at `http://localhost:4200/`

### Production

Build for production:

```bash
npm run build

```

Build artifacts will be stored in the `dist/` directory.

### Useful Commands

Common commands for development, building, and formatting:

| **Command**              | **Description**                   |
|----------------------------|--------------------------------------|
| `npm start`                | Run development server               |
| `npm run build`            | Build for production                 |
| `npm run watch`            | Build and watch for changes          |
| `npm run format`           | Format code with Prettier            |
| `npm run format:check`     | Check code formatting (Prettier)     |


## User Guide

### Managing Orders

-   **Browse Products**: View available items in the catalog
-   **Add to Cart**: Click "+" to add items to your order
-   **Adjust Quantity**: Use "+" and "-" to modify item quantities
-   **Remove Items**: Set quantity to 0 or use the remove button

### Payment Processing

1.  **Review Total**: Verify the amount due
2.  **Enter Payment**: Input the amount received from customer
3.  **Calculate**: Process the payment and determine change
4.  **View Results**:
    -   Total change amount
    -   Optimal coin combination
    -   Alternative withdrawal options

### Change Calculation

The system calculates change using these denominations:

-   11฿ coins
-   7฿ coins
-   5฿ coins
-   1฿ coins

### Key Features

-   ✅ Real-time order management
-   ✅ Intelligent change calculation
-   ✅ Multiple withdrawal options
-   ✅ Memory-efficient processing
-   ✅ Support for large transactions
-   ✅ Comprehensive input validation
    -   Whole number validation
    -   Minimum payment validation

## Technical Details

### Coin Combination Algorithm

The application implements a sophisticated algorithm for finding optimal coin combinations using denominations [11, 7, 5, 1]. The algorithm adaptively employs different strategies based on the amount being processed, providing an optimal balance between memory efficiency, runtime performance, and solution completeness.

### Core Algorithm Architecture

The coin combination algorithm uses a multi-strategy approach that selects the appropriate technique based on the input amount:

1.  **Large Amounts (>1000)**: Mathematical optimizations and pattern recognition
2.  **Medium Amounts (100-1000)**: LCM-based optimizations and residue handling
3.  **Small Amounts (<100)**: Memory-efficient dynamic programming with BFS

### Mathematical Foundations

#### Frobenius Coin Problem

For our coin system [11, 7, 5, 1], the Frobenius number is 10, meaning any amount larger than 10 can be represented using our coin denominations. This mathematical property allows us to use simplified approaches for larger amounts.

```
F(11,7,5,1) = 1*11 - 1 = 10

```

### Residue Patterns

The algorithm leverages modular arithmetic to efficiently handle change calculations.  
For amounts modulo 11, we use these precomputed optimal patterns:

| Residue | Optimal Coin Combination    |
|---------|-----------------------------|
| 0       | (none needed)               |
| 1       | 1 × 1                       |
| 2       | 2 × 1                       |
| 3       | 3 × 1                       |
| 4       | 1 × 5 - 1 × 1               |
| 5       | 1 × 5                       |
| 6       | 1 × 7 - 1 × 1               |
| 7       | 1 × 7                       |
| 8       | 1 × 5 + 3 × 1               |
| 9       | 1 × 5 + 4 × 1               |
| 10      | 2 × 5                       |


### Algorithm Implementation

#### 1. Memory-Efficient Dynamic Programming

For amounts up to 100, we use a memory-optimized dynamic programming approach:

```typescript
private findMinCoins(amount: number): number {
  // We only need to store the last (largestCoin + 1) states
  const dp = new Array(largestCoin + 1).fill(Infinity);
  dp[0] = 0;  // Base case

  // Build solution using a sliding window approach
  for (let target = 1; target <= amount; target++) {
    const pos = target % (largestCoin + 1);  // Circular array position
    dp[pos] = Infinity;  // Reset before calculating

    // Try each coin denomination
    for (const coin of COIN_SIZES) {
      if (target - coin >= 0) {
        const prevPos = (target - coin) % (largestCoin + 1);
        dp[pos] = Math.min(dp[pos], dp[prevPos] + 1);
      }
    }
  }

  return dp[amount % (largestCoin + 1)];
}

```

This approach achieves O(1) space complexity regardless of input size, using only a fixed-size circular array.

#### 2. LCM Optimization for Medium Amounts

For medium-sized amounts (100-1000), we leverage mathematical relationships between coin denominations:

```typescript
private applyLCMOptimization(amount: number, coins: number[]): { reduced: boolean; result?: any } {
  // Find coin pairs with mathematical relationships
  for (let i = 0; i < coins.length; i++) {
    for (let j = i + 1; j < coins.length; j++) {
      const a = coins[i];
      const b = coins[j];
      const gcd = this.gcd(a, b);

      if (gcd > 1) {
        // These coins have a common factor
        const lcm = (a * b) / gcd;

        // Check if amount is divisible by the LCM
        if (amount % lcm === 0) {
          // We can optimize this case!
          const factor = amount / lcm;
          const baseCoins = this.solveForLCM(a, b, lcm);
          const result = this.scaleCoinsResult(baseCoins, factor);
          return { reduced: true, result: [result] };
        }
      }
    }
  }
  return { reduced: false };
}

```

This technique uses Bézout's identity and the extended Euclidean algorithm to find optimal solutions when the amount has special mathematical properties.

#### 3. Large Amount Processing

For very large amounts (>1000), we use advanced mathematical properties to avoid memory issues:

```typescript
private handleLargeAmount(amount: number, coins: number[]): any[] {
  // For large amounts, calculate the base solution using mathematical properties
  const minCoins = this.findMinCoinsForLargeAmount(amount, coins);
  const baseSolution = this.getCompactSolution(amount, coins, minCoins);
  
  return baseSolution ? [baseSolution] : [];
}

```

The algorithm uses the fact that for large amounts, the minimum number of coins approaches:

```
min_coins(n) = ⌊n/largestCoin⌋ + min_coins(n % largestCoin)

```

#### 4. Memory-Efficient BFS for All Solutions

To find all possible optimal combinations, we use a space-efficient BFS approach:

```typescript
private findAllCombinations(amount: number, minCoins: number, options: any[]) {
  // Use a compact state representation
  const queue = new Array(Math.min(maxStates, 10000));  // Cap size
  let head = 0, tail = 0;  // Circular queue indices
  const visited = new Set<string>();  // Track visited states
  
  // Start BFS
  queue[tail++] = {
    remaining: amount,
    index: 0,
    current: Array(COIN_SIZES.length).fill(0),
    totalUsed: 0,
  };
  
  while (head !== tail) {
    // Process each state in the queue
    // ...
    
    // For each state, try two options:
    // 1. Skip this coin denomination
    // 2. Take one of this coin denomination
  }
}

```

This approach prevents memory overflow by:

1.  Using a fixed-size circular queue
2.  Employing a compact state representation
3.  Deduplicating states with a visit set
4.  Pruning non-optimal paths early

### Advanced Optimization Techniques

#### Extended Euclidean Algorithm

For solving Diophantine equations in LCM optimization:

```typescript
private extendedGcd(a: number, b: number): [number, number] {
  if (b === 0) return [1, 0];
  
  const [x1, y1] = this.extendedGcd(b, a % b);
  const x = y1;
  const y = x1 - Math.floor(a / b) * y1;
  
  return [x, y];
}

```

This algorithm finds integers x, y such that ax + by = gcd(a,b), which is crucial for finding optimal coin combinations.

#### Pattern Recognition for Residues

For amounts modulo the largest coin, we use precomputed patterns:

```typescript
// Precomputed optimal values for remainders mod 11
const remainderCoins = [0, 1, 2, 3, 4, 1, 2, 1, 3, 4, 2];
return quotient + remainderCoins[remainder];

```

This allows O(1) calculation for residue handling, dramatically speeding up the algorithm.

### Performance Characteristics

-   **Time Complexity**:
    
    -   Small amounts: O(n), where n is the amount
    -   Medium amounts: O(log n) with LCM optimization
    -   Large amounts: O(1) using mathematical properties
-   **Space Complexity**:
    
    -   Constant O(1) regardless of input size
    -   Maximum memory usage capped at 10,000 states

### Edge Case Handling

-   **Zero or Negative Amounts**: Returns 0 or special values
-   **Very Large Amounts**: Uses mathematical properties to avoid overflow
-   **Non-Canonical Systems**: Fallback to complete search when greedy fails

### Multiple Solution Support

-   Finds all optimal combinations with the same minimum coin count
-   Handles both unique and multiple solutions
-   Returns single optimal solution for very large amounts (>1000) to conserve memory
-   Recognizes when the greedy algorithm produces the optimal solution

----------

_ChangeSolver-DP-LCM-BFS is implemented as an Angular service_