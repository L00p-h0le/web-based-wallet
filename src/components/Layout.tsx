import type { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
    hideNavbar?: boolean;
}

export const Layout = ({ children, hideNavbar = false }: LayoutProps) => {
    return (
        <div className="min-h-screen font-sans" style={{ backgroundColor: '#11120D', color: '#FFFBF4' }}>
            {/* Animated Background Decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-[#FFFBF4]/5 rounded-full blur-[160px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#FFFBF4]/3 rounded-full blur-[140px]"></div>
            </div>

            {/* Modern Navbar - Hidden when hideNavbar is true */}
            {!hideNavbar && (
                <nav className="fixed w-full top-0 z-50 backdrop-blur-xl border-b border-[#FFFBF4]/10" style={{ backgroundColor: 'rgba(17, 18, 13, 0.9)' }}>
                    <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-center">
                        <div className="animate-fadeInUp">
                            <span className="text-3xl font-medium tracking-tight text-[#FFFBF4]">
                                Crypto<span className="text-[#FFFBF4]/70">Vault</span>
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
