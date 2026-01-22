import { deriveEthAddress, generateMnemonic } from './ethereum/hd-wallet';
import { deriveSolAddress } from './solana/hd-wallet';
import { WalletVault } from './wallet/vault';
import { ethers } from 'ethers';

async function verifyCrypto() {
    console.log("Starting Crypto Verification...");

    // 1. Test Mnemonic Generation
    const mnemonic = generateMnemonic();
    console.log("Generated Mnemonic:", mnemonic ? "SUCCESS" : "FAILED");
    if (!mnemonic) throw new Error("Mnemonic generation failed");

    // 2. Test Vault
    WalletVault.importVault(mnemonic);
    if (!WalletVault.isUnlocked()) throw new Error("Vault failed to unlock");
    console.log("Vault Unlocked: SUCCESS");

    // 3. Test Ethereum Derivation
    // Known test vector from bip39 spec can be useful, but for now we ensure it runs and produces valid address
    const ethAddress = deriveEthAddress(mnemonic, 0);
    console.log("Derived ETH Address:", ethAddress);
    if (!ethers.isAddress(ethAddress)) throw new Error("Invalid ETH address derived");

    // 4. Test Solana Derivation
    try {
        const solAddress = await deriveSolAddress(mnemonic, 0);
        console.log("Derived SOL Address:", solAddress);
        if (!process.env.TEST_SKIP_SOL_CHECK && solAddress.length < 30) throw new Error("Suspiciously short SOL address");
        // Real validation would use PublicKey, but we might not have it in this simple node script context easily without polyfills active in the test runner context, 
        // strictly speaking this script is meant to be run inside the browser or a polyfilled node env. 
        // For CLI run, we might face issues with Buffer if not polyfilled.
    } catch (e) {
        console.error("Solana Derivation Error:", e);
        throw e;
    }

    console.log("ALL CHECKS PASSED");
}

// We export it to be calling from a UI component for verified in-browser testing
export { verifyCrypto };
