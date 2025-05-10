# Easy Cashier

_Create, Price, Calculate in one simple package!_

## Table of Contents

- [Running the Project](#running-the-project)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development Server](#development-server)
  - [Building for Production](#building-for-production)
  - [Additional Commands](#additional-commands)
- [How to Use](#how-to-use)
  - [Managing Orders](#1-managing-orders)
  - [Payment Processing](#2-payment-processing)
  - [Change Calculation](#3-change-calculation)
  - [Features](#4-features)
- [Coin Combination Algorithm](#coin-combination-algorithm)
  - [Algorithm Overview](#algorithm-overview)
  - [Key Features](#key-features)

## Running the Project

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development Server

To start the development server:

```bash
npm start
```

This will start the application on `http://localhost:4200/`

### Building for Production

To build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Additional Commands

- `npm run watch` - Build and watch for changes
- `npm run format` - Format code using Prettier
- `npm run format:check` - Check code formatting

## How to Use

Easy Cashier is a point-of-sale application that helps you manage orders and calculate change efficiently. Here's how to use it:

### 1. Managing Orders

- Browse through the available products
- Click the "+" button to add items to your cart
- Use the "+" and "-" buttons to adjust quantities
- Items can be removed from the cart by setting their quantity to 0

### 2. Payment Processing

1. After adding items to your cart, you'll see the total amount due
2. Enter the amount of money received from the customer in the "Received Money" field
3. Click "Calculate" to process the payment
4. The system will automatically:
   - Calculate the change amount
   - Show the optimal coin combination for the change
   - Display all possible withdrawal options using the available coins (11฿, 7฿, 5฿, 1฿)

### 3. Change Calculation

The system uses an advanced algorithm to calculate change using the following coin denominations:

- 11฿ coins
- 7฿ coins
- 5฿ coins
- 1฿ coins

The algorithm will:

- Find the optimal combination of coins
- Show all possible combinations that use the minimum number of coins
- Handle large amounts efficiently
- Prevent memory issues with large transactions

### 4. Features

- Real-time order management
- Automatic change calculation
- Multiple withdrawal options
- Memory-efficient processing
- Support for large transactions
- Input validation for received money
- Whole number validation
- Minimum payment validation

# Coin Combination Algorithm

This project implements an efficient algorithm for finding optimal coin combinations for a given amount using coins of denominations [11, 7, 5, 1]. The implementation focuses on three key aspects: minimal memory usage, optimized runtime, and prevention of brute force approaches.

## Algorithm Overview

The implementation uses several sophisticated techniques to handle different scenarios efficiently:

### 1. Memory-Efficient Implementation

- Constant space complexity O(1) for large amounts
- Sliding window dynamic programming approach
- Circular queue implementation with fixed memory allocation
- No recursive calls to prevent stack overflow
- Memory usage capped at 10,000 states regardless of input size

### 2. Runtime Optimization

- O(n) time complexity for basic cases
- Mathematical shortcuts for common scenarios
- Early termination for optimal solutions
- Efficient state tracking and pruning
- Precomputed optimal values for remainders
- LCM (Least Common Multiple) optimization for specific cases

### 3. Brute Force Prevention

- Smart mathematical properties utilization
- Frobenius number properties for optimization
- GCD/LCM relationships between coin pairs
- Efficient residue handling
- Pattern recognition for common cases
- Mathematical shortcuts for large amounts

### 4. Advanced Techniques

- Frobenius coin problem solution for amounts > 1000
- Mathematical properties of the coin system [11,7,5,1]
- Efficient residue calculations
- Pattern-based optimization
- State space reduction techniques

## Key Features

1. **Memory Efficiency**

   - Constant space usage for large amounts
   - Sliding window DP implementation
   - Capped queue size to prevent memory issues
   - No recursive stack usage
   - Fixed memory allocation

2. **Performance Optimizations**

   - Early termination for optimal solutions
   - Mathematical shortcuts for common cases
   - Efficient state tracking and pruning
   - Pattern-based optimization
   - Smart mathematical properties utilization

3. **Multiple Solution Support**

   - Can find all possible optimal combinations
   - Handles both unique and multiple solutions
   - Efficient BFS implementation for finding all solutions
   - Memory-efficient solution tracking

4. **Edge Case Handling**
   - Proper handling of large amounts
   - Efficient residue calculations
   - Mathematical optimization for special cases
   - Pattern recognition for common scenarios

## Usage

The algorithm is implemented as an Angular service
