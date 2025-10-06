'use client';

import { useEffect } from 'react';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full">
            <ErrorMessage
            title="Error de la aplicación"
            message="Ha ocurrido un error inesperado. Por favor, intenta nuevamente."
            onRetry={reset}
            />
        </div>
        </div>
    );
}