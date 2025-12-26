import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Checklist = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-background-light dark:bg-background-dark font-display relative overflow-hidden h-screen w-full">
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => navigate(-1)}></div>
                
                <div className="relative w-full max-w-2xl bg-white dark:bg-card-dark rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">
                     <div className="p-8 pb-4">
                        <div className="flex items-start gap-4 mb-2">
                            <div className="flex items-center justify-center size-12 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 shrink-0">
                                <span className="material-symbols-outlined text-2xl font-bold">verified_user</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-[#111813] dark:text-white mb-1">Checklist de Seguridad y Calidad</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">
                                    Antes de publicar, revisa que tu automatización cumpla con los estándares de seguridad para proteger tus datos y los de tus usuarios.
                                </p>
                            </div>
                        </div>
                     </div>

                     <div className="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar">
                         {/* Info Box */}
                         <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl flex items-start gap-3">
                             <span className="material-symbols-outlined text-blue-600 text-xl mt-0.5">info</span>
                             <div className="flex-1">
                                 <div className="flex justify-between items-center mb-1">
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Mejores Prácticas de Seguridad</h4>
                                    <button className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                                        Ver Guía <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                    </button>
                                 </div>
                                 <p className="text-xs text-gray-600 dark:text-gray-400">Recomendamos seguir las guías de OWASP para Low-Code. Asegura que no expones datos sensibles.</p>
                             </div>
                         </div>

                         <div className="flex flex-col gap-6 pb-6">
                             {[
                                 { title: 'Protección de Datos Personales (PII)', desc: '¿La automatización maneja nombres, emails o teléfonos? Confirma que cumples con GDPR/CCPA.', checked: false },
                                 { title: 'Gestión de Secretos', desc: 'Verifica que no existan contraseñas o API keys en texto plano dentro de los nodos. Usa variables de entorno.', checked: true },
                                 { title: 'Pruebas con "Dummy Data"', desc: 'Confirma que el flujo ha sido testeado exitosamente con datos de prueba antes de usar datos reales.', checked: false },
                                 { title: 'Límites de Ejecución', desc: 'Revisa los límites de iteración configurados para evitar bucles infinitos y consumo excesivo de créditos.', checked: false },
                             ].map((item, i) => (
                                 <label key={i} className="flex gap-4 cursor-pointer group">
                                     <div className="relative flex items-start mt-1">
                                         {item.checked ? (
                                             <div className="size-6 bg-primary rounded-full flex items-center justify-center text-white">
                                                 <span className="material-symbols-outlined text-base font-bold">check</span>
                                             </div>
                                         ) : (
                                             <div className="size-6 border-2 border-gray-300 dark:border-gray-600 rounded-full group-hover:border-primary transition-colors"></div>
                                         )}
                                         <input defaultChecked={item.checked} className="hidden" type="checkbox"/>
                                     </div>
                                     <div className="flex flex-col gap-1">
                                         <p className="text-[#111813] dark:text-white text-base font-semibold">{item.title}</p>
                                         <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                                     </div>
                                 </label>
                             ))}
                         </div>
                     </div>

                     <div className="p-8 pt-4 bg-white dark:bg-card-dark flex justify-end gap-3">
                         <button onClick={() => navigate(-1)} className="px-6 py-3 rounded-full text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                             Seguir Editando
                         </button>
                         <button onClick={() => navigate('/details')} className="px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-transform active:scale-95">
                             <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                             Confirmar y Publicar
                         </button>
                     </div>
                </div>
            </div>
        </div>
    );
};