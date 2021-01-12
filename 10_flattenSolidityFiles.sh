#!/bin/sh
# ----------------------------------------------------------------------------------------------
# Flatten solidity files
#
# Enjoy. (c) The Optino Project. GPLv2
# ----------------------------------------------------------------------------------------------

echo "\$ rm -rf flattened/ ..."
rm -rf flattened/
echo "\$ mkdir flattened/ ..."
mkdir flattened/
echo "\$ truffle-flattener contracts/HoprToken.sol > flattened/HoprToken_flattened.sol ..."
truffle-flattener contracts/HoprToken.sol > flattened/HoprToken_flattened.sol
echo "\$ truffle-flattener contracts/HoprDistributor.sol > flattened/HoprDistributor_flattened.sol ..."
truffle-flattener contracts/HoprDistributor.sol > flattened/HoprDistributor_flattened.sol
