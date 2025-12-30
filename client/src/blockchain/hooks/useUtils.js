import { parseUnits, formatUnits } from 'viem';
import { blockchainConfig } from '../config';   

 

export const useUtils = () => {
 
  const parseToken = (value) => {
    return parseUnits(value, blockchainConfig.TOKEN_DECIMALS);
  }
  const formatToken = (value) => {
     return formatUnits(value, blockchainConfig.TOKEN_DECIMALS);
  }
const convertToHumanReadable = (value) => {
  if (value === undefined || value === null || value === '') return '0';
  try {
    // Handle BigInt directly or convert other types to BigInt
    const bigIntValue = typeof value === 'bigint' ? value : BigInt(value.toString());
    return formatUnits(bigIntValue, blockchainConfig.USDT_DECIMALS);
  } catch (error) {
    console.error('Error converting to human readable:', error, value);
    return '0';
  }
}
const convertToDecimalUnits = (value) => {
  if (value === undefined || value === null) return 0n;
  return parseUnits(value.toString(), blockchainConfig.USDT_DECIMALS);
}
  return {
    parseToken,formatToken, convertToHumanReadable, convertToDecimalUnits
  };
};