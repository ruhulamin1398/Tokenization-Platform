// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {console} from "forge-std/console.sol";
import {Script} from "forge-std/Script.sol";
import {USDT} from "../src/mock/USDT.sol";

contract DeployUSDT is Script {
    function run() external {
        vm.startBroadcast();
        USDT usdt = new USDT();
        console.log("USDT deployed at:", address(usdt));

        vm.stopBroadcast();
    }
}
