// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ITokenFactory {
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

    event TokenCreated(
        address indexed tokenAddress,
        address indexed owner,
        string name,
        string symbol,
        uint256 maxSupply,
        uint256 price
    );

    event TokenPurchased(address indexed buyer, address indexed tokenAddress, uint256 amount, uint256 totalPrice);

    event FactoryPaused(address indexed account);
    event FactoryUnpaused(address indexed account);
    event TokenPriceUpdated(address indexed tokenAddress, uint256 oldPrice, uint256 newPrice);

    function createToken(
        string memory name,
        string memory symbol,
        string memory description,
        uint256 maxSupply,
        uint256 price
    ) external returns (address);

    function purchaseToken(address tokenAddress, uint256 amount) external;

    // Contract owner functions
    function pauseFactory() external;

    function unpauseFactory() external;

    // Token owner functions
    function updateTokenPrice(address tokenAddress, uint256 newPrice) external;

    /// Token Issuer realted funcitons
    function getOwnerTokenList(address owner) external view returns (address[] memory);

    function getOwnerTokenCount(address owner) external view returns (uint256);

    function getOwnerTokens(address owner) external view returns (TokenInfo[] memory);

    // Public token related functions
    function getTokens(uint256 startIndex, uint256 endIndex) external view returns (TokenInfo[] memory);

    function getTokensPaginated(uint256 page, uint256 pageSize)
        external
        view
        returns (TokenInfo[] memory, uint256 total);

    function getAllTokens() external view returns (TokenInfo[] memory);

    function getTokenDetails(address tokenAddress) external view returns (TokenInfo memory);

    function getTokenAddressList() external view returns (address[] memory);

    // User related functions
    function balanceOf(address tokenAddress, address user) external view returns (uint256);
    function usdtToken() external view returns (address);
}
