// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {TokenFactory} from "../src/TokenFactory.sol";
import {AssetToken} from "../src/AssetToken.sol";
import {USDT} from "../src/mock/USDT.sol";

contract PurchaseTest is Test {
    TokenFactory public factory;
    USDT public usdt;
    address public owner = address(1);
    address public buyer1 = address(2);
    address public buyer2 = address(3);
    address public tokenOwner = address(4);
    address public tokenAddress;

    function setUp() public {
        usdt = new USDT();
        vm.prank(owner);
        factory = new TokenFactory(address(usdt), owner);

        // Create a token for testing purchases
        vm.prank(tokenOwner);
        tokenAddress = factory.createToken("Purchase Test Token", "PTT", "Token for purchase tests", 1000, 10); // Price 10 USDT per token
    }

    function testSuccessfulPurchase() public {
        // Mint USDT to buyer
        usdt.mint(buyer1, 100); // Enough for 10 tokens
        vm.prank(buyer1);
        usdt.approve(address(factory), 100);

        // Purchase 5 tokens
        vm.prank(buyer1);
        factory.purchaseToken(tokenAddress, 5);

        // Assertions
        assertEq(usdt.balanceOf(buyer1), 50); // 100 - 50 = 50
        assertEq(usdt.balanceOf(tokenOwner), 50); // Received 50 USDT
        assertEq(factory.balanceOf(tokenAddress, buyer1), 5);

        TokenFactory.TokenInfo memory info = factory.getTokenDetails(tokenAddress);
        assertEq(info.totalSupply, 5);
    }

    function testMultiplePurchases() public {
        // Buyer 1 purchases 3 tokens
        usdt.mint(buyer1, 30);
        vm.prank(buyer1);
        usdt.approve(address(factory), 30);
        vm.prank(buyer1);
        factory.purchaseToken(tokenAddress, 3);

        // Buyer 2 purchases 7 tokens
        usdt.mint(buyer2, 70);
        vm.prank(buyer2);
        usdt.approve(address(factory), 70);
        vm.prank(buyer2);
        factory.purchaseToken(tokenAddress, 7);

        // Assertions
        assertEq(usdt.balanceOf(buyer1), 0);
        assertEq(usdt.balanceOf(buyer2), 0);
        assertEq(usdt.balanceOf(tokenOwner), 100); // 30 + 70
        assertEq(factory.balanceOf(tokenAddress, buyer1), 3);
        assertEq(factory.balanceOf(tokenAddress, buyer2), 7);

        TokenFactory.TokenInfo memory info = factory.getTokenDetails(tokenAddress);
        assertEq(info.totalSupply, 10);
    }

    function testPurchaseExceedsSupply() public {
        // Try to purchase more than available
        usdt.mint(buyer1, 1000); // Plenty of USDT
        vm.prank(buyer1);
        usdt.approve(address(factory), 1000);

        vm.prank(buyer1);
        vm.expectRevert(); // Should revert due to insufficient supply
        factory.purchaseToken(tokenAddress, 1001); // Max supply is 1000
    }

    function testPurchaseInsufficientAllowance() public {
        usdt.mint(buyer1, 100);
        vm.prank(buyer1);
        usdt.approve(address(factory), 50); // Only approve 50, need 100 for 10 tokens

        vm.prank(buyer1);
        vm.expectRevert(); // SafeERC20 will revert on insufficient allowance
        factory.purchaseToken(tokenAddress, 10);
    }

    function testPurchaseInsufficientBalance() public {
        // Approve but don't have enough USDT
        vm.prank(buyer1);
        usdt.approve(address(factory), 100);

        vm.prank(buyer1);
        vm.expectRevert(); // SafeERC20 will revert on insufficient balance
        factory.purchaseToken(tokenAddress, 10);
    }

    function testPurchaseNonExistentToken() public {
        usdt.mint(buyer1, 100);
        vm.prank(buyer1);
        usdt.approve(address(factory), 100);

        vm.prank(buyer1);
        vm.expectRevert(); // Token does not exist
        factory.purchaseToken(address(0), 10);
    }

    function testPurchaseZeroAmount() public {
        usdt.mint(buyer1, 100);
        vm.prank(buyer1);
        usdt.approve(address(factory), 100);

        vm.prank(buyer1);
        vm.expectRevert(); // Amount must be > 0, but actually contract allows 0? Wait, check contract.
        // In contract, amount is checked implicitly via totalPrice > 0, but if amount=0, totalPrice=0, might pass but pointless.
        // Actually, in AssetToken mint, require(amount > 0), so it will revert.
        factory.purchaseToken(tokenAddress, 0);
    }

    function testPurchaseAfterPartialSales() public {
        // First purchase 500 tokens
        usdt.mint(buyer1, 5000);
        vm.prank(buyer1);
        usdt.approve(address(factory), 5000);
        vm.prank(buyer1);
        factory.purchaseToken(tokenAddress, 500);

        // Second purchase 400 tokens (remaining 100)
        usdt.mint(buyer2, 4000);
        vm.prank(buyer2);
        usdt.approve(address(factory), 4000);
        vm.prank(buyer2);
        factory.purchaseToken(tokenAddress, 400);

        // Third purchase should fail for more than 100
        vm.prank(buyer2);
        vm.expectRevert();
        factory.purchaseToken(tokenAddress, 101);
    }

    function testEventEmission() public {
        usdt.mint(buyer1, 50);
        vm.prank(buyer1);
        usdt.approve(address(factory), 50);

        vm.prank(buyer1);
        vm.expectEmit(true, true, false, true);
        emit TokenFactory.TokenPurchased(buyer1, tokenAddress, 5, 50);
        factory.purchaseToken(tokenAddress, 5);
    }
}
