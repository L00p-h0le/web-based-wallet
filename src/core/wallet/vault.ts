import { generateMnemonic, validateMnemonic } from '../ethereum/hd-wallet';

// In-memory storage for the mnemonic.
// This variable is NOT exported, so it cannot be accessed directly by other modules.
let _secretMnemonic: string | null = null;

export interface WalletAccount {
    index: number;
    chain: 'ethereum' | 'solana';
    address: string;
    name?: string;
}

export class WalletVault {

    /**
     * Initializes the vault with a new random mnemonic.
     */
    static createNewVault(): string {
        const mnemonic = generateMnemonic();
        _secretMnemonic = mnemonic;
        return mnemonic;
    }

    /**
     * Initializes the vault with an imported mnemonic.
     */
    static importVault(mnemonic: string): boolean {
        if (!validateMnemonic(mnemonic)) {
            return false;
        }
        _secretMnemonic = mnemonic;
        return true;
    }

    /**
     * Checks if the vault is unlocked (has a mnemonic).
     */
    static isUnlocked(): boolean {
        return _secretMnemonic !== null;
    }

    /**
     * Clears the vault (Lock/Logout).
     */
    static lockVault(): void {
        _secretMnemonic = null;
    }

    /**
     * RETRIEVES THE SECRET.
     * This should ONLY be used for:
     * 1. Deriving keys (internally passed to engines)
     * 2. Revealing to user for backup (explicit user action)
     */
    static getMnemonic(): string | null {
        return _secretMnemonic;
    }
}
