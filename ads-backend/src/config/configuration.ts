export default () => ({
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    user: process.env.DB_USER,
    name: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  app: {
    port: process.env.APP_PORT,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  eth: {
    masterWallet: process.env.ETH_MASTER_WALLET,
    rpcProvider: process.env.ETHERS_RPC_PROVIDER,
  },
});
