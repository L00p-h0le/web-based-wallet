import { useState } from 'react';
import { WalletVault } from '../core/wallet/vault';
import { ArrowRight, Check, Shield } from 'lucide-react';

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
        <div className="w-full mx-auto px-4 py-8">
            {/* Copy Toast Notification */}
            {showCopyToast && (
                <div className="fixed top-24 right-8 z-50 animate-fadeInUp">
                    <div className="bg-gradient-to-r from-brand-600 to-accent text-white px-6 py-3 rounded-2xl shadow-glow font-bold flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        Copied to clipboard!
                    </div>
                </div>
            )}

            {/* Main Card */}
            {mnemonic.length > 0 ? (
                // Centered Mnemonic Display (No Navbar)
                <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center">
                    {/* Centered CryptoVault Text Only */}
                    <div className="mb-6 text-center">
                        <span className="text-xl font-bold tracking-tight text-slate-800">Crypto<span className="text-blue-600">Vault</span></span>
                    </div>

                    {/* Main Card */}
                    <main className="w-full max-w-xl bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.08)] border border-white relative overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-softblue-100/50 blur-[80px] rounded-full"></div>
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-slate-200/40 blur-[80px] rounded-full"></div>

                        <div className="text-center mb-10 relative z-10">
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight">Secret Recovery Phrase</h1>
                            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                                This 12-word phrase is the master key to your wallet. Keep it safe and never share it with anyone.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 relative z-10">
                            {mnemonic.map((word, i) => (
                                <div
                                    key={i}
                                    className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 hover:border-slate-300 hover:bg-slate-50 transition-all"
                                >
                                    <span className="text-[10px] font-bold text-blue-500/60 w-5">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="font-mono text-slate-800 font-medium text-sm tracking-wide">
                                        {word}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row-reverse gap-3 relative z-10">
                            <button
                                onClick={confirmCreation}
                                className="flex-[1.5] px-8 py-4 rounded-2xl bg-gradient-to-r from-slate-700 to-softblue-500 text-white font-semibold transition-all flex items-center justify-center gap-2 group shadow-lg hover:translate-y-[-2px] hover:shadow-[0_10px_20px_-5px_rgba(59,130,246,0.3)]"
                            >
                                Next Step
                                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                            <button
                                onClick={copyToClipboard}
                                className="flex-1 px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-600 font-semibold transition-all border border-slate-200 flex items-center justify-center gap-2 hover:border-softblue-500 hover:scale-[1.01]"
                            >
                                <span className="material-symbols-outlined text-lg">content_copy</span>
                                Copy Phrase
                            </button>
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="mt-8 flex flex-col items-center gap-3">
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
                            End-to-End Encrypted • <a className="text-slate-600 hover:text-blue-600 transition-colors underline underline-offset-4 decoration-slate-200" href="#">Security Guide</a>
                        </p>
                        <div className="flex gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                        </div>
                    </footer>
                </div>
            ) : isImporting ? (
                // Import Wallet
                <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center">
                    {/* CryptoVault Header - Top Left */}
                    <div className="fixed top-0 left-0 w-full px-8 py-6">
                        <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                            Crypto<span className="text-softblue-600">Vault</span>
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-16 tracking-tighter text-slate-900">
                        Secure your <br />
                        <span className="text-softblue-600">Digital Future</span>
                    </h1>

                    <div className="w-full max-w-xl bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.08)] border border-white relative overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-softblue-100/50 blur-[80px] rounded-full"></div>
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-slate-200/40 blur-[80px] rounded-full"></div>

                        <div className="text-center mb-12 relative z-10">
                            <h2 className="text-3xl font-bold mb-3 text-slate-900">Import Your Wallet</h2>
                            <p className="text-slate-500 text-sm">Enter your 12-word secret recovery phrase</p>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <textarea
                                value={importInput}
                                onChange={(e) => setImportInput(e.target.value)}
                                placeholder="Enter your 12-word recovery phrase separated by spaces..."
                                className="w-full h-40 p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-softblue-500 focus:bg-white font-mono text-sm transition-all resize-none"
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

                        <div className="flex flex-col sm:flex-row gap-4 mt-8 relative z-10">
                            <button
                                onClick={() => setIsImporting(false)}
                                className="flex-1 px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-600 font-semibold transition-all border border-slate-200 hover:border-softblue-500 hover:scale-[1.01]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitImport}
                                className="flex-[2] px-6 py-4 rounded-2xl bg-gradient-to-r from-slate-700 to-softblue-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg hover:translate-y-[-2px] hover:shadow-[0_10px_20px_-5px_rgba(59,130,246,0.3)] transition-all"
                            >
                                <ArrowRight className="w-5 h-5" />
                                Import Wallet
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                // Initial Choice - Get Started (matches reference design)
                <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center">
                    {/* CryptoVault Header - Top Left */}
                    <div className="fixed top-0 left-0 w-full px-8 py-6">
                        <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                            Crypto<span className="text-softblue-600">Vault</span>
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-16 tracking-tighter text-slate-900">
                        Secure your <br />
                        <span className="text-softblue-600">Digital Future</span>
                    </h1>

                    <div className="w-full max-w-xl bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.08)] border border-white relative overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-softblue-100/50 blur-[80px] rounded-full"></div>
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-slate-200/40 blur-[80px] rounded-full"></div>

                        <div className="text-center mb-12 relative z-10">
                            <h2 className="text-3xl font-bold mb-3 text-slate-900">Get Started</h2>
                            <p className="text-slate-500 text-sm">Sophisticated asset custody for the modern era</p>
                        </div>

                        <div className="space-y-5 relative z-10">
                            <button
                                onClick={handleCreate}
                                className="group w-full p-6 rounded-2xl bg-gradient-to-r from-slate-700 to-softblue-500 flex items-center justify-between text-white shadow-lg hover:translate-y-[-2px] hover:shadow-[0_10px_20px_-5px_rgba(59,130,246,0.3)] hover:brightness-105 transition-all"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                        <span className="material-symbols-outlined text-white text-3xl">add_card</span>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-lg font-extrabold text-white">Create New Wallet</div>
                                        <div className="text-sm font-medium opacity-80">Initialize secure seed phrase</div>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>

                            <button
                                onClick={handleImport}
                                className="group w-full p-6 rounded-2xl bg-white border border-slate-200 flex items-center justify-between hover:border-softblue-500 hover:bg-slate-50 hover:scale-[1.01] transition-all"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-slate-600 text-3xl">key_visualizer</span>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-lg font-bold text-slate-900 group-hover:text-softblue-600 transition-colors">Import Existing</div>
                                        <div className="text-sm text-slate-500">Restore from recovery phrase</div>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-softblue-600 group-hover:translate-x-1 transition-all">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
