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
    CurrencyDollarIcon,
    CalendarIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';
import './globals.css'; // Adjust the path if needed
import { AuthProvider } from './context/AuthContext'; // Adjust the path if needed
import Navbar from './components/Navbar'; // Adjust the path if needed

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    return (
        <html lang="en" data-arp="">
            <body className={`${inter.className} bg-gray-50`}>
                <AuthProvider>
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
                                    icon={<ClipboardDocumentIcon className="w-5 h-5" />}
                                    href="/projects"
                                    isActive={pathname === '/projects'}
                                    sidebarOpen={sidebarOpen}
                                >
                                    Projects
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
                                    icon={<CurrencyDollarIcon className="w-5 h-5" />}
                                    href="/invoices"
                                    isActive={pathname === '/invoices'}
                                    sidebarOpen={sidebarOpen}
                                >
                                    Invoices
                                </SidebarItem>
                                <SidebarItem
                                    icon={<CalendarIcon className="w-5 h-5" />}
                                    href="/calendar"
                                    isActive={pathname === '/calendar'}
                                    sidebarOpen={sidebarOpen}
                                >
                                    Calendar
                                </SidebarItem>
                                <SidebarItem
                                    icon={<Cog6ToothIcon className="w-5 h-5" />}
                                    href="/settings"
                                    isActive={pathname === '/settings'}
                                    sidebarOpen={sidebarOpen}
                                >
                                    Settings
                                </SidebarItem>
                            </ul>
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <main className={`
                        flex-1 overflow-auto bg-gray-100
                        ${sidebarOpen ? 'ml-64' : 'ml-20'}
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