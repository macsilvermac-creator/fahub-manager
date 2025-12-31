/ src/App.tsx (ou seu arquivo de rotas principal)
// ... outras importações
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard'; // Importe o novo componente Dashboard
// ... outros imports de páginas, como Header, Sidebar, etc.

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Assumindo que o Sidebar já existe. Importe e use-o aqui se ele for global. */}
        {/* <Sidebar /> */} 

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Assumindo que o Header já existe. Importe e use-o aqui. */}
          {/* <Header /> */}

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
            <Routes>
              {/* Adicione esta nova rota para o Dashboard */}
              <Route path="/dashboard" element={<Dashboard />} /> 
              
              {/* ... outras rotas existentes do seu aplicativo */}
              {/* <Route path="/" element={<Home />} /> */}
              {/* <Route path="/atletas" element={<AtletasPage />} /> */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;