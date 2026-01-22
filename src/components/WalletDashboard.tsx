import { useEffect, useState } from 'react';
import { WalletVault } from '../core/wallet/vault';
import { deriveEthAddress } from '../core/ethereum/hd-wallet';
import { deriveSolAddress } from '../core/solana/hd-wallet';
import { Copy, Plus, Trash2, Check, ExternalLink, AlertTriangle, ArrowUpRight, ArrowDownLeft, Coins, History, Settings, LogOut } from 'lucide-react';

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
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 flex flex-col md:flex-row gap-10 min-h-[80vh]">
            {/* Copied Popup Notification */}
            {showCopyToast && (
                <div className="fixed top-24 right-8 z-50 animate-bounce">
                    <div className="bg-brand text-white px-6 py-3 rounded-2xl shadow-premium font-bold flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        Copied to clipboard!
                    </div>
                </div>
            )}

            {/* SIDEBAR NAVIGATION / INFO */}
            <aside className="w-full md:w-80 space-y-8">
                <div className="card p-6 !bg-brand text-white shadow-premium">
                    <div className="flex items-center justify-between mb-8 text-white/60">
                        <span className="text-xs font-bold uppercase tracking-widest leading-none">Total Balance</span>
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-white/40"></div>)}
                        </div>
                    </div>
                    <div className="mb-2 text-4xl font-black">$0.00</div>
                    <div className="text-sm font-medium text-white/70 mb-8 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-white/20"></span>
                        Educational Mode Active
                    </div>
                    <div className="flex gap-3">
                        <button className="flex-1 bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors flex flex-col items-center gap-2 group">
                            <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform"><ArrowUpRight className="w-5 h-5 text-white" /></div>
                            <span className="text-[10px] font-bold uppercase tracking-wider">Send</span>
                        </button>
                        <button className="flex-1 bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors flex flex-col items-center gap-2 group">
                            <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform"><ArrowDownLeft className="w-5 h-5 text-white" /></div>
                            <span className="text-[10px] font-bold uppercase tracking-wider">Receive</span>
                        </button>
                    </div>
                </div>

                <div className="card p-4 space-y-1">
                    {[
                        { icon: <Coins />, label: 'Assets', active: true },
                        { icon: <History />, label: 'History' },
                        { icon: <Settings />, label: 'Settings' }
                    ].map((item) => (
                        <div key={item.label} className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${item.active ? 'bg-brand/5 text-brand shadow-inner border border-brand/5' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-xl ${item.active ? 'bg-brand/20 text-brand' : 'bg-gray-100'}`}>
                                    {item.icon}
                                </div>
                                <span className="font-bold text-[15px]">{item.label}</span>
                            </div>
                            {item.active && <div className="w-1.5 h-1.5 rounded-full bg-brand"></div>}
                        </div>
                    ))}
                </div>

                <div className="p-4">
                    <button onClick={onDeleteAll} className="flex items-center gap-4 p-4 w-full text-red-400 hover:text-red-500 font-bold transition-colors">
                        <LogOut className="w-5 h-5" />
                        Log Out / Delete Session
                    </button>
                </div>
            </aside>

            {/* MAIN DASHBOARD CONTENT */}
            <main className="flex-1 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Portfolio</h2>
                        <p className="text-gray-500 font-medium">Manage your multi-chain addresses</p>
                    </div>

                    <div className="flex bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
                        <button
                            onClick={() => setActiveTab('eth')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'eth'
                                ? 'bg-white text-brand shadow-premium'
                                : 'text-gray-500 hover:text-brand'
                                }`}
                        >
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${activeTab === 'eth' ? 'bg-brand text-white' : 'bg-gray-200'}`}>E</div>
                            Ethereum
                        </button>
                        <button
                            onClick={() => setActiveTab('sol')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'sol'
                                ? 'bg-white text-brand shadow-premium'
                                : 'text-gray-500 hover:text-brand'
                                }`}
                        >
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${activeTab === 'sol' ? 'bg-brand text-white' : 'bg-gray-200'}`}>S</div>
                            Solana
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {wallets.map((wallet) => {
                        const address = activeTab === 'eth' ? wallet.ethAddress : wallet.solAddress;
                        const chainName = activeTab === 'eth' ? 'Ethereum Mainnet' : 'Solana Mainnet';

                        return (
                            <div
                                key={wallet.index}
                                className="card group relative flex flex-col md:flex-row items-center justify-between gap-8 hover:scale-[1.01]"
                            >
                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-2xl font-black shadow-lg ${activeTab === 'eth'
                                        ? 'bg-gradient-to-br from-blue-500 to-brand text-white'
                                        : 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
                                        }`}>
                                        {activeTab === 'eth' ? 'ETH' : 'SOL'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-xl text-gray-900 tracking-tight">Wallet {wallet.index + 1}</h3>
                                            <span className="text-[10px] bg-brand/5 text-brand px-2 py-0.5 rounded-full border border-brand/10 font-black uppercase tracking-wider">Active</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-400">{chainName}</p>
                                    </div>
                                </div>

                                <div className="flex-1 w-full relative">
                                    <div
                                        className="bg-gray-50 border border-gray-100 rounded-2xl p-4 font-mono text-sm break-all flex items-center justify-between group-hover:bg-brand/5 group-hover:border-brand/10 transition-all cursor-pointer shadow-inner"
                                        onClick={() => copyToClipboard(address)}
                                    >
                                        <div className="flex gap-1 overflow-hidden">
                                            <span className="text-gray-800 font-bold">{address.slice(0, 12)}</span>
                                            <span className="text-gray-300">...</span>
                                            <span className="text-gray-800 font-bold">{address.slice(-12)}</span>
                                        </div>
                                        <div className="ml-4 p-2 bg-white rounded-xl shadow-sm text-gray-400 group-hover:text-brand transition-colors">
                                            {copied === address ? (
                                                <Check className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <Copy className="w-5 h-5" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                                    <button className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-2xl transition-colors border border-gray-100">
                                        <ExternalLink className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(wallet.index)}
                                        className="p-3 bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-500 rounded-2xl transition-colors border border-red-50"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={addNewWallet}
                    className="w-full py-8 bg-brand/5 border-2 border-dashed border-brand/20 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 text-brand hover:bg-brand hover:text-white hover:border-brand transition-all font-bold group"
                >
                    <div className="p-3 bg-white group-hover:bg-white/20 rounded-2xl shadow-sm group-hover:shadow-none transition-all">
                        <Plus className="w-8 h-8" />
                    </div>
                    <span>Generate New HD Account</span>
                </button>
            </main>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm fade-in">
                    <div className="card max-w-md w-full !p-8 shadow-premium">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="w-10 h-10 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Delete Wallet {showDeleteConfirm + 1}?</h3>
                            <p className="text-gray-500 leading-relaxed font-medium">
                                This will remove the wallet from your view. You can always recover it using your original secret phrase.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="flex-1 btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => confirmDelete(showDeleteConfirm)}
                                className="flex-1 bg-red-500 text-white font-bold py-3 px-6 rounded-full hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95"
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
