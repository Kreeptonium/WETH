import { expect } from "chai";
import { ethers } from "hardhat";
import {deployContract, MockProvider, solidity} from 'ethereum-waffle';

describe("Deposit", function() {
    let wethContract:any;
    let address1:any;
    let address2:any;
    const provider = ethers.provider;

    it("Should Mint Weth", async function () {

         [address1, address2] = await ethers.getSigners();
        const Weth = await ethers.getContractFactory('Weth');
        wethContract = await Weth.deploy();
        await wethContract.deployed();
       
        await wethContract.deposit({value:8000});//Depositing Eth //Will be used as Weth inside the smart contract
        expect(await provider.getBalance(wethContract.address)).to.equal(8000);
        //await wethContract.transfer(address1.address, 2000); address1 & smart contract address balance always remain same
        await wethContract.transfer(address2.address, 2000); //Transferring Weth
        console.log("Weth Contract Balance 1:"+ wethContract.address +":"+ (await wethContract.balanceOf(wethContract.address)).toString());
        
        
    })
    
    describe("receive", function(){
        it("Should send ether to contract & update the account balance mappings", async function(){
            
            //expect(await provider.getBalance(wethContract.address)).to.equal(100);
            console.log("Address1 Weth Balance: ",address1.address + ":" +(await wethContract.balanceOf(address1.address)).toString()); //6000
            console.log("Address2 Weth Balance: ",address2.address + ":" +(await wethContract.balanceOf(address2.address)).toString()); //2000
            console.log("Address2 Eth Balance: ",await ethers.utils.formatUnits(await provider.getBalance(address2.address),"ether").toString()); //10000 // Balance at address level is different than at smart contract level // At smart contract level it is Weth balance(2k) & at address level it is Eth balance (10k)
            
            // Address2 is minting the Weth by transferring the 1k Eth
            await address2.sendTransaction({
                "to": wethContract.address,
                "value": 1000,
                "data":'0x5b4b73a90000000000000000000000000000000000000000000000000000000000000011'
            })

            //Address2 Eth balance should get reduced by 1k & Address2 Weth balance will get increased by 1k
            console.log("Address2 Eth Balance: " + (await provider.getBalance(wethContract.address)).toString()); //"9000" // "provider.getBalance" considers all the account address inside Smart contract
            console.log("Address2 Weth Balance: ",(await wethContract.balanceOf(address2.address)).toString()); //3000

            //After transferring 1k Eth from "address2", the new balance at "wethContract" must be 9k
            console.log("Weth Contract Balance 2: ",wethContract.address + ":" + (await provider.getBalance(wethContract.address)).toString()); //"9000" // "provider.getBalance" considers all the account address inside Smart contract
            console.log("Weth Contract Balance 2.1: ",wethContract.address + ":" + (await wethContract.balanceOf(wethContract.address)).toString());//"0" // "wethContract.balanceOf" only supports to get balance at account address level. It will always return 0 balance for Smart contract.
            console.log("addr1Balance1:",(await wethContract.balanceOf(address1.address)).toString()); //6000
            

            // Transfer 500 tokens from owner to addr1
            await wethContract.connect(address1).transfer(address2.address, 500);//It will transfer Weth as we are calling transfer function at smart contract level
            expect(await wethContract.balanceOf(address2.address)).to.equal(3500);


            console.log("addr1 Weth Balance1.1:",(await wethContract.balanceOf(address1.address)).toString());//5500
            console.log("addr2 Weth Balance2.1:",(await wethContract.balanceOf(address2.address)).toString());//3500
            console.log("wethContract Eth Balance:",(await provider.getBalance(wethContract.address)).toString());//9000 //Eth Balance
            expect(await provider.getBalance(wethContract.address)).to.equal(9000);
            
            
        })
    })
    describe("withdraw", function(){
        it("Should withdraw ether from contract", async function(){

            console.log("wethContract Balance:",(await provider.getBalance(wethContract.address)).toString());
           // await wethContract.withdraw(5500); >>> By using this code it will default consider the address1
            await wethContract.connect(address1).withdraw(5500);//Withdrawing Eth // Need to specify from which address funds need to be withdrawn
            await wethContract.connect(address2).withdraw(3500);//Withdrawing Eth // Need to specify from which address funds need to be withdrawn
            console.log("wethContract Balance:",(await provider.getBalance(wethContract.address)).toString());
            //expect(await provider.getBalance(wethContract.address)).to.equal(1000);

        })
    })
});

