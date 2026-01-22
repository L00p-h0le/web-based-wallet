import { ethers } from 'ethers';
import { ETH_DERIVATION_PATH } from './constants';

/**
 * Derives an Ethereum address from a mnemonic phrase.
 * Uses BIP-44 path: m/44'/60'/0'/0/index
 * 
 * @param mnemonic - The BIP-39 mnemonic phrase
 * @param accountIndex - The index of the account (default 0)
 * @returns The public Ethereum address (0x...)
 */
export const deriveEthAddress = (mnemonic: string, accountIndex: number = 0): string => {
    try {
        // Validate mnemonic first
        if (!ethers.Mnemonic.isValidMnemonic(mnemonic)) {
            throw new Error('Invalid mnemonic phrase');
        }

        // Create HDNode from seed to get Master Node (depth 0)
        // This allows deriving absolute paths starting with "m/"
        const mnemonicInstance = ethers.Mnemonic.fromPhrase(mnemonic);
        const seed = mnemonicInstance.computeSeed();
        const masterNode = ethers.HDNodeWallet.fromSeed(seed);

        // Derive the specific path
        // We append the index to the base path
        const path = `${ETH_DERIVATION_PATH}/${accountIndex}`;
        const childNode = masterNode.derivePath(path);

        return childNode.address;
    } catch (error) {
        console.error('Failed to derive ETH address:', error);
        throw error;
    }
};

/**
 * Validates if a string is a valid BIP-39 mnemonic
 */
export const validateMnemonic = (mnemonic: string): boolean => {
    return ethers.Mnemonic.isValidMnemonic(mnemonic);
};

/**
 * Generates a new random mnemonic phrase (12 words)
 */
export const generateMnemonic = (): string => {
    const wallet = ethers.Wallet.createRandom();
    if (!wallet.mnemonic) {
        throw new Error("Failed to generate mnemonic");
    }
    return wallet.mnemonic.phrase;
};
