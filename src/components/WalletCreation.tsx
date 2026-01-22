import { useState } from 'react';
import { WalletVault } from '../core/wallet/vault';
import { Copy, RefreshCw, ArrowRight, Wallet as WalletIcon, Import, Check } from 'lucide-react';

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
        // In a real app, we'd force the user to verify they saved it.
        // For this educational/demo wallet, we trust they copied it.
        onWalletCreated();
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(mnemonic.join(' '));
        setShowCopyToast(true);
        setTimeout(() => setShowCopyToast(false), 2000);
    };

    return (
        <div className="max-w-xl mx-auto relative">
            {/* Copied Popup Notification */}
            {showCopyToast && (
                <div className="fixed top-24 right-8 z-50 animate-bounce fade-in">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg font-medium flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Copied to clipboard!
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-[#1a1d24] rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-white/5">
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-blue-500/10 rounded-full">
                            <WalletIcon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-center mb-2">
                        {mnemonic.length > 0 ? 'Back Up Your Secret Phrase' : isImporting ? 'Import Existing Wallet' : 'Welcome to Lumina'}
                    </h2>

                    <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
                        {mnemonic.length > 0
                            ? 'Write down these 12 words in order and keep them safe. This phrase is the key to your wallet.'
                            : isImporting
                                ? 'Enter your 12-word secret recovery phrase to restore your wallet.'
                                : 'Create a new wallet to get started or import an existing one using your secret recovery phrase.'}
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {mnemonic.length > 0 ? (
                        <div className="space-y-6 fade-in">
                            <div
                                className="grid grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5 cursor-pointer hover:border-blue-500/50 transition-colors"
                                onClick={copyToClipboard}
                                title="Click to copy"
                            >
                                {mnemonic.map((word, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 bg-white dark:bg-[#252830] rounded-lg shadow-sm">
                                        <span className="text-xs text-slate-400 select-none">{index + 1}.</span>
                                        <span className="font-mono font-medium text-slate-700 dark:text-slate-200">{word}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={copyToClipboard}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-colors"
                                >
                                    <Copy className="w-4 h-4" />
                                    Copy Phrase
                                </button>
                                <button
                                    onClick={confirmCreation}
                                    className="flex-[2] flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02]"
                                >
                                    I've Saved It
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : isImporting ? (
                        <div className="space-y-6 fade-in">
                            <textarea
                                value={importInput}
                                onChange={(e) => setImportInput(e.target.value)}
                                placeholder="apple banana cherry..."
                                className="w-full h-32 p-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-mono text-sm transition-all"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsImporting(false)}
                                    className="flex-1 py-3 px-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitImport}
                                    disabled={!importInput.trim()}
                                    className="flex-[2] py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all"
                                >
                                    Import Wallet
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 fade-in">
                            <button
                                onClick={handleCreate}
                                className="group relative flex items-center justify-between p-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/20 rounded-lg">
                                        <RefreshCw className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-lg">Create New Wallet</div>
                                        <div className="text-blue-100 text-sm">Generate a new 12-word phrase</div>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                            </button>

                            <button
                                onClick={handleImport}
                                className="group relative flex items-center justify-between p-5 bg-white dark:bg-[#1a1d24] hover:bg-gray-50 dark:hover:bg-[#252830] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl transition-all hover:scale-[1.02]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-lg text-gray-500 dark:text-gray-400">
                                        <Import className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-lg">I Already Have a Wallet</div>
                                        <div className="text-gray-500 dark:text-gray-400 text-sm">Import your Secret Recovery Phrase</div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
