import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
            <h1 className="text-9xl font-bold text-gray-300">404</h1>
            <h2 className="text-2xl font-bold text-gray-900 mt-4">Página no encontrada</h2>
            <p className="text-gray-600 mt-2 mb-6">
                La página que estás buscando no existe.
            </p>
            <Link
                href="/"
                className="btn-primary inline-flex items-center"
            >
                Volver al inicio
            </Link>
            </div>
        </main>
        
        <Footer />
        </div>
    );
}