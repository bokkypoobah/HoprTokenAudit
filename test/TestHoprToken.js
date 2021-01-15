// import { singletons, expectRevert } from '@openzeppelin/test-helpers'
const { singletons, expectRevert } = require("@openzeppelin/test-helpers");
const { expect, assert } = require("chai");
const { BigNumber } = require("ethers");
const util = require('util');
// const { Decimal } = require("decimal.js");

let InterestUtils;

describe("TestHoprToken", function() {
  let owner, user0, user1, hoprToken, hoprDistributor, startTime;

  function printEvents(contract, receipt) {
    receipt.logs.forEach((log) => {
      try {
        var data = contract.interface.parseLog(log);
        var result = data.name + "(";
        let separator = "";
        data.eventFragment.inputs.forEach((a) => {
          result = result + separator + a.name + ": ";
          result = result + data.args[a.name].toString();
          separator = ", ";
        });
        result = result + ")";
        console.log("      + " + result);
      } catch (e) {
        console.log("      + " + JSON.stringify(log));
      }
    });
  }

  before(async function () {
    [owner, user0, user1] = await web3.eth.getAccounts();
    console.log("    owner: " + owner + "; user0: " + user0 + "; user1: " + user1);

    await singletons.ERC1820Registry(owner)

    HoprToken = await ethers.getContractFactory("HoprToken");
    HoprDistributor = await ethers.getContractFactory("HoprDistributor");
    hoprToken = await HoprToken.deploy();
    const deployHoprTokenTransactionReceipt = await hoprToken.deployTransaction.wait();
    console.log("    owner -> HoprToken.deploy() to " + hoprToken.address);
    printEvents(hoprToken, deployHoprTokenTransactionReceipt);
    console.log("    owner -> hoprToken.grantRole(MINTER_ROLE, owner)");
    const grantRole1 = await hoprToken.grantRole(await hoprToken.MINTER_ROLE(), owner);
    printEvents(hoprToken, await grantRole1.wait());

    startTime = parseInt(new Date() / 1000);
    const maxMintAmount = ethers.utils.parseUnits("123.456", 18);
    hoprDistributor = await HoprDistributor.deploy(hoprToken.address, startTime, maxMintAmount);
    console.log("    owner -> HoprDistributor.deploy(hoprToken, " + startTime + ", " + ethers.utils.formatUnits(maxMintAmount, 18) + ") to " + hoprDistributor.address);
    printEvents(hoprDistributor, await hoprDistributor.deployTransaction.wait());
  })


  it("TestHoprToken - #0", async function() {
    // expect(await hoprToken.name()).to.be.equal('HOPR Token', 'wrong name');
    console.log("    hoprToken.name: " + await hoprToken.name());
    console.log("    hoprToken.symbol: " + await hoprToken.symbol());
    console.log("    hoprToken.decimals: " + await hoprToken.decimals());
    console.log("    hoprToken.granularity: " + await hoprToken.granularity());
    console.log("    hoprToken.totalSupply: " + ethers.utils.formatUnits(await hoprToken.totalSupply(), 18));

    console.log("    owner -> hoprToken.mint(user0, 123, '0x00', '0x00')");
    const mint1 = await hoprToken.mint(user0, ethers.utils.parseUnits("123", 18), '0x00', '0x00');
    printEvents(hoprToken, await mint1.wait());

    console.log("    owner -> hoprToken.mint(user1, 0.123456789123456789, '0x01', '0x02')");
    const mint2 = await hoprToken.mint(user1, ethers.utils.parseUnits("0.123456789123456789", 18), '0x01', '0x02');
    printEvents(hoprToken, await mint2.wait());
    console.log("    hoprToken.totalSupply: " + ethers.utils.formatUnits(await hoprToken.totalSupply(), 18));
    console.log("    hoprToken.user0.balance: " + ethers.utils.formatUnits(await hoprToken.balanceOf(user0), 18));
    console.log("    hoprToken.user1.balance: " + ethers.utils.formatUnits(await hoprToken.balanceOf(user1), 18));

    console.log("    hoprDistributor.MULTIPLIER: " + await hoprDistributor.MULTIPLIER());
    console.log("    hoprDistributor.totalMinted: " + ethers.utils.formatUnits(await hoprDistributor.totalMinted(), 18));
    console.log("    hoprDistributor.totalToBeMinted: " + ethers.utils.formatUnits(await hoprDistributor.totalToBeMinted(), 18));
    console.log("    hoprDistributor.startTime: " + await hoprDistributor.startTime());
    console.log("    hoprDistributor.token: " + await hoprDistributor.token());
    console.log("    hoprDistributor.maxMintAmount: " + ethers.utils.formatUnits(await hoprDistributor.maxMintAmount(), 18));

    console.log("    owner -> hoprDistributor.addSchedule(durations, percents, 'test)");
    const durations = [0, 10, 20, 100];
    const percents = [100000, 200000, 800000, 1000000];
    const addSchedule1 = await hoprDistributor.addSchedule(durations, percents, 'test');
    printEvents(hoprDistributor, await addSchedule1.wait());

    console.log("    owner -> hoprDistributor.addAllocations([user0, user1], [12.3, 13.4], 'test)");
    const accounts = [user0, user1];
    const amounts = [ethers.utils.parseUnits("12.3", 18), ethers.utils.parseUnits("13.4", 18)];
    const addAllocations1 = await hoprDistributor.addAllocations(accounts, amounts, 'test');
    printEvents(hoprDistributor, await addAllocations1.wait());

    console.log("    Time 0");
    console.log("      hoprDistributor.getSchedule('test'): " + JSON.stringify(await hoprDistributor.getSchedule('test')));
    console.log("      hoprDistributor.getClaimable(user0, 'test'): " + ethers.utils.formatUnits(await hoprDistributor.getClaimable(user0, 'test'), 18));
    console.log("      hoprDistributor.getClaimable(user1, 'test'): " + ethers.utils.formatUnits(await hoprDistributor.getClaimable(user1, 'test'), 18));

    console.log("    Time 10");
    let waitUntil = startTime + 10;
    console.log("    waitUntil: " + waitUntil);
    while ((new Date()).getTime() <= waitUntil * 1000) {
    }
    const transfer1 = await hoprToken.transfer(user0, 0);
    printEvents(hoprToken, await transfer1.wait());
    console.log("      hoprDistributor.getSchedule('test'): " + JSON.stringify(await hoprDistributor.getSchedule('test')));
    console.log("      hoprDistributor.getClaimable(user0, 'test'): " + ethers.utils.formatUnits(await hoprDistributor.getClaimable(user0, 'test'), 18));
    console.log("      hoprDistributor.getClaimable(user1, 'test'): " + ethers.utils.formatUnits(await hoprDistributor.getClaimable(user1, 'test'), 18));

    console.log("    Time 20");
    waitUntil = startTime + 20;
    console.log("    waitUntil: " + waitUntil);
    while ((new Date()).getTime() <= waitUntil * 1000) {
    }
    const transfer2 = await hoprToken.transfer(user0, 0);
    printEvents(hoprToken, await transfer2.wait());
    console.log("      hoprDistributor.getSchedule('test'): " + JSON.stringify(await hoprDistributor.getSchedule('test')));
    console.log("      hoprDistributor.getClaimable(user0, 'test'): " + ethers.utils.formatUnits(await hoprDistributor.getClaimable(user0, 'test'), 18));
    console.log("      hoprDistributor.getClaimable(user1, 'test'): " + ethers.utils.formatUnits(await hoprDistributor.getClaimable(user1, 'test'), 18));

    // Decimal.set({ precision: 30 });
    // const SECONDS_PER_DAY = 60 * 60 * 24;
    // const SECONDS_PER_YEAR = 365 * SECONDS_PER_DAY;
    //
    // HoprToken = await ethers.getContractFactory("HoprToken");
    //
    // console.log("        --- Test 1 - Deploy TestHoprToken ---");
    // const setup1a = [];
    // setup1a.push(TestHoprToken.deploy());
    // const [testInterestUtils] = await Promise.all(setup1a);
    // const hoprToken = await HoprToken.deploy();
    //
    // const _from = parseInt(new Date().getTime()/1000);
    // const _to = parseInt(_from) + SECONDS_PER_YEAR * 2;
    // const amount = 1000000;
    // const _amount = ethers.utils.parseUnits(amount.toString(), 18);
    //
    // for (let date = _from; date < _to; date += (SECONDS_PER_DAY * 23.13)) {
    //   console.log("        date: " + new Date(date * 1000).toUTCString());
    //   const term = date - _from;
    //   for (let rate = 0; rate < 3; rate = parseFloat(rate) + 0.231345) {
    //     const exp = Decimal.exp(new Decimal(rate).mul(term).div(SECONDS_PER_YEAR).div(100));
    //     // console.log("      > exp: " + exp.toPrecision(30));
    //     const expectedFV = exp.mul(_amount.toString());
    //     const _rate = ethers.utils.parseUnits(rate.toString(), 16);
    //     const [fv, gasUsed] = await testInterestUtils.futureValue_(_amount, BigNumber.from(_from), BigNumber.from(date), _rate);
    //     const _diff = fv.sub(expectedFV.toFixed(0));
    //     const diff = ethers.utils.formatUnits(_diff, 18);
    //     console.log("          rate: " + rate + " => fv: " + ethers.utils.formatUnits(fv, 18) + " vs expectedFV: " + ethers.utils.formatUnits(expectedFV.toFixed(0), 18) + ", diff: " + ethers.utils.formatUnits(_diff.toString(), 18) + ", gasUsed: " + gasUsed);
    //     expect(parseFloat(diff.toString())).to.be.closeTo(0, 0.000000001, "Diff too large");
    //   }
    // }

    console.log("        --- Test Completed ---");
    console.log("");
  });
});
