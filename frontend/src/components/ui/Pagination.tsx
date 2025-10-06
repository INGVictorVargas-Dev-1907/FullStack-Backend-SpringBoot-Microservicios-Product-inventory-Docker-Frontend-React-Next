import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    className = ''
}) => {
    if (totalPages <= 1) return null;

    const pages = [];
    const showPages = 5;
    
    let startPage = Math.max(0, currentPage - Math.floor(showPages / 2));
    const endPage = Math.min(totalPages - 1, startPage + showPages - 1);
    
    if (endPage - startPage + 1 < showPages) {
        startPage = Math.max(0, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className={`flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 ${className}`}>
        <div className="flex flex-1 justify-between sm:hidden">
            <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
            Anterior
            </button>
            <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
            Siguiente
            </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
            <p className="text-sm text-gray-700">
                Mostrando página <span className="font-medium">{currentPage + 1}</span> de{' '}
                <span className="font-medium">{totalPages}</span>
            </p>
            </div>
            <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                <button
                aria-label="Página anterior"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                <ChevronLeftIcon className="h-5 w-5" />
                </button>
                
                {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    page === currentPage
                        ? 'bg-blue-600 text-white focus:bg-blue-600'
                        : 'text-gray-900'
                    }`}
                >
                    {page + 1}
                </button>
                ))}
                
                <button
                aria-label="Página siguiente"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                <ChevronRightIcon className="h-5 w-5" />
                </button>
            </nav>
            </div>
        </div>
        </div>
    );
};