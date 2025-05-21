'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';
import {
    Bars3Icon,
    XMarkIcon,
    ChartBarIcon,
    ClipboardDocumentIcon,
    UsersIcon,
} from '@heroicons/react/24/outline';
import './globals.css'; // Adjust the path if needed
import { AuthProvider } from './context/AuthContext'; // Adjust the path if needed
import Navbar from './components/Navbar'; // Adjust the path if needed

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();

    // Determine if the current page is an authentication page
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    return (
        <html lang="en" data-arp="">
            <body className={`${inter.className} bg-gray-50`}>
                <AuthProvider>
                    {/* Conditionally render Navbar and the main app layout */}
                    {!isAuthPage ? (
                        <>
                            <Navbar />
                            <div className="flex h-screen">
                                {/* Sidebar */}
                                <aside
                                    className={`
                                        ${sidebarOpen ? 'w-64' : 'w-20'}
                                        bg-white shadow-md h-full transition-all duration-200
                                        md:relative z-40
                                    `}
                                >
                                    {/* Sidebar Header with Toggle */}
                                    <div className="p-4 border-b flex items-center justify-between">
                                        <button
                                            className="p-1 rounded hover:bg-gray-100"
                                            onClick={() => setSidebarOpen(!sidebarOpen)}
                                        >
                                            {sidebarOpen ? (
                                                <XMarkIcon className="h-5 w-5" />
                                            ) : (
                                                <Bars3Icon className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Sidebar Navigation */}
                                    <nav className="p-2">
                                        <ul className="space-y-1">
                                            <SidebarItem
                                                icon={<ChartBarIcon className="w-5 h-5" />}
                                                href="/dashboard"
                                                isActive={pathname === '/dashboard'}
                                                sidebarOpen={sidebarOpen}
                                            >
                                                Dashboard
                                            </SidebarItem>
                                            <SidebarItem
                                                icon={<UsersIcon className="w-5 h-5" />}
                                                href="/employees"
                                                isActive={pathname === '/employees'}
                                                sidebarOpen={sidebarOpen}
                                            >
                                                Employees
                                            </SidebarItem>
                                            <SidebarItem
                                                icon={<ClipboardDocumentIcon className="w-5 h-5" />}
                                                href="/projects"
                                                isActive={pathname === '/projects'}
                                                sidebarOpen={sidebarOpen}
                                            >
                                                Projects
                                            </SidebarItem>

                                        </ul>
                                    </nav>
                                </aside>

                                {/* Main Content Area */}
                                <main className={`
                                    flex-1 overflow-auto bg-gray-100
                                    ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}
                                    transition-all duration-200
                                `}>
                                    {/* Mobile Toggle Button (always visible) */}
                                    <button
                                        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-200"
                                        onClick={() => setSidebarOpen(!sidebarOpen)}
                                    >
                                        {sidebarOpen ? (
                                            <XMarkIcon className="h-6 w-6" />
                                        ) : (
                                            <Bars3Icon className="h-6 w-6" />
                                        )}
                                    </button>

                                    <div className="p-6">{children}</div>
                                </main>
                            </div>
                        </>
                    ) : (
                        // Render only children for auth pages, centered
                        <div className="flex min-h-screen items-center justify-center bg-gray-100">
                            {children}
                        </div>
                    )}
                </AuthProvider>
            </body>
        </html>
    );
}

function SidebarItem({
    icon,
    href,
    children,
    isActive,
    sidebarOpen
}) {
    return (
        <li>
            <a
                href={href}
                className={`
                    flex items-center p-3 rounded-lg
                    ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}
                    hover:bg-indigo-50
                    transition-all duration-200
                    ${sidebarOpen ? 'w-full' : 'w-12 justify-center'}
                `}
            >
                <span className={`${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>
                    {icon}
                </span>
                {sidebarOpen && (
                    <span className={`ml-3 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                        {children}
                    </span>
                )}
            </a>
        </li>
    );
}