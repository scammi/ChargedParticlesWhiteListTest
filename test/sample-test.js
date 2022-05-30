
const { expect } = require("chai");
const { ethers } = require("hardhat");

const ChargedSettingsAbi = require("@charged-particles/protocol-subgraph/abis/ChargedSettings.json");
const ChargedParticlesAbi = require("@charged-particles/protocol-subgraph/abis/ChargedParticles.json");

const chargedParticlesMainnetAddress = require("@charged-particles/protocol-subgraph/networks/mainnet.json");

describe("Greeter", function () {
  const chargedSettingsMainnetAddress = chargedParticlesMainnetAddress.chargedSettings.address; 
  const chargedParticlesContractMainnetAddress = chargedParticlesMainnetAddress.chargedParticles.address; 

  // const provider = ethers.getDefaultProvider(1);
  const provider = new ethers.providers.StaticJsonRpcProvider(process.env.RPC_URL_MAINNET, 1);

  const ChargedParticlesContract = new ethers.Contract(chargedParticlesContractMainnetAddress, ChargedParticlesAbi);
  const ChargedSettingContract = new ethers.Contract(chargedSettingsMainnetAddress, ChargedSettingsAbi);

  it ("Interacts with charged particle protocol", async() => {
    const contractResponse = await ChargedParticlesContract.connect(provider).getStateAddress();
    expect(contractResponse).to.be.equal(chargedParticlesMainnetAddress.chargedState.address)
  });

  it ("Become admin !", async() => {
    const CustomNFT = await ethers.getContractFactory("CustomeToken"); 
    const customNFT = await CustomNFT.deploy();

    const deployed = await customNFT.deployed();
    const deploymentAddress = deployed.address;

    // const [ signer ] = await ethers.getSigners();

    // this should revert
    // const whiteList = await ChargedSettingContract.connect(signer).enableNftContracts([deploymentAddress])
    
    const adminAddress = await ChargedParticlesContract.connect(provider).owner();

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [adminAddress],
    });

    const owner = await ethers.getSigner(adminAddress);

    const whiteList = await ChargedSettingContract.connect(owner).enableNftContracts([deploymentAddress])
    console.log(whiteList)



  });
});
