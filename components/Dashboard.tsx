import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileMenu } from './MobileMenu';
import { Link, useNavigate } from 'react-router-dom';
import { templateService } from '../services/templateService';

export const Dashboard = () => {
    const navigate = useNavigate();
    const [isRunningLast, setIsRunningLast] = useState(false);

    // Logic to run last template
    const handleRunLast = () => {
        const workflows = templateService.getUserWorkflows();
        if (workflows.length === 0) {
            alert("No tienes plantillas para ejecutar.");
            return;
        }

        const lastWorkflow = workflows[0]; // Assuming index 0 is latest based on service logic
        setIsRunningLast(true);

        // Simulate Execution
        setTimeout(() => {
            setIsRunningLast(false);
            
            // SIMULATE ERROR 100% of the time to demonstrate AI Diagnosis
            const hasError = true;

            if (hasError) {
                // Redirect to Diagnose page with state
                navigate('/diagnose', { 
                    state: { 
                        workflowId: lastWorkflow.id,
                        autoAnalyze: true,
                        errorMessage: "Error Crítico: Fallo en nodo 'HTTP Request' (Timeout 5000ms)"
                    } 
                });
            } else {
                alert("Ejecución completada con éxito");
            }

        }, 2000);
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-background-light dark:bg-background-dark">
                {/* Top Header */}
                <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-card-dark border-b border-[#f0f4f2] dark:border-[#2a4533] flex-shrink-0">
                    <div className="flex items-center">
                        <MobileMenu />
                        <div className="hidden lg:flex flex-col">
                            <h2 className="text-lg font-bold">Dashboard</h2>
                        </div>
                        <h2 className="lg:hidden text-lg font-bold">Dashboard</h2>
                    </div>
                    
                    <div className="flex items-center gap-4 ml-auto">
                         {/* Quick Run Button */}
                         <button 
                            onClick={handleRunLast}
                            disabled={isRunningLast}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm shadow-md transition-all
                                ${isRunningLast 
                                    ? 'bg-gray-100 text-gray-500 cursor-wait' 
                                    : 'bg-green-600 hover:bg-green-500 text-white hover:shadow-lg active:scale-95'
                                }
                            `}
                            title="Ejecutar última plantilla"
                         >
                             {isRunningLast ? (
                                 <>
                                    <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                                    <span>Ejecutando...</span>
                                 </>
                             ) : (
                                 <>
                                    <span className="material-symbols-outlined text-[20px] fill-1">play_arrow</span>
                                    <span className="hidden sm:inline">Ejecutar Última</span>
                                 </>
                             )}
                         </button>

                         {/* Divider */}
                         <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

                         {/* Settings Gear */}
                         <Link to="/settings" className="size-10 rounded-full bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors">
                            <span className="material-symbols-outlined text-[22px]">settings</span>
                         </Link>

                         {/* Profile */}
                         <Link to="/settings" className="size-9 rounded-full bg-cover bg-center border-2 border-[#f0f4f2] dark:border-[#2a4533]" style={{backgroundImage: 'url("https://i.pravatar.cc/150?u=alex")'}}></Link>
                    </div>
                </header>
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-[1200px] mx-auto space-y-8">
                        {/* Page Heading */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Tu impacto este mes</h1>
                                <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium">¡Gran trabajo! Estás superando tus objetivos de eficiencia.</p>
                            </div>
                        </div>
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                            <div className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-[#f0f4f2] dark:border-[#2a4533] hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                        <span className="material-symbols-outlined">schedule</span>
                                    </div>
                                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                        +15%
                                    </span>
                                </div>
                                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium">Horas ahorradas</p>
                                <h3 className="text-4xl font-black tracking-tight mt-1 mb-2">42.5 h</h3>
                            </div>
                            <div className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-[#f0f4f2] dark:border-[#2a4533] hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                        <span className="material-symbols-outlined">savings</span>
                                    </div>
                                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                        +8%
                                    </span>
                                </div>
                                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium">Coste reducido</p>
                                <h3 className="text-4xl font-black tracking-tight mt-1 mb-2">$1,250</h3>
                            </div>
                             <div className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-[#f0f4f2] dark:border-[#2a4533] hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                        <span className="material-symbols-outlined">check_circle</span>
                                    </div>
                                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                        +22%
                                    </span>
                                </div>
                                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium">Tareas completadas</p>
                                <h3 className="text-4xl font-black tracking-tight mt-1 mb-2">843</h3>
                            </div>
                        </div>

                         {/* AI Suggestions */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                                <h2 className="text-xl font-bold">Sugerencias de Optimización con IA</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Link to="/checklist" className="group bg-gradient-to-br from-white to-[#f0f4f2] dark:from-card-dark dark:to-[#152a1e] rounded-2xl p-6 shadow-sm border border-[#f0f4f2] dark:border-[#2a4533] hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-primary text-[32px]">arrow_outward</span>
                                    </div>
                                    <div className="flex flex-col h-full justify-between gap-4">
                                        <div>
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold mb-3">
                                                <span className="material-symbols-outlined text-[14px]">mail</span>
                                                Email Intelligence
                                            </div>
                                            <h3 className="text-lg font-bold mb-2">Automatiza Reportes en Excel</h3>
                                            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Detectamos que pasas 3h semanales exportando datos manualmente.</p>
                                        </div>
                                    </div>
                                </Link>
                                <Link to="/checklist" className="group bg-gradient-to-br from-white to-[#f0f4f2] dark:from-card-dark dark:to-[#152a1e] rounded-2xl p-6 shadow-sm border border-[#f0f4f2] dark:border-[#2a4533] hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden">
                                     <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-primary text-[32px]">arrow_outward</span>
                                    </div>
                                    <div className="flex flex-col h-full justify-between gap-4">
                                        <div>
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-bold mb-3">
                                                <span className="material-symbols-outlined text-[14px]">hub</span>
                                                Connectors
                                            </div>
                                            <h3 className="text-lg font-bold mb-2">Sincroniza Slack y Trello</h3>
                                            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Crea tareas automáticamente desde mensajes destacados.</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};