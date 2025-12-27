// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {AssetToken} from "./AssetToken.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Factory Contract
contract TokenFactory is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    address public usdtToken;

    struct TokenInfo {
        address tokenAddress;
        address owner;
        string name;
        string symbol;
        string description;
        uint256 maxSupply;
        uint256 totalSupply;
        uint256 price;
        uint256 createdAt;
    }

    // Mapping: token address => token info
    mapping(address => TokenInfo) public tokens;

    // Mapping: owner address => array of token addresses
    mapping(address => address[]) public ownerTokens;

    // Array of all token addresses
    address[] public tokenAddressList;

    // Events
    event TokenCreated(
        address indexed tokenAddress,
        address indexed owner,
        string name,
        string symbol,
        uint256 maxSupply,
        uint256 price
    );

    event TokenPurchased(address indexed buyer, address indexed tokenAddress, uint256 amount, uint256 totalPrice);

    constructor(address _usdtToken, address _owner) Ownable(_owner) {
        require(_usdtToken != address(0), "Invalid USDT token address");
        require(_owner != address(0), "Invalid owner address");
        require(_usdtToken != _owner, "USDT token address cannot be the owner address");
        require(_usdtToken.code.length > 0, "USDT token address must be a contract");
        require(_owner.code.length == 0, "Owner address must be an EOA");

        usdtToken = _usdtToken;
    }

    /**
     * @dev Creates and deploys a new token contract
     * @param name Token name
     * @param symbol Token symbol
     * @param description Token description
     * @param maxSupply Maximum token supply
     * @param price Price per token in USDT (with decimals)
     */
    function createToken(
        string memory name,
        string memory symbol,
        string memory description,
        uint256 maxSupply,
        uint256 price
    ) external whenNotPaused returns (address) {
        require(maxSupply > 0, "Max supply must be greater than 0");
        require(price > 0, "Price must be greater than 0");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");

        // Deploy new token contract
        AssetToken newToken = new AssetToken(name, symbol);

        address tokenAddress = address(newToken);

        // Store token information
        tokens[tokenAddress] = TokenInfo({
            tokenAddress: tokenAddress,
            owner: msg.sender,
            name: name,
            symbol: symbol,
            description: description,
            maxSupply: maxSupply,
            totalSupply: 0,
            price: price,
            createdAt: block.timestamp
        });

        // Add to owner's token list
        ownerTokens[msg.sender].push(tokenAddress);

        // Add to global token list
        tokenAddressList.push(tokenAddress);

        emit TokenCreated(tokenAddress, msg.sender, name, symbol, maxSupply, price);

        return tokenAddress;
    }

    /**
     * @dev Purchase tokens from a deployed token contract
     * @param tokenAddress Address of the token to purchase
     * @param amount Number of tokens to purchase
     */
    function purchaseToken(address tokenAddress, uint256 amount) external nonReentrant {
        TokenInfo storage tokenInfo = tokens[tokenAddress];
        require(tokenInfo.tokenAddress != address(0), "Token does not exist");

        uint256 totalPrice = amount * tokenInfo.price;

        // Check remaining supply
        require(tokenInfo.totalSupply + amount <= tokenInfo.maxSupply, "Insufficient tokens available");

        // Transfer USDT from buyer to token owner
        IERC20(usdtToken).safeTransferFrom(msg.sender, tokenInfo.owner, totalPrice);

        AssetToken token = AssetToken(tokenAddress);

        // Mint tokens to buyer
        token.mint(msg.sender, amount);
        tokenInfo.totalSupply += amount;

        emit TokenPurchased(msg.sender, tokenAddress, amount, totalPrice);
    }

    /**
     * @dev Pause the factory contract
     */
    function pauseFactory() external onlyOwner {
        _pause();
    }
    /**
     * @dev Unpause the factory contract
     */

    function unpauseFactory() external onlyOwner {
        _unpause();
    }
    /**
     * @dev Get all tokens created by a specific owner
     */

    function balanceOf(address tokenAddress, address user) external view returns (uint256) {
        AssetToken token = AssetToken(tokenAddress);
        return token.balanceOf(user);
    }

    function getOwnerTokenList(address owner) external view returns (address[] memory) {
        return ownerTokens[owner];
    }
    /**
     * @dev Get the count of tokens created by a specific owner
     * @param owner Address of the token owner
     */

    function getOwnerTokenCount(address owner) external view returns (uint256) {
        return ownerTokens[owner].length;
    }

    /**
     * @dev Get detailed information about all tokens created by a specific owner
     * @param owner Address of the token owner
     */
    function getOwnerTokens(address owner) external view returns (TokenInfo[] memory) {
        address[] memory ownerTokenAddresses = ownerTokens[owner];
        uint256 count = ownerTokenAddresses.length;
        TokenInfo[] memory ownerTokenInfos = new TokenInfo[](count);

        for (uint256 i = 0; i < count; i++) {
            ownerTokenInfos[i] = tokens[ownerTokenAddresses[i]];
        }

        return ownerTokenInfos;
    }
    /**
     * @dev Get tokens in a specific index range
     * @param startIndex Starting index (inclusive)
     * @param endIndex Ending index (exclusive)
     */

    function getTokens(uint256 startIndex, uint256 endIndex) external view returns (TokenInfo[] memory) {
        require(startIndex < endIndex, "Invalid index range");
        require(endIndex <= tokenAddressList.length, "End index out of bounds");

        uint256 count = endIndex - startIndex;
        TokenInfo[] memory tokenInfos = new TokenInfo[](count);

        for (uint256 i = 0; i < count; i++) {
            address tokenAddress = tokenAddressList[startIndex + i];
            tokenInfos[i] = tokens[tokenAddress];
        }

        return tokenInfos;
    }
    /**
     * @dev Get all tokens in the platform
     */

    function getAllTokens() external view returns (TokenInfo[] memory) {
        uint256 count = tokenAddressList.length;
        TokenInfo[] memory tokenInfos = new TokenInfo[](count);

        for (uint256 i = 0; i < count; i++) {
            address tokenAddress = tokenAddressList[i];
            tokenInfos[i] = tokens[tokenAddress];
        }

        return tokenInfos;
    }
    /**
     * @dev Get detailed information about a token
     */

    function getTokenDetails(address tokenAddress) external view returns (TokenInfo memory) {
        require(tokens[tokenAddress].tokenAddress != address(0), "Token does not exist");
        return tokens[tokenAddress];
    }

    /**
     * @dev Get all tokens in the platform
     */
    function getTokenAddressList() external view returns (address[] memory) {
        return tokenAddressList;
    }
}
