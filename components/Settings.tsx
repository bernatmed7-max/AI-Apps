import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileMenu } from './MobileMenu';

export const Settings = () => {
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        updates: true
    });

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">
            <Sidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 md:px-8 bg-white dark:bg-card-dark border-b border-[#f0f4f2] dark:border-[#2a4533] shrink-0">
                    <div className="flex items-center gap-4">
                        <MobileMenu />
                        <h2 className="text-lg font-bold">Configuración de Cuenta</h2>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-4xl mx-auto space-y-8">
                        
                        {/* Profile Card */}
                        <div className="bg-white dark:bg-card-dark rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-center gap-8">
                            <div className="relative">
                                <div className="size-24 rounded-full bg-cover bg-center border-4 border-gray-50 dark:border-[#1a1f33]" style={{backgroundImage: 'url("https://i.pravatar.cc/150?u=alex")'}}></div>
                                <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full border-2 border-white dark:border-card-dark hover:bg-primary-hover transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">edit</span>
                                </button>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-2xl font-black mb-1">Alex Morgan</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Senior Automation Engineer • Plan Pro</p>
                                <div className="flex justify-center md:justify-start gap-3">
                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold">Admin</span>
                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-bold">Verificado</span>
                                </div>
                            </div>
                        </div>

                        {/* Settings Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            
                            {/* General Info */}
                            <div className="bg-white dark:bg-card-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-gray-400">badge</span>
                                    <h3 className="font-bold text-lg">Información Personal</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nombre Completo</label>
                                        <input type="text" defaultValue="Alex Morgan" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:ring-primary focus:border-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Correo Electrónico</label>
                                        <input type="email" defaultValue="alex.morgan@bautomatex.com" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:ring-primary focus:border-primary" />
                                    </div>
                                    <div className="pt-2">
                                        <button className="text-primary font-bold text-sm hover:underline">Cambiar Contraseña</button>
                                    </div>
                                </div>
                            </div>

                            {/* Notifications */}
                            <div className="bg-white dark:bg-card-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-gray-400">notifications</span>
                                    <h3 className="font-bold text-lg">Notificaciones</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5">
                                        <div>
                                            <p className="font-bold text-sm">Alertas de Error por Email</p>
                                            <p className="text-xs text-gray-500">Recibe un correo cuando un flujo falle.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={notifications.email} onChange={() => setNotifications({...notifications, email: !notifications.email})} className="sr-only peer"/>
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5">
                                        <div>
                                            <p className="font-bold text-sm">Notificaciones Push</p>
                                            <p className="text-xs text-gray-500">Alertas en tiempo real en el navegador.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={notifications.push} onChange={() => setNotifications({...notifications, push: !notifications.push})} className="sr-only peer"/>
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5">
                                        <div>
                                            <p className="font-bold text-sm">Novedades de Producto</p>
                                            <p className="text-xs text-gray-500">Enterate de nuevos nodos y funciones IA.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={notifications.updates} onChange={() => setNotifications({...notifications, updates: !notifications.updates})} className="sr-only peer"/>
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* API Keys */}
                            <div className="lg:col-span-2 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Claves de API</h3>
                                        <p className="text-sm text-gray-400 mb-6 max-w-xl">Gestiona tus claves para acceder a Gemini 3 Pro, Veo y otras funcionalidades premium. No compartas estas claves con nadie.</p>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-600 text-4xl">vpn_key</span>
                                </div>
                                <div className="bg-black/30 rounded-lg p-4 flex items-center justify-between mb-4 border border-white/10">
                                    <code className="text-sm font-mono text-green-400">sk-proj-**********************9x8z</code>
                                    <div className="flex gap-2">
                                        <button className="text-gray-400 hover:text-white"><span className="material-symbols-outlined text-[18px]">visibility_off</span></button>
                                        <button className="text-gray-400 hover:text-white"><span className="material-symbols-outlined text-[18px]">content_copy</span></button>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-white text-gray-900 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors">Generar Nueva Clave</button>
                            </div>

                        </div>
                        
                        <div className="flex justify-end pt-4">
                            <button className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">Guardar Cambios</button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};