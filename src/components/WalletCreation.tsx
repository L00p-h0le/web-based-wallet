import { useState } from 'react';
import { WalletVault } from '../core/wallet/vault';
import { RefreshCw, ArrowRight, Import, Check, Sparkles, Shield, Key } from 'lucide-react';

interface WalletCreationProps {
    onWalletCreated: () => void;
}

export const WalletCreation = ({ onWalletCreated }: WalletCreationProps) => {
    const [mnemonic, setMnemonic] = useState<string[]>([]);
    const [isImporting, setIsImporting] = useState(false);
    const [importInput, setImportInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [showCopyToast, setShowCopyToast] = useState(false);

    const handleCreate = () => {
        const newMnemonic = WalletVault.createNewVault();
        setMnemonic(newMnemonic.split(' '));
        setIsImporting(false);
        setError(null);
    };

    const handleImport = () => {
        setIsImporting(true);
        setMnemonic([]);
        setError(null);
    };

    const submitImport = () => {
        const success = WalletVault.importVault(importInput.trim());
        if (success) {
            onWalletCreated();
        } else {
            setError('Invalid mnemonic phrase. Please check and try again.');
        }
    };

    const confirmCreation = () => {
        onWalletCreated();
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(mnemonic.join(' '));
        setShowCopyToast(true);
        setTimeout(() => setShowCopyToast(false), 2000);
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-6 lg:px-12 py-8">
            {/* Copy Toast Notification */}
            {showCopyToast && (
                <div className="fixed top-24 right-8 z-50 animate-fadeInUp">
                    <div className="bg-gradient-to-r from-brand-600 to-accent text-white px-6 py-3 rounded-2xl shadow-glow font-bold flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        Copied to clipboard!
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <div className="text-center mb-6 stagger-animation">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100/50 border border-purple-200/50 rounded-full mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                    <span className="text-xs font-bold text-brand-700">Multi-Chain Wallet</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                    Welcome to <span className="gradient-text">CryptoVault</span>
                </h1>


            </div>

            {/* Main Card */}
            <div className="card-premium max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                {mnemonic.length > 0 ? (
                    // Mnemonic Display
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-accent rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-1">Save Your Secret Phrase</h2>
                            <p className="text-slate-500 font-medium text-sm">
                                Write this down and store it in a safe place. You'll need it to recover your wallet.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-4 bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-2xl border border-purple-100/50 shadow-inner">
                            {mnemonic.map((word, i) => (
                                <div
                                    key={i}
                                    className="bg-white p-3 rounded-xl border border-slate-200/80 hover:border-brand-300 transition-all hover:shadow-md group"
                                    style={{ animationDelay: `${i * 0.05}s` }}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-black text-slate-300 w-5">{i + 1}</span>
                                        <span className="font-mono-address text-xs text-slate-800 group-hover:text-brand-600 transition-colors">
                                            {word}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={copyToClipboard}
                                className="btn-secondary flex-1 flex items-center justify-center gap-2"
                            >
                                <Key className="w-5 h-5" />
                                Copy Phrase
                            </button>
                            <button
                                onClick={confirmCreation}
                                className="btn-primary flex-[2] flex items-center justify-center gap-2"
                            >
                                <Check className="w-5 h-5" />
                                I've Saved It Securely
                            </button>
                        </div>

                        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-4 flex gap-3">
                            <div className="text-brand-600 mt-0.5">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div className="text-sm text-purple-900">
                                <p className="font-bold mb-1">Security Notice</p>
                                <p className="text-purple-700">
                                    Never share your secret phrase. Anyone with access to it can control your funds.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : isImporting ? (
                    // Import Wallet
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Import className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-2">Import Your Wallet</h2>
                            <p className="text-slate-500 font-medium">
                                Enter your 12-word secret recovery phrase
                            </p>
                        </div>

                        <div className="space-y-4">
                            <textarea
                                value={importInput}
                                onChange={(e) => setImportInput(e.target.value)}
                                placeholder="Enter your 12-word recovery phrase separated by spaces..."
                                className="w-full h-40 p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-brand-500 focus:bg-white font-mono-address text-sm transition-all resize-none"
                            />

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
                                    <div className="text-red-600 mt-0.5">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div className="text-sm text-red-900">
                                        <p className="font-bold">{error}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => setIsImporting(false)}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitImport}
                                className="btn-primary flex-[2] flex items-center justify-center gap-2"
                            >
                                <ArrowRight className="w-5 h-5" />
                                Import Wallet
                            </button>
                        </div>
                    </div>
                ) : (
                    // Initial Choice
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Get Started</h2>
                            <p className="text-slate-500 font-medium text-sm">
                                Create a new wallet or import an existing one
                            </p>
                        </div>

                        <div className="grid gap-3">
                            <button
                                onClick={handleCreate}
                                className="group relative overflow-hidden bg-gradient-to-r from-brand-600 to-accent text-white font-bold py-5 px-6 rounded-2xl hover:shadow-glow transition-all duration-300 hover:scale-[1.02] active:scale-95"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                                            <RefreshCw className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-lg font-black mb-0.5">Create New Wallet</div>
                                            <div className="text-purple-100 text-xs font-medium">Generate a fresh recovery phrase</div>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>

                            <button
                                onClick={handleImport}
                                className="group bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-brand-300 text-slate-900 font-bold py-5 px-6 rounded-2xl transition-all duration-300 hover:shadow-xl active:scale-95"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-brand-50 group-hover:bg-brand-100 rounded-xl transition-colors">
                                            <Import className="w-6 h-6 text-brand-600" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-lg font-black mb-0.5">Import Existing Wallet</div>
                                            <div className="text-slate-500 text-xs font-medium">Use your recovery phrase</div>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-6 h-6 text-slate-400 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3 mt-8">
                            <div className="text-blue-600 mt-0.5">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div className="text-sm text-blue-900">
                                <p className="font-bold mb-1">Educational Purpose</p>
                                <p className="text-blue-700">
                                    This wallet is for learning and testing. Do not use it with real funds on mainnet.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
