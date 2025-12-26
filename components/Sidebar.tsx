import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SidebarLink = ({ to, icon, label }: { to: string; icon: string; label: string }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    const baseClass = "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium text-sm";
    const activeClass = "bg-primary/10 text-primary dark:text-primary";
    const inactiveClass = "text-text-secondary-light dark:text-text-secondary-dark hover:bg-[#f0f4f2] dark:hover:bg-[#2a4533]";

    return (
        <Link to={to} className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}>
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
            {label}
        </Link>
    );
};

export const Sidebar = () => {
    return (
        <aside className="hidden lg:flex w-64 flex-col bg-white dark:bg-card-dark border-r border-[#f0f4f2] dark:border-[#2a4533] h-full flex-shrink-0 transition-colors duration-200">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                    </div>
                    <div>
                        <h1 className="text-base font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark">bautomatex</h1>
                        <p className="text-[10px] text-text-secondary-light uppercase tracking-wider font-semibold">Pro Workspace</p>
                    </div>
                </div>
                
                <div className="space-y-1 mb-6">
                    <SidebarLink to="/chat" icon="add" label="Nuevo Chat" />
                    <SidebarLink to="/editor" icon="design_services" label="Editor Visual" />
                </div>

                <div className="mb-2 px-3 text-xs font-bold text-text-secondary-light dark:text-slate-500 uppercase tracking-wider">
                    Gestión
                </div>
                <div className="space-y-1 mb-6">
                    <SidebarLink to="/" icon="dashboard" label="Dashboard" />
                    <SidebarLink to="/my-templates" icon="folder_open" label="Mis Plantillas" />
                    <SidebarLink to="/library" icon="grid_view" label="Biblioteca Global" />
                    <SidebarLink to="/details" icon="account_tree" label="Flujos Activos" />
                    <SidebarLink to="/diagnose" icon="hub" label="Conectores" />
                </div>

                <div className="mb-2 px-3 text-xs font-bold text-text-secondary-light dark:text-slate-500 uppercase tracking-wider">
                    Recientes
                </div>
                <div className="space-y-1">
                    <SidebarLink to="/details" icon="history" label="Reporte Semanal" />
                    <SidebarLink to="/diagnose" icon="history" label="Sync CRM - Email" />
                    <SidebarLink to="/community" icon="forum" label="Foro Comunidad" />
                </div>
            </div>
            <div className="mt-auto p-4 border-t border-[#f0f4f2] dark:border-[#2a4533]">
                <div className="flex items-center gap-3 px-2">
                     <div className="size-9 rounded-full bg-cover bg-center border border-gray-200 dark:border-gray-700" style={{backgroundImage: 'url("https://i.pravatar.cc/150?u=alex")'}}></div>
                     <div className="flex flex-col">
                         <span className="text-sm font-bold text-text-primary-light dark:text-white">Alex Morgan</span>
                         <span className="text-xs text-text-secondary-light">Plan Pro</span>
                     </div>
                </div>
            </div>
        </aside>
    );
};