# ChangeSolver-DP-BFS

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
- [Components](#components)
  - [Pages](#pages)
  - [Core Components](#core-components)
  - [Features](#features)
  - [Backend Integration](#backend-integration)
  - [State Management & Performance](#state-management--performance)
  - [Code Maintenance & Formatting](#code-maintenance--formatting)
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

ChangeSolver-DP-BFS is a comprehensive point-of-sale algorithm module that streamlines change calculation using a multi-strategy approach. It is designed for high performance and low memory consumption, capable of solving for optimal coin combinations across various input sizes.

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

# Components

## Pages
- `MainPageComponent`: The main application page that serves as the container for all other components
- `ColorPaletteComponent`: Displays the color palette and typography system used in the application

## Core Components
- `BannerComponent`: Top banner section containing the "Add Product" button and modal
  - `AddProductModalComponent`: Modal for adding new products with form validation

- `ProductListComponent`: Displays the list of products with infinite scroll functionality
  - `ShoeItemComponent`: Individual product card with add to cart functionality

- `OrderSummaryComponent`: Shows the current order items and total
  - `OrderItemComponent`: Individual order item with quantity controls

- `PaymentSummaryComponent`: Handles payment calculation and change computation
  - `WithdrawalOptionListComponent`: Displays all possible coin combinations for change
  - `WithdrawalOptionItemComponent`: Individual coin combination display

- `SearchBarComponent`: Search functionality for filtering products by name

## Features
- Responsive design for both desktop and mobile
- Form validation for adding new products
- Real-time total price calculation
- Change calculation with optimal coin combinations
- Search functionality
- Efficient infinite scroll with Supabase pagination
  - Loads only necessary data
  - Implements cursor-based pagination
  - Optimizes performance by fetching limited items per request
- Color palette and typography system documentation
- Supabase integration for data persistence and initial product data

#### Backend Integration
- Connected to Supabase for data management
- Initial product data stored in Supabase database
- Real-time data synchronization
- Optimized data fetching:
  - Implements pagination
  - Loads data in chunks to minimize initial load time
  - Efficient querying with Supabase's range pagination
  - Maintains smooth scrolling performance

#### State Management & Performance
- NgRx implementation for robust state management:
  - Centralized store for application state
  - Actions and reducers for predictable state updates
  - Selectors for efficient state access
  - Facade pattern for simplified store interactions
- Memory leak prevention:
  - RxJS takeUntil operator for proper subscription cleanup
  - Automatic unsubscription on component destruction
  - Efficient memory management for long-lived components
- Modern Angular Architecture:
  - Standalone components for better maintainability
  - Self-contained components with explicit dependencies
  - Simplified testing and lazy loading
  - Reduced bundle size through tree-shaking
  - No need for NgModule declarations
  - Easier component reuse and composition

#### Code Maintenance & Formatting
- Prettier integration for consistent code formatting:
  - Automatic code formatting on save
  - Enforced consistent code style across the project
  - Configurable formatting rules

  
## Technical Details

### Coin Combination Algorithm

This application implements an advanced algorithm for finding optimal coin combinations using denominations [11, 7, 5, 1]. The algorithm dynamically selects strategies based on the input amount, balancing memory efficiency, runtime performance, and solution completeness.

### Core Algorithm Architecture

The coin combination algorithm uses a multi-strategy approach that selects the appropriate technique based on the input amount:

1. **Large Amounts (>10000)**: Mathematical optimizations and pattern recognition
2. **Small Amounts (<10000)**: Memory-efficient dynamic programming with BFS

### Mathematical Foundations

### Algorithm Implementation

#### 1. Memory-Efficient Dynamic Programming

For finding minimum coins needed, we use a memory-optimized dynamic programming approach:

```typescript
private findMinCoins(amount: number): number {
  const COIN_SIZES = [11, 7, 5, 1];

  if (amount === 0) return 0;
  if (amount < 0) return Infinity;

  const largestCoin = Math.max(...COIN_SIZES);
  const dp = new Array(largestCoin + 1).fill(Infinity);
  dp[0] = 0;

  for (let target = 1; target <= amount; target++) {
    const pos = target % (largestCoin + 1);
    dp[pos] = Infinity;

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

This achieves O(amount) time complexity with O(largestCoin) space complexity by using a circular array.

#### 2. Large Amount Processing

For very large amounts (>10000), we use advanced mathematical properties to avoid memory issues:

```typescript
private handleLargeAmount(amount: number, coins: number[]): CoinCombination[] {
  const options: CoinCombination[] = [];
  const baseSolution = this.getCompactSolution(amount, coins);
  if (baseSolution) {
    options.push(...baseSolution);
  }
  return options;
}
```

#### 3. Memory-Efficient BFS for All Solutions

To find all possible optimal combinations, we use a space-efficient BFS approach:

```typescript
private findAllCombinations(amount: number, minCoins: number, options: CoinCombination[]) {
  const COIN_SIZES = [11, 7, 5, 1];
  const solutionKeys = new Set<string>();
  const maxStates = Math.min(100000, amount * COIN_SIZES.length);
  const visited = new Set<string>();
  const queue = new Array(maxStates);
  let head = 0, tail = 0;

  // Start with the first coin
  queue[tail++] = {
    remaining: amount,
    index: 0,
    current: Array(COIN_SIZES.length).fill(0),
    totalUsed: 0,
  };

  while (head !== tail) {
    const { remaining, index, current, totalUsed } = queue[head++];
    if (head >= queue.length) head = 0;

    const stateKey = `${remaining}:${index}:${totalUsed}`;
    if (visited.has(stateKey)) continue;
    visited.add(stateKey);

    if (totalUsed > minCoins) continue;
    if (remaining === 0 && totalUsed === minCoins) {
      const coins: { [key: number]: number } = {};
      COIN_SIZES.forEach((c, i) => {
        if (current[i] > 0) coins[c] = current[i];
      });
      const solutionKey = this.createSolutionKey(coins);
      if (!solutionKeys.has(solutionKey)) {
        options.push({ coins, amount: totalUsed });
        solutionKeys.add(solutionKey);
      }
      continue;
    }
    if (index >= COIN_SIZES.length) continue;

    const coin = COIN_SIZES[index];
    if (index < COIN_SIZES.length - 1) {
      queue[tail++] = { remaining, index: index + 1, current: [...current], totalUsed };
      if (tail >= queue.length) tail = 0;
    }
    if (remaining >= coin && totalUsed + 1 <= minCoins) {
      const newCurrent = [...current];
      newCurrent[index]++;
      queue[tail++] = { remaining: remaining - coin, index, current: newCurrent, totalUsed: totalUsed + 1 };
      if (tail >= queue.length) tail = 0;
    }
  }
}
```

#### 4. Greedy Solution Attempt
The algorithm first tries a greedy approach, which is optimal for some amounts:

```typescript
private tryGreedySolution(amount: number, coins: number[]): CoinCombination | null {
  const result: { [key: number]: number } = {};
  let remaining = amount;
  let totalCoins = 0;
  const sortedCoins = [...coins].sort((a, b) => b - a);

  for (const coin of sortedCoins) {
    if (remaining >= coin) {
      const count = Math.floor(remaining / coin);
      result[coin] = count;
      totalCoins += count;
      remaining -= count * coin;
    }
  }

  return remaining === 0 ? { coins: result, amount: totalCoins } : null;
}
```

### Advanced Optimization Techniques

#### Deduplication

```typescript
private createSolutionKey(coins: { [key: number]: number }): string {
  return this.COIN_SIZES.filter(coin => coins[coin] > 0)
    .map(coin => `${coin}:${coins[coin]}`)
    .join('|');
}
```

The algorithm uses a Set to track visited states and unique solutions, ensuring memory efficiency:

This algorithm finds integers x, y such that ax + by = gcd(a,b), which is crucial for finding optimal coin combinations.



This allows O(1) calculation for residue handling, dramatically speeding up the algorithm.

### Performance Characteristics

- **Time Complexity**:
  - Small amounts (<10000): O(amount * |COIN_SIZES|) for DP, O(amount * |COIN_SIZES| * S) for BFS, where S is the number of solutions
  - Large amounts (>10000): O(largestCoin) for minimum coins, O(1) for single solution generation
- **Space Complexity**:
  - O(largestCoin) for DP sliding window
  - O(min(10000, amount * |COIN_SIZES|)) for BFS queue
  - O(S) for storing solutions, where S is the number of unique solutions

### Edge Case Handling

- **Zero or Negative Amounts**: Returns 0 or Infinity
- **Very Large Amounts**: Uses mathematical properties to avoid overflow
- **Non-Canonical Systems**: Fallback to complete search when greedy fails

### Multiple Solution Support

- Finds all optimal combinations with the same minimum coin count
- Handles both unique and multiple solutions
- Returns single optimal solution for very large amounts (>10000) to conserve memory
- Recognizes when the greedy algorithm produces the optimal solution

----------

_ChangeSolver-DP-BFS is implemented as an Angular service_
