import * as bip39 from 'bip39';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { derivePath } from 'ed25519-hd-key';

/**
 * Derives a Solana address from a mnemonic phrase.
 * Uses BIP-44 path for Solana: m/44'/501'/0'/0' (Note: Solana commonly uses hardened derivation)
 * 
 * @param mnemonic - The BIP-39 mnemonic phrase
 * @param accountIndex - The index of the account (default 0)
 * @returns The public Solana address (Base58)
 */
export const deriveSolAddress = async (mnemonic: string, accountIndex: number = 0): Promise<string> => {
    try {
        // Seed generation is async in bip39 usually, or sync if using mnemonicToSeedSync
        // We need a Buffer for ed25519-hd-key
        const seed = await bip39.mnemonicToSeed(mnemonic);

        // Path: m/44'/501'/index'/0' is standard for some wallets (Phantom uses m/44'/501'/0'/0')
        // Let's stick to the requested standard derivation if specified, or common Sol practice.
        // User requested: "BIP-44 derivation path for Ethereum" but for Sol "Derive Ed25519 keypair"
        // Standard Solana derivation path is m/44'/501'/0'/0' for the first account (and usually accounts are on the 3rd index change? No, Solana is weird).
        // Common: m/44'/501'/X'/0' where X is account index.

        const path = `m/44'/501'/${accountIndex}'/0'`;

        const derived = derivePath(path, seed.toString('hex'));

        // derived.key is the private key seed for Keypair
        const keypair = Keypair.fromSeed(derived.key);

        return keypair.publicKey.toBase58();
    } catch (error) {
        console.error('Failed to derive SOL address:', error);
        throw error;
    }
};

/**
 * Validates Solana address format
 */
export const validateSolAddress = (address: string): boolean => {
    try {
        new PublicKey(address);
        return true;
    } catch {
        return false;
    }
};
