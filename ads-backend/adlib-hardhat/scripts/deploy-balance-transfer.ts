import { ethers } from "ethers";
import { readFileSync } from "fs";
import { join } from "path";

async function main() {
  console.log("Deploying BalanceTransfer contract...");

  // RPC provider ve private key'i environment'tan al
  const rpcUrl = process.env.ETHERS_RPC_PROVIDER;
  const privateKey = process.env.PRIVATE_KEY;

  if (!rpcUrl || !privateKey) {
    throw new Error("ETHERS_RPC_PROVIDER and PRIVATE_KEY must be set");
  }

  // Provider ve wallet oluştur
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("Deploying from address:", wallet.address);

  // Contract bytecode ve ABI'yi oku
  const contractPath = join(__dirname, "../artifacts/contracts/BalanceTransfer.sol/BalanceTransfer.json");
  const contractJson = JSON.parse(readFileSync(contractPath, "utf8"));

  // Contract factory oluştur
  const contractFactory = new ethers.ContractFactory(
    contractJson.abi,
    contractJson.bytecode,
    wallet
  );

  // Contract'ı deploy et
  const balanceTransfer = await contractFactory.deploy();
  await balanceTransfer.waitForDeployment();

  const contractAddress = await balanceTransfer.getAddress();
  const masterWallet = await (balanceTransfer as any).getMasterWallet();

  console.log(`BalanceTransfer deployed to: ${contractAddress}`);
  console.log(`Master wallet: ${masterWallet}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});