import React from 'react';

interface SkeletonLoaderProps {
    count?: number;
    className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
    count = 6,
    className = ''
}) => {
    return (
        <div className={`animate-pulse space-y-4 ${className}`}>
        {[...Array(count)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
            <div className="flex justify-between items-center">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/6"></div>
            </div>
            </div>
        ))}
        </div>
    );
};

// Skeleton para detalles de producto
export const ProductDetailSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse bg-white rounded-lg shadow-md p-6">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            </div>
            <div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
        </div>
        </div>
    );
};