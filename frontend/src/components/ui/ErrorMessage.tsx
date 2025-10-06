import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface ErrorMessageProps {
    title: string;
    message: string;
    onRetry?: () => void;
    className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    title,
    message,
    onRetry,
    className = ''
}) => {
    return (
        <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-start">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
            <h3 className="text-red-800 font-semibold">{title}</h3>
            <p className="text-red-600 mt-1 text-sm">{message}</p>
            {onRetry && (
                <button
                onClick={onRetry}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                >
                Reintentar
                </button>
            )}
            </div>
        </div>
        </div>
    );
};