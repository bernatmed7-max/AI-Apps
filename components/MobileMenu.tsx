import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const MobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="lg:hidden flex items-center mr-4">
            <button onClick={() => setIsOpen(true)} className="text-gray-900 dark:text-white p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-2xl">menu</span>
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity" 
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar / Drawer */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#1a1f33] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                             <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                            </div>
                            <span className="font-bold text-lg dark:text-white">bautomatex</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-1">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <nav className="space-y-1 flex-1 overflow-y-auto">
                        {[
                            { path: '/', icon: 'dashboard', label: 'Dashboard' },
                            { path: '/editor', icon: 'design_services', label: 'Editor Visual' },
                            { path: '/my-templates', icon: 'folder_open', label: 'Mis Plantillas' },
                            { path: '/chat', icon: 'smart_toy', label: 'Nuevo Chat' },
                            { path: '/details', icon: 'account_tree', label: 'Flujos Activos' },
                            { path: '/library', icon: 'grid_view', label: 'Biblioteca' },
                            { path: '/diagnose', icon: 'hub', label: 'Conectores' },
                            { path: '/community', icon: 'forum', label: 'Comunidad' },
                            { path: '/checklist', icon: 'verified_user', label: 'Checklist' },
                        ].map((link) => (
                            <Link 
                                key={link.path} 
                                to={link.path} 
                                className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="material-symbols-outlined">{link.icon}</span>
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3 px-2">
                            <div className="size-9 rounded-full bg-gray-200 bg-cover" style={{backgroundImage: 'url("https://i.pravatar.cc/150?u=alex")'}}></div>
                            <div>
                                <div className="text-sm font-bold dark:text-white">Alex Morgan</div>
                                <div className="text-xs text-gray-500">Plan Pro</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};