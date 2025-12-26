import React, { useState, useMemo } from 'react';
import { Sidebar } from './Sidebar';
import { MobileMenu } from './MobileMenu';
import { Link } from 'react-router-dom';
import { templateService, APPS_DB, CATEGORIES } from '../services/templateService';

export const Library = () => {
    // State
    const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [visibleCount, setVisibleCount] = useState<number>(24);
    const [filterTool, setFilterTool] = useState<string | null>(null);

    // Get templates from service
    const ALL_TEMPLATES = templateService.getAll();

    // Derived State
    const filteredTemplates = useMemo(() => {
        return ALL_TEMPLATES.filter(t => {
            const matchesCategory = selectedCategory === 'Todas' || t.category === selectedCategory || (selectedCategory === 'Tendencias' && t.isPopular) || (selectedCategory === 'Nuevas con IA' && t.isNew);
            const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTool = filterTool ? t.apps.some(a => a.name === filterTool) : true;
            return matchesCategory && matchesSearch && matchesTool;
        });
    }, [selectedCategory, searchQuery, filterTool, ALL_TEMPLATES]);

    const visibleTemplates = filteredTemplates.slice(0, visibleCount);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 24);
    };

    const handleUseTemplate = (title: string) => {
        alert(`¡Plantilla "${title}" copiada a tus flujos!`);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">
            <Sidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Navbar */}
                <header className="h-16 flex items-center justify-between px-6 md:px-8 bg-white dark:bg-card-dark border-b border-[#f0f4f2] dark:border-[#2a4533] shrink-0">
                    <div className="flex items-center gap-4">
                        <MobileMenu />
                        <nav className="hidden lg:flex gap-6 text-sm font-medium">
                            <Link to="/" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">Dashboard</Link>
                            <Link to="/details" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">Mis Flujos</Link>
                            <Link to="/library" className="text-primary font-bold border-b-2 border-primary pb-5 mt-5">Biblioteca</Link>
                            <Link to="/diagnose" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">Conexiones</Link>
                            <Link to="/settings" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">Configuración</Link>
                        </nav>
                        <h2 className="lg:hidden text-lg font-bold">Biblioteca</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="bg-primary text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-primary-hover shadow-sm whitespace-nowrap transition-transform active:scale-95">Crear Flujo</button>
                         <div className="size-8 rounded-full bg-gray-200 dark:bg-gray-700 hidden sm:block bg-cover" style={{backgroundImage: 'url("https://i.pravatar.cc/150?u=alex")'}}></div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
                    {/* Hero */}
                    <div className="bg-[#2d3e40] dark:bg-[#1a2e2b] text-white py-16 px-8 text-center relative overflow-hidden shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/50 to-slate-900/50"></div>
                        <div className="relative z-10 max-w-3xl mx-auto animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 border border-white/20 backdrop-blur-sm">
                                <span className="material-symbols-outlined text-sm text-yellow-300">auto_awesome</span> Potenciado por IA
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Biblioteca de Inspiración</h1>
                            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">Explora <span className="text-white font-bold">{ALL_TEMPLATES.length}+</span> automatizaciones listas para usar. Encuentra el flujo perfecto para tu negocio.</p>
                            
                            <div className="flex max-w-xl mx-auto bg-white dark:bg-[#252b3b] rounded-full p-1 shadow-2xl transition-all focus-within:ring-4 focus-within:ring-primary/30">
                                <div className="pl-4 flex items-center text-gray-400"><span className="material-symbols-outlined">search</span></div>
                                <input 
                                    type="text" 
                                    className="flex-1 border-none focus:ring-0 text-gray-900 dark:text-white bg-transparent placeholder-gray-400 px-4" 
                                    placeholder="Buscar plantillas (ej. 'Lead Scoring', 'Resumen Slack')" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-bold text-sm transition-colors">Buscar</button>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 flex gap-8">
                        {/* Sidebar Filters */}
                        <div className="w-64 shrink-0 hidden lg:block sticky top-8 h-fit max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar pr-2">
                            <div className="mb-6">
                                <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Categorías</h3>
                                <p className="text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">Explorar</p>
                            </div>
                            <div className="space-y-1 mb-8">
                                <button 
                                    onClick={() => setSelectedCategory('Todas')}
                                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${selectedCategory === 'Todas' ? 'bg-gray-100 dark:bg-white/10 text-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">grid_view</span> Todas
                                </button>
                                {CATEGORIES.map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${selectedCategory === cat ? 'bg-gray-100 dark:bg-white/10 text-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                    >
                                        <span className="material-symbols-outlined text-[18px]">folder</span> {cat}
                                    </button>
                                ))}
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Herramientas Populares</h3>
                                <div className="space-y-2">
                                    {Object.entries(APPS_DB).slice(0, 15).map(([key, app]) => (
                                        <label key={key} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer group hover:text-primary transition-colors">
                                            <input 
                                                type="checkbox" 
                                                checked={filterTool === app.name}
                                                onChange={() => setFilterTool(filterTool === app.name ? null : app.name)}
                                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <div className={`size-5 ${app.bg} rounded-full flex items-center justify-center`}>
                                                <span className={`material-symbols-outlined ${app.color} text-[12px]`}>{app.icon}</span>
                                            </div>
                                            {app.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="flex-1 min-w-0">
                            {/* Filter Pills */}
                            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                                <div className="flex gap-2 overflow-x-auto w-full pb-2 no-scrollbar">
                                    <button onClick={() => setSelectedCategory('Tendencias')} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 border transition-colors ${selectedCategory === 'Tendencias' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200' : 'bg-white dark:bg-card-dark border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'}`}>
                                        <span className="material-symbols-outlined text-[16px]">trending_up</span> Tendencias
                                    </button>
                                    <button onClick={() => setSelectedCategory('Nuevas con IA')} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 border transition-colors ${selectedCategory === 'Nuevas con IA' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200' : 'bg-white dark:bg-card-dark border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'}`}>
                                        <span className="material-symbols-outlined text-[16px]">auto_awesome</span> Nuevas con IA
                                    </button>
                                    {filterTool && (
                                         <button onClick={() => setFilterTool(null)} className="whitespace-nowrap px-4 py-1.5 bg-gray-800 text-white rounded-full text-sm font-bold flex items-center gap-1 animate-fade-in">
                                            Filtro: {filterTool} <span className="material-symbols-outlined text-[14px]">close</span>
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap">
                                    Mostrando <span className="font-bold text-gray-900 dark:text-white">{visibleTemplates.length}</span> de {filteredTemplates.length}
                                </div>
                            </div>
                            
                            {filteredTemplates.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                                    <div className="size-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                        <span className="material-symbols-outlined text-gray-400 text-3xl">search_off</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No se encontraron plantillas</h3>
                                    <p className="text-gray-500">Intenta ajustar tus filtros o búsqueda.</p>
                                    <button onClick={() => {setSearchQuery(''); setSelectedCategory('Todas'); setFilterTool(null);}} className="mt-4 text-primary font-bold hover:underline">Limpiar filtros</button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {visibleTemplates.map((template) => (
                                        <div key={template.id} className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col h-full animate-fade-in-up">
                                            {/* Header */}
                                            <div className={`h-32 relative flex items-center justify-center ${template.apps[0].bg} dark:bg-opacity-10 transition-colors`}>
                                                {template.isFree && <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 px-2 py-1 rounded text-[10px] font-bold shadow-sm uppercase text-gray-700 dark:text-gray-200 z-10">Gratis</div>}
                                                {template.isPopular && <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded text-[10px] font-bold shadow-sm uppercase z-10 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">trending_up</span> Top</div>}
                                                {template.isNew && <div className="absolute top-3 right-3 bg-purple-600 text-white px-2 py-1 rounded text-[10px] font-bold shadow-sm uppercase z-10 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">new_releases</span> New</div>}
                                                
                                                <div className="relative z-0 group-hover:scale-110 transition-transform duration-500">
                                                    <span className={`material-symbols-outlined text-7xl opacity-80 ${template.apps[0].color}`}>{template.apps[0].icon}</span>
                                                </div>
                                                
                                                {/* App Icons Overlay */}
                                                <div className="absolute -bottom-5 left-6 flex -space-x-2">
                                                    {template.apps.map((app, i) => (
                                                        <div key={i} className="size-10 rounded-full border-2 border-white dark:border-card-dark bg-white dark:bg-[#1a1f33] flex items-center justify-center shadow-sm z-10" title={app.name}>
                                                            <span className={`material-symbols-outlined text-[20px] ${app.color}`}>{app.icon}</span>
                                                        </div>
                                                    ))}
                                                    {template.apps.length > 3 && (
                                                        <div className="size-10 rounded-full border-2 border-white dark:border-card-dark bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500 z-10">
                                                            +{template.apps.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-6 pt-8 flex-1 flex flex-col">
                                                <div className="mb-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{template.category}</span>
                                                </div>
                                                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white leading-tight group-hover:text-primary transition-colors">{template.title}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed">{template.description}</p>
                                                
                                                <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between gap-4">
                                                    <div className="flex gap-1 overflow-hidden">
                                                        {template.tags.slice(0, 2).map(tag => (
                                                            <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-white/5 rounded text-[10px] font-medium text-gray-500 whitespace-nowrap">{tag}</span>
                                                        ))}
                                                    </div>
                                                    <button 
                                                        onClick={() => handleUseTemplate(template.title)}
                                                        className="size-10 rounded-full bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white flex items-center justify-center transition-all shadow-sm group-active:scale-95 shrink-0"
                                                        title="Usar Plantilla"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {visibleCount < filteredTemplates.length && (
                                <div className="mt-12 flex justify-center pb-12">
                                    <button 
                                        onClick={handleLoadMore}
                                        className="group px-8 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-300 transition-all flex items-center gap-2"
                                    >
                                        Cargar más plantillas
                                        <span className="material-symbols-outlined group-hover:translate-y-0.5 transition-transform">expand_more</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};