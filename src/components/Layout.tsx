import type { ReactNode } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Wallet as WalletIcon } from 'lucide-react';

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    // Theme is enforced to dark, no need to access context
    // const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen transition-colors duration-300 font-sans bg-[#0f1115] text-gray-100">
            <nav className="fixed w-full top-0 z-50 border-b backdrop-blur-md border-white/10 bg-[#0f1115]/70">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <WalletIcon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                Lumina Wallet
                            </span>
                        </div>
                        {/* Theme toggle removed for permanent dark mode */}
                    </div>
                </div>
            </nav>

            <main className="pt-24 px-4 sm:px-6 lg:px-8 w-full pb-12">
                <div className="fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
};
