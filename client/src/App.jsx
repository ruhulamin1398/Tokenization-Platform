import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import IssuerLayout from './layouts/issuer/index.jsx';
import IssuerDashboard from './pages/IssuerDashboard';
import CreateTokenPage from './pages/CreateTokenPage';
import './App.css';

function Home() {
  return (
    <>
      <nav className="bg-blue-600 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">Tokenization Platform</h1>
          <ConnectButton showBalance={false} />
        </div>
      </nav>
      <div className="p-4">
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
        <a href="/issuer" className="text-blue-500 underline">Go to Issuer Dashboard</a>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/issuer" element={<IssuerLayout />}>
          <Route index element={<IssuerDashboard />} />
          <Route path="create-token" element={<CreateTokenPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
