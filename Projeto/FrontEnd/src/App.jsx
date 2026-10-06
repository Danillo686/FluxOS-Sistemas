import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/owner" element={<Dashboard />} />
      <Route path="/manager" element={<Dashboard />} />
      <Route path="/attendant" element={<Dashboard />} />
      <Route path="/technician" element={<Dashboard />} />
      <Route path="/customer" element={<Dashboard />} />
      <Route path="*" element={<div>Página não encontrada</div>} />
    </Routes>
  );
}

export default App;