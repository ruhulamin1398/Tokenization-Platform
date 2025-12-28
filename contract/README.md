# Tokenization Platform

A proof-of-concept (POC) smart contract platform for asset tokenization on Ethereum. Enables asset owners to create and manage tokenized assets, while allowing buyers to purchase and transfer these tokens seamlessly.

## Features

- **Token Creation**: Asset owners can create ERC20-compatible tokens with custom parameters (name, symbol, supply, price).
- **Secure Purchases**: Buyers can purchase tokens using USDT with built-in validations for supply, balance, and allowances.
- **Factory Pattern**: Centralized TokenFactory contract manages all tokenized assets.
- **Pausable Operations**: Emergency pause functionality for security.
- **Comprehensive Testing**: Full test suite with Foundry for reliability.

## Tech Stack

- **Solidity**: Smart contract development
- **Foundry**: Testing, building, and deployment toolkit
- **OpenZeppelin**: Secure, audited contracts (ERC20, Ownable, Pausable, etc.)
- **Ethereum Sepolia Testnet**: Deployment network

## Installation

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation.html)
- [Git](https://git-scm.com/)

### Clone the Repository

```bash
git clone <repository-url>
cd tokenization-platform/contract
```

### Install Dependencies

```bash
forge install
```

This installs OpenZeppelin contracts and other dependencies.

## Setup

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY_59=your_private_key_without_0x
V2_API_KEY=your_etherscan_api_key
```

- `RPC_URL`: Sepolia testnet RPC endpoint
- `PRIVATE_KEY_59`: Deployer's private key (ensure it has Sepolia ETH)
- `V2_API_KEY`: Etherscan API key for contract verification

## Testing

Run the full test suite:

```bash
forge test
```

Run specific test files:

```bash
forge test --match-test TokenFactory
forge test --match-test PurchaseTest
```

For verbose output:

```bash
forge test -vvvv
```

## Deployment

### Deploy to Sepolia Testnet

Ensure your `.env` is set up and you have Sepolia ETH in your wallet.

```bash
make deploy
```

This command:
1. Formats the code
2. Deploys the `TokenFactory` contract
3. Verifies the contract on Etherscan

### Manual Deployment

If needed, deploy manually:

```bash
forge script script/DeployFactoryContract.s.sol:DeployAurexToken --rpc-url $RPC_URL --private-key $PRIVATE_KEY_59 --verify --verifier-api-key $V2_API_KEY --broadcast -vvvv
```

## Contract Addresses

### Sepolia Testnet

- **TokenFactory**: [0x6ab92902b3e40ac3d0149df6dfa1aa15bec1955f](https://sepolia.etherscan.io/address/0x6ab92902b3e40ac3d0149df6dfa1aa15bec1955f)
- **USDT Token**: [0x61807fBd22D2E47227C1af6d5aC5F3ECC0d05930](https://sepolia.etherscan.io/address/0x61807fBd22D2E47227C1af6d5aC5F3ECC0d05930)

## Usage

### Creating a Token

As an asset owner, call `createToken` on the TokenFactory:

```solidity
function createToken(
    string memory name,
    string memory symbol,
    string memory description,
    uint256 maxSupply,
    uint256 price // Price in USDT (6 decimals)
) external returns (address)
```

Example (using Cast):

```bash
cast send 0x6ab92902b3e40ac3d0149df6dfa1aa15bec1955f "createToken(string,string,string,uint256,uint256)" "My Asset" "MAS" "Description" 1000 1000000 --rpc-url $RPC_URL --private-key $PRIVATE_KEY
```

### Purchasing Tokens

Buyers can purchase tokens using USDT:

1. Approve USDT spending to the factory
2. Call `purchaseToken`

```bash
# Approve USDT
cast send $USDT_ADDRESS "approve(address,uint256)" 0x6ab92902b3e40ac3d0149df6dfa1aa15bec1955f 1000000 --rpc-url $RPC_URL --private-key $BUYER_PRIVATE_KEY

# Purchase tokens
cast send 0x6ab92902b3e40ac3d0149df6dfa1aa15bec1955f "purchaseToken(address,uint256)" $TOKEN_ADDRESS 10 --rpc-url $RPC_URL --private-key $BUYER_PRIVATE_KEY
```

### Viewing Token Information

Get token details:

```bash
cast call 0x6ab92902b3e40ac3d0149df6dfa1aa15bec1955f "getTokenDetails(address)" $TOKEN_ADDRESS --rpc-url $RPC_URL
```

## Architecture

### Core Contracts

- **TokenFactory**: Central registry for creating and managing tokens
- **AssetToken**: ERC20 token template with minting capabilities
- **USDT (Mock)**: Tether USD mock for testing purchases

### Key Functions

- `createToken()`: Deploy new token and register in factory
- `purchaseToken()`: Buy tokens with USDT validation
- `getOwnerTokens()`: List tokens by owner
- `getAllTokens()`: Global token list

### Security Features

- ReentrancyGuard on purchases
- Pausable for emergency stops
- Input validations
- SafeERC20 for transfers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues or questions, please open a GitHub issue.
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
