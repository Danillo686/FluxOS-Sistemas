import { useNavigate } from 'react-router-dom';

function TabNavigator() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <nav>
      <h2>VideFrigo</h2>
      <button type="button" onClick={() => navigate('/dashboard')}>Painel</button>
      <button type="button" onClick={logout}>Sair</button>
    </nav>
  );
}

export default TabNavigator;