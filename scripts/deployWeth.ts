
import {ethers} from "hardhat";

async function main()
{

    const Weth =  await ethers.getContractFactory("Weth");
    const weth =  await Weth.deploy();

    await weth.deployed();
    console.log("Weth Contract deployed to:", weth.address);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });