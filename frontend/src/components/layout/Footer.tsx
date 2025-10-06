import { CodeBracketIcon, EnvelopeIcon, LinkIcon } from '@heroicons/react/24/outline';
import React from 'react';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-gray-500">
                © {currentYear} Inventory Manager. Todos los derechos reservados.
            </div>

            <div className="flex space-x-4 mt-2 sm:mt-0">
                <a
                href="https://github.com/INGVictorVargas-Dev-1907"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
                title="GitHub"
                >
                <CodeBracketIcon className="h-6 w-6" />
                </a>
                <a
                href="http://www.linkedin.com/in/victor-alfonso-𝚅𝚊𝚛𝚐𝚊𝚜-diaz-6b853a355"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
                title="LinkedIn"
                >
                <LinkIcon className="h-6 w-6" />
                </a>
                <a
                href="mailto:victor19vargas2018@gmail.com"
                className="text-gray-500 hover:text-gray-700"
                title="Correo"
                >
                <EnvelopeIcon className="h-6 w-6" />
                </a>
            </div>
            </div>
        </div>
        </footer>
    );
};
