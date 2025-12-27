// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {TokenFactory} from "../src/TokenFactory.sol";
import {AssetToken} from "../src/AssetToken.sol";
import {USDT} from "../src/mock/USDT.sol";

contract TokenFactoryTest is Test {
    TokenFactory public factory;
    USDT public usdt;
    address public owner = address(1);
    address public buyer = address(2);
    address public tokenOwner = address(3);

    function setUp() public {
        usdt = new USDT();
        vm.prank(owner);
        factory = new TokenFactory(address(usdt), owner);
    }

    function testConstructor() public {
        assertEq(factory.usdtToken(), address(usdt));
        assertEq(factory.owner(), owner);
    }

    function testCreateToken() public {
        vm.prank(tokenOwner);
        address tokenAddress = factory.createToken("Test Token", "TTK", "A test token", 1000, 10);

        TokenFactory.TokenInfo memory info = factory.getTokenDetails(tokenAddress);
        assertEq(info.owner, tokenOwner);
        assertEq(info.name, "Test Token");
        assertEq(info.symbol, "TTK");
        assertEq(info.description, "A test token");
        assertEq(info.maxSupply, 1000);
        assertEq(info.price, 10);
        assertEq(info.totalSupply, 0);
        assertGt(info.createdAt, 0);

        address[] memory ownerTokens = factory.getOwnerTokenList(tokenOwner);
        assertEq(ownerTokens.length, 1);
        assertEq(ownerTokens[0], tokenAddress);

        address[] memory allTokens = factory.getTokenAddressList();
        assertEq(allTokens.length, 1);
        assertEq(allTokens[0], tokenAddress);
    }

    function testCreateTokenReverts() public {
        vm.prank(tokenOwner);
        vm.expectRevert();
        factory.createToken("Test", "T", "Desc", 0, 10);

        vm.expectRevert();
        factory.createToken("Test", "T", "Desc", 100, 0);

        vm.expectRevert();
        factory.createToken("", "T", "Desc", 100, 10);
    }

    function testPurchaseToken() public {
        vm.prank(tokenOwner);
        address tokenAddress = factory.createToken("Test Token", "TTK", "A test token", 1000, 10);

        usdt.mint(buyer, 100); // Mint 100 USDT to buyer
        vm.prank(buyer);
        usdt.approve(address(factory), 100);

        vm.prank(buyer);
        factory.purchaseToken(tokenAddress, 10);

        assertEq(usdt.balanceOf(buyer), 0);
        assertEq(usdt.balanceOf(tokenOwner), 100);

        assertEq(factory.balanceOf(tokenAddress, buyer), 10);

        TokenFactory.TokenInfo memory info = factory.getTokenDetails(tokenAddress);
        assertEq(info.totalSupply, 10);
    }

    function testPurchaseTokenReverts() public {
        vm.prank(tokenOwner);
        address tokenAddress = factory.createToken("Test Token", "TTK", "A test token", 100, 10);

        vm.prank(buyer);
        vm.expectRevert();
        factory.purchaseToken(address(0), 10);

        usdt.mint(buyer, 50);
        vm.prank(buyer);
        usdt.approve(address(factory), 50);

        vm.prank(buyer);
        vm.expectRevert();
        factory.purchaseToken(tokenAddress, 10); // 10 * 10 = 100 > 50 USDT
    }

    function testPauseUnpause() public {
        vm.prank(owner);
        factory.pauseFactory();
        assertTrue(factory.paused());

        vm.prank(tokenOwner);
        vm.expectRevert();
        factory.createToken("Test", "T", "Desc", 100, 10);

        vm.prank(owner);
        factory.unpauseFactory();
        assertFalse(factory.paused());

        vm.prank(tokenOwner);
        factory.createToken("Test", "T", "Desc", 100, 10); // Should work now
    }

    function testGetOwnerTokens() public {
        vm.startPrank(tokenOwner);
        address token1 = factory.createToken("Token1", "T1", "Desc1", 100, 10);
        address token2 = factory.createToken("Token2", "T2", "Desc2", 200, 20);
        vm.stopPrank();

        TokenFactory.TokenInfo[] memory tokens = factory.getOwnerTokens(tokenOwner);
        assertEq(tokens.length, 2);
        assertEq(tokens[0].tokenAddress, token1);
        assertEq(tokens[1].tokenAddress, token2);
    }

    function testGetAllTokens() public {
        vm.prank(tokenOwner);
        address token1 = factory.createToken("Token1", "T1", "Desc1", 100, 10);
        vm.prank(tokenOwner);
        address token2 = factory.createToken("Token2", "T2", "Desc2", 200, 20);

        TokenFactory.TokenInfo[] memory tokens = factory.getAllTokens();
        assertEq(tokens.length, 2);
        assertEq(tokens[0].tokenAddress, token1);
        assertEq(tokens[1].tokenAddress, token2);
    }

    function testGetTokensRange() public {
        vm.prank(tokenOwner);
        factory.createToken("Token1", "T1", "Desc1", 100, 10);
        vm.prank(tokenOwner);
        factory.createToken("Token2", "T2", "Desc2", 200, 20);
        vm.prank(tokenOwner);
        factory.createToken("Token3", "T3", "Desc3", 300, 30);

        TokenFactory.TokenInfo[] memory tokens = factory.getTokens(1, 3);
        assertEq(tokens.length, 2);
        assertEq(tokens[0].symbol, "T2");
        assertEq(tokens[1].symbol, "T3");
    }
}
