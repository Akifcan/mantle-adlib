import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("BalanceTransferModule", (m) => {
  const balanceTransfer = m.contract("BalanceTransfer");

  return { balanceTransfer };
});