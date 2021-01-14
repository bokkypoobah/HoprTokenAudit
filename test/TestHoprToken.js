// import { singletons, expectRevert } from '@openzeppelin/test-helpers'
const { singletons, expectRevert } = require("@openzeppelin/test-helpers");
const { expect, assert } = require("chai");
const { BigNumber } = require("ethers");
const util = require('util');
// const { Decimal } = require("decimal.js");

let InterestUtils;

describe("TestHoprToken", function() {
  let owner, user0, user1, hoprToken;

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
    console.log("    owner -> HoprToken.deploy()");
    hoprToken = await HoprToken.deploy();
    const deployHoprTokenTransactionReceipt = await hoprToken.deployTransaction.wait();
    printEvents(hoprToken, deployHoprTokenTransactionReceipt);
    await hoprToken.grantRole(await hoprToken.MINTER_ROLE(), owner);
  })


  it("TestHoprToken - #0", async function() {


    // expect(await hoprToken.name()).to.be.equal('HOPR Token', 'wrong name');
    console.log("    name: " + await hoprToken.name());
    console.log("    symbol: " + await hoprToken.symbol());
    console.log("    decimals: " + await hoprToken.decimals());
    console.log("    granularity: " + await hoprToken.granularity());
    console.log("    totalSupply: " + ethers.utils.formatUnits(await hoprToken.totalSupply(), 18));

    console.log("    owner -> hoprToken.mint(user0, 123, '', '')");
    const mint1 = await hoprToken.mint(user0, ethers.utils.parseUnits("123", 18), '0x00', '0x00');
    printEvents(hoprToken, await mint1.wait());

    console.log("    owner -> hoprToken.mint(user1, 0.123456789123456789, '', '')");
    const mint2 = await hoprToken.mint(user1, ethers.utils.parseUnits("0.123456789123456789", 18), '0x00', '0x00');
    printEvents(hoprToken, await mint2.wait());
    console.log("totalSupply: " + ethers.utils.formatUnits(await hoprToken.totalSupply(), 18));
    console.log("user0.balance: " + ethers.utils.formatUnits(await hoprToken.balanceOf(user0), 18));
    console.log("user1.balance: " + ethers.utils.formatUnits(await hoprToken.balanceOf(user1), 18));

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