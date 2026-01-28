import { useEffect, useState } from 'react';
import { WalletVault } from '../core/wallet/vault';
import { deriveEthAddress } from '../core/ethereum/hd-wallet';
import { deriveSolAddress } from '../core/solana/hd-wallet';
import { Check } from 'lucide-react';

interface Wallet {
    index: number;
    ethAddress: string;
    solAddress: string;
}

interface WalletDashboardProps {
    onDeleteAll: () => void;
}

export const WalletDashboard = ({ onDeleteAll }: WalletDashboardProps) => {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [activeTab, setActiveTab] = useState<'eth' | 'sol'>('eth');
    const [copied, setCopied] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
    const [showCopyToast, setShowCopyToast] = useState(false);

    // Load initial wallet (index 0)
    useEffect(() => {
        loadWallet(0);
    }, []);

    const loadWallet = async (index: number) => {
        try {
            const mnemonic = WalletVault.getMnemonic();
            if (!mnemonic) return;

            const ethAddress = deriveEthAddress(mnemonic, index);
            const solAddress = await deriveSolAddress(mnemonic, index);

            setWallets(prev => {
                if (prev.find(w => w.index === index)) return prev;
                return [...prev, { index, ethAddress, solAddress }];
            });
        } catch (e) {
            console.error("Failed to load wallet", e);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setShowCopyToast(true);
        setTimeout(() => {
            setCopied(null);
            setShowCopyToast(false);
        }, 2000);
    };

    const addNewWallet = () => {
        const nextIndex = wallets.length > 0 ? wallets[wallets.length - 1].index + 1 : 0;
        loadWallet(nextIndex);
    };

    const confirmDelete = (index: number) => {
        const newWallets = wallets.filter(w => w.index !== index);
        setWallets(newWallets);
        setShowDeleteConfirm(null);

        if (newWallets.length === 0) {
            onDeleteAll();
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 min-h-screen">
            {/* Copied Toast Notification */}
            {showCopyToast && (
                <div className="fixed top-24 right-8 z-50 animate-fadeInUp">
                    <div className="bg-[#FFFBF4] text-[#11120D] px-6 py-3 rounded-xl shadow-lg font-bold flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        Address copied!
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="mb-12 animate-fadeInUp">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-[#FFFBF4] mb-2">
                            Portfolio Overview
                        </h1>
                        <p className="text-[#FFFBF4]/60 font-medium">
                            Manage your multi-chain digital assets with precision.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={addNewWallet}
                            className="group flex items-center gap-2 bg-[#FFFBF4] text-[#11120D] px-6 py-3 rounded-xl font-bold transition-all hover:shadow-[0_10px_25px_-5px_rgba(255,251,244,0.35)] hover:translate-y-[-2px] active:scale-95"
                        >
                            <span className="material-symbols-outlined text-xl">add</span>
                            Add Wallet
                        </button>
                        <button
                            onClick={onDeleteAll}
                            className="flex items-center gap-2 bg-transparent hover:bg-[#FFFBF4]/10 text-[#FFFBF4] px-6 py-3 rounded-xl font-bold transition-all border border-[#FFFBF4]/30 hover:border-[#FFFBF4]"
                        >
                            <span className="material-symbols-outlined text-xl">logout</span>
                            Logout
                        </button>
                    </div>
                </div>

                {/* Chain Selector Tabs */}
                <div className="flex items-center gap-8 border-b border-[#FFFBF4]/20 pb-0">
                    <button
                        onClick={() => setActiveTab('eth')}
                        className={`px-2 py-4 text-sm font-semibold transition-all tab-underline ${activeTab === 'eth' ? 'text-[#FFFBF4] tab-active' : 'text-[#FFFBF4]/40 hover:text-[#FFFBF4]/70'
                            }`}
                    >
                        Ethereum
                    </button>
                    <button
                        onClick={() => setActiveTab('sol')}
                        className={`px-2 py-4 text-sm font-semibold transition-all tab-underline ${activeTab === 'sol' ? 'text-[#FFFBF4] tab-active' : 'text-[#FFFBF4]/40 hover:text-[#FFFBF4]/70'
                            }`}
                    >
                        Solana
                    </button>
                </div>
            </div>

            {/* Wallets Grid */}
            <div className="grid grid-cols-1 gap-5 stagger-animation">
                {wallets.map((wallet, idx) => {
                    const address = activeTab === 'eth' ? wallet.ethAddress : wallet.solAddress;
                    const chainName = activeTab === 'eth' ? 'ETH Network' : 'SOL Network';

                    return (
                        <div
                            key={wallet.index}
                            className="p-8 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-8 transition-all hover:border-[#FFFBF4]/30 border border-[#FFFBF4]/10"
                            style={{ backgroundColor: 'rgba(17, 18, 13, 0.95)', animationDelay: `${idx * 0.05}s` }}
                        >
                            <div className="flex items-center gap-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-bold text-[#FFFBF4] leading-none">
                                            Wallet {wallet.index + 1}
                                        </h3>
                                        <span className="bg-[#FFFBF4]/10 text-[#FFFBF4]/70 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border border-[#FFFBF4]/20">
                                            Active
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#FFFBF4]/40 font-semibold text-xs uppercase tracking-wider">
                                        <span>{chainName}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-1 max-w-xl items-center gap-3 border border-[#FFFBF4]/10 p-1.5 pr-4 rounded-xl" style={{ backgroundColor: 'rgba(17, 18, 13, 0.8)' }}>
                                <div className="flex-1 px-3 py-1.5 font-mono text-sm text-[#FFFBF4]/70 truncate">
                                    {address}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(address)}
                                    className="p-1.5 text-[#FFFBF4]/40 hover:text-[#FFFBF4] transition-all"
                                >
                                    {copied === address ? (
                                        <Check className="w-4 h-4 text-[#FFFBF4]" />
                                    ) : (
                                        <span className="material-symbols-outlined text-lg">content_copy</span>
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowDeleteConfirm(wallet.index)}
                                    className="p-2.5 text-[#FFFBF4]/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all border border-transparent"
                                    title="Delete Wallet"
                                >
                                    <span className="material-symbols-outlined text-xl">delete</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>



            {/* Delete Confirmation Modal */}
            {showDeleteConfirm !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11120D]/80 backdrop-blur-md">
                    <div className="max-w-sm w-full p-8 rounded-[2.5rem] border border-[#FFFBF4]/10" style={{ backgroundColor: 'rgba(17, 18, 13, 0.98)' }}>
                        <div className="text-center mb-8">
                            <h3 className="text-xl font-bold text-[#FFFBF4] mb-3">
                                Delete {showDeleteConfirm === 0 ? 'Main Operations' : `Wallet ${showDeleteConfirm + 1}`}?
                            </h3>
                            <p className="text-[#FFFBF4]/60 leading-relaxed text-sm">
                                This will remove the wallet from your view. You can always recover it using your original secret phrase.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="flex-1 px-6 py-3 rounded-2xl bg-transparent hover:bg-[#FFFBF4]/10 text-[#FFFBF4] font-semibold transition-all border border-[#FFFBF4]/30 hover:border-[#FFFBF4]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => confirmDelete(showDeleteConfirm)}
                                className="flex-1 bg-[#FFFBF4] text-[#11120D] font-semibold py-3 px-5 rounded-2xl hover:shadow-[0_10px_25px_-5px_rgba(255,251,244,0.35)] hover:translate-y-[-2px] transition-all active:scale-95"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
