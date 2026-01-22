import { useState } from 'react';
import { WalletVault } from '../core/wallet/vault';
import { Copy, RefreshCw, ArrowRight, Wallet as WalletIcon, Import, Check, PlusCircle } from 'lucide-react';

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
        <div className="w-full max-w-4xl mx-auto py-20 text-center">
            {showCopyToast && (
                <div className="fixed top-24 right-8 z-50 animate-bounce">
                    <div className="bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg font-bold flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        Copied to clipboard!
                    </div>
                </div>
            )}

            <div className="mb-12">
                <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tight">
                    Welcome to <span className="text-indigo-600">Lumina</span>
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                    The beautiful, secure, and intuitive multi-chain wallet.
                </p>
            </div>

            <div className="card max-w-2xl mx-auto">
                {mnemonic.length > 0 ? (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold">Safe Your Secret Phrase</h2>
                        <div className="grid grid-cols-3 gap-3 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            {mnemonic.map((word, i) => (
                                <div key={i} className="bg-white p-2 rounded-lg border border-slate-100 text-sm font-mono font-bold text-slate-700">
                                    <span className="text-slate-300 mr-2">{i + 1}</span>{word}
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-4">
                            <button onClick={copyToClipboard} className="btn-secondary flex-1">Copy</button>
                            <button onClick={confirmCreation} className="btn-primary flex-[2]">I've Saved It</button>
                        </div>
                    </div>
                ) : isImporting ? (
                    <div className="space-y-6 text-left">
                        <h2 className="text-2xl font-bold">Import Wallet</h2>
                        <textarea
                            value={importInput}
                            onChange={(e) => setImportInput(e.target.value)}
                            placeholder="Enter your 12 words..."
                            className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-mono"
                        />
                        <div className="flex gap-4">
                            <button onClick={() => setIsImporting(false)} className="btn-secondary flex-1">Cancel</button>
                            <button onClick={submitImport} className="btn-primary flex-[2]">Import</button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        <button onClick={handleCreate} className="btn-primary py-6 flex items-center justify-between px-10">
                            <div className="flex items-center gap-4">
                                <RefreshCw className="w-8 h-8" />
                                <div className="text-left font-bold text-xl">Create New Wallet</div>
                            </div>
                            <ArrowRight className="w-6 h-6" />
                        </button>
                        <button onClick={handleImport} className="btn-secondary py-6 flex items-center justify-between px-10 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-4">
                                <Import className="w-8 h-8 text-indigo-600" />
                                <div className="text-left font-bold text-xl">Import Existing</div>
                            </div>
                            <PlusCircle className="w-6 h-6 text-slate-300" />
                        </button>
                    </div>
                )}
            </div>

            {error && <p className="mt-6 text-red-500 font-bold">{error}</p>}
        </div>
    );
};
