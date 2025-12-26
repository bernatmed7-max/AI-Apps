import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileMenu } from './MobileMenu';
import { Link, useNavigate } from 'react-router-dom';
import { APPS_DB, templateService } from '../services/templateService';

export const MyTemplates = () => {
    const navigate = useNavigate();
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    // Fetch Data
    const folders = templateService.getFolders();
    const workflows = templateService.getUserWorkflows();

    // Filter Logic
    const filteredWorkflows = currentFolder 
        ? workflows.filter(w => w.folderId === currentFolder)
        : workflows; // Show all if no folder selected (or show only root? Let's show all for "All" view)

    const handleCreateFolder = () => {
        if (newFolderName.trim()) {
            templateService.createFolder(newFolderName);
            setNewFolderName('');
            setShowFolderModal(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">
            <Sidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="h-16 flex items-center justify-between px-6 md:px-8 bg-white dark:bg-card-dark border-b border-[#f0f4f2] dark:border-[#2a4533] shrink-0">
                    <div className="flex items-center gap-4">
                        <MobileMenu />
                        <h2 className="text-lg font-bold">Mis Plantillas</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowFolderModal(true)} className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                            <span className="material-symbols-outlined text-[18px]">create_new_folder</span>
                            Nueva Carpeta
                        </button>
                        <Link to="/library" className="text-sm font-bold text-primary hover:underline">Explorar Biblioteca</Link>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-2xl font-black">Tu Espacio de Trabajo</h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    {currentFolder 
                                        ? `Carpeta: ${folders.find(f => f.id === currentFolder)?.name}` 
                                        : 'Todos los flujos'}
                                </p>
                            </div>
                            <button onClick={() => navigate('/editor')} className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 flex items-center gap-2 transition-transform active:scale-95">
                                <span className="material-symbols-outlined">add</span> Nuevo Flujo
                            </button>
                        </div>

                        {/* Folders Section */}
                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Carpetas</h3>
                            <div className="flex flex-wrap gap-4">
                                <button 
                                    onClick={() => setCurrentFolder(null)}
                                    className={`px-4 py-3 rounded-xl border flex items-center gap-3 transition-all ${!currentFolder 
                                        ? 'bg-gray-800 text-white border-gray-800 shadow-md' 
                                        : 'bg-white dark:bg-card-dark border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400'}`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">grid_view</span>
                                    <span className="font-bold text-sm">Todos</span>
                                </button>
                                
                                {folders.map(folder => (
                                    <button 
                                        key={folder.id}
                                        onClick={() => setCurrentFolder(folder.id)}
                                        className={`px-4 py-3 rounded-xl border flex items-center gap-3 transition-all ${currentFolder === folder.id 
                                            ? 'bg-gray-800 text-white border-gray-800 shadow-md' 
                                            : 'bg-white dark:bg-card-dark border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400'}`}
                                    >
                                        <span className={`material-symbols-outlined text-[20px] ${currentFolder === folder.id ? 'text-yellow-400' : 'text-yellow-500'}`}>folder</span>
                                        <span className="font-bold text-sm">{folder.name}</span>
                                    </button>
                                ))}

                                <button onClick={() => setShowFolderModal(true)} className="size-12 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors">
                                    <span className="material-symbols-outlined">add</span>
                                </button>
                            </div>
                        </div>

                        {/* Workflows Grid */}
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Flujos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredWorkflows.map((workflow) => (
                                <div key={workflow.id} className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col h-full">
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex -space-x-2">
                                                {workflow.apps.slice(0, 4).map((app, i) => (
                                                    <div key={i} className={`size-8 rounded-full border-2 border-white dark:border-card-dark ${app.bg} flex items-center justify-center shadow-sm`}>
                                                        <span className={`material-symbols-outlined text-[14px] ${app.color}`}>{app.icon}</span>
                                                    </div>
                                                ))}
                                                {workflow.apps.length > 4 && (
                                                    <div className="size-8 rounded-full border-2 border-white dark:border-card-dark bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                                                        +{workflow.apps.length - 4}
                                                    </div>
                                                )}
                                            </div>
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                workflow.status === 'Active' ? 'bg-green-100 text-green-700' : 
                                                workflow.status === 'Draft' ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                                {workflow.status}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{workflow.title}</h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                                            {new Date(workflow.lastModified).toLocaleDateString()}
                                            {workflow.folderId && (
                                                <>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">folder</span> {folders.find(f => f.id === workflow.folderId)?.name}</span>
                                                </>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-2 border-t border-gray-50 dark:border-gray-800 pt-4 mt-auto">
                                            <button 
                                                onClick={() => navigate('/editor')}
                                                className="flex-1 py-2 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">edit_square</span> Editar
                                            </button>
                                            <button className="size-9 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Create New Card */}
                            <button onClick={() => navigate('/editor')} className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors min-h-[200px] bg-gray-50/50 dark:bg-white/5">
                                <div className="size-12 rounded-full bg-white dark:bg-white/10 shadow-sm flex items-center justify-center mb-3">
                                    <span className="material-symbols-outlined text-2xl">add</span>
                                </div>
                                <span className="font-bold text-sm">Crear desde cero</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Create Folder Modal */}
            {showFolderModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-card-dark p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-fade-in-up">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Nueva Carpeta</h3>
                        <input 
                            type="text" 
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Nombre de la carpeta"
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary mb-6"
                            autoFocus
                        />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowFolderModal(false)} className="px-4 py-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-bold text-sm">Cancelar</button>
                            <button onClick={handleCreateFolder} className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold text-sm">Crear</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};