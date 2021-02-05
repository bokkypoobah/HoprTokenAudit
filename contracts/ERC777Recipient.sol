// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.2/contracts/token/ERC777/IERC777Sender.sol";
import "./openzeppelin/token/ERC777/IERC777Recipient.sol";
import "./openzeppelin/introspection/IERC1820Registry.sol";

import "hardhat/console.sol";

contract ERC777Recipient is IERC777Recipient {

    IERC1820Registry constant internal _ERC1820_REGISTRY = IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);

    constructor() public {
        _ERC1820_REGISTRY.setInterfaceImplementer(address(this), keccak256("ERC777TokensRecipient"), address(this));
    }

    function tokensReceived(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes calldata /*userData*/,
        bytes calldata /*operatorData*/
    ) external override {
        console.log("      > ERC777Recipient.tokensReceived: operator %s, from %s, to %s,", operator, from, to);
        console.log("        amount %s", amount);
    }
}
