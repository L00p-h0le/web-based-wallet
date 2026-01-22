import { useEffect, useState } from 'react';
import { WalletVault } from '../core/wallet/vault';
import { deriveEthAddress } from '../core/ethereum/hd-wallet';
import { deriveSolAddress } from '../core/solana/hd-wallet';
import { Copy, Plus, Trash2, Check, AlertTriangle, LogOut, Wallet as WalletIcon } from 'lucide-react';

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
        <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16 min-h-[80vh]">
            {/* Copied Toast Notification */}
            {showCopyToast && (
                <div className="fixed top-24 right-8 z-50 animate-fadeInUp">
                    <div className="bg-gradient-to-r from-brand-600 to-accent text-white px-6 py-3 rounded-2xl shadow-glow font-bold flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        Address copied!
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="mb-12 animate-fadeInUp">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-5xl font-black tracking-tight mb-3">
                            <span className="gradient-text">Your Wallets</span>
                        </h1>
                        <p className="text-xl text-slate-600 font-medium">
                            Manage your multi-chain addresses
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={addNewWallet}
                            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-brand-600 to-accent text-white rounded-2xl font-bold hover:shadow-glow transition-all hover:scale-[1.02]"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Wallet</span>
                        </button>
                        <button
                            onClick={onDeleteAll}
                            className="group flex items-center gap-3 px-6 py-3 bg-white hover:bg-red-50 border-2 border-slate-200 hover:border-red-300 rounded-2xl transition-all hover:shadow-lg text-slate-600 hover:text-red-600 font-bold"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>End Session</span>
                        </button>
                    </div>
                </div>

                {/* Chain Selector */}
                <div className="flex bg-white/80 backdrop-blur-sm p-2 rounded-2xl border-2 border-slate-200/80 shadow-subtle inline-flex gap-2">
                    <button
                        onClick={() => setActiveTab('eth')}
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'eth'
                            ? 'bg-gradient-to-r from-brand-600 to-accent text-white shadow-lg shadow-brand-500/30'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-brand-600'
                            }`}
                    >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${activeTab === 'eth' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                            E
                        </div>
                        Ethereum
                    </button>
                    <button
                        onClick={() => setActiveTab('sol')}
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'sol'
                            ? 'bg-gradient-to-r from-brand-600 to-accent text-white shadow-lg shadow-brand-500/30'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-brand-600'
                            }`}
                    >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${activeTab === 'sol' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                            S
                        </div>
                        Solana
                    </button>
                </div>
            </div>

            {/* Wallets Grid */}
            <div className="space-y-6 stagger-animation">
                {wallets.map((wallet, idx) => {
                    const address = activeTab === 'eth' ? wallet.ethAddress : wallet.solAddress;
                    const chainName = activeTab === 'eth' ? 'Ethereum Mainnet' : 'Solana Mainnet';
                    const chainColor = activeTab === 'eth'
                        ? 'from-blue-500 to-indigo-600'
                        : 'from-purple-500 to-pink-600';

                    return (
                        <div
                            key={wallet.index}
                            className="bg-white rounded-2xl p-5 shadow-subtle border border-slate-100 hover:shadow-premium transition-all duration-500 hover:border-brand-200 group hover:scale-[1.01]"
                            style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                                {/* Wallet Icon & Info */}
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${chainColor} flex items-center justify-center shadow-lg`}>
                                        <WalletIcon className="w-7 h-7 text-white" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-black text-lg text-slate-900">
                                                Wallet {wallet.index + 1}
                                            </h3>
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-black uppercase tracking-wider rounded-full border border-green-200">
                                                Active
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                                            {chainName}
                                        </p>
                                    </div>
                                </div>

                                {/* Address Display */}
                                <div className="w-full lg:flex-1">
                                    <div
                                        onClick={() => copyToClipboard(address)}
                                        className="bg-gradient-to-br from-slate-50 to-purple-50/30 border border-slate-200 hover:border-brand-400 rounded-xl p-3 cursor-pointer transition-all hover:shadow-md group/address"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="font-mono-address text-xs text-slate-700 break-all flex-1">
                                                <span className="font-bold text-slate-900">{address.slice(0, 10)}</span>
                                                <span className="text-slate-400">...</span>
                                                <span className="font-bold text-slate-900">{address.slice(-10)}</span>
                                            </div>
                                            <div className="p-2 bg-white rounded-lg shadow-sm group-hover/address:bg-brand-50 transition-colors">
                                                {copied === address ? (
                                                    <Check className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-slate-400 group-hover/address:text-brand-600" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setShowDeleteConfirm(wallet.index)}
                                        className="p-3 bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 rounded-xl transition-all border border-red-100 hover:shadow-md"
                                        title="Delete Wallet"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>



            {/* Delete Confirmation Modal */}
            {showDeleteConfirm !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                    <div className="card-premium max-w-sm w-full !p-6 shadow-glow">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-red-200">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">
                                Delete Wallet {showDeleteConfirm + 1}?
                            </h3>
                            <p className="text-slate-600 leading-relaxed font-medium text-sm">
                                This will remove the wallet from your view. You can always recover it using your original secret phrase.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="flex-1 btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => confirmDelete(showDeleteConfirm)}
                                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 px-5 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95"
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
