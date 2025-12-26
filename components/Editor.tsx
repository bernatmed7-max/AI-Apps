import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { MobileMenu } from './MobileMenu';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { APPS_DB, CORE_NODES, templateService } from '../services/templateService';

// Types
interface Node {
    id: string;
    type: 'trigger' | 'action' | 'helper';
    x: number;
    y: number;
    data: { name: string; icon: string; color: string; bg: string; config?: any };
    status?: 'idle' | 'running' | 'success' | 'error';
}

interface Edge {
    id: string;
    source: string;
    target: string;
}

export const Editor = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Workflow State Identification
    const [workflowId, setWorkflowId] = useState<string | null>(null);

    // Canvas State
    const [view, setView] = useState({ x: 0, y: 0, k: 1 }); // Pan & Zoom
    const [isPanning, setIsPanning] = useState(false);
    const [startPan, setStartPan] = useState({ x: 0, y: 0 });
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 }); // World coordinates
    
    // Node Palette State
    const [activeTab, setActiveTab] = useState<'triggers' | 'actions'>('triggers');
    const [searchQuery, setSearchQuery] = useState('');

    // Workflow State
    const [nodes, setNodes] = useState<Node[]>([
        { id: '1', type: 'trigger', x: 250, y: 300, data: APPS_DB.gmail, status: 'idle' },
        { id: '2', type: 'action', x: 600, y: 300, data: APPS_DB.openai, status: 'idle' },
    ]);
    const [edges, setEdges] = useState<Edge[]>([
        { id: 'e1-2', source: '1', target: '2' },
    ]);

    // Interaction State
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null); // For Property Panel
    const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null); // For Moving
    const [connectingSourceId, setConnectingSourceId] = useState<string | null>(null); // For Wiring
    
    // UI State
    const [isRunning, setIsRunning] = useState(false);
    const [workflowName, setWorkflowName] = useState("Nuevo Flujo");
    const [selectedFolderId, setSelectedFolderId] = useState<string>('');
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Modals State
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showAppModal, setShowAppModal] = useState(false); // "Implementar App"
    const [showKeysModal, setShowKeysModal] = useState(false); // API Keys
    const [showShareModal, setShowShareModal] = useState(false); // Share
    const [showGithubModal, setShowGithubModal] = useState(false); // Github

    // New Drag Creation State (From Sidebar)
    const [isDraggingNew, setIsDraggingNew] = useState(false);
    const [draggedNewNodeData, setDraggedNewNodeData] = useState<any>(null);

    const canvasRef = useRef<HTMLDivElement>(null);

    // --- Data Preparation ---
    const getFilteredNodes = (type: 'triggers' | 'actions') => {
        const query = searchQuery.toLowerCase();
        let categories: Record<string, any[]> = {};

        if (type === 'triggers') {
            categories['Core Triggers'] = Object.values(CORE_NODES).filter(n => n.type === 'trigger');
            categories['Integraciones'] = Object.values(APPS_DB); 
        } else {
            categories['Lógica'] = Object.values(CORE_NODES).filter(n => n.category === 'Lógica');
            categories['Helpers'] = Object.values(CORE_NODES).filter(n => n.category === 'Helpers');
            categories['Integraciones'] = Object.values(APPS_DB); 
        }

        if (query) {
            Object.keys(categories).forEach(key => {
                categories[key] = categories[key].filter(n => n.name.toLowerCase().includes(query));
                if (categories[key].length === 0) delete categories[key];
            });
        }

        return categories;
    };

    const nodeCategories = getFilteredNodes(activeTab);

    // --- Interaction Handlers ---

    // 1. Canvas Panning & Global Mouse Move
    const handleMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.node-element') || (e.target as HTMLElement).closest('.node-handle')) return;
        setIsPanning(true);
        setStartPan({ x: e.clientX - view.x, y: e.clientY - view.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const worldX = (e.clientX - view.x) / view.k;
        const worldY = (e.clientY - view.y) / view.k;
        setCursorPos({ x: worldX, y: worldY });

        if (isPanning) {
            setView({ ...view, x: e.clientX - startPan.x, y: e.clientY - startPan.y });
        } else if (draggedNodeId) {
            setNodes(prev => prev.map(n => {
                if (n.id === draggedNodeId) {
                    return { ...n, x: worldX - 100, y: worldY - 40 };
                }
                return n;
            }));
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        setIsPanning(false);
        setDraggedNodeId(null);
        
        if (connectingSourceId) {
            const targetElement = document.elementFromPoint(e.clientX, e.clientY);
            const targetNodeEl = targetElement?.closest('.node-element');
            if (targetNodeEl) {
                const targetId = targetNodeEl.getAttribute('data-id');
                if (targetId && targetId !== connectingSourceId) {
                    const exists = edges.find(ed => ed.source === connectingSourceId && ed.target === targetId);
                    if (!exists) {
                        setEdges(prev => [...prev, {
                            id: `e${connectingSourceId}-${targetId}-${Date.now()}`,
                            source: connectingSourceId,
                            target: targetId
                        }]);
                    }
                }
            }
            setConnectingSourceId(null);
        }

        if (isDraggingNew && draggedNewNodeData) {
            const newNode: Node = {
                id: `node-${Date.now()}`,
                type: activeTab === 'triggers' ? 'trigger' : 'action',
                x: (e.clientX - view.x) / view.k - 100,
                y: (e.clientY - view.y) / view.k - 40,
                data: draggedNewNodeData,
                status: 'idle'
            };
            setNodes(prev => [...prev, newNode]);
            setIsDraggingNew(false);
            setDraggedNewNodeData(null);
        }
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const zoomSensitivity = 0.001;
            const newK = Math.min(Math.max(0.2, view.k - e.deltaY * zoomSensitivity), 3);
            setView(prev => ({ ...prev, k: newK }));
        }
    };

    // 2. Node Interactions
    const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDraggedNodeId(id);
    };

    const handleNodeDoubleClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setSelectedNodeId(id);
    };

    // 3. Wiring Interactions
    const handleHandleMouseDown = (e: React.MouseEvent, nodeId: string) => {
        e.stopPropagation();
        e.preventDefault();
        setConnectingSourceId(nodeId);
    };

    // 4. Palette Drag Handlers
    const handlePaletteDragStart = (e: React.DragEvent, nodeData: any) => {
        e.dataTransfer.setData('application/json', JSON.stringify(nodeData));
        e.dataTransfer.effectAllowed = 'copy';
    };

    const handleCanvasDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleCanvasDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const dataStr = e.dataTransfer.getData('application/json');
        if (dataStr) {
            const nodeData = JSON.parse(dataStr);
            const newNode: Node = {
                id: `node-${Date.now()}`,
                type: activeTab === 'triggers' ? 'trigger' : 'action',
                x: (e.clientX - view.x) / view.k - 100,
                y: (e.clientY - view.y) / view.k - 40,
                data: nodeData,
                status: 'idle'
            };
            setNodes(prev => [...prev, newNode]);
        }
    };

    // --- Logic & Features ---

    const runTest = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setToastMessage("Iniciando ejecución de prueba...");
        setNodes(prev => prev.map(n => ({ ...n, status: 'idle' })));
        
        const startNodes = nodes.filter(n => n.type === 'trigger');
        
        for (const startNode of startNodes) {
            let currentId: string | undefined = startNode.id;
            
            while(currentId) {
                const nid = currentId;
                setNodes(prev => prev.map(n => n.id === nid ? { ...n, status: 'running' } : n));
                await new Promise(r => setTimeout(r, 600));

                const nextEdge = edges.find(e => e.source === nid);
                
                if (!nextEdge) {
                     // Simulate Error on last node for Demo
                     setNodes(prev => prev.map(n => n.id === nid ? { ...n, status: 'error' } : n));
                     setIsRunning(false);
                     setToastMessage("Error en la ejecución.");
                     setShowErrorModal(true); 
                     return; 
                }

                setNodes(prev => prev.map(n => n.id === nid ? { ...n, status: 'success' } : n));
                await new Promise(r => setTimeout(r, 200));
                currentId = nextEdge.target;
            }
        }

        setIsRunning(false);
        setToastMessage("¡Ejecución completada con éxito!");
        setTimeout(() => setToastMessage(null), 3000);
    };

    // --- NEW FEATURES IMPLEMENTATION ---

    const handleSave = () => {
        const apps = nodes.map(n => n.data).filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);
        const savedWorkflow = templateService.saveUserWorkflow({
            id: workflowId || undefined,
            title: workflowName,
            folderId: selectedFolderId || null,
            nodes,
            edges,
            status: 'Active',
            apps
        });
        setWorkflowId(savedWorkflow.id);
        setShowSaveModal(false);
        setToastMessage(workflowId ? "Plantilla actualizada correctamente" : "Plantilla creada correctamente");
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleExportJSON = () => {
        const data = {
            title: workflowName,
            version: '1.0',
            exportedAt: new Date(),
            nodes: nodes,
            edges: edges
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${workflowName.replace(/\s+/g, '_')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setToastMessage("Archivo JSON exportado");
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleGithubPush = () => {
        // Mock GitHub Push
        setTimeout(() => {
            setShowGithubModal(false);
            setToastMessage("¡Push a GitHub exitoso! (main branch)");
            setTimeout(() => setToastMessage(null), 3000);
        }, 1500);
    };

    const handleAddAppNode = (appData: any) => {
        const newNode: Node = {
            id: `node-${Date.now()}`,
            type: 'action',
            // Place in center of view
            x: (300 - view.x) / view.k, 
            y: (300 - view.y) / view.k,
            data: appData,
            status: 'idle'
        };
        setNodes(prev => [...prev, newNode]);
        setShowAppModal(false);
        setToastMessage(`Nodo ${appData.name} añadido`);
        setTimeout(() => setToastMessage(null), 2000);
    };

    const handleDiagnoseRedirect = () => {
        navigate('/diagnose', { 
            state: { 
                workflowId: workflowId || 'w1', 
                autoAnalyze: true,
                errorMessage: "Error de Ejecución: Timeout en el último nodo."
            } 
        });
    };

    const getBezierPath = (sx: number, sy: number, tx: number, ty: number) => {
        const dist = Math.abs(sx - tx);
        const c1x = sx + dist * 0.4;
        const c2x = tx - dist * 0.4;
        return `M ${sx} ${sy} C ${c1x} ${sy}, ${c2x} ${ty}, ${tx} ${ty}`;
    };

    const selectedNode = nodes.find(n => n.id === selectedNodeId);

    // Filter used apps for API Keys Modal
    const usedApps = nodes.map(n => n.data).filter((v, i, a) => a.findIndex(t => t.name === v.name) === i && v.name !== 'Switch' && v.name !== 'Merge' && v.name !== 'Wait');

    return (
        <div className="flex h-screen overflow-hidden bg-[#111] font-display text-white select-none">
            {/* Extended Sidebar (Library) */}
            <div className="w-72 flex flex-col bg-[#1a1a1a] border-r border-[#333] z-20 shadow-xl hidden md:flex">
                {/* Header */}
                <div className="p-4 border-b border-[#333] flex items-center gap-3">
                    <Link to="/my-templates" className="size-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-gray-400 text-lg">arrow_back</span>
                    </Link>
                    <span className="font-bold text-sm">Biblioteca de Nodos</span>
                </div>

                {/* Search */}
                <div className="p-4 pb-2">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-500 text-lg">search</span>
                        <input 
                            type="text" 
                            placeholder="Buscar nodos..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#111] border border-[#333] rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary placeholder-gray-600"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex px-4 gap-2 mb-2">
                    <button 
                        onClick={() => setActiveTab('triggers')}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'triggers' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        Triggers
                    </button>
                    <button 
                        onClick={() => setActiveTab('actions')}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'actions' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        Acciones
                    </button>
                </div>

                {/* Node List */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {Object.entries(nodeCategories).map(([category, items]) => (
                        <div key={category} className="mb-6">
                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 pl-1">{category}</h4>
                            <div className="space-y-2">
                                {items.map((node: any, i: number) => (
                                    <div 
                                        key={i} 
                                        draggable
                                        onDragStart={(e) => handlePaletteDragStart(e, node)}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#252525] cursor-grab active:cursor-grabbing border border-transparent hover:border-[#333] transition-all group"
                                    >
                                        <div className={`size-8 rounded-lg ${node.bg} flex items-center justify-center shrink-0`}>
                                            <span className={`material-symbols-outlined text-[18px] ${node.color}`}>{node.icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-200 group-hover:text-white truncate">{node.name}</div>
                                            <div className="text-[10px] text-gray-600 group-hover:text-gray-500">{activeTab === 'triggers' ? 'Starts flow' : 'Action step'}</div>
                                        </div>
                                        <span className="material-symbols-outlined text-gray-600 opacity-0 group-hover:opacity-100 text-sm">drag_indicator</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                {/* Top Bar / Header */}
                <header className="h-14 bg-[#1a1a1a] border-b border-[#333] flex items-center justify-between px-6 z-20">
                    <div className="flex items-center gap-4">
                        <MobileMenu />
                        <div className="flex flex-col">
                            <input 
                                value={workflowName} 
                                onChange={(e) => setWorkflowName(e.target.value)}
                                className="bg-transparent border-none text-sm font-bold text-white focus:ring-0 p-0 hover:underline cursor-text w-40 md:w-auto"
                            />
                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                <span className={`size-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
                                {isRunning ? 'Ejecutando...' : (workflowId ? 'Guardado' : 'Borrador Nuevo')}
                            </span>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <button onClick={() => setShowAppModal(true)} title="Implementar App / Nodo" className="p-2 text-gray-400 hover:text-white hover:bg-[#333] rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[20px]">add_box</span>
                        </button>
                        <div className="h-4 w-px bg-[#333] mx-1"></div>
                        
                        <button onClick={handleExportJSON} title="Exportar JSON" className="p-2 text-gray-400 hover:text-white hover:bg-[#333] rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[20px]">download</span>
                        </button>
                        <button onClick={() => setShowGithubModal(true)} title="Guardar en GitHub" className="p-2 text-gray-400 hover:text-white hover:bg-[#333] rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[20px]">code</span>
                        </button>
                        <button onClick={() => setShowShareModal(true)} title="Compartir" className="p-2 text-gray-400 hover:text-white hover:bg-[#333] rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[20px]">share</span>
                        </button>
                         <button onClick={() => setShowKeysModal(true)} title="Gestión de API Keys" className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-[#333] rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[20px]">key</span>
                        </button>

                        <div className="h-4 w-px bg-[#333] mx-1"></div>

                        <button 
                            onClick={runTest}
                            disabled={isRunning}
                            className={`px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-2 transition-all ${isRunning ? 'bg-gray-700 text-gray-400' : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20'}`}
                        >
                            <span className="material-symbols-outlined text-[16px]">play_arrow</span> Run Once
                        </button>
                        <button 
                            onClick={() => setShowSaveModal(true)}
                            className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all"
                        >
                            <span className="material-symbols-outlined text-[16px]">save</span> Guardar
                        </button>
                    </div>
                </header>

                {/* Infinite Canvas */}
                <div 
                    ref={canvasRef}
                    className="flex-1 relative bg-[#0f0f0f] cursor-default overflow-hidden"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onWheel={handleWheel}
                    onDragOver={handleCanvasDragOver}
                    onDrop={handleCanvasDrop}
                >
                    {/* Grid Pattern */}
                    <div 
                        className="absolute inset-0 pointer-events-none opacity-20"
                        style={{
                            transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`,
                            backgroundImage: 'radial-gradient(#444 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                            width: '400%',
                            height: '400%',
                            left: '-150%',
                            top: '-150%'
                        }}
                    />

                    {/* Nodes Layer */}
                    <div 
                        className="absolute inset-0 origin-top-left"
                        style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})` }}
                    >
                        {/* Edges */}
                        <svg className="absolute overflow-visible top-0 left-0 w-full h-full pointer-events-none">
                            <defs>
                                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#666" />
                                </marker>
                            </defs>
                            {edges.map(edge => {
                                const source = nodes.find(n => n.id === edge.source);
                                const target = nodes.find(n => n.id === edge.target);
                                if (!source || !target) return null;
                                return (
                                    <path 
                                        key={edge.id}
                                        d={getBezierPath(source.x + 200, source.y + 40, target.x, target.y + 40)}
                                        stroke="#666"
                                        strokeWidth="2"
                                        fill="none"
                                        markerEnd="url(#arrow)"
                                        className="transition-all duration-300"
                                    />
                                );
                            })}
                            
                            {connectingSourceId && (
                                <path 
                                    d={(() => {
                                        const source = nodes.find(n => n.id === connectingSourceId);
                                        if(!source) return '';
                                        return getBezierPath(source.x + 200, source.y + 40, cursorPos.x, cursorPos.y);
                                    })()}
                                    stroke="#3b82f6"
                                    strokeWidth="2"
                                    strokeDasharray="5,5"
                                    fill="none"
                                    markerEnd="url(#arrow)"
                                />
                            )}
                        </svg>

                        {/* Nodes */}
                        {nodes.map(node => (
                            <div
                                key={node.id}
                                data-id={node.id}
                                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                                onDoubleClick={(e) => handleNodeDoubleClick(e, node.id)}
                                className={`node-element absolute w-[200px] bg-[#222] rounded-2xl shadow-xl flex flex-col transition-shadow duration-200 group
                                    ${selectedNodeId === node.id ? 'ring-2 ring-primary shadow-primary/20' : 'border border-[#333] hover:border-gray-500'}
                                    ${node.status === 'running' ? 'ring-2 ring-yellow-500 shadow-yellow-500/20' : ''}
                                    ${node.status === 'success' ? 'ring-2 ring-green-500 shadow-green-500/20' : ''}
                                    ${node.status === 'error' ? 'ring-2 ring-red-500 shadow-red-500/20' : ''}
                                    ${connectingSourceId && connectingSourceId !== node.id ? 'hover:ring-2 hover:ring-blue-500 hover:shadow-blue-500/20 cursor-copy' : 'cursor-move'}
                                `}
                                style={{
                                    left: node.x,
                                    top: node.y,
                                    zIndex: selectedNodeId === node.id ? 50 : 10
                                }}
                            >
                                <div className="p-3 flex items-center gap-3 border-b border-[#333]">
                                    <div className={`size-8 rounded-lg ${node.data.bg} flex items-center justify-center shrink-0`}>
                                        <span className={`material-symbols-outlined text-[18px] ${node.data.color}`}>{node.data.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{node.type}</div>
                                        <div className="font-bold text-xs text-white truncate">{node.data.name}</div>
                                    </div>
                                    {node.status === 'running' && <span className="material-symbols-outlined text-yellow-500 text-sm animate-spin">sync</span>}
                                    {node.status === 'success' && <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>}
                                    {node.status === 'error' && <span className="material-symbols-outlined text-red-500 text-sm">error</span>}
                                </div>
                                <div className="p-2 bg-[#1a1a1a] rounded-b-2xl pointer-events-none">
                                    <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono px-1">
                                        <span>ID: {node.id}</span>
                                        <span>v1.0</span>
                                    </div>
                                </div>
                                {node.type !== 'trigger' && (
                                    <div className="node-handle absolute top-10 -left-1.5 size-3 bg-[#555] rounded-full border border-[#222] transition-colors"></div>
                                )}
                                <div 
                                    className="node-handle absolute top-10 -right-1.5 size-3 bg-[#555] rounded-full border border-[#222] hover:bg-primary transition-colors cursor-crosshair hover:scale-125 z-50"
                                    onMouseDown={(e) => handleHandleMouseDown(e, node.id)}
                                ></div>
                            </div>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-30">
                        <button onClick={() => setView(v => ({...v, k: Math.min(v.k + 0.2, 3)}))} className="size-10 bg-[#222] rounded-lg border border-[#333] hover:bg-[#333] text-white flex items-center justify-center">
                            <span className="material-symbols-outlined">add</span>
                        </button>
                        <button onClick={() => setView(v => ({...v, k: Math.max(v.k - 0.2, 0.2)}))} className="size-10 bg-[#222] rounded-lg border border-[#333] hover:bg-[#333] text-white flex items-center justify-center">
                            <span className="material-symbols-outlined">remove</span>
                        </button>
                        <button onClick={() => setView({x:0, y:0, k:1})} className="size-10 bg-[#222] rounded-lg border border-[#333] hover:bg-[#333] text-white flex items-center justify-center">
                            <span className="material-symbols-outlined">center_focus_strong</span>
                        </button>
                    </div>

                    {/* Toast */}
                    {toastMessage && (
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-fade-in-up z-50 border border-gray-700">
                            <span className="material-symbols-outlined text-green-400">check_circle</span>
                            <span className="font-bold text-sm">{toastMessage}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Properties Panel (Right Sidebar) */}
            <div className={`w-80 bg-[#1a1a1a] border-l border-[#333] flex flex-col transition-all duration-300 transform ${selectedNodeId ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full'} z-30`}>
                {selectedNode ? (
                    <>
                        <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#222]">
                            <div className="flex items-center gap-3">
                                <div className={`size-6 rounded ${selectedNode.data.bg} flex items-center justify-center`}>
                                    <span className={`material-symbols-outlined text-xs ${selectedNode.data.color}`}>{selectedNode.data.icon}</span>
                                </div>
                                <span className="font-bold text-sm">{selectedNode.data.name}</span>
                            </div>
                            <button onClick={() => setSelectedNodeId(null)} className="text-gray-500 hover:text-white"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Etiqueta</label>
                                <input type="text" defaultValue={selectedNode.data.name} className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Autenticación</label>
                                <select className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary">
                                    <option>Mi cuenta de {selectedNode.data.name}</option>
                                    <option>+ Añadir Nueva Credencial</option>
                                </select>
                            </div>
                            <div className="p-3 bg-blue-900/20 border border-blue-900/40 rounded-lg">
                                <p className="text-xs text-blue-200">
                                    <span className="font-bold">Tip:</span> Mapea datos de nodos anteriores usando <code className="bg-black/30 px-1 rounded">{'{{...}}'}</code>.
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-600 p-8 text-center">
                        <span className="material-symbols-outlined text-4xl mb-4">touch_app</span>
                        <p className="text-sm">Haz clic en un nodo para editar sus propiedades.</p>
                    </div>
                )}
            </div>

            {/* MODALS */}

            {/* Save Modal */}
            {showSaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-md border border-[#333] shadow-2xl animate-fade-in-up">
                        <h3 className="text-xl font-bold text-white mb-4">Guardar Flujo</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nombre</label>
                                <input 
                                    type="text" 
                                    value={workflowName}
                                    onChange={e => setWorkflowName(e.target.value)}
                                    className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Carpeta</label>
                                <select 
                                    value={selectedFolderId}
                                    onChange={e => setSelectedFolderId(e.target.value)}
                                    className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white focus:ring-primary focus:border-primary"
                                >
                                    <option value="">Sin carpeta (Raíz)</option>
                                    {templateService.getFolders().map(f => (
                                        <option key={f.id} value={f.id}>{f.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <button onClick={() => setShowSaveModal(false)} className="px-4 py-2 text-gray-400 hover:text-white font-bold text-sm">Cancelar</button>
                            <button onClick={handleSave} className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold text-sm">
                                {workflowId ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* App Implementation Modal */}
            {showAppModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-2xl border border-[#333] shadow-2xl animate-fade-in-up h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Implementar App / Nodo</h3>
                            <button onClick={() => setShowAppModal(false)} className="text-gray-500 hover:text-white"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                            {/* Featured: HTTP Request */}
                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Utilidades</h4>
                                <div 
                                    onClick={() => handleAddAppNode(CORE_NODES.http)}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-[#222] hover:bg-[#2a2a2a] cursor-pointer border border-[#333] hover:border-primary transition-all group"
                                >
                                    <div className="size-12 rounded-lg bg-green-900/30 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-2xl">cloud_sync</span>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-white">HTTP Request</h5>
                                        <p className="text-xs text-gray-400">Conecta con cualquier API externa (REST, SOAP, GraphQL).</p>
                                    </div>
                                </div>
                            </div>

                            {/* App Grid */}
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Aplicaciones Integradas</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {Object.values(APPS_DB).map((app, i) => (
                                    <div 
                                        key={i}
                                        onClick={() => handleAddAppNode(app)}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-[#222] hover:bg-[#2a2a2a] cursor-pointer border border-transparent hover:border-[#444] transition-colors"
                                    >
                                        <div className={`size-8 rounded ${app.bg} flex items-center justify-center`}>
                                            <span className={`material-symbols-outlined text-[18px] ${app.color}`}>{app.icon}</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-300">{app.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* API Keys Modal */}
            {showKeysModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-lg border border-[#333] shadow-2xl animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Gestión de API Keys</h3>
                            <button onClick={() => setShowKeysModal(false)} className="text-gray-500 hover:text-white"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <p className="text-sm text-gray-400 mb-6">Configura las credenciales para los servicios utilizados en este flujo.</p>
                        
                        <div className="space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                            {usedApps.length === 0 && (
                                <div className="text-center py-8 text-gray-600 italic">No hay servicios externos en el lienzo.</div>
                            )}
                            {usedApps.map((app, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`size-5 rounded ${app.bg} flex items-center justify-center`}>
                                            <span className={`material-symbols-outlined text-[12px] ${app.color}`}>{app.icon}</span>
                                        </div>
                                        <label className="text-xs font-bold text-gray-300">{app.name} API Key</label>
                                    </div>
                                    <div className="relative">
                                        <input 
                                            type="password" 
                                            placeholder={`sk_...`}
                                            className="w-full bg-[#111] border border-[#333] rounded-lg pl-3 pr-10 py-2 text-sm text-white focus:ring-primary focus:border-primary"
                                        />
                                        <span className="material-symbols-outlined absolute right-3 top-2.5 text-gray-600 text-[18px]">vpn_key</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end mt-8">
                            <button onClick={() => { setShowKeysModal(false); setToastMessage("Keys guardadas (Simulado)"); setTimeout(()=>setToastMessage(null), 2000); }} className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold text-sm">
                                Guardar Credenciales
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-md border border-[#333] shadow-2xl animate-fade-in-up">
                        <h3 className="text-xl font-bold text-white mb-6">Compartir Plantilla</h3>
                        
                        <div className="space-y-4">
                            <button className="w-full py-3 bg-[#1DA1F2] hover:bg-opacity-90 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">flutter</span> Compartir en X (Twitter)
                            </button>
                            <button className="w-full py-3 bg-[#0077b5] hover:bg-opacity-90 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">work</span> Compartir en LinkedIn
                            </button>
                            <div className="relative mt-4">
                                <input readOnly value={`https://bautomatex.app/w/${workflowId || 'draft'}`} className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-gray-400 text-sm" />
                                <button className="absolute right-2 top-1.5 p-1.5 bg-[#333] hover:bg-[#444] rounded-md text-white transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button onClick={() => setShowShareModal(false)} className="text-sm font-bold text-gray-500 hover:text-white">Cerrar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* GitHub Modal */}
            {showGithubModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-md border border-[#333] shadow-2xl animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-3xl text-white">code</span>
                            <h3 className="text-xl font-bold text-white">Guardar en GitHub</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Repositorio</label>
                                <select className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white focus:ring-primary focus:border-primary">
                                    <option>alexmorgan/my-automations</option>
                                    <option>alexmorgan/work-scripts</option>
                                    <option>+ Nuevo Repositorio</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mensaje del Commit</label>
                                <input 
                                    type="text" 
                                    defaultValue={`Update ${workflowName}`}
                                    className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Rama (Branch)</label>
                                <input 
                                    type="text" 
                                    defaultValue="main"
                                    className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button onClick={() => setShowGithubModal(false)} className="px-4 py-2 text-gray-400 hover:text-white font-bold text-sm">Cancelar</button>
                            <button onClick={handleGithubPush} className="px-6 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg font-bold text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">upload</span> Push
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error / Diagnose Modal (Existing) */}
            {showErrorModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
                    <div className="bg-[#1a1a1a] p-8 rounded-3xl w-full max-w-sm border border-red-900/50 shadow-2xl animate-fade-in-up text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-red-900/10 pointer-events-none"></div>
                        <div className="size-16 bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-4xl">error</span>
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">Ejecución Fallida</h3>
                        <p className="text-gray-400 text-sm mb-6">Se ha detectado un error crítico en el último nodo. ¿Quieres que la IA analice y repare el flujo automáticamente?</p>
                        
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={handleDiagnoseRedirect}
                                className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
                            >
                                <span className="material-symbols-outlined">auto_fix_high</span>
                                Diagnosticar con IA
                            </button>
                            <button 
                                onClick={() => setShowErrorModal(false)}
                                className="w-full py-3 bg-transparent hover:bg-white/5 text-gray-500 hover:text-white rounded-xl font-bold text-sm transition-colors"
                            >
                                Ignorar por ahora
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};