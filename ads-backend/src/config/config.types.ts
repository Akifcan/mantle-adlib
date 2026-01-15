export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  name: string;
  password: string;
}

export interface JWTConfig {
  secret: string;
}

export interface AppConfig {
  port: number;
}

export interface EtherscanConfig {
  apiKey: string;
}

export interface EthConfig {
  masterWallet: string;
  rpcProvider: string;
}
