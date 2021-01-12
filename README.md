# HoprTokenAudit
HOPR ERC-777 Token Contract Audit


## Scope

https://github.com/hoprnet/hoprnet/blob/f38c4afd707b150f48095140fbaa6285d22efe5f/packages/ethereum/AUDIT.md

### Source Code

Imports adjusted to compile from local directory.

* [contracts/HoprToken.sol](contracts/HoprToken.sol) - [source](https://github.com/hoprnet/hoprnet/blob/f38c4afd707b150f48095140fbaa6285d22efe5f/packages/ethereum/contracts/HoprToken.sol)
* [contracts/ERC777/ERC777Snapshot.sol](contracts/ERC777/ERC777Snapshot.sol) - [source](https://github.com/hoprnet/hoprnet/blob/f38c4afd707b150f48095140fbaa6285d22efe5f/packages/ethereum/contracts/ERC777/ERC777Snapshot.sol)
* [contracts/HoprDistributor.sol](contracts/HoprDistributor.sol) - [source](https://github.com/hoprnet/hoprnet/blob/f38c4afd707b150f48095140fbaa6285d22efe5f/packages/ethereum/contracts/HoprDistributor.sol)

<br />

### OpenZeppelin version

* `"@openzeppelin/contracts": "^3.0.1", ` https://github.com/hoprnet/hoprnet/blob/f38c4afd707b150f48095140fbaa6285d22efe5f/packages/ethereum/package.json#L30

  * https://github.com/OpenZeppelin/openzeppelin-contracts/releases/tag/v3.0.1
  * Minor non-code changes to v3.0.2 (release version of v3.0.1) - https://github.com/OpenZeppelin/openzeppelin-contracts/commit/5294f3b9b7f9b971db1ac53a127427621815cde4

<br />

<hr />

## Testing Environment

Hardhat https://hardhat.org/


npx hardhat

npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers

Using latest Solidity ^0.6.0 => 0.6.12 currently

<br />

<hr />

## Source Code

Flattened with OpenZeppelin v3.0.2.

### HoprToken

* [contracts/HoprToken.sol](contracts/HoprToken.sol)
  * [contracts/openzeppelin/access/AccessControl.sol](contracts/openzeppelin/access/AccessControl.sol) - [source](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.2/contracts/access/AccessControl.sol)
    * [contracts/openzeppelin/utils/EnumerableSet.sol](contracts/openzeppelin/utils/EnumerableSet.sol) - [source](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.2/contracts/utils/EnumerableSet.sol)
    * [contracts/openzeppelin/utils/Address.sol](contracts/openzeppelin/utils/Address.sol) - [source](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.2/contracts/utils/Address.sol)
    * [contracts/openzeppelin/GSN/Context.sol](contracts/openzeppelin/GSN/Context.sol) - [source](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.2/contracts/GSN/Context.sol)
  * import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
    * [contracts/openzeppelin/token/ERC777/ERC777.sol](contracts/openzeppelin/token/ERC777/ERC777.sol) - [source](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.2/contracts/token/ERC777/ERC777.sol)
      * `import "../../GSN/Context.sol";` - see below
      * [contracts/openzeppelin/token/ERC777/IERC777.sol](contracts/openzeppelin/token/ERC777/IERC777.sol) - [source](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.2/contracts/token/ERC777/IERC777.sol)
      * [contracts/openzeppelin/token/ERC777/IERC777Recipient.sol](contracts/openzeppelin/token/ERC777/IERC777Recipient.sol) - [source](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.2/contracts/token/ERC777/IERC777Recipient.sol)
      * [contracts/openzeppelin/token/ERC777/IERC777Sender.sol](contracts/openzeppelin/token/ERC777/IERC777Sender.sol) - [source](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.2/contracts/token/ERC777/IERC777Sender.sol)
      * [contracts/openzeppelin/token/ERC20/IERC20.sol](contracts/openzeppelin/token/ERC20/IERC20.sol) - [source](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.2/contracts/token/ERC20/IERC20.sol)
      * [contracts/openzeppelin/math/SafeMath.sol](contracts/openzeppelin/math/SafeMath.sol) - [source](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.2/contracts/math/SafeMath.sol)
      * `import "../../utils/Address.sol";` - see below
      * [contracts/openzeppelin/introspection/IERC1820Registry.sol](contracts/openzeppelin/introspection/IERC1820Registry.sol) - [source](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.2/contracts/introspection/IERC1820Registry.sol)
  * `import "./ERC777/ERC777Snapshot.sol";` - see below

<br />

### ERC777Snapshot

* [contracts/ERC777/ERC777Snapshot.sol](contracts/ERC777/ERC777Snapshot.sol)
  * `import "@openzeppelin/contracts/math/SafeMath.sol";` - see above
  * `import "@openzeppelin/contracts/token/ERC777/ERC777.sol";` - see above

<br />

### HoprDistributor

* [contracts/HoprDistributor.sol](contracts/HoprDistributor.sol)
  * [contracts/openzeppelin/access/Ownable.sol](contracts/openzeppelin/access/Ownable.sol) - [source](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.2/contracts/access/Ownable.sol)
    * [contracts/openzeppelin/GSN/Context.sol](contracts/openzeppelin/GSN/Context.sol) - [source](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.2/contracts/GSN/Context.sol)
  * `import "./HoprToken.sol";` - see above
