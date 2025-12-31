const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Visão Geral</h2>
        <span className="text-sm text-gray-500">Última atualização: Hoje, 14:30</span>
      </div>
      
      {/* Grid de Cards Exemplo - Código direto, sem componentes externos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Atletas Ativos</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">45</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Caixa Atual</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">R$ 1.250,00</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Próximo Treino</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">Sábado, 14:00</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;