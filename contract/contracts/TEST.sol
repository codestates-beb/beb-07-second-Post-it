// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0; 

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract TEST is ERC20 { // Contract 이름은 TEST1
  constructor() ERC20("TESTToken", "TTO") {
    _mint(msg.sender, 100000000e18);
  }
}