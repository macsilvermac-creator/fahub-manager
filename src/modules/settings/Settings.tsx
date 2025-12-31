import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-slate-800">
        <SettingsIcon size={32} />
        <h2 className="text-3xl font-bold">Configurações</h2>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Em Construção</h3>
          <p className="text-slate-500">
            Logo você poderá alterar seu perfil e configurações do sistema aqui.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;