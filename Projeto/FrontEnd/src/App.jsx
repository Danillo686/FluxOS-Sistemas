import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Owner from './pages/Owner';
import Customer from './pages/Customer';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/owner" element={<Owner />} />
      <Route path="/customer" element={<Customer />} />
      <Route path="*" element={<div>Página não encontrada</div>} />
    </Routes>
  );
}

export default App;