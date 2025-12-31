// snippet para src/App.tsx
// Adicione os imports no topo:
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Se já não tiver
import Dashboard from './pages/Dashboard/Dashboard'; // Ajuste o caminho se necessário
import Header from './components/Header/Header'; // Assumindo que Header existe
import Sidebar from './components/Sidebar/Sidebar'; // Assumindo que Sidebar existe

// ... dentro do seu componente App ou onde suas rotas são definidas

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar /> {/* Seu componente Sidebar */}
        <div className="flex-1 flex flex-col">
          <Header /> {/* Seu componente Header */}
          <main className="flex-1 overflow-y-auto">
            <Routes>
              {/* Adicione a rota para o Dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Outras rotas existentes */}
              {/* <Route path="/atletas" element={<AthletesPage />} /> */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;