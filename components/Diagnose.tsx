import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { MobileMenu } from './MobileMenu';
import { templateService, UserWorkflow } from '../services/templateService';
import { geminiService } from '../services/geminiService';
import { useNavigate, useLocation } from 'react-router-dom';

interface DiagnosisResponse {
    analysis: string;
    fixedWorkflow: { nodes: any[], edges: any[] } | null;
    predictedOutcome: string;
}

export const Diagnose = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // State
    const myWorkflows = templateService.getUserWorkflows();
    const [selectedWorkflow, setSelectedWorkflow] = useState<UserWorkflow | null>(myWorkflows[0] || null);
    
    // AI State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [diagnosisData, setDiagnosisData] = useState<DiagnosisResponse | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [incomingError, setIncomingError] = useState<string | null>(null);

    // Effect to handle incoming redirects (e.g. from Dashboard Error)
    useEffect(() => {
        if (location.state && location.state.workflowId) {
            const wf = myWorkflows.find(w => w.id === location.state.workflowId);
            if (wf) {
                setSelectedWorkflow(wf);
                if (location.state.errorMessage) {
                    setIncomingError(location.state.errorMessage);
                }
                if (location.state.autoAnalyze) {
                    // Slight delay to allow UI to mount before starting heavy AI op
                    setTimeout(() => {
                        handleDiagnose(wf, location.state.errorMessage);
                    }, 500);
                }
            }
        }
    }, [location.state]);

    // Helpers to visualize the graph (simple version)
    const getBezierPath = (sx: number, sy: number, tx: number, ty: number) => {
        const dist = Math.abs(sx - tx);
        const c1x = sx + dist * 0.4;
        const c2x = tx - dist * 0.4;
        return `M ${sx} ${sy} C ${c1x} ${sy}, ${c2x} ${ty}, ${tx} ${ty}`;
    };

    const handleDiagnose = async (workflowOverride?: UserWorkflow, errorContext?: string) => {
        const targetWf = workflowOverride || selectedWorkflow;
        if (!targetWf) return;

        setIsAnalyzing(true);
        setDiagnosisData(null);
        setShowPreview(false);
        try {
            // Pass the error context to the AI if it exists
            const wfWithContext = errorContext ? { ...targetWf, runtimeError: errorContext } : targetWf;
            
            const result = await geminiService.diagnoseWorkflow(wfWithContext);
            setDiagnosisData(result);
            // Automatically switch to preview if fix exists
            if (result.fixedWorkflow) {
                setShowPreview(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsAnalyzing(false);
            setIncomingError(null); // Clear error after analysis
        }
    };

    const handleApplyFix = () => {
        if (!selectedWorkflow || !diagnosisData?.fixedWorkflow) return;
        
        // Update the workflow in the service
        templateService.saveUserWorkflow({
            ...selectedWorkflow,
            nodes: diagnosisData.fixedWorkflow.nodes,
            edges: diagnosisData.fixedWorkflow.edges,
            title: `${selectedWorkflow.title} (Fixed)`,
            status: 'Active'
        });

        // Navigate to editor to see result
        navigate('/editor');
    };

    // Determine which nodes/edges to show
    const nodesToShow = (showPreview && diagnosisData?.fixedWorkflow) ? diagnosisData.fixedWorkflow.nodes : (selectedWorkflow?.nodes || []);
    const edgesToShow = (showPreview && diagnosisData?.fixedWorkflow) ? diagnosisData.fixedWorkflow.edges : (selectedWorkflow?.edges || []);

    // Parse Markdown-like structure simply for display
    const renderAnalysis = (text: string) => {
        if (!text) return null;
        const sections = text.split('#').filter(Boolean);
        return (
            <div className="space-y-6 animate-fade-in-up">
                {sections.map((sec, idx) => {
                    const [title, ...content] = sec.split('\n');
                    const body = content.join('\n').trim();
                    
                    // Specific styling for the "3 Options" section
                    if (title.toLowerCase().includes('alternativas')) {
                        const options = body.split('##').filter(Boolean);
                        return (
                            <div key={idx} className="space-y-4">
                                <h3 className="font-bold text-lg text-primary uppercase tracking-wide border-b border-primary/20 pb-2">{title.trim()}</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {options.map((opt, i) => {
                                        const [optTitle, ...optBody] = opt.split('\n');
                                        return (
                                            <div key={i} className="bg-white dark:bg-[#1a1f33] p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:border-primary/50 transition-colors">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className={`size-6 rounded-full flex items-center justify-center font-bold text-xs ${i===0 ? 'bg-green-100 text-green-700' : i===1 ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                                        {i + 1}
                                                    </div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{optTitle.trim()}</h4>
                                                </div>
                                                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{optBody.join('\n').trim()}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={idx}>
                            <h3 className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-2">{title.trim()}</h3>
                            <div className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                {body}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">
             <Sidebar />
             <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                 {/* Header */}
                 <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-card-dark border-b border-[#f0f4f2] dark:border-[#2a4533] shrink-0 z-20">
                     <div className="flex items-center gap-2 overflow-hidden">
                         <MobileMenu />
                         <div className="flex items-center gap-2 truncate">
                             <h2 className="font-bold text-sm text-gray-500 hidden sm:block">Conectores / </h2>
                             <span className="font-bold text-sm text-gray-900 dark:text-white truncate">Diagnóstico IA</span>
                         </div>
                     </div>
                 </header>

                 <div className="flex flex-1 overflow-hidden">
                     {/* Left Sidebar: Template List */}
                     <div className="w-80 bg-white dark:bg-card-dark border-r border-[#f0f4f2] dark:border-[#2a4533] flex flex-col z-10 hidden lg:flex">
                         <div className="p-6 border-b border-[#f0f4f2] dark:border-[#2a4533]">
                             <h3 className="font-bold mb-1">Mis Plantillas</h3>
                             <p className="text-xs text-gray-500">Selecciona un flujo para analizar</p>
                         </div>
                         <div className="flex-1 overflow-y-auto p-4 space-y-3">
                             {myWorkflows.length === 0 && (
                                 <div className="text-center py-10 text-gray-400 text-xs">No tienes flujos guardados.</div>
                             )}
                             {myWorkflows.map(wf => (
                                 <div 
                                    key={wf.id}
                                    onClick={() => { setSelectedWorkflow(wf); setDiagnosisData(null); setShowPreview(false); setIncomingError(null); }}
                                    className={`p-4 rounded-xl cursor-pointer border transition-all ${selectedWorkflow?.id === wf.id 
                                        ? 'bg-primary/5 border-primary shadow-sm' 
                                        : 'bg-white dark:bg-card-dark border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                 >
                                     <div className="flex justify-between items-start mb-2">
                                         <div className="font-bold text-sm truncate pr-2 dark:text-white">{wf.title}</div>
                                         <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${wf.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                             {wf.status}
                                         </span>
                                     </div>
                                     <div className="flex -space-x-1 mb-2">
                                         {wf.apps.map((app, i) => (
                                             <div key={i} className={`size-6 rounded-full border border-white dark:border-gray-800 ${app.bg} flex items-center justify-center`}>
                                                 <span className={`material-symbols-outlined text-[12px] ${app.color}`}>{app.icon}</span>
                                             </div>
                                         ))}
                                     </div>
                                     <div className="text-[10px] text-gray-400">
                                         {wf.nodes.length} nodos • Modificado: {new Date(wf.lastModified).toLocaleDateString()}
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>

                     {/* Main Canvas Area (Visual Context) */}
                     <div className="flex-1 bg-[#f8fafc] dark:bg-[#0f1323] relative bg-grid-pattern overflow-hidden flex flex-col">
                         
                         {/* Toggle & Status Bar */}
                         {diagnosisData?.fixedWorkflow && (
                             <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-1 bg-white dark:bg-card-dark p-1 rounded-full border border-gray-200 dark:border-gray-700 shadow-lg">
                                <button 
                                    onClick={() => setShowPreview(false)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!showPreview ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    Original
                                </button>
                                <button 
                                    onClick={() => setShowPreview(true)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${showPreview ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    <span className="material-symbols-outlined text-[14px]">auto_fix</span>
                                    Propuesta IA
                                </button>
                             </div>
                         )}

                         <div className="flex-1 relative flex items-center justify-center">
                             {selectedWorkflow ? (
                                 <div className="relative w-full h-full animate-fade-in">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {/* Visualize Nodes */}
                                        <div className="relative" style={{ width: '80%', height: '80%' }}>
                                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                                {edgesToShow.map((edge: any, i: number) => {
                                                    const source = nodesToShow.find((n: any) => n.id === edge.source);
                                                    const target = nodesToShow.find((n: any) => n.id === edge.target);
                                                    if(!source || !target) return null;
                                                    return (
                                                        <path 
                                                            key={i}
                                                            d={getBezierPath(source.x + 200, source.y + 40, target.x, target.y + 40)}
                                                            stroke={showPreview ? "#607AFB" : "#cbd5e1"}
                                                            strokeWidth={showPreview ? "3" : "2"}
                                                            fill="none"
                                                            strokeDasharray={showPreview ? "5,5" : "0"}
                                                            className={showPreview ? "animate-pulse" : ""}
                                                        />
                                                    );
                                                })}
                                            </svg>
                                            {nodesToShow.map((node: any) => (
                                                <div 
                                                    key={node.id}
                                                    className={`absolute w-[200px] bg-white dark:bg-card-dark rounded-xl shadow-md border p-3 flex items-center gap-3 transition-all duration-500
                                                        ${showPreview ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-gray-200 dark:border-gray-700'}
                                                    `}
                                                    style={{ left: node.x, top: node.y }}
                                                >
                                                    <div className={`size-8 rounded-lg ${node.data.bg} flex items-center justify-center`}>
                                                        <span className={`material-symbols-outlined ${node.data.color} text-sm`}>{node.data.icon}</span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-xs truncate dark:text-white">{node.data.name}</div>
                                                        <div className="text-[10px] text-gray-500 uppercase">{node.type}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Overlay Info */}
                                    <div className="absolute top-6 left-6 bg-white/80 dark:bg-black/50 backdrop-blur px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col gap-2">
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase font-bold">{showPreview ? 'Previsualización' : 'Visualizando'}</div>
                                            <div className="font-bold text-lg dark:text-white">{selectedWorkflow.title} {showPreview && '(Corregido)'}</div>
                                        </div>
                                        {incomingError && (
                                            <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded px-2 py-1 flex items-center gap-2 text-xs font-bold text-red-700 dark:text-red-400 animate-pulse">
                                                <span className="material-symbols-outlined text-[14px]">warning</span>
                                                {incomingError}
                                            </div>
                                        )}
                                    </div>
                                 </div>
                             ) : (
                                 <div className="text-center text-gray-400">
                                     <span className="material-symbols-outlined text-4xl mb-2">hub</span>
                                     <p>Selecciona un flujo para visualizar</p>
                                 </div>
                             )}
                         </div>

                         {/* Result Simulation Panel */}
                         {showPreview && diagnosisData?.predictedOutcome && (
                             <div className="h-48 bg-white dark:bg-card-dark border-t border-gray-200 dark:border-gray-800 p-6 flex flex-col z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-slide-up">
                                 <div className="flex items-center gap-2 mb-2 text-primary font-bold text-sm uppercase tracking-wider">
                                     <span className="material-symbols-outlined text-base">play_circle</span> Resultado Simulado
                                 </div>
                                 <div className="flex-1 bg-gray-50 dark:bg-[#111] rounded-lg p-4 font-mono text-sm text-gray-700 dark:text-gray-300 overflow-y-auto border border-gray-100 dark:border-gray-700">
                                     {diagnosisData.predictedOutcome}
                                 </div>
                             </div>
                         )}
                     </div>

                     {/* Right AI Panel */}
                     <div className="w-[450px] bg-white dark:bg-card-dark border-l border-[#f0f4f2] dark:border-[#2a4533] flex flex-col z-20 shadow-2xl absolute right-0 inset-y-0">
                         <div className="p-6 border-b border-[#f0f4f2] dark:border-[#2a4533] flex justify-between items-center bg-white dark:bg-card-dark z-10">
                             <div className="flex items-center gap-2 text-primary font-bold text-lg">
                                 <span className="material-symbols-outlined">auto_awesome</span> Diagnóstico IA
                             </div>
                             {isAnalyzing && (
                                 <div className="flex items-center gap-2 text-xs text-primary font-bold animate-pulse">
                                     <span className="size-2 bg-primary rounded-full"></span> Analizando...
                                 </div>
                             )}
                         </div>
                         
                         <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-gray-50/50 dark:bg-[#0f1323]/50">
                             {!selectedWorkflow ? (
                                 <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
                                     <span className="material-symbols-outlined text-5xl mb-4 opacity-50">plumbing</span>
                                     <p className="max-w-[200px]">Selecciona una plantilla del menú izquierdo para comenzar el análisis.</p>
                                 </div>
                             ) : !diagnosisData && !isAnalyzing ? (
                                 <div className="flex flex-col items-center justify-center h-full space-y-6">
                                     <div className="text-center space-y-2">
                                         <div className={`size-16 rounded-full flex items-center justify-center mx-auto transition-colors ${incomingError ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>
                                             <span className="material-symbols-outlined text-3xl">{incomingError ? 'report_problem' : 'analytics'}</span>
                                         </div>
                                         <h3 className="text-xl font-bold text-gray-900 dark:text-white">{incomingError ? 'Error Detectado' : 'Listo para analizar'}</h3>
                                         <p className="text-sm text-gray-500 max-w-xs mx-auto">
                                             {incomingError 
                                                ? `Se detectó un fallo en la ejecución. La IA puede depurar "${selectedWorkflow.title}" automáticamente.`
                                                : `La IA revisará la lógica, seguridad y eficiencia de "${selectedWorkflow.title}".`
                                             }
                                         </p>
                                     </div>
                                     <button 
                                        onClick={() => handleDiagnose()}
                                        className={`w-full max-w-xs py-4 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 ${incomingError ? 'bg-red-600 hover:bg-red-500 shadow-red-500/20' : 'bg-primary hover:bg-primary-hover shadow-primary/25'}`}
                                     >
                                         <span className="material-symbols-outlined">{incomingError ? 'bug_report' : 'play_arrow'}</span> 
                                         {incomingError ? 'Reparar Error con IA' : 'Ejecutar Diagnóstico'}
                                     </button>
                                 </div>
                             ) : isAnalyzing ? (
                                 <div className="space-y-6 p-4">
                                     <div className="space-y-3">
                                         <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
                                         <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                                     </div>
                                     <div className="space-y-3">
                                         <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
                                         <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                                     </div>
                                 </div>
                             ) : (
                                 renderAnalysis(diagnosisData?.analysis || '')
                             )}
                         </div>

                         {diagnosisData && (
                             <div className="p-4 border-t border-[#f0f4f2] dark:border-[#2a4533] bg-white dark:bg-card-dark">
                                 <div className="flex gap-3">
                                     <button 
                                        onClick={() => { setDiagnosisData(null); setShowPreview(false); setIncomingError(null); }}
                                        className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                                     >
                                         Volver
                                     </button>
                                     {diagnosisData.fixedWorkflow && (
                                         <button 
                                            onClick={handleApplyFix}
                                            className="flex-1 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold text-sm shadow-md flex items-center justify-center gap-2"
                                         >
                                             <span className="material-symbols-outlined text-[18px]">check_circle</span> Aplicar Corrección
                                         </button>
                                     )}
                                 </div>
                             </div>
                         )}
                     </div>
                 </div>
             </main>
        </div>
    );
};