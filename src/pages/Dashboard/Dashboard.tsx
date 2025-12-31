const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Visão Geral</h2>
        <span className="text-sm text-gray-500">Última atualização: Hoje, 14:30</span>
      </div>
      
      {/* Grid de Cards Exemplo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Atletas Ativos</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">45</p>
          <p className="text-sm text-green-600 mt-2 font-medium">+2 novos esta semana</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Caixa Atual</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">R$ 1.250,00</p>
          <p className="text-sm text-red-600 mt-2 font-medium">- R$ 350,00 em despesas</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Próximo Treino</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">Sábado, 14:00</p>
          <p className="text-sm text-gray-500 mt-2">CT Joinville Gladiators</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
        <h3 className="font-bold text-gray-800 mb-4">Atividades Recentes</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <p className="text-sm text-gray-600">Novo atleta cadastrado: <strong>João Silva</strong></p>
          </div>
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <p className="text-sm text-gray-600">Mensalidade confirmada: <strong>Marcos Oliveira</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;