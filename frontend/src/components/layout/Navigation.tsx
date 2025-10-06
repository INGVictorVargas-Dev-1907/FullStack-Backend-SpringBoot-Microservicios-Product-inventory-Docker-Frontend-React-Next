import { useAppStore } from '@/store/appStore';
import {
    ChartBarIcon,
    CogIcon,
    CubeIcon,
    HomeIcon
} from '@heroicons/react/24/outline';
import React from 'react';

interface NavigationProps {
    className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
    const { sidebarOpen } = useAppStore();

    if (!sidebarOpen) return null;

    const navigationItems = [
        { name: 'Inicio', href: '/', icon: HomeIcon, current: true },
        { name: 'Productos', href: '/products', icon: CubeIcon, current: false },
        { name: 'Reportes', href: '/reports', icon: ChartBarIcon, current: false },
        { name: 'Configuración', href: '/settings', icon: CogIcon, current: false },
    ];

    return (
        <nav className={`bg-gray-800 text-white w-64 min-h-screen py-4 ${className}`}>
        <div className="px-4 space-y-2">
            {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
                <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.current
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
                </a>
            );
            })}
        </div>
        </nav>
    );
};