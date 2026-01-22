# Dash - Web-Based Crypto Wallet

A secure, educational, non-custodial web wallet for Ethereum and Solana, built with React and TypeScript.

## 🚀 Features

- **Multi-Chain Support**: Manage Ethereum and Solana wallets in one interface.
- **BIP-39 Standard**: Generates standard 12-word mnemonic phrases.
- **Client-Side Only**: No backend, no databases, no APIs storing your keys.
- **Secure Architecture**: Secrets derived in-memory and never persisted.
- **Zero-Storage**: Relax knowing your keys are gone effectively when you close the tab (Educational Mode).
- **Responsive Design**: Beautiful, dark-mode first UI using Tailwind CSS.

## 🏗 Architecture

The project follows a strict separation of concerns:

- **`src/core/`**: Contains all cryptographic logic.
    - `ethereum/`: BIP-44 derivation using `ethers.js`.
    - `solana/`: ED25519 derivation using `bip39` and `@solana/web3.js`.
    - `wallet/`: Central Vault controller.
- **`src/components/`**: React UI components (View Layer).
- **`src/context/`**: Global state (Theme).

### Folder Structure
- `src/core/`: Cryptographic and business logic.
- `src/components/`: Reusable UI components.
- `src/hooks/`: Custom React hooks for wallet state.
- `src/context/`: React Context providers.
- `src/styles/`: Global CSS and Tailwind configurations.

## 🛡 Security Model

1.  **Memory-Only Storage**: Mnemonic phrases are stored in a module-level variable within the vault. This variable is not exported and acts as a closure. It is reset on page reload.
2.  **No Persistence**: We explicitly **do not** use `localStorage`, `sessionStorage`, or Cookies for sensitive data.
3.  **Client-Side Execution**: All key derivation happens locally in your browser.
4.  **Dependencies**: We use battle-tested libraries (`ethers`, `bip39`, `@solana/web3.js`) for crypto operations.

### Security Assumptions
- User's browser environment is secure (no malicious extensions).
- OS is not compromised.
- Physical access to the device is restricted while the tab is open.

## ⚠️ Known Limitations
- **Data Loss on Refresh**: Since keys are memory-only, refreshing the page will require re-importing or regenerating the wallet.
- **No Persistence**: No local history of transactions or addresses is saved.
- **MVP Status**: Currently limited to address derivation and balance display (depending on implementation stage).

## 🛤 Future Roadmap
- [ ] Multi-account derivation (BIP-44 paths).
- [ ] Transaction signing and broadcasting.
- [ ] Token management (ERC-20/SPL).
- [ ] NFT Gallery.
- [ ] WalletConnect integration.

## 🛠 Development

**Install Dependencies:**
```bash
npm install
```

**Run Locally:**
```bash
npm run dev
```

**Build:**
```bash
npm run build
```

## ⚠️ Disclaimer

This wallet is intended for **educational purposes**. While it uses standard cryptographic libraries, it operates in a "transient" mode where data is lost on reload. **Do not use this for large amounts of real funds.**
