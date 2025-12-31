const AthletesList = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Elenco (Roster)</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + Novo Atleta
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 text-center text-gray-500">
          <p>A lista de atletas aparecerá aqui.</p>
          <p className="text-sm mt-2">Módulo em construção 🚧</p>
        </div>
      </div>
    </div>
  );
};

export default AthletesList;