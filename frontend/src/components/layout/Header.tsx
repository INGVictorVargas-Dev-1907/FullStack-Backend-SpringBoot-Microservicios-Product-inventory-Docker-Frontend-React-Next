'use client';

import { useAppStore } from '@/store/appStore';
import { Bars3Icon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface HeaderProps {
    title?: string;
}

export const Header: React.FC<HeaderProps> = ({
    title = 'Inventory Manager'
}) => {
    const { sidebarOpen, darkMode, toggleSidebar, toggleDarkMode } = useAppStore();

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
            {/* Logo y título */}
            <div className="flex items-center">
                <button
                aria-label='Toggle sidebar'
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 mr-4"
                >
                <Bars3Icon className="h-6 w-6" />
                </button>
                
                <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">IM</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                    {title}
                </h1>
                </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center space-x-4">
                {/* Toggle Dark Mode */}
                <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                title={darkMode ? 'Modo claro' : 'Modo oscuro'}
                >
                {darkMode ? (
                    <SunIcon className="h-5 w-5" />
                ) : (
                    <MoonIcon className="h-5 w-5" />
                )}
                </button>

                {/* User menu (placeholder) */}
                <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium text-sm">U</span>
                </div>
                <span className="text-sm text-gray-700 hidden sm:block">
                    Usuario
                </span>
                </div>
            </div>
            </div>
        </div>
        </header>
    );
};