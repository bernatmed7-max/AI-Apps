
// Shared Database of Apps
export const APPS_DB: Record<string, { name: string; icon: string; color: string; bg: string }> = {
    openai: { name: 'OpenAI', icon: 'auto_awesome', color: 'text-emerald-600', bg: 'bg-emerald-100' },
    slack: { name: 'Slack', icon: 'chat', color: 'text-purple-600', bg: 'bg-purple-100' },
    gmail: { name: 'Gmail', icon: 'mail', color: 'text-red-600', bg: 'bg-red-100' },
    sheets: { name: 'Google Sheets', icon: 'table_view', color: 'text-green-600', bg: 'bg-green-100' },
    hubspot: { name: 'HubSpot', icon: 'hub', color: 'text-orange-600', bg: 'bg-orange-100' },
    salesforce: { name: 'Salesforce', icon: 'cloud', color: 'text-blue-600', bg: 'bg-blue-100' },
    notion: { name: 'Notion', icon: 'description', color: 'text-slate-600', bg: 'bg-slate-100' },
    calendar: { name: 'Google Calendar', icon: 'calendar_today', color: 'text-blue-500', bg: 'bg-blue-100' },
    stripe: { name: 'Stripe', icon: 'payments', color: 'text-indigo-600', bg: 'bg-indigo-100' },
    shopify: { name: 'Shopify', icon: 'shopping_bag', color: 'text-green-500', bg: 'bg-green-100' },
    github: { name: 'GitHub', icon: 'code', color: 'text-gray-800', bg: 'bg-gray-200' },
    discord: { name: 'Discord', icon: 'forum', color: 'text-indigo-500', bg: 'bg-indigo-100' },
    linkedin: { name: 'LinkedIn', icon: 'work', color: 'text-blue-700', bg: 'bg-blue-100' },
    twitter: { name: 'X (Twitter)', icon: 'flutter', color: 'text-black', bg: 'bg-gray-200' },
    airtable: { name: 'Airtable', icon: 'table_chart', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    trello: { name: 'Trello', icon: 'dashboard', color: 'text-blue-500', bg: 'bg-blue-50' },
    asana: { name: 'Asana', icon: 'task_alt', color: 'text-red-500', bg: 'bg-red-50' },
    drive: { name: 'Google Drive', icon: 'add_to_drive', color: 'text-green-600', bg: 'bg-green-50' },
    dropbox: { name: 'Dropbox', icon: 'inventory_2', color: 'text-blue-700', bg: 'bg-blue-50' },
    zoom: { name: 'Zoom', icon: 'videocam', color: 'text-blue-500', bg: 'bg-blue-100' },
    teams: { name: 'Microsoft Teams', icon: 'groups', color: 'text-indigo-700', bg: 'bg-indigo-50' },
    woocommerce: { name: 'WooCommerce', icon: 'storefront', color: 'text-purple-700', bg: 'bg-purple-50' },
    mailchimp: { name: 'Mailchimp', icon: 'mark_email_unread', color: 'text-yellow-500', bg: 'bg-yellow-50' },
    telegram: { name: 'Telegram', icon: 'send', color: 'text-blue-400', bg: 'bg-blue-50' },
    whatsapp: { name: 'WhatsApp', icon: 'chat', color: 'text-green-500', bg: 'bg-green-50' },
    typeform: { name: 'Typeform', icon: 'dynamic_form', color: 'text-gray-700', bg: 'bg-gray-200' },
    intercom: { name: 'Intercom', icon: 'support_agent', color: 'text-blue-600', bg: 'bg-blue-100' },
    zendesk: { name: 'Zendesk', icon: 'headset_mic', color: 'text-green-700', bg: 'bg-green-50' },
    youtube: { name: 'YouTube', icon: 'play_circle', color: 'text-red-600', bg: 'bg-red-50' },
    wordpress: { name: 'WordPress', icon: 'public', color: 'text-blue-800', bg: 'bg-blue-50' },
};

export const CORE_NODES: Record<string, { name: string; icon: string; color: string; bg: string; type: 'trigger' | 'action'; category: string }> = {
    // Triggers
    webhook: { name: 'Webhook', icon: 'webhook', color: 'text-pink-600', bg: 'bg-pink-100', type: 'trigger', category: 'Core' },
    schedule: { name: 'Schedule', icon: 'schedule', color: 'text-blue-600', bg: 'bg-blue-100', type: 'trigger', category: 'Core' },
    manual: { name: 'On Click', icon: 'touch_app', color: 'text-gray-600', bg: 'bg-gray-100', type: 'trigger', category: 'Core' },
    form: { name: 'Form Trigger', icon: 'list_alt', color: 'text-purple-600', bg: 'bg-purple-100', type: 'trigger', category: 'Core' },
    // Logic
    if: { name: 'IF Condition', icon: 'call_split', color: 'text-orange-600', bg: 'bg-orange-100', type: 'action', category: 'Lógica' },
    switch: { name: 'Switch', icon: 'alt_route', color: 'text-orange-600', bg: 'bg-orange-100', type: 'action', category: 'Lógica' },
    merge: { name: 'Merge', icon: 'call_merge', color: 'text-orange-600', bg: 'bg-orange-100', type: 'action', category: 'Lógica' },
    // Helpers
    code: { name: 'Code', icon: 'code', color: 'text-yellow-600', bg: 'bg-yellow-100', type: 'action', category: 'Helpers' },
    http: { name: 'HTTP Request', icon: 'cloud_sync', color: 'text-green-600', bg: 'bg-green-100', type: 'action', category: 'Helpers' },
    wait: { name: 'Wait', icon: 'hourglass_empty', color: 'text-gray-600', bg: 'bg-gray-100', type: 'action', category: 'Helpers' },
    variable: { name: 'Set Variable', icon: 'data_object', color: 'text-blue-600', bg: 'bg-blue-100', type: 'action', category: 'Helpers' },
    split: { name: 'Split In Batches', icon: 'safety_divider', color: 'text-teal-600', bg: 'bg-teal-100', type: 'action', category: 'Helpers' },
};

export const CATEGORIES = ['Marketing', 'Ventas', 'HR', 'IT', 'Soporte', 'Finanzas', 'Productividad', 'E-commerce', 'Redes Sociales'];

export interface Template {
    id: string;
    title: string;
    description: string;
    category: string;
    apps: { name: string; icon: string; color: string; bg: string }[];
    isNew?: boolean;
    isPopular?: boolean;
    isFree?: boolean;
    tags: string[];
}

export interface UserWorkflow {
    id: string;
    title: string;
    folderId: string | null;
    nodes: any[];
    edges: any[];
    status: 'Active' | 'Draft' | 'Paused';
    lastModified: Date;
    apps: { name: string; icon: string; color: string; bg: string }[];
}

export interface Folder {
    id: string;
    name: string;
    color: string;
}

// --- MOCK STORES ---
const TEMPLATE_STORE: Template[] = generateTemplates();

// Initial User Data
let FOLDER_STORE: Folder[] = [
    { id: 'f1', name: 'Marketing Campaigns', color: 'bg-purple-100 text-purple-600' },
    { id: 'f2', name: 'Internal Ops', color: 'bg-blue-100 text-blue-600' }
];

let USER_WORKFLOW_STORE: UserWorkflow[] = [
    { 
        id: 'w1', 
        title: 'Procesamiento de Facturas - Q3', 
        folderId: 'f2',
        nodes: [], 
        edges: [], 
        status: 'Active', 
        lastModified: new Date(Date.now() - 7200000), 
        apps: [APPS_DB.gmail, APPS_DB.openai, APPS_DB.sheets] 
    },
    { 
        id: 'w2', 
        title: 'Lead Sync CRM', 
        folderId: 'f1',
        nodes: [], 
        edges: [], 
        status: 'Draft', 
        lastModified: new Date(Date.now() - 86400000), 
        apps: [APPS_DB.typeform, APPS_DB.hubspot] 
    }
];

// Helper to get random item
function getRandom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function getRandomKey(obj: object) { return Object.keys(obj)[Math.floor(Math.random() * Object.keys(obj).length)]; }

// Generator for 1000 templates
function generateTemplates(): Template[] {
    const fixedTemplates: Template[] = [
        {
            id: '1', title: 'Clasificación de Leads IA', description: 'Analiza correos entrantes con GPT-4 para calificar leads y asignar prioridad.',
            category: 'Ventas', apps: [APPS_DB.gmail, APPS_DB.openai, APPS_DB.hubspot], isFree: true, tags: ['GPT-4', 'Automation']
        },
        {
            id: '2', title: 'Procesamiento de Facturas', description: 'Extrae datos de facturas PDF y guárdalos en Google Sheets.',
            category: 'Finanzas', apps: [APPS_DB.gmail, APPS_DB.sheets], isPopular: true, tags: ['OCR', 'Finance']
        },
        {
            id: '3', title: 'Generador de Posts LinkedIn', description: 'Convierte artículos de blog en hilos virales de LinkedIn.',
            category: 'Marketing', apps: [APPS_DB.notion, APPS_DB.openai, APPS_DB.linkedin], isPopular: true, tags: ['Social Media', 'Content']
        },
        {
            id: '4', title: 'Resumen Diario de Slack', description: 'Recibe un resumen de los canales más activos en tu correo.',
            category: 'Productividad', apps: [APPS_DB.slack, APPS_DB.gmail], isNew: true, tags: ['Summary', 'Async']
        },
        {
            id: '5', title: 'Onboarding de Empleados', description: 'Envía contratos y crea cuentas de correo automáticamente.',
            category: 'HR', apps: [APPS_DB.gmail, APPS_DB.calendar, APPS_DB.slack], tags: ['Onboarding', 'Admin']
        },
        {
            id: '6', title: 'Auto-Respuesta Soporte', description: 'Borrador automático para tickets comunes de soporte técnico.',
            category: 'Soporte', apps: [APPS_DB.openai, APPS_DB.gmail], tags: ['Support', 'AI Agent']
        }
    ];

    const generated: Template[] = [];
    const structures = [
        { text: (a: string, b: string, n: string) => `Sincronizar ${n} de ${a} a ${b}`, cat: 'Productividad', nouns: ['tareas', 'contactos', 'eventos', 'notas'] },
        { text: (a: string, b: string, n: string) => `Notificar en ${b} nuevos ${n} de ${a}`, cat: 'Productividad', nouns: ['leads', 'tickets', 'pedidos', 'formularios', 'pagos'] },
        { text: (a: string, b: string, n: string) => `Guardar archivos de ${a} en ${b}`, cat: 'IT', nouns: ['adjuntos', 'reportes', 'facturas', 'logs'] },
        { text: (a: string, b: string, n: string) => `Crear ${n} en ${b} desde ${a}`, cat: 'Ventas', nouns: ['cliente', 'oportunidad', 'tarea', 'registro'] },
        { text: (a: string, b: string, n: string) => `Analizar ${n} de ${a} con IA y enviar a ${b}`, cat: 'Marketing', nouns: ['sentimiento', 'feedback', 'respuestas', 'comentarios'] },
        { text: (a: string, b: string, n: string) => `Publicar en ${b} cuando haya nuevo ${n} en ${a}`, cat: 'Redes Sociales', nouns: ['video', 'artículo', 'producto', 'anuncio'] },
        { text: (a: string, b: string, n: string) => `Añadir suscriptor a ${b} tras compra en ${a}`, cat: 'E-commerce', nouns: ['producto', 'servicio', 'curso'] }
    ];

    for (let i = 0; i < 994; i++) {
        const struct = getRandom(structures);
        const key1 = getRandomKey(APPS_DB);
        let key2 = getRandomKey(APPS_DB);
        while(key1 === key2) key2 = getRandomKey(APPS_DB);

        const app1 = APPS_DB[key1];
        const app2 = APPS_DB[key2];
        const hasThirdApp = Math.random() > 0.7;
        const app3 = hasThirdApp ? (Math.random() > 0.5 ? APPS_DB.openai : APPS_DB.slack) : null;

        const noun = getRandom(struct.nouns);
        const title = struct.text(app1.name, app2.name, noun);
        
        let category = struct.cat;
        if (app1.name === 'Shopify' || app1.name === 'WooCommerce') category = 'E-commerce';
        if (app1.name === 'Stripe' || app2.name === 'Stripe') category = 'Finanzas';
        if (app1.name === 'Zendesk' || app1.name === 'Intercom') category = 'Soporte';
        if (app2.name === 'Slack' || app2.name === 'Teams') category = 'Productividad';

        const description = `Automatización completa para ${title.toLowerCase()}. Conecta ${app1.name} y ${app2.name} ${app3 ? `usando la potencia de ${app3.name}` : ''} para optimizar tu flujo de trabajo en ${category}.`;

        const apps = [app1, app2];
        if (app3 && app3.name !== app1.name && app3.name !== app2.name) apps.push(app3);

        generated.push({
            id: `gen-${i}`,
            title,
            description,
            category,
            apps,
            isNew: Math.random() > 0.9,
            isPopular: Math.random() > 0.85,
            isFree: Math.random() > 0.7,
            tags: [category, app1.name, noun]
        });
    }

    return [...fixedTemplates, ...generated];
};

export const templateService = {
    // Templates
    getAll: () => TEMPLATE_STORE,
    search: (query: string): Template[] => {
        if (!query) return TEMPLATE_STORE;
        const lowerQ = query.toLowerCase();
        return TEMPLATE_STORE.filter(t => 
            t.title.toLowerCase().includes(lowerQ) || 
            t.description.toLowerCase().includes(lowerQ) ||
            t.apps.some(a => a.name.toLowerCase().includes(lowerQ))
        );
    },

    // Folders
    getFolders: () => FOLDER_STORE,
    createFolder: (name: string) => {
        const newFolder: Folder = {
            id: `f-${Date.now()}`,
            name,
            color: 'bg-gray-100 text-gray-600'
        };
        FOLDER_STORE = [...FOLDER_STORE, newFolder];
        return newFolder;
    },

    // User Workflows
    getUserWorkflows: () => USER_WORKFLOW_STORE,
    saveUserWorkflow: (workflowData: Partial<UserWorkflow>) => {
        const id = workflowData.id || `w-${Date.now()}`;
        const existingIndex = USER_WORKFLOW_STORE.findIndex(w => w.id === id);
        
        const newWorkflow: UserWorkflow = {
            id,
            title: workflowData.title || 'Untitled Workflow',
            folderId: workflowData.folderId || null,
            nodes: workflowData.nodes || [],
            edges: workflowData.edges || [],
            status: workflowData.status || 'Draft',
            lastModified: new Date(),
            apps: workflowData.apps || []
        };

        if (existingIndex >= 0) {
            USER_WORKFLOW_STORE[existingIndex] = newWorkflow;
        } else {
            USER_WORKFLOW_STORE = [newWorkflow, ...USER_WORKFLOW_STORE];
        }
        return newWorkflow;
    }
};
