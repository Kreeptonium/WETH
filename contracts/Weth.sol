// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract Weth is ERC20{

event Deposit(address indexed account, uint amount);
event Withdraw(address indexed account, uint amount);
event log(address indexed account, uint amount);

constructor () ERC20("Wrapped Ether", "WETH") {}

fallback() external payable {

deposit();
console.log("Fallback Called");

}

receive() external payable {

 _mint(msg.sender, msg.value);
    emit Deposit(msg.sender, msg.value);
    console.log("Receive Called");
}


function deposit() public payable{

    _mint(msg.sender, msg.value);
    emit Deposit(msg.sender, msg.value);
    console.log("Deposit Called");
}


function withdraw(uint _amount) external {
    _burn(msg.sender,_amount);
    payable(msg.sender).transfer(_amount);
    emit Withdraw(msg.sender, _amount);
    console.log("Withdraw Called");
}


}