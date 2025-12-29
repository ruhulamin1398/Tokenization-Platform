// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AssetToken
 * @dev Individual Token Contract Template for tokenized assets
 * @notice This contract is deployed by the TokenFactory and owned by the factory contract.
 *         The factory contract has minting rights. Ownership should not be transferred
 *         to prevent unauthorized minting.
 */
contract AssetToken is ERC20, Ownable {
    /**
     * @dev Constructor that sets the token name and symbol
     * @param name The name of the token
     * @param symbol The symbol of the token
     */
    constructor(string memory name, string memory symbol) ERC20(name, symbol) Ownable(msg.sender) {}

    /**
     * @dev Mints tokens to a specified address
     * @notice Only the owner (TokenFactory) can call this function
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than zero");

        _mint(to, amount);
    }

    /**
     * @dev Returns the number of decimals for the token
     * @return The number of decimals (6, matching USDT)
     */
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
}
