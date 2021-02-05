// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.2/contracts/token/ERC777/IERC777Sender.sol";
import "./openzeppelin/token/ERC20/IERC20.sol";
import "./openzeppelin/token/ERC777/IERC777.sol";
import "./openzeppelin/token/ERC777/IERC777Sender.sol";
import "./openzeppelin/token/ERC777/IERC777Recipient.sol";
import "./openzeppelin/introspection/IERC1820Registry.sol";

import "hardhat/console.sol";

contract ERC777Wallet is IERC777Sender, IERC777Recipient {

    IERC1820Registry constant internal _ERC1820_REGISTRY = IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);

    IERC20 public token;
    uint public counter;

    constructor(IERC20 _token) public {
        token = _token;
        _ERC1820_REGISTRY.setInterfaceImplementer(address(this), keccak256("ERC777TokensSender"), address(this));
        _ERC1820_REGISTRY.setInterfaceImplementer(address(this), keccak256("ERC777TokensRecipient"), address(this));
    }

    function tokensToSend(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes calldata /*userData*/,
        bytes calldata /*operatorData*/
    ) external override {
        console.log("      > ERC777Wallet.tokensToSend: operator %s, from %s, to %s,", operator, from, to);
        console.log("        amount %s", amount);
        // token.send(to, amount, "");
        counter++;
        if (counter < 5) {
            token.transfer(to, amount + 1);
        }
        counter--;
    }

    function tokensReceived(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes calldata /*userData*/,
        bytes calldata /*operatorData*/
    ) external override {
        console.log("      > ERC777Wallet.tokensReceived: operator %s, from %s, to %s,", operator, from, to);
        console.log("        amount %s", amount);
    }

    function send(address to, uint256 amount, bytes memory data) public {
        // token.send(to, amount, data);
        token.transfer(to, amount);
    }
}
