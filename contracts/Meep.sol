// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Meep is ERC20 {
    constructor(uint256 initialSupply) ERC20("Meep", "MEEP") {
        _mint(msg.sender, initialSupply);
    }
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

// Contract address : 0x78f50a36ac83C5bDba773A32F8214f4E51F4e712