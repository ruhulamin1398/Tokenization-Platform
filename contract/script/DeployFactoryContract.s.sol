// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {TokenFactory} from "../src/TokenFactory.sol";
import {console} from "forge-std/console.sol";
import {Script} from "forge-std/Script.sol";
import {USDT} from "../src/mock/USDT.sol";

contract DeployFactoryContract is Script {
    address public usdtTokenAddress = 0x61807fBd22D2E47227C1af6d5aC5F3ECC0d05930;

    function run() external returns (address tokenFactoryAddress) {
        vm.startBroadcast();

        TokenFactory tokenFactory = new TokenFactory(usdtTokenAddress, msg.sender);
        console.log("Token Factory deployed at:", address(tokenFactory));

        tokenFactoryAddress = address(tokenFactory);

        // Create dummy tokens for testing
        // createDummyTokens(tokenFactory);

        vm.stopBroadcast();
    }

    function createDummyTokens(TokenFactory tokenFactory) internal {
        string[10] memory names = [
            "Gold Token",
            "Silver Token",
            "Platinum Token",
            "Diamond Token",
            "Ruby Token",
            "Emerald Token",
            "Sapphire Token",
            "Pearl Token",
            "Amethyst Token",
            "Topaz Token"
        ];

        string[10] memory symbols = ["GLD", "SLV", "PLT", "DMD", "RUB", "EMD", "SAP", "PRL", "AMT", "TPZ"];

        string[10] memory descriptions = [
            "This premium gold token represents digital ownership of physical gold assets stored in secure vaults. Each token is backed by one gram of pure 24k gold bullion, providing investors with a stable and tangible asset class that maintains value during economic uncertainty and market volatility.",
            "Silver token offering represents ownership in industrial-grade silver reserves used across multiple sectors including electronics, solar panels, and jewelry manufacturing. This token provides exposure to both precious metal appreciation and industrial demand growth in the global economy.",
            "Platinum token symbolizes ownership of rare platinum reserves, one of the scarcest and most valuable precious metals on earth. Used extensively in automotive catalytic converters, jewelry, and industrial applications, this token offers diversification beyond traditional gold and silver investments.",
            "Diamond token represents fractional ownership in certified diamond reserves, providing access to the luxury gemstone market. Each token corresponds to a portion of professionally graded diamonds stored in secure facilities, offering both aesthetic and investment value in the high-end luxury market.",
            "Ruby gemstone token provides ownership in premium ruby reserves sourced from the finest mines worldwide. These vibrant red gemstones are prized for their beauty and rarity, offering investors exposure to the growing luxury jewelry and collectible gemstone market with historical appreciation.",
            "Emerald token represents digital ownership of Colombian and Zambian emerald reserves, renowned for their exceptional clarity and deep green color. These precious gemstones have been valued for centuries and continue to appreciate as rare natural resources in the luxury market.",
            "Sapphire token offers fractional ownership in blue sapphire reserves from Sri Lankan and Burmese mines, famous for their intense color and brilliance. These gemstones represent both investment potential and the enduring beauty valued in high-end jewelry collections worldwide.",
            "Pearl token symbolizes ownership in cultured pearl reserves from premium oyster farms in Japan and China. These lustrous gemstones represent both natural beauty and sustainable aquaculture investment, with growing demand in the luxury jewelry and wellness markets.",
            "Amethyst token provides exposure to premium purple amethyst crystal reserves from Brazilian and Uruguayan mines. These violet gemstones offer both aesthetic appeal and metaphysical properties, appealing to collectors and investors seeking unique alternative assets.",
            "Topaz token represents ownership in golden topaz reserves from Brazilian and Pakistani mines, prized for their warm amber color and clarity. These durable gemstones offer investment potential in the growing colored gemstone market with applications in both jewelry and industrial uses."
        ];

        uint256[10] memory maxSupplies = [
            uint256(1000000) * 10 ** 6, // 1M tokens in decimal units
            uint256(2000000) * 10 ** 6, // 2M tokens in decimal units
            uint256(500000) * 10 ** 6, // 500K tokens in decimal units
            uint256(100000) * 10 ** 6, // 100K tokens in decimal units
            uint256(250000) * 10 ** 6, // 250K tokens in decimal units
            uint256(750000) * 10 ** 6, // 750K tokens in decimal units
            uint256(300000) * 10 ** 6, // 300K tokens in decimal units
            uint256(150000) * 10 ** 6, // 150K tokens in decimal units
            uint256(400000) * 10 ** 6, // 400K tokens in decimal units
            uint256(600000) * 10 ** 6 // 600K tokens in decimal units
        ];

        uint256[10] memory prices = [
            uint256(1000000), // 1 USDT per token (in wei units)
            uint256(500000), // 0.5 USDT per token
            uint256(2000000), // 2 USDT per token
            uint256(5000000), // 5 USDT per token
            uint256(750000), // 0.75 USDT per token
            uint256(1500000), // 1.5 USDT per token
            uint256(3000000), // 3 USDT per token
            uint256(250000), // 0.25 USDT per token
            uint256(800000), // 0.8 USDT per token
            uint256(1200000) // 1.2 USDT per token
        ];

        console.log("Creating dummy tokens...");

        for (uint256 i = 0; i < 10; i++) {
            address tokenAddress =
                tokenFactory.createToken(names[i], symbols[i], descriptions[i], maxSupplies[i], prices[i]);

            console.log("Created token:", names[i], symbols[i], tokenAddress);
        }

        console.log("All dummy tokens created successfully!");
    }
}
