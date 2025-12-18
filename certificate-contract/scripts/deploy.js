// scripts/deploy.js

async function main() {
  // Get the ContractFactory for CertificateStorage
  const CertificateStorage = await hre.ethers.getContractFactory("CertificateStorage");

  // Deploy the contract
  const storage = await CertificateStorage.deploy();

  // Wait until the contract is deployed
  await storage.deployed();

  console.log("CertificateStorage deployed to:", storage.address);
}

// Run the deployment script and catch errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
