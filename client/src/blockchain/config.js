import { sepolia , mainnet } from "wagmi/chains";
import{ ASSET_TOKEN_ABI } from "./abi/AssetToken.js";
import{ TOKEN_FACTORY_ABI } from "./abi/tokenFactory.js"; 
import {USDT_ABI} from './abi/USDT'
const environment = import.meta.env.VITE_ENVIRONMENT || "dev";

const getConfig = (environment) => {
    console.log("Environment: ", environment);
    if (environment === 'dev') {
        return {
            RPC_URL: 'https://sepolia.gateway.tenderly.co',
            CHAIN: sepolia,
            CHAIN_ID: sepolia.id,
            ASSET_TOKEN_ABI: ASSET_TOKEN_ABI,
            TOKEN_FACTORY_ABI: TOKEN_FACTORY_ABI,
            USDT_ABI:USDT_ABI,
            OWNER: '0x3ff88b69d1762aa444c85c30c4b0b795f9c48b59',
            FACTORY_CONTRACT_ADDRESS: '0x6ab92902b3e40ac3d0149df6dfa1aa15bec1955f',
            USDT_CONTRACT_ADDRESS: '0x61807fBd22D2E47227C1af6d5aC5F3ECC0d05930',
            USDT_DECIMALS: 6,
            USDT_SYMBOL: 'USDT', 
            EXPLORER_ADDRESS: 'https://sepolia.etherscan.io/address/'
        }
    } else {
        return {
            RPC_URL: 'https://ethereum-sepolia.publicnode.com',
            CHAIN: mainnet,
            CHAIN_ID: mainnet.id,            
            ASSET_TOKEN_ABI: ASSET_TOKEN_ABI,
            TOKEN_FACTORY_ABI: TOKEN_FACTORY_ABI,  
            USDT_ABI:USDT_ABI,        
            OWNER: '0x3ff88b69d1762aa444c85c30c4b0b795f9c48b59',
            FACTORY_CONTRACT_ADDRESS: '0x6ab92902b3e40ac3d0149df6dfa1aa15bec1955f',
            USDT_CONTRACT_ADDRESS: '0x61807fBd22D2E47227C1af6d5aC5F3ECC0d05930',
            USDT_DECIMALS: 6,
            USDT_SYMBOL: 'USDT', 
            EXPLORER_ADDRESS: 'https://sepolia.etherscan.io/address/'
        }
    }
  }
};

validateEnvVars(environment);

const getConfig = (environment) => {
  console.log("Environment: ", environment);
  
  // Constants
  const USDT_DECIMALS = 6;
  const USDT_SYMBOL = 'USDT';
  
  if (environment === 'dev') {
    return {
      RPC_URL: import.meta.env.VITE_RPC_URL || 'https://sepolia.gateway.tenderly.co',
      CHAIN: sepolia,
      CHAIN_ID: sepolia.id,
      ASSET_TOKEN_ABI: ASSET_TOKEN_ABI,
      TOKEN_FACTORY_ABI: TOKEN_FACTORY_ABI,
      OWNER: import.meta.env.VITE_OWNER_ADDRESS || '0x3ff88b69d1762aa444c85c30c4b0b795f9c48b59',
      FACTORY_CONTRACT_ADDRESS: import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS || '0x6ab92902b3e40ac3d0149df6dfa1aa15bec1955f',
      USDT_CONTRACT_ADDRESS: import.meta.env.VITE_USDT_CONTRACT_ADDRESS || '0x61807fBd22D2E47227C1af6d5aC5F3ECC0d05930',
      USDT_DECIMALS: USDT_DECIMALS,
      USDT_SYMBOL: USDT_SYMBOL,
      EXPLORER_ADDRESS: import.meta.env.VITE_EXPLORER_ADDRESS || 'https://sepolia.etherscan.io/address/'
    };
  } else {
    // Production config - require all env vars
    if (!import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS || !import.meta.env.VITE_USDT_CONTRACT_ADDRESS) {
      throw new Error('Production environment requires VITE_FACTORY_CONTRACT_ADDRESS and VITE_USDT_CONTRACT_ADDRESS');
    }
    
    return {
      RPC_URL: import.meta.env.VITE_RPC_URL || 'https://ethereum-sepolia.publicnode.com',
      CHAIN: mainnet,
      CHAIN_ID: mainnet.id,
      ASSET_TOKEN_ABI: ASSET_TOKEN_ABI,
      TOKEN_FACTORY_ABI: TOKEN_FACTORY_ABI,
      OWNER: import.meta.env.VITE_OWNER_ADDRESS,
      FACTORY_CONTRACT_ADDRESS: import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS,
      USDT_CONTRACT_ADDRESS: import.meta.env.VITE_USDT_CONTRACT_ADDRESS,
      USDT_DECIMALS: USDT_DECIMALS,
      USDT_SYMBOL: USDT_SYMBOL,
      EXPLORER_ADDRESS: import.meta.env.VITE_EXPLORER_ADDRESS || 'https://etherscan.io/address/'
    };
  }
};

export const blockchainConfig = getConfig(environment);
