# HoprTokenAudit
HOPR ERC-777 Token Contract Audit


## Scope

https://github.com/hoprnet/hoprnet/blob/f38c4afd707b150f48095140fbaa6285d22efe5f/packages/ethereum/AUDIT.md

### Source Code

* [contracts/HoprToken.sol](contracts/HoprToken.sol) - copied from https://github.com/hoprnet/hoprnet/blob/f38c4afd707b150f48095140fbaa6285d22efe5f/packages/ethereum/contracts/HoprToken.sol
* [contracts/ERC777Snapshot.sol](contracts/ERC777Snapshot.sol) - copied from https://github.com/hoprnet/hoprnet/blob/f38c4afd707b150f48095140fbaa6285d22efe5f/packages/ethereum/contracts/ERC777/ERC777Snapshot.sol
* [contracts/HoprDistributor.sol](contracts/HoprDistributor.sol) - copied from https://github.com/hoprnet/hoprnet/blob/f38c4afd707b150f48095140fbaa6285d22efe5f/packages/ethereum/contracts/HoprDistributor.sol

<br />

### OpenZeppelin version

* `"@openzeppelin/contracts": "^3.0.1", ` https://github.com/hoprnet/hoprnet/blob/f38c4afd707b150f48095140fbaa6285d22efe5f/packages/ethereum/package.json#L30

** https://github.com/OpenZeppelin/openzeppelin-contracts/releases/tag/v3.0.1
** Minor non-code changes to v3.0.2 (release version of v3.0.1) - https://github.com/OpenZeppelin/openzeppelin-contracts/commit/5294f3b9b7f9b971db1ac53a127427621815cde4

<br />

<hr />

## Testing Environment

Hardhat https://hardhat.org/

<br />

<hr />

## Source Code

Flattened with OpenZeppelin v3.0.2.

### HoprToken

* [contracts/HoprToken.sol](contracts/HoprToken.sol)
** import "@openzeppelin/contracts/access/AccessControl.sol";
** import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
** import "./ERC777/ERC777Snapshot.sol";

<br />

### ERC777Snapshot

* [contracts/ERC777Snapshot.sol](contracts/ERC777Snapshot.sol)
** import "@openzeppelin/contracts/math/SafeMath.sol";
** import "@openzeppelin/contracts/token/ERC777/ERC777.sol";

<br />

### HoprDistributor

* [contracts/HoprDistributor.sol](contracts/HoprDistributor.sol)
** [contracts/openzeppelin/access/Ownable.sol](contracts/openzeppelin/access/Ownable.sol) - `import "@openzeppelin/contracts/access/Ownable.sol";`
*** [contracts/openzeppelin/GSN/Context.sol](contracts/openzeppelin/GSN/Context.sol) - `import "../GSN/Context.sol";`
** import "./HoprToken.sol";
