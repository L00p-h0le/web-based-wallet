import type { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
    hideNavbar?: boolean;
}

export const Layout = ({ children, hideNavbar = false }: LayoutProps) => {
    return (
        <div className="min-h-screen font-sans" style={{ backgroundColor: '#F0F4F8', backgroundImage: 'radial-gradient(at 0% 0%, rgba(255, 255, 255, 0.5) 0, transparent 50%), radial-gradient(at 50% 0%, rgba(59, 130, 246, 0.05) 0, transparent 50%)' }}>
            {/* Animated Background Decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-softblue-100/30 rounded-full blur-[160px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-slate-200/40 rounded-full blur-[140px]"></div>
            </div>

            {/* Modern Navbar - Hidden when hideNavbar is true */}
            {!hideNavbar && (
                <nav className="fixed w-full top-0 z-50 backdrop-blur-xl border-b border-slate-100/50">
                    <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-center">
                        <div className="animate-fadeInUp">
                            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                                Crypto<span className="text-softblue-600">Vault</span>
                            </span>
                        </div>
                    </div>
                </nav>
            )}

            {/* Main Content with Animation */}
            <main className={`relative ${!hideNavbar ? 'pt-20' : ''} min-h-screen`}>
                <div className="fade-in">
                    {children}
                </div>
            </main>


        </div>
    );
};
