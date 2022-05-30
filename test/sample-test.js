const { expect } = require("chai");
const { ethers } = require("hardhat");

// Charged Particles imports
const ChargedSettingsAbi = require("@charged-particles/protocol-subgraph/abis/ChargedSettings.json");
const ChargedParticlesAbi = require("@charged-particles/protocol-subgraph/abis/ChargedParticles.json");
const chargedParticlesMainnetAddress = require("@charged-particles/protocol-subgraph/networks/mainnet.json");

describe("Charged Particles whitelist ", function () {
  const chargedSettingsMainnetAddress = chargedParticlesMainnetAddress.chargedSettings.address; 
  const chargedParticlesContractMainnetAddress = chargedParticlesMainnetAddress.chargedParticles.address; 

  const provider = new ethers.providers.StaticJsonRpcProvider(process.env.RPC_URL_MAINNET, 1);

  const ChargedParticlesContract = new ethers.Contract(chargedParticlesContractMainnetAddress, ChargedParticlesAbi);
  const ChargedSettingContract = new ethers.Contract(chargedSettingsMainnetAddress, ChargedSettingsAbi);

  it ("Interacts with charged particle protocol", async() => {
    const contractResponse = await ChargedParticlesContract.connect(provider).getStateAddress();
    expect(contractResponse).to.be.equal(chargedParticlesMainnetAddress.chargedState.address)
  });

  it ("Become admin !", async() => {
    // Deploy custom NFT
    const CustomNFT = await ethers.getContractFactory("CustomToken"); 
    const customNFT = await CustomNFT.deploy();
    const deployed = await customNFT.deployed();

    const deploymentAddress = deployed.address;

    // this should revert since you are not the admin
    // const [ signer ] = await ethers.getSigners();
    // const whiteList = await ChargedSettingContract.connect(signer).enableNftContracts([deploymentAddress])
    
    // Get Charged Particle owner address
    const adminAddress = await ChargedParticlesContract.connect(provider).owner();

    // impersonate admin account 
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [adminAddress],
    });

    // White list custom NFT
    const owner = await ethers.getSigner(adminAddress);
    const whiteList = await ChargedSettingContract.connect(owner).enableNftContracts([deploymentAddress])
    await whiteList.wait();

    console.log(whiteList)
  });
});
