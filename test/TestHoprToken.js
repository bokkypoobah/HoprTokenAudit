const { singletons, expectRevert } = require("@openzeppelin/test-helpers");
const { expect, assert } = require("chai");
const { BigNumber } = require("ethers");
const util = require('util');

let InterestUtils;

describe("TestHoprToken", function() {
  let owner, user0, user1, ownerSigner, user0Signer, user1Signer, erc1820Registry, hoprToken, hoprDistributor, erc777Wallet, startTime;
  const accounts = [];
  const accountNames = {};

  function addAccount(account, accountName) {
    accounts.push(account);
    accountNames[account.toLowerCase()] = accountName;
    console.log("      Mapping " + account + " => " + getShortAccountName(account));
  }

  function getShortAccountName(address) {
    if (address != null) {
      var a = address.toLowerCase();
      var n = accountNames[a];
      if (n !== undefined) {
        return n + ":" + address.substring(0, 6);
      }
    }
    return address;
  }

  function printEvents(contract, receipt) {
    console.log("      Gas used: " + receipt.gasUsed);
    receipt.logs.forEach((log) => {
      try {
        var data = contract.interface.parseLog(log);
        var result = data.name + "(";
        let separator = "";
        data.eventFragment.inputs.forEach((a) => {
          result = result + separator + a.name + ": ";
          if (a.type == 'address') {
            result = result + getShortAccountName(data.args[a.name].toString());
          } else if (a.type == 'uint256' || a.type == 'uint128') {
            if (a.name == 'tokens' || a.name == 'amount' || a.name == 'balance' || a.name == 'value') {
              result = result + ethers.utils.formatUnits(data.args[a.name], 18);
            } else {
              result = result + data.args[a.name].toString();
            }
          } else {
            result = result + data.args[a.name].toString();
          }
          separator = ", ";
        });
        result = result + ")";
        console.log("      + " + log.blockNumber + "." + log.logIndex + " " + result);
      } catch (e) {
        console.log("      + " + getShortAccountName(log.address) + " " + JSON.stringify(log.topics));
      }
    });
  }

  async function printHoprTokenDetails(header = false) {
    console.log("    --- hoprToken '" + await hoprToken.symbol() + "', '" + await hoprToken.name() + "' ---");
    if (header) {
      console.log("      - decimals: " + await hoprToken.decimals());
      console.log("      - granularity: " + await hoprToken.granularity());
      const adminRole = await hoprToken.DEFAULT_ADMIN_ROLE();
      console.log("      - DEFAULT_ADMIN_ROLE: " + adminRole);
      console.log("      - hoprToken.getRoleMemberCount(adminRole): " + await hoprToken.getRoleMemberCount(adminRole));
      console.log("      - hoprToken.getRoleMember(adminRole, 0): " + getShortAccountName(await hoprToken.getRoleMember(adminRole, 0)));
      console.log("      - hoprToken.getRoleAdmin(adminRole): " + await hoprToken.getRoleAdmin(adminRole));
      console.log("      - hoprToken.hasRole(owner, DEFAULT_ADMIN_ROLE): " + await hoprToken.hasRole(adminRole, owner));
      console.log("      - hoprToken.hasRole(user1, DEFAULT_ADMIN_ROLE): " + await hoprToken.hasRole(adminRole, user1));
      const minterRole = await hoprToken.MINTER_ROLE();
      console.log("      - MINTER_ROLE: " + minterRole);
      console.log("      - hoprToken.getRoleMemberCount(minterRole): " + await hoprToken.getRoleMemberCount(minterRole));
      console.log("      - hoprToken.getRoleMember(minterRole, 0): " + getShortAccountName(await hoprToken.getRoleMember(minterRole, 0)));
      console.log("      - hoprToken.getRoleAdmin(minterRole): " + await hoprToken.getRoleAdmin(minterRole));
      console.log("      - hoprToken.hasRole(owner, MINTER_ROLE): " + await hoprToken.hasRole(minterRole, owner));
      console.log("      - hoprToken.hasRole(user1, MINTER_ROLE): " + await hoprToken.hasRole(minterRole, user1));
      console.log("      - hoprToken.defaultOperators(): " + await hoprToken.defaultOperators());
    }
    console.log("      - totalSupply: " + ethers.utils.formatUnits(await hoprToken.totalSupply(), 18));
    try {
      for (let i = 0; i < 10; i++) {
        const totalSupplySnapshot = await hoprToken.totalSupplySnapshots(i);
        console.log("        - totalSupplySnapshots(" + i + ") - fromBlock: " + totalSupplySnapshot[0].toString() + ", value: " + ethers.utils.formatUnits(totalSupplySnapshot[1], 18));
      }
    } catch (e) {
    }
    var checkAccounts = [owner, user0, user1, erc777Wallet.address];
    for (let i = 0; i < checkAccounts.length; i++) {
      console.log("      - " + getShortAccountName(checkAccounts[i]) + ".balance: " + ethers.utils.formatUnits(await hoprToken.balanceOf(checkAccounts[i]), 18));
      try {
        for (let j = 0; j < 10; j++) {
          const accountSnapshot = await hoprToken.accountSnapshots(checkAccounts[i], j);
          console.log("        - accountSnapshots(" + getShortAccountName(checkAccounts[i]) + ", " + j + ") - fromBlock: " + accountSnapshot[0].toString() + ", value: " + ethers.utils.formatUnits(accountSnapshot[1], 18));
        }
      } catch (e) {
      }
    }
  }

  async function printHoprDistributorDetails(header = false) {
    console.log("    --- hoprDistributor ---");
    if (header) {
      console.log("      - owner: " + getShortAccountName(await hoprDistributor.owner()));
      console.log("      - MULTIPLIER: " + await hoprDistributor.MULTIPLIER());
      console.log("      - totalToBeMinted: " + ethers.utils.formatUnits(await hoprDistributor.totalToBeMinted(), 18));
      console.log("      - startTime: " + await hoprDistributor.startTime());
      console.log("      - token: " + getShortAccountName(await hoprDistributor.token()));
      console.log("      - maxMintAmount: " + ethers.utils.formatUnits(await hoprDistributor.maxMintAmount(), 18));
    }
    console.log("      - totalMinted: " + ethers.utils.formatUnits(await hoprDistributor.totalMinted(), 18));
    console.log("      - getSchedule('test'): " + JSON.stringify((await hoprDistributor.getSchedule('test')).map((x) => { return x.toString(); })));
    const allocation0 = await hoprDistributor.allocations(user0, 'test');
    console.log("      - allocations(user0, 'test') - amount: " + ethers.utils.formatUnits(allocation0.amount, 18) + ", claimed: " + ethers.utils.formatUnits(allocation0.claimed, 18) + ", lastClaim: " + allocation0.lastClaim + ", revoked: " + allocation0.revoked);
    const allocation1 = await hoprDistributor.allocations(user1, 'test');
    console.log("      - allocations(user1, 'test') - amount: " + ethers.utils.formatUnits(allocation1.amount, 18) + ", claimed: " + ethers.utils.formatUnits(allocation1.claimed, 18) + ", lastClaim: " + allocation1.lastClaim + ", revoked: " + allocation1.revoked);
    try {
      console.log("      - getClaimable(user0, 'test'): " + ethers.utils.formatUnits(await hoprDistributor.getClaimable(user0, 'test'), 18));
      console.log("      - getClaimable(user1, 'test'): " + ethers.utils.formatUnits(await hoprDistributor.getClaimable(user1, 'test'), 18));
    } catch (e) {
    }
  }

  before(async function () {
    [owner, user0, user1] = await web3.eth.getAccounts();
    [ownerSigner, user0Signer, user1Signer] = await ethers.getSigners();

    console.log("    --- Setup ---");
    addAccount("0x0000000000000000000000000000000000000000", "null");
    addAccount(owner, "owner");
    addAccount(user0, "user0");
    addAccount(user1, "user1");

    erc1820Registry = await singletons.ERC1820Registry(owner);
    addAccount(erc1820Registry.address, "ERC1820Registry");

    HoprToken = await ethers.getContractFactory("HoprToken");
    hoprToken = await HoprToken.deploy();
    addAccount(hoprToken.address, "HOPRToken");
    const deployHoprTokenTransactionReceipt = await hoprToken.deployTransaction.wait();
    console.log("    owner -> HoprToken.deploy()-ed to " + hoprToken.address);
    printEvents(hoprToken, deployHoprTokenTransactionReceipt);

    console.log("    owner -> hoprToken.grantRole(MINTER_ROLE, owner)");
    const grantRole1 = await hoprToken.grantRole(await hoprToken.MINTER_ROLE(), owner);
    printEvents(hoprToken, await grantRole1.wait());

    HoprDistributor = await ethers.getContractFactory("HoprDistributor");
    startTime = parseInt(new Date() / 1000);
    const maxMintAmount = ethers.utils.parseUnits("123.456", 18);
    hoprDistributor = await HoprDistributor.deploy(hoprToken.address, startTime, maxMintAmount);
    addAccount(hoprDistributor.address, "HOPRDistributor");
    console.log("    owner -> HoprDistributor.deploy(hoprToken, " + startTime + ", " + ethers.utils.formatUnits(maxMintAmount, 18) + ")-ed to " + hoprDistributor.address);
    printEvents(hoprDistributor, await hoprDistributor.deployTransaction.wait());

    // const ERC777Sender = await ethers.getContractFactory("ERC777Sender");
    // erc777Sender = await ERC777Sender.connect(ownerSigner).deploy();
    // addAccount(erc777Sender.address, "ERC777Sender");
    // console.log("    owner -> ERC777Sender.deploy()-ed to " + erc777Sender.address);
    // printEvents(erc777Sender, await erc777Sender.deployTransaction.wait());
    //
    // // const hash = web3.utils.soliditySha3('ERC777TokensSender');
    // // console.log("    hash " + hash);
    // //
    // // console.log("    owner -> 1820Reg.setInterfaceImplementer()");
    // // console.log("    erc1820Registry: " + util.inspect(erc1820Registry));
    // // const registerSender = await erc1820Registry.setInterfaceImplementer(user0, web3.utils.soliditySha3('ERC777TokensSender'), erc777Sender.address, { from: user0 });
    // // printEvents(erc1820Registry, await registerSender.wait());
    //
    // const ERC777Recipient = await ethers.getContractFactory("ERC777Recipient");
    // erc777Recipient = await ERC777Recipient.connect(user0Signer).deploy();
    // addAccount(erc777Recipient.address, "ERC777Recipient");
    // console.log("    user0 -> ERC777Recipient.deploy()-ed to " + erc777Recipient.address);
    // printEvents(erc777Recipient, await erc777Recipient.deployTransaction.wait());

    const ERC777Wallet = await ethers.getContractFactory("ERC777Wallet");
    erc777Wallet = await ERC777Wallet.connect(ownerSigner).deploy(hoprToken.address);
    addAccount(erc777Wallet.address, "ERC777Wallet");
    console.log("    owner -> ERC777Wallet.deploy(hoprToken)-ed to " + erc777Wallet.address);
    printEvents(erc777Wallet, await erc777Wallet.deployTransaction.wait());

  })


  it.skip("TestHoprToken - #0", async function() {
    await printHoprTokenDetails(true);

    // console.log("    owner -> hoprToken.mint(user0, 123, '0x00', '0x00')");
    // const mint1 = await hoprToken.mint(user0, ethers.utils.parseUnits("123", 18), '0x00', '0x00');
    // printEvents(hoprToken, await mint1.wait());

    console.log("    owner -> hoprToken.mint(erc777Wallet, 0.123456789123456789, '0x01', '0x02')");
    const mint2 = await hoprToken.mint(erc777Wallet.address, ethers.utils.parseUnits("0.123456789123456789", 18), '0x01', '0x02');
    printEvents(hoprToken, await mint2.wait());
    await printHoprTokenDetails();

    console.log("    owner -> erc777Wallet.send(erc777Wallet.address, 0.000000000000000001, '0x01')");
    const send1 = await erc777Wallet.send(erc777Wallet.address, ethers.utils.parseUnits("0.000000000000000001", 18), '0x01');
    printEvents(hoprToken, await send1.wait());
    await printHoprTokenDetails();

    console.log("        --- Test Completed ---");
    console.log("");
  });


  it("TestHoprDistributor - #0", async function() {
    await printHoprTokenDetails(true);

    console.log("    owner -> hoprToken.mint(user0, 123, '0x00', '0x00')");
    const mint1 = await hoprToken.mint(user0, ethers.utils.parseUnits("123", 18), '0x00', '0x00');
    printEvents(hoprToken, await mint1.wait());

    console.log("    owner -> hoprToken.mint(user1, 0.123456789123456789, '0x01', '0x02')");
    const mint2 = await hoprToken.mint(user1, ethers.utils.parseUnits("0.123456789123456789", 18), '0x01', '0x02');
    printEvents(hoprToken, await mint2.wait());
    await printHoprTokenDetails();

    await printHoprDistributorDetails(true);

    console.log("    owner -> hoprDistributor.addSchedule(durations, percents, 'test)");
    const durations = [1, 12, 20, 100];
    const percents = [100000, 200000, 300000, 400000];
    const addSchedule1 = await hoprDistributor.addSchedule(durations, percents, 'test');
    printEvents(hoprDistributor, await addSchedule1.wait());

    console.log("    owner -> hoprDistributor.addAllocations([user0, user1], [12.3, 13.4], 'test)");
    const accounts = [user0, user1];
    const amounts = [ethers.utils.parseUnits("12.3", 18), ethers.utils.parseUnits("13.4", 18)];
    const addAllocations1 = await hoprDistributor.addAllocations(accounts, amounts, 'test');
    printEvents(hoprDistributor, await addAllocations1.wait());

    console.log("    Time @ 0s");
    await printHoprDistributorDetails();

    // console.log("    Time @ 12s");
    // let waitUntil = startTime + 12;
    // console.log("    waitUntil: " + waitUntil);
    // while ((new Date()).getTime() <= waitUntil * 1000) {
    // }
    // const transfer1 = await hoprToken.transfer(user0, 0);
    // printEvents(hoprToken, await transfer1.wait());
    // await printHoprDistributorDetails();
    //
    // console.log("    Time @ 20s");
    // waitUntil = startTime + 20;
    // console.log("    waitUntil: " + waitUntil);
    // while ((new Date()).getTime() <= waitUntil * 1000) {
    // }
    // const transfer2 = await hoprToken.transfer(user0, 0);
    // printEvents(hoprToken, await transfer2.wait());
    // await printHoprDistributorDetails();

    console.log("        --- Test Completed ---");
    console.log("");
  });
});
