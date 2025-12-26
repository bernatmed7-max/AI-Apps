import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileMenu } from './MobileMenu';
import { Link, useNavigate } from 'react-router-dom';

export const AutomationDetails = () => {
    const navigate = useNavigate();
    const [isRunning, setIsRunning] = useState(false);

    const handleRun = () => {
        setIsRunning(true);
        
        // Simular ejecución
        setTimeout(() => {
            setIsRunning(false);
            
            // Simular un Error Crítico para demostrar la funcionalidad IA
            const hasError = true; 

            if (hasError) {
                // Redirigir a Diagnóstico con el contexto de esta plantilla
                navigate('/diagnose', { 
                    state: { 
                        // En un caso real, pasaríamos el ID real de la plantilla
                        workflowId: 'w1', 
                        autoAnalyze: true,
                        errorMessage: "Error Crítico: El nodo 'Google Sheets' devolvió 401 Unauthorized."
                    } 
                });
            } else {
                alert("Ejecución completada con éxito.");
            }
        }, 2000);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display">
            <Sidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 md:px-8 bg-white dark:bg-card-dark border-b border-[#f0f4f2] dark:border-[#2a4533] shrink-0">
                     <div className="flex items-center gap-2">
                         <MobileMenu />
                         <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                             <span>Automations</span>
                             <span className="material-symbols-outlined text-xs">chevron_right</span>
                             <span>Finance</span>
                             <span className="material-symbols-outlined text-xs">chevron_right</span>
                             <span className="font-bold text-gray-900 dark:text-white">Procesamiento de Facturas - Q3</span>
                         </div>
                         <div className="md:hidden font-bold text-gray-900 dark:text-white truncate max-w-[200px]">Procesamiento de Facturas - Q3</div>
                     </div>
                     <div className="flex items-center gap-4">
                         <button className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined">notifications</span></button>
                         <div className="size-8 rounded-full bg-orange-200"></div>
                     </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">Procesamiento de Facturas - Q3</h1>
                                <div className="flex items-center gap-3">
                                    <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-bold flex items-center gap-1">
                                        <div className="size-1.5 rounded-full bg-green-600"></div> Active
                                    </span>
                                    <span className="text-sm text-gray-500">• Last run: 5 mins ago</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                <button 
                                    onClick={() => navigate('/editor')}
                                    className="flex-1 md:flex-none px-4 py-2 rounded-full bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 hover:text-primary transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">edit</span> Edit
                                </button>
                                
                                {/* Botón Tuerca -> Settings */}
                                <Link to="/settings" className="flex-1 md:flex-none px-4 py-2 rounded-full bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 text-gray-700 dark:text-gray-200">
                                    <span className="material-symbols-outlined text-[18px]">settings</span>
                                </Link>

                                {/* Botón Run */}
                                <button 
                                    onClick={handleRun}
                                    disabled={isRunning}
                                    className="flex-1 md:flex-none px-5 py-2 rounded-full bg-[#111813] hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isRunning ? (
                                        <>
                                            <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            Running...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[18px]">play_arrow</span> Run
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Stats Column */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* KPIs */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-gray-500 text-sm font-medium">Success Rate</span>
                                            <span className="material-symbols-outlined text-primary">check_circle</span>
                                        </div>
                                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">92%</h3>
                                        <div className="w-full bg-gray-100 h-1 rounded-full mt-2"><div className="bg-primary w-[92%] h-1 rounded-full"></div></div>
                                        <span className="text-xs text-green-600 font-bold mt-2 block">+4% vs last week</span>
                                    </div>
                                    <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-gray-500 text-sm font-medium">Total Runs</span>
                                            <span className="material-symbols-outlined text-gray-400">history</span>
                                        </div>
                                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">1,248</h3>
                                         <div className="h-4 w-full mt-2">
                                            <svg viewBox="0 0 100 20" className="w-full h-full text-blue-300 fill-none stroke-current stroke-2"><path d="M0 15 Q 10 5 20 10 T 40 10 T 60 5 T 80 12 T 100 8" /></svg>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-gray-500 text-sm font-medium">Errors (7d)</span>
                                            <span className="material-symbols-outlined text-red-500">warning</span>
                                        </div>
                                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">3</h3>
                                        <span className="text-xs text-red-500 font-bold mt-2 block">Needs Attention</span>
                                        <div className="w-full bg-red-100 h-1 rounded-full mt-2"><div className="bg-red-500 w-[15%] h-1 rounded-full"></div></div>
                                    </div>
                                </div>

                                {/* AI Insights */}
                                <div className="bg-[#effcf6] dark:bg-[#0f291e] border border-[#d6f5e6] dark:border-[#1a4030] rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="material-symbols-outlined text-primary">auto_awesome</span>
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Estadísticas y Sugerencias de IA</h3>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start">
                                            <div className="size-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 text-red-600">
                                                <span className="material-symbols-outlined">link_off</span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">Conexión API Interrumpida</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Esta automatización falló 3 veces. El nodo "Google Sheets" reportó error 401. Revisa tus credenciales.</p>
                                            </div>
                                            <button className="px-3 py-1.5 bg-white dark:bg-transparent border border-red-200 dark:border-red-800 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 w-full sm:w-auto">Fix Connection</button>
                                        </div>

                                        <div className="bg-white dark:bg-[#15231b] border border-gray-100 dark:border-[#1f3627] rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start">
                                            <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-blue-600">
                                                <span className="material-symbols-outlined">speed</span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">Oportunidad de Optimización</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">El paso "Generar PDF" tarda 5s en promedio. Sugerimos ejecutarlo en segundo plano.</p>
                                            </div>
                                            <button className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover shadow-sm w-full sm:w-auto">Optimize</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Executions */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-lg">Recent Executions</h3>
                                        <button className="text-primary text-sm font-bold">View All Logs</button>
                                    </div>
                                    <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden overflow-x-auto">
                                        <table className="w-full text-sm text-left min-w-[600px]">
                                            <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 font-medium border-b border-gray-100 dark:border-gray-800">
                                                <tr>
                                                    <th className="p-4 pl-6">STATUS</th>
                                                    <th className="p-4">RUN ID / TRIGGER</th>
                                                    <th className="p-4">DURATION</th>
                                                    <th className="p-4">TIME</th>
                                                    <th className="p-4">ACTION</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                                <tr>
                                                    <td className="p-4 pl-6"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold flex w-fit gap-1 items-center"><span className="material-symbols-outlined text-[14px]">check</span> Success</span></td>
                                                    <td className="p-4">
                                                        <div className="font-bold">#Run-8392</div>
                                                        <div className="text-xs text-gray-500">New Invoice (Gmail)</div>
                                                    </td>
                                                    <td className="p-4">1.2s</td>
                                                    <td className="p-4">Today, 10:24 AM</td>
                                                    <td className="p-4"><button className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined">visibility</span></button></td>
                                                </tr>
                                                <tr>
                                                    <td className="p-4 pl-6"><span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold flex w-fit gap-1 items-center"><span className="material-symbols-outlined text-[14px]">close</span> Failed</span></td>
                                                    <td className="p-4">
                                                        <div className="font-bold">#Run-8391</div>
                                                        <div className="text-xs text-gray-500">New Invoice (Gmail)</div>
                                                    </td>
                                                    <td className="p-4">0.4s</td>
                                                    <td className="p-4">Today, 09:15 AM</td>
                                                    <td className="p-4"><button className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined">visibility</span></button></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Right */}
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-card-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                                    <h3 className="font-bold mb-4">Workflow Steps</h3>
                                    <div className="space-y-0 relative">
                                        <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-gray-100 dark:bg-gray-700"></div>
                                        {[
                                            { icon: 'mail', name: 'New Invoice', sub: 'Gmail • Trigger', color: 'bg-blue-100 text-blue-600' },
                                            { icon: 'smart_toy', name: 'Extract Details', sub: 'AI Parser', color: 'bg-purple-100 text-purple-600' },
                                            { icon: 'table_chart', name: 'Add Row', sub: 'Google Sheets • Error', color: 'bg-red-100 text-red-600', error: true },
                                            { icon: 'send', name: 'Notify Team', sub: 'Slack', color: 'bg-gray-100 text-gray-600' }
                                        ].map((step, i) => (
                                            <div key={i} className="flex items-center gap-4 relative z-10 py-2">
                                                <div className={`size-10 rounded-full flex items-center justify-center shrink-0 border-4 border-white dark:border-card-dark ${step.color}`}>
                                                    <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className={`font-bold text-sm ${step.error ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>{step.name}</div>
                                                    <div className="text-xs text-gray-500">{step.sub}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => navigate('/editor')} className="w-full mt-6 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 hover:text-primary transition-colors">Edit Visual Flow</button>
                                </div>

                                <div className="bg-white dark:bg-card-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                                    <h3 className="font-bold mb-4">Connected Apps</h3>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-xs font-bold flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-red-500">mail</span> Gmail</span>
                                        <span className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-xs font-bold flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-green-500">table_view</span> Sheets</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};