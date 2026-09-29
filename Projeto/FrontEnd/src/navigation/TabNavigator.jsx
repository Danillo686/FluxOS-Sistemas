function TabNavigator() {
  return (
    <nav>
      <h2>VideFrigo</h2>
      <button>Dashboard</button>
      <button>Ordem de Serviço</button>
      <button type="button" onClick={() => navigate('/login')}>Sair</button>
    </nav>
  );
}

export default TabNavigator;