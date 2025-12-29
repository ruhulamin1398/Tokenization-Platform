# Tokenization Platform

This document outlines the technical architecture and implementation plan for a proof-of-concept (POC) tokenization platform. The platform enables asset owners to create and manage tokenized assets while allowing buyers to purchase and transfer these tokens seamlessly.

---

## System Architecture

### Core Components

The platform consists of the following key components:

- **Frontend Application**: Web interface for user interaction
- **Smart Contracts**: On-chain logic for token management and transactions
- **Wallet Integration**: MetaMask connectivity for authentication and transactions
- **Factory Contract**: Central registry managing all tokenised assets

---

## 1. Authentication & User Management

### Wallet-Based Authentication

Users authenticate by connecting their cryptocurrency wallets to the platform. This approach eliminates traditional username/password systems and leverages blockchain identity.

**Technology Stack:**

- **WAGMI**: React hooks for Ethereum interactions
- **RainbowKit**: User-friendly wallet connection interface
- **MetaMask**: Primary wallet provider

### User Roles

The platform supports two distinct user types:

**Owner/Issuer**

- Create new tokenized assets
- Manage existing tokens
- View token statistics and holder information
- Set token pricing and supply parameters

**Buyer/User**

- Browse available tokens
- Purchase tokens using USDT
- Transfer tokens to other wallets
- View purchase history and token balances

### Security Considerations

- Role-based access control (RBAC) implemented at smart contract level
- Action restrictions based on user type
- Wallet signature verification for sensitive operations
- Network validation to ensure correct blockchain connection

---

## 2. Token Creation Flow

### Tokenization Form

Owners can create new tokenized assets through a structured form interface.

**Required Fields:**

- **Token Name**: Human-readable identifier for the asset
- **Symbol:** Token symbol
- **Short Description**: Brief explanation of the tokenized asset
- **Total Supply**: Maximum number of tokens to be created
- **Token Price**: Cost per token (denominated in USDT or selected stablecoin)

### Creation Workflow

The token creation process follows these steps:

1. **Form Submission**: Owner completes and submits the tokenization form
2. **Contract Deployment**: Factory contract deploys a new ERC20-compatible token contract
3. **Metadata Registration**: Token details are registered in the Factory Contract registry
4. **Confirmation**: Owner receives confirmation with contract address and transaction hash

### Technical Implementation

`User Input → Frontend Validation → Factory Contract Call → Token Deployment → Registry Update`

---

## 3. Issuer Dashboard

### Features & Functionality

The issuer dashboard provides comprehensive token management capabilities.

**Display Information:**

- Token name and symbol
- Total supply and minted supply
- Contract address with blockchain explorer link
- Current token price
- Optional: List of token holders with balances

**Available Actions:**

- View detailed token statistics
- Monitor minting progress (minted vs remaining supply)
- Access token holder information

---

## 4. User Dashboard

### Overview

The user dashboard serves as the central hub for buyers to manage their token portfolio.

**Display Components:**

- **Token Portfolio**: All purchased tokens with current balances
- **Token Details**: Name, symbol, contract address
- **Purchase History**: Complete transaction log with dates and amounts
- **Transaction Hashes**: Links to blockchain explorer for verification

### User Actions

**Token Transfers**

- Send tokens to other wallet addresses
- Specify transfer amount and the recipient
- Confirm the transaction through wallet signature

**Token Information**

- View comprehensive token metadata
- Access original token description

---

## 5. Token Purchase Flow

### Purchase Process

The token acquisition process ensures secure and validated transactions.

**Step-by-Step Flow:**

1. **Token Selection**: User browses available tokens and selects desired token
2. **Quantity Input**: User specifies the number of tokens to purchase
3. **Validation**: Smart contract validates:
    - Token availability (sufficient unminted supply)
    - USDT allowance (buyer has approved sufficient USDT)
    - Buyer wallet balance
4. **Payment Processing**: USDT transferred from buyer to owner via `transferFrom()`
5. **Token Minting**: Corresponding token amount minted to buyer's wallet
6. **Event Emission**: `TokenPurchased` event logged on-chain for record-keeping
7. **Confirmation**: User receives transaction confirmation and updated balance

### Technical Validation

The smart contract performs multiple checks:

- Verify token exists and is active
- Confirm unminted supply >= requested amount
- Validate USDT allowance >= total purchase price
- Ensure buyer balance >= total purchase price

---

## 6. Factory Contract Specification

### Purpose & Role

The Factory Contract serves as the central registry and coordination layer for all tokenized assets on the platform.

### Stored Data Structure

**Per Token Record:**

- **Owner Address**: Wallet address of token creator
- **Token Contract Address**: Deployed token contract location
- **Price**: Cost per token in USDT
- **Total Supply**: Maximum mintable token count
- **Metadata**: Name, description, symbol

### Core Functions

**`registerToken()`**

Adds a newly deployed token to the central registry.

- **Parameters**: Token metadata, price, supply
- **Returns**: contract address

**`purchaseToken(uint256 amount, address tokenAddress)`**

Executes token purchase transaction.

- **Parameters**: Purchase amount, target token address
- **Process**: Deducts USDT, mints tokens to buyer
- **Returns**: Transaction success status

**`getTokensByOwner(address owner)`**

Retrieves all tokens created by a specific owner.

- **Parameters**: Owner wallet address
- **Returns**: Array of token details

**`getTokenDetails(address tokenAddress)`**

Fetches comprehensive information for a specific token.

- **Parameters**: Token contract address
- **Returns**: Complete token metadata and statistics

### Event Emissions

The contract emits events for important state changes:

**`TokenCreated`**

- Triggered when new token is registered
- Contains: owner address, token address, initial parameters

**`TokenPurchased`**

- Triggered on successful token purchase
- Contains: buyer address, token address, amount, price paid

**`TokenTransferred`**

- Triggered when tokens move between wallets
- Contains: from address, to address, token add