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
                    <div className="bg-[#FFFBF4] text-[#11120D] px-6 py-3 rounded-2xl shadow-glow font-bold flex items-center gap-2">
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
                        <span className="text-3xl font-medium tracking-tight text-[#FFFBF4]">Wa<span className="text-[#FFFBF4]/70">ult</span></span>
                    </div>

                    {/* Main Card */}
                    <main className="w-full max-w-xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] border border-[#FFFBF4]/10 relative overflow-hidden" style={{ backgroundColor: 'rgba(17, 18, 13, 0.98)' }}>
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FFFBF4]/5 blur-[80px] rounded-full"></div>
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#FFFBF4]/3 blur-[80px] rounded-full"></div>

                        <div className="text-center mb-10 relative z-10">
                            <h1 className="text-2xl md:text-3xl font-bold text-[#FFFBF4] mb-3 tracking-tight">Secret Recovery Phrase</h1>
                            <p className="text-[#FFFBF4]/60 text-sm max-w-md mx-auto leading-relaxed">
                                This 12-word phrase is the master key to your wallet. Keep it safe and never share it with anyone.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 relative z-10">
                            {mnemonic.map((word, i) => (
                                <div
                                    key={i}
                                    className="border border-[#FFFBF4]/20 rounded-xl p-3.5 flex items-center gap-3 hover:border-[#FFFBF4]/40 hover:bg-[#FFFBF4]/5 transition-all"
                                    style={{ backgroundColor: 'rgba(17, 18, 13, 0.8)' }}
                                >
                                    <span className="text-[10px] font-bold text-[#FFFBF4]/40 w-5">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="font-mono text-[#FFFBF4] font-medium text-sm tracking-wide">
                                        {word}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row-reverse gap-3 relative z-10">
                            <button
                                onClick={confirmCreation}
                                className="flex-[1.5] px-8 py-4 rounded-2xl bg-[#FFFBF4] text-[#11120D] font-semibold transition-all flex items-center justify-center gap-2 group shadow-lg hover:translate-y-[-2px] hover:shadow-[0_10px_25px_-5px_rgba(255,251,244,0.35)]"
                            >
                                Next Step
                                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                            <button
                                onClick={copyToClipboard}
                                className="flex-1 px-8 py-4 rounded-2xl bg-transparent hover:bg-[#FFFBF4]/10 text-[#FFFBF4] font-semibold transition-all border border-[#FFFBF4]/30 flex items-center justify-center gap-2 hover:border-[#FFFBF4] hover:scale-[1.01]"
                            >
                                <span className="material-symbols-outlined text-lg">content_copy</span>
                                Copy Phrase
                            </button>
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="mt-8 flex flex-col items-center gap-3">
                        <p className="text-[#FFFBF4]/40 text-xs font-medium uppercase tracking-widest">
                            End-to-End Encrypted • <a className="text-[#FFFBF4]/60 hover:text-[#FFFBF4] transition-colors underline underline-offset-4 decoration-[#FFFBF4]/20" href="#">Security Guide</a>
                        </p>
                        <div className="flex gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FFFBF4]/20"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FFFBF4]/50"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FFFBF4]/20"></div>
                        </div>
                    </footer>
                </div>
            ) : isImporting ? (
                // Import Wallet
                <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center">
                    {/* CryptoVault Header - Top Left */}
                    <div className="fixed top-0 left-0 w-full px-8 py-6">
                        <span className="text-4xl font-medium tracking-tight text-[#FFFBF4]">
                            Wa<span className="text-[#FFFBF4]/70">ult</span>
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-medium text-center mb-16 tracking-tight text-[#FFFBF4]">
                        Secure your <span className="text-[#FFFBF4]/70">Digital Future</span>
                    </h1>

                    <div className="w-full max-w-xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] border border-[#FFFBF4]/10 relative overflow-hidden" style={{ backgroundColor: 'rgba(17, 18, 13, 0.98)' }}>
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FFFBF4]/5 blur-[80px] rounded-full"></div>
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#FFFBF4]/3 blur-[80px] rounded-full"></div>

                        <div className="text-center mb-12 relative z-10">
                            <h2 className="text-3xl font-bold mb-3 text-[#FFFBF4]">Import Your Wallet</h2>
                            <p className="text-[#FFFBF4]/60 text-sm">Enter your 12-word secret recovery phrase</p>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <textarea
                                value={importInput}
                                onChange={(e) => setImportInput(e.target.value)}
                                placeholder="Enter your 12-word recovery phrase separated by spaces..."
                                className="w-full h-40 p-5 border-2 border-[#FFFBF4]/20 rounded-2xl outline-none focus:border-[#FFFBF4]/50 font-mono text-sm transition-all resize-none text-[#FFFBF4] placeholder-[#FFFBF4]/30"
                                style={{ backgroundColor: 'rgba(17, 18, 13, 0.8)' }}
                            />

                            {error && (
                                <div className="border border-[#FFFBF4]/20 rounded-2xl p-4 flex gap-3" style={{ backgroundColor: 'rgba(17, 18, 13, 0.9)' }}>
                                    <div className="text-[#FFFBF4]/60 mt-0.5">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div className="text-sm text-[#FFFBF4]/80">
                                        <p className="font-medium">{error}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-8 relative z-10">
                            <button
                                onClick={() => setIsImporting(false)}
                                className="flex-1 px-6 py-4 rounded-2xl bg-transparent hover:bg-[#FFFBF4]/10 text-[#FFFBF4] font-semibold transition-all border border-[#FFFBF4]/30 hover:border-[#FFFBF4] hover:scale-[1.01]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitImport}
                                className="flex-[2] px-6 py-4 rounded-2xl bg-[#FFFBF4] text-[#11120D] font-semibold flex items-center justify-center gap-2 shadow-lg hover:translate-y-[-2px] hover:shadow-[0_10px_25px_-5px_rgba(255,251,244,0.35)] transition-all"
                            >
                                <ArrowRight className="w-5 h-5" />
                                Import Wallet
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                // Initial Choice - Get Started (matches reference design)
                <div className="h-screen flex flex-col items-center justify-center">
                    {/* CryptoVault Header - Top Left */}
                    <div className="fixed top-0 left-0 w-full px-8 py-6">
                        <span className="text-4xl font-medium tracking-tight text-[#FFFBF4]">
                            Wa<span className="text-[#FFFBF4]/70">ult</span>
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-medium text-center mb-16 tracking-tight text-[#FFFBF4]">
                        Secure your <span className="text-[#FFFBF4]/70">Digital Future</span>
                    </h1>

                    <div className="w-full max-w-lg rounded-[2.5rem] px-8 py-12 md:px-12 md:py-20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] border border-[#FFFBF4]/10 relative overflow-hidden" style={{ backgroundColor: 'rgba(17, 18, 13, 0.98)' }}>
                        <div className="text-center mb-12 relative z-10">
                            <h2 className="text-3xl font-medium mb-3 text-[#FFFBF4]">Get Started</h2>
                            <p className="text-[#FFFBF4]/60 text-sm">Sophisticated asset custody for the modern era</p>
                        </div>

                        <div className="space-y-5 relative z-10">
                            <button
                                onClick={handleCreate}
                                className="group w-full p-6 rounded-2xl bg-[#FFFBF4] flex items-center justify-between text-[#11120D] shadow-lg hover:translate-y-[-2px] hover:shadow-[0_10px_25px_-5px_rgba(255,251,244,0.35)] hover:brightness-97 transition-all"
                            >
                                <div className="text-left">
                                    <div className="text-lg font-semibold text-[#11120D]">Create New Wallet</div>
                                    <div className="text-sm font-medium text-[#11120D]/60">Initialize secure seed phrase</div>
                                </div>
                                <span className="material-symbols-outlined font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>

                            <button
                                onClick={handleImport}
                                className="group w-full p-6 rounded-2xl border border-[#FFFBF4]/20 flex items-center justify-between hover:border-[#FFFBF4]/50 hover:bg-[#FFFBF4]/5 hover:scale-[1.01] transition-all"
                                style={{ backgroundColor: 'rgba(17, 18, 13, 0.8)' }}
                            >
                                <div className="text-left">
                                    <div className="text-lg font-semibold text-[#FFFBF4] group-hover:text-[#FFFBF4] transition-colors">Import Existing</div>
                                    <div className="text-sm text-[#FFFBF4]/50">Restore from recovery phrase</div>
                                </div>
                                <span className="material-symbols-outlined text-[#FFFBF4]/40 group-hover:text-[#FFFBF4] group-hover:translate-x-1 transition-all">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
