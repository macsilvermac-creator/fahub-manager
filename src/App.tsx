// ... imports anteriores preservados
import HumanCapital from './modules/people/HumanCapital';

// Mocks para evitar erro TS2307 enquanto criamos os arquivos físicos
const StaffList = () => <HumanCapital />;
const PayrollManager = () => <HumanCapital />;
const GovernanceInst = () => <HumanCapital />;

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NexusPortal />} />
        {/* ... rotas financeiras ... */}

        {/* MÓDULO CAPITAL HUMANO */}
        <Route path="/human-capital" element={<HumanCapital />} />
        <Route path="/human-capital/staff" element={<StaffList />} />
        <Route path="/human-capital/payroll" element={<PayrollManager />} />
        <Route path="/human-capital/governanca" element={<GovernanceInst />} />
        
        {/* ... outras rotas ... */}
      </Routes>
    </Router>
  );
};