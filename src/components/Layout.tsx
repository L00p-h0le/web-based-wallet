import type { ReactNode } from 'react';
import { Wallet } from 'lucide-react';

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen font-sans bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/20">
            {/* Animated Background Decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Modern Navbar */}
            <nav className="fixed w-full top-0 z-50 glass backdrop-blur-xl border-b border-purple-100/50">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 animate-fadeInUp">
                        <div className="w-11 h-11 bg-gradient-to-br from-brand-600 to-accent rounded-2xl flex items-center justify-center text-white shadow-lg hover-glow">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black tracking-tight gradient-text">
                            CryptoVault
                        </span>
                    </div>


                </div>
            </nav>

            {/* Main Content with Animation */}
            <main className="relative pt-20 min-h-screen">
                <div className="fade-in">
                    {children}
                </div>
            </main>

            {/* Premium Footer */}
            <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900/90 to-slate-900 border-t border-purple-500/20 py-12 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-accent rounded-xl flex items-center justify-center text-white">
                                <Wallet className="w-4 h-4" />
                            </div>
                            <span className="text-lg font-bold text-white">CryptoVault</span>
                        </div>
                        <p className="text-purple-300/80 text-sm font-medium max-w-md">
                            A beautiful, secure multi-chain wallet for managing your digital assets.
                        </p>
                        <div className="flex items-center gap-3 text-xs text-purple-400/60 font-semibold">
                            <span>© 2026 CryptoVault</span>
                            <span>•</span>
                            <span>Educational Purpose Only</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
