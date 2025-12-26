import React from 'react';
import { Sidebar } from './Sidebar';
import { MobileMenu } from './MobileMenu';

export const Community = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">
             <Sidebar />
             <main className="flex-1 flex flex-col h-full overflow-hidden">
                 {/* Navbar */}
                 <header className="h-16 flex items-center justify-between px-6 md:px-8 bg-white dark:bg-card-dark border-b border-[#f0f4f2] dark:border-[#2a4533] shrink-0">
                     <div className="flex items-center gap-4 flex-1 max-w-lg">
                         <MobileMenu />
                         <div className="flex items-center gap-2 relative flex-1">
                             <span className="material-symbols-outlined absolute left-3 text-gray-400">search</span>
                             <input type="text" className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-full py-2 pl-10 pr-4 text-sm" placeholder="Search..." />
                         </div>
                     </div>
                     <div className="flex items-center gap-4 ml-4">
                         <button className="size-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-white hover:bg-gray-200 hidden sm:flex"><span className="material-symbols-outlined">notifications</span></button>
                         <button className="size-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-white hover:bg-gray-200 hidden sm:flex"><span className="material-symbols-outlined">help</span></button>
                         <div className="size-9 rounded-full bg-orange-200 bg-cover" style={{backgroundImage: 'url("https://i.pravatar.cc/150?u=alex")'}}></div>
                     </div>
                 </header>

                 <div className="flex-1 overflow-y-auto bg-[#f8fafc] dark:bg-[#0f1323] p-4 md:p-8">
                     <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                         {/* Left Menu */}
                         <div className="lg:col-span-1 space-y-6 hidden lg:block">
                             <div className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                                 <h3 className="font-bold text-lg mb-1">Foro</h3>
                                 <p className="text-xs text-gray-500 mb-6">Comunidad Global</p>
                                 <nav className="space-y-1">
                                     <a href="#" className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg font-bold text-sm"><span className="material-symbols-outlined text-[20px]">home</span> Inicio</a>
                                     <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 rounded-lg font-medium text-sm"><span className="material-symbols-outlined text-[20px]">chat</span> Mis Hilos</a>
                                     <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 rounded-lg font-medium text-sm"><span className="material-symbols-outlined text-[20px]">extension</span> Integraciones API</a>
                                     <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 rounded-lg font-medium text-sm"><span className="material-symbols-outlined text-[20px]">auto_awesome</span> Prompts IA</a>
                                     <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 rounded-lg font-medium text-sm"><span className="material-symbols-outlined text-[20px]">bug_report</span> Solución de Problemas</a>
                                 </nav>
                             </div>

                             <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/30 text-center">
                                 <div className="size-12 rounded-full bg-white dark:bg-white/10 flex items-center justify-center mx-auto mb-3 shadow-sm">
                                     <span className="material-symbols-outlined text-indigo-500 text-2xl">rocket_launch</span>
                                 </div>
                                 <h3 className="font-bold text-gray-900 dark:text-white mb-1">¿Eres nuevo?</h3>
                                 <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">Aprende lo básico en nuestra academia.</p>
                                 <button className="w-full py-2 bg-white dark:bg-card-dark text-gray-900 dark:text-white font-bold text-sm rounded-xl shadow-sm hover:shadow-md transition-all">Ver Tutoriales</button>
                             </div>
                         </div>

                         {/* Main Content */}
                         <div className="lg:col-span-2 space-y-6">
                             {/* Header Banner */}
                             <div className="bg-white dark:bg-card-dark rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                                 <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                     <div>
                                         <h1 className="text-3xl font-black mb-2">Comunidad y Soporte</h1>
                                         <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">Conecta con otros profesionales, comparte tus flujos y resuelve dudas sobre automatización con IA.</p>
                                     </div>
                                     <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-primary/20 flex items-center gap-2 whitespace-nowrap">
                                         <span className="material-symbols-outlined">add</span> Iniciar discusión
                                     </button>
                                 </div>
                             </div>

                             {/* Search Bar */}
                             <div className="relative">
                                 <span className="material-symbols-outlined absolute left-4 top-3.5 text-gray-400">search</span>
                                 <input type="text" className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-primary text-sm font-medium" placeholder="Buscar flujos, errores de API, o ideas para prompts..." />
                             </div>

                             {/* Filter Tabs */}
                             <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                 <button className="px-4 py-2 bg-[#111813] text-white rounded-full text-sm font-bold whitespace-nowrap">Recientes</button>
                                 <button className="px-4 py-2 bg-white dark:bg-card-dark text-gray-600 dark:text-gray-300 rounded-full text-sm font-bold shadow-sm flex items-center gap-1 whitespace-nowrap"><span className="material-symbols-outlined text-orange-500 text-[16px]">local_fire_department</span> Más votados</button>
                                 <button className="px-4 py-2 bg-white dark:bg-card-dark text-gray-600 dark:text-gray-300 rounded-full text-sm font-bold shadow-sm flex items-center gap-1 whitespace-nowrap"><span className="material-symbols-outlined text-blue-500 text-[16px]">help</span> Sin respuesta</button>
                                 <button className="px-4 py-2 bg-white dark:bg-card-dark text-gray-600 dark:text-gray-300 rounded-full text-sm font-bold shadow-sm flex items-center gap-1 whitespace-nowrap"><span className="material-symbols-outlined text-green-500 text-[16px]">check_circle</span> Resueltos</button>
                             </div>

                             {/* Post 1 */}
                             <div className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-sm border-l-4 border-l-primary hover:shadow-md transition-shadow cursor-pointer">
                                 <div className="flex justify-between items-start mb-2">
                                     <div className="flex items-center gap-3">
                                         <div className="size-10 rounded-full bg-cover" style={{backgroundImage: 'url("https://i.pravatar.cc/150?u=sarah")'}}></div>
                                         <div>
                                             <h3 className="font-bold text-lg">Error al parsear JSON con el nodo GenAI v2</h3>
                                             <div className="text-xs text-gray-500">Sarah Jenkins • hace 2 horas</div>
                                         </div>
                                     </div>
                                     <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check</span> RESUELTO</span>
                                 </div>
                                 <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 pl-13">Estoy intentando extraer los datos estructurados de una respuesta de OpenAI usando el nuevo nodo, pero el formato de salida no coincide con mi esquema de base de datos...</p>
                                 <div className="flex items-center justify-between">
                                     <div className="flex gap-2">
                                         <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 rounded text-xs font-medium text-gray-500">#GenAI</span>
                                         <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 rounded text-xs font-medium text-gray-500">#Python</span>
                                         <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 rounded text-xs font-medium text-gray-500">#Error500</span>
                                     </div>
                                     <div className="flex items-center gap-4 text-gray-400 text-xs font-bold">
                                         <div className="flex items-center gap-1 hover:text-primary"><span className="material-symbols-outlined text-[18px]">thumb_up</span> 24</div>
                                         <div className="flex items-center gap-1 hover:text-primary"><span className="material-symbols-outlined text-[18px]">chat_bubble</span> 8</div>
                                         <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">visibility</span> 1.2k</div>
                                     </div>
                                 </div>
                             </div>

                             {/* Post 2 */}
                             <div className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow cursor-pointer">
                                 <div className="flex justify-between items-start mb-2">
                                     <div className="flex items-center gap-3">
                                         <div className="size-10 rounded-full bg-cover" style={{backgroundImage: 'url("https://i.pravatar.cc/150?u=mike")'}}></div>
                                         <div>
                                             <h3 className="font-bold text-lg">Mejores prácticas para flujos de automatización de CRM masivos</h3>
                                             <div className="text-xs text-gray-500">Mike Ross • hace 4 horas</div>
                                         </div>
                                     </div>
                                 </div>
                                 <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 pl-13">He estado trabajando en una automatización para actualizar 10,000 registros en Salesforce diariamente. ¿Debería dividir esto en sub-flujos o usar un bucle con delay...</p>
                                 <div className="flex items-center justify-between">
                                     <div className="flex gap-2">
                                         <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 rounded text-xs font-medium text-gray-500">#Salesforce</span>
                                         <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 rounded text-xs font-medium text-gray-500">#Optimización</span>
                                     </div>
                                     <div className="flex items-center gap-4 text-gray-400 text-xs font-bold">
                                         <div className="flex items-center gap-1 hover:text-primary text-primary"><span className="material-symbols-outlined text-[18px] fill-1">thumb_up</span> 56</div>
                                         <div className="flex items-center gap-1 hover:text-primary"><span className="material-symbols-outlined text-[18px]">chat_bubble</span> 21</div>
                                         <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">visibility</span> 3k</div>
                                     </div>
                                 </div>
                             </div>

                             {/* Post 3 */}
                             <div className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow cursor-pointer">
                                 <div className="flex justify-between items-start mb-2">
                                     <div className="flex items-center gap-3">
                                         <div className="size-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">JD</div>
                                         <div>
                                             <h3 className="font-bold text-lg">¿Cómo autenticar con OAuth2 personalizado?</h3>
                                             <div className="text-xs text-gray-500">John Doe • hace 15 min</div>
                                         </div>
                                     </div>
                                 </div>
                                 <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 pl-13">Estoy intentando conectar con una API bancaria que requiere un token en el header pero con un prefijo especial. No veo la opción en el nodo HTTP estándar.</p>
                                 <div className="flex items-center justify-between">
                                     <div className="flex gap-2">
                                         <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 rounded text-xs font-medium text-gray-500">#Seguridad</span>
                                         <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 rounded text-xs font-medium text-gray-500">#HTTP</span>
                                     </div>
                                     <div className="flex items-center gap-4 text-gray-400 text-xs font-bold">
                                         <div className="flex items-center gap-1 hover:text-primary"><span className="material-symbols-outlined text-[18px]">thumb_up</span> 0</div>
                                         <div className="flex items-center gap-1 hover:text-primary"><span className="material-symbols-outlined text-[18px]">chat_bubble</span> 0</div>
                                         <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">visibility</span> 12</div>
                                     </div>
                                 </div>
                             </div>
                             
                             <div className="flex justify-center pt-4">
                                 <span className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                             </div>
                         </div>

                         {/* Right Sidebar */}
                         <div className="lg:col-span-1 space-y-6 hidden lg:block">
                             <div className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                                 <div className="flex justify-between items-center mb-4">
                                     <h3 className="font-bold">Tendencias</h3>
                                     <span className="material-symbols-outlined text-xs text-gray-400">trending_up</span>
                                 </div>
                                 <div className="space-y-4">
                                     <div className="flex justify-between items-center text-sm">
                                         <span className="font-medium">#ChatGPT-4o</span>
                                         <span className="bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded text-xs text-gray-500">124 posts</span>
                                     </div>
                                     <div className="flex justify-between items-center text-sm">
                                         <span className="font-medium">#NotionAPI</span>
                                         <span className="bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded text-xs text-gray-500">89 posts</span>
                                     </div>
                                     <div className="flex justify-between items-center text-sm">
                                         <span className="font-medium">#Webhooks</span>
                                         <span className="bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded text-xs text-gray-500">65 posts</span>
                                     </div>
                                     <div className="flex justify-between items-center text-sm">
                                         <span className="font-medium">#Automatización</span>
                                         <span className="bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded text-xs text-gray-500">42 posts</span>
                                     </div>
                                 </div>
                             </div>

                             <div className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                                 <h3 className="font-bold mb-4">Top Contribuidores</h3>
                                 <div className="space-y-4">
                                     {[
                                         { name: 'Alex Chen', points: '4.5k pts', img: 'https://i.pravatar.cc/150?u=a' },
                                         { name: 'Maria G.', points: '3.2k pts', img: 'https://i.pravatar.cc/150?u=m' },
                                         { name: 'David K.', points: '2.8k pts', img: 'https://i.pravatar.cc/150?u=d' }
                                     ].map((user, i) => (
                                         <div key={i} className="flex items-center justify-between">
                                             <div className="flex items-center gap-3">
                                                 <div className="size-10 rounded-full bg-cover" style={{backgroundImage: `url('${user.img}')`}}></div>
                                                 <div>
                                                     <div className="font-bold text-sm">{user.name}</div>
                                                     <div className="text-xs text-primary font-bold">{user.points}</div>
                                                 </div>
                                             </div>
                                             <span className="material-symbols-outlined text-gray-400 text-[20px]">person_add</span>
                                         </div>
                                     ))}
                                 </div>
                             </div>

                             <div className="bg-[#15231b] rounded-2xl p-6 relative overflow-hidden">
                                 <div className="relative z-10">
                                     <div className="flex items-center gap-2 mb-3">
                                         <span className="material-symbols-outlined text-blue-400">menu_book</span>
                                         <h3 className="font-bold text-white">Documentación Oficial</h3>
                                     </div>
                                     <p className="text-xs text-gray-300 mb-4">Consulta la guía completa de nodos y referencias API.</p>
                                     <div className="w-6 h-6 rounded-full bg-yellow-400 absolute -bottom-8 -right-8 flex items-center justify-center text-[10px] text-black font-bold">1</div>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             </main>
        </div>
    );
};