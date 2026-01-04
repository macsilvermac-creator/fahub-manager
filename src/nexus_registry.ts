import HC_Module from '../modules/hc-tactical';

export const NEXUS_CAPABILITIES = [
  { 
    id: 'HC_MODULE_V1', 
    label: 'Comando Tático', 
    path: '/hc-tactical',
    icon: 'Zap', // Você pode usar qualquer ícone do Lucide
    component: HC_Module, 
    roles: ['MASTER', 'HC'] 
  }
];