import type { ReactNode } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Box } from 'lucide-react';

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    const { theme } = useTheme();

    return (
        <div className={`min-h-screen font-sans bg-white text-slate-900`}>
            {/* Simple Navbar for Debugging */}
            <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-20 flex items-center px-6 lg:px-12">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                        <Box className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Lumina</span>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-20 min-h-screen">
                <div className="fade-in px-6 lg:px-12 py-10">
                    {children}
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="bg-slate-50 border-t border-slate-200 py-12 px-6 lg:px-12 text-center text-slate-400 text-sm font-medium">
                © 2026 Lumina Wallet. All rights reserved.
            </footer>
        </div>
    );
};
