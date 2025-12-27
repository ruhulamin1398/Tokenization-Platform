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
        vm.stopBroadcast();
    }
}
