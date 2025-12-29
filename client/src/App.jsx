import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import IssuerLayout from './layouts/issuer/index.jsx';
import UserLayout from './layouts/user/index.jsx';
import IssuerDashboard from './pages/IssuerDashboard';
import CreateTokenPage from './pages/CreateTokenPage';
import FaucetPage from './pages/FaucetPage';
import Marketplace from './components/Marketplace';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Marketplace />} />
          <Route path="faucet" element={<FaucetPage />} />
        </Route>
        <Route path="/issuer" element={<IssuerLayout />}>
          <Route index element={<IssuerDashboard />} />
          <Route path="create-token" element={<CreateTokenPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
