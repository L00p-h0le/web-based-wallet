---
trigger: always_on
---

always ask for permission before installing any dependencies.
always ask for permission before accessing the browser to run the code.
make separate components/files for UI and logic.
use tailwind css for styling ui.
do not write or access or modify files outside the current workspace root directory.
ask for permission before running commands in the terminal.
Follow ERC-20 standards for writing contracts wherever needed.
first code the logic and when it works correctly ask for permission to move on to building the ui.

#Security rules

Never store mnemonics or private keys in any storage or state persistence.
Never log seed phrases or private keys.
All cryptographic operations must run client-side only.
Wallet deletion removes only public metadata.

#Architecture Rules

UI components must not contain cryptographic logic.
Wallet controller must be chain-agnostic.
Ethereum and Solana logic must live in separate modules.
No shared derivation code between chains.

#Code Quality Rules

TypeScript is mandatory.
Functions must be small and single-purpose.
Every crypto-related function must include comments explaining what it does.
Folder structure must be documented.

#Development Rules

Start with Ethereum first, then Solana.
Implement auto-generated mnemonic flow before user-input flow.
No send/transfer functionality in MVP.
Test derivation logic independently before wiring UI.

#Documentation Rules

README must include:
Architecture overview
Security assumptions
Known limitations
Future roadmap

Comment code as if a junior dev will read it.

#Forbidden Shortcuts (call these out explicitly)

No hardcoded private keys.
No copying MetaMask internals.
No server-side code.
No mixing chain logic for convenience.