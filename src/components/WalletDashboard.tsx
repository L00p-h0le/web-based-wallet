import { useEffect, useState } from 'react';
import { WalletVault } from '../core/wallet/vault';
import { deriveEthAddress } from '../core/ethereum/hd-wallet';
import { deriveSolAddress } from '../core/solana/hd-wallet';
import { Copy, Plus, Trash2, Check, ExternalLink, X, AlertTriangle } from 'lucide-react';

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
    const [showCopyToilet, setShowCopyToilet] = useState(false); // Helper for the popup "Copied" message

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
        setShowCopyToilet(true);
        setTimeout(() => {
            setCopied(null);
            setShowCopyToilet(false);
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
            // All wallets deleted, revert to home
            onDeleteAll();
        }
    };

    return (
        <div className="space-y-6 relative">
            {/* Copied Popup Notification */}
            {showCopyToilet && (
                <div className="fixed top-24 right-8 z-50 animate-bounce fade-in">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg font-medium flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Copied to clipboard!
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Wallets</h2>
                <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('eth')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'eth'
                            ? 'bg-white dark:bg-[#252830] text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        Ethereum
                    </button>
                    <button
                        onClick={() => setActiveTab('sol')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'sol'
                            ? 'bg-white dark:bg-[#252830] text-purple-500 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        Solana
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {wallets.map((wallet) => {
                    const address = activeTab === 'eth' ? wallet.ethAddress : wallet.solAddress;
                    const chainName = activeTab === 'eth' ? 'Ethereum' : 'Solana';

                    return (
                        <div
                            key={wallet.index}
                            className="group bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-white/5 rounded-xl p-6 transition-all hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 fade-in relative"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${activeTab === 'eth' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30'
                                        }`}>
                                        {activeTab === 'eth' ? 'E' : 'S'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Wallet {wallet.index + 1}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{chainName}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowDeleteConfirm(wallet.index)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    aria-label="Delete Wallet"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="bg-gray-50 dark:bg-black/20 rounded-lg p-4 font-mono text-sm break-all flex items-center justify-between group-hover:bg-gray-100 dark:group-hover:bg-black/40 transition-colors">
                                <span className="text-gray-700 dark:text-gray-300">
                                    {address}
                                </span>
                                <button
                                    onClick={() => copyToClipboard(address)}
                                    className="ml-4 p-2 text-gray-400 hover:text-blue-500 transition-colors"
                                    title="Copy Address"
                                >
                                    {copied === address ? (
                                        <Check className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                onClick={addNewWallet}
                className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all font-medium"
            >
                <Plus className="w-5 h-5" />
                Add New Wallet
            </button>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm fade-in">
                    <div className="bg-white dark:bg-[#1a1d24] rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-white/10">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    Delete Wallet {showDeleteConfirm + 1}?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    This action cannot be undone. This will permanently remove this wallet from your current session view.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => confirmDelete(showDeleteConfirm)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-lg shadow-red-500/30 transition-all"
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
