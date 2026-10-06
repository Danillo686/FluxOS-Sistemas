import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../api';
import TabNavigator from '../navigation/TabNavigator';

const employeeRoles = {
  admin: ['owner', 'attendant', 'employee'],
  owner: ['manager', 'attendant', 'employee'],
  manager: ['attendant', 'employee'],
};

const roleNames = {
  admin: 'Administrador',
  owner: 'Proprietário',
  manager: 'Gerente',
  attendant: 'Atendente',
  employee: 'Técnico',
  customer: 'Cliente',
};

function Dashboard() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [serviceOrders, setServiceOrders] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadDashboard(currentUser) {
    try {
      setError('');
      const [vehicleResult, customerResult, userResult, orderResult] = await Promise.all([
        apiGet(currentUser.role === 'customer' ? '/my/vehicles' : '/vehicles'),
        currentUser.role === 'customer' ? Promise.resolve({ data: [] }) : apiGet('/customers'),
        currentUser.role === 'customer' ? Promise.resolve({ data: [] }) : apiGet('/users'),
        currentUser.role === 'customer' ? Promise.resolve({ data: [] }) : apiGet('/service-orders'),
      ]);

      setVehicles(vehicleResult.data || []);
      setCustomers(customerResult.data || []);
      setUsers(userResult.data || []);
      setServiceOrders(orderResult.data || []);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  useEffect(() => {
    if (!user || !localStorage.getItem('token')) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
      return;
    }

    void Promise.resolve().then(() => loadDashboard(user));
  }, [navigate, user]);

  async function submitForm(event, path, onSuccess) {
    event.preventDefault();
    const form = event.currentTarget;
    setSaving(true);
    setError('');
    setNotice('');
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());

    try {
      await apiPost(path, payload);
      form.reset();
      setNotice('Cadastro realizado com sucesso.');
      await loadDashboard(user);
      onSuccess?.();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  const isCustomer = user.role === 'customer';
  const canCreateEmployees = Boolean(employeeRoles[user.role]?.length);
  const canCreateRecords = ['attendant', 'owner', 'manager', 'admin'].includes(user.role);
  const ownVehicles = vehicles.filter((vehicle) => vehicle.customer_id === user.id);

  return (
    <div className="app-shell">
      <TabNavigator />
      <main className="dashboard">
        <header className="dashboard-heading">
          <div>
            <p className="eyebrow">PAINEL {roleNames[user.role]?.toUpperCase()}</p>
            <h1>Olá, {user.name || 'bem-vindo'}</h1>
          </div>
          <span className="role-badge">{roleNames[user.role] || user.role}</span>
        </header>

        {error && <p className="feedback feedback-error" role="alert">{error}</p>}
        {notice && <p className="feedback feedback-success" role="status">{notice}</p>}

        {isCustomer ? (
          <section className="data-section">
            <div className="section-heading">
              <div><p className="eyebrow">SEUS DADOS</p><h2>Meus veículos</h2></div>
              <span>{ownVehicles.length} cadastrados</span>
            </div>
            {ownVehicles.length ? (
              <div className="record-list">
                {ownVehicles.map((vehicle) => (
                  <article className="record-row" key={vehicle.id_vehicles}>
                    <strong>{vehicle.brand} {vehicle.model}</strong>
                    <span>{vehicle.plate}</span>
                  </article>
                ))}
              </div>
            ) : <p className="empty-state">Nenhum veículo vinculado à sua conta.</p>}
          </section>
        ) : (
          <>
            {canCreateEmployees && (
              <section className="data-section">
                <div className="section-heading"><div><p className="eyebrow">EQUIPE</p><h2>Cadastrar funcionário</h2></div></div>
                <form className="form-grid" onSubmit={(event) => submitForm(event, '/users')}>
                  <label>Nome<input name="name" required /></label>
                  <label>Email<input name="email" type="email" required /></label>
                  <label>Senha<input name="password" type="password" minLength="6" required /></label>
                  <label>Função<select name="role" required defaultValue=""><option value="" disabled>Selecione</option>{employeeRoles[user.role].map((role) => <option key={role} value={role}>{roleNames[role]}</option>)}</select></label>
                  <button disabled={saving} type="submit">{saving ? 'Salvando...' : 'Cadastrar funcionário'}</button>
                </form>
              </section>
            )}

            {user.role === 'attendant' && (
              <>
                <section className="data-section">
                  <div className="section-heading"><div><p className="eyebrow">CLIENTES</p><h2>Novo cliente</h2></div></div>
                  <form className="form-grid" onSubmit={(event) => submitForm(event, '/customers')}>
                    <label>Nome<input name="name" required /></label>
                    <label>CPF<input name="cpf" required /></label>
                    <label>CEP<input name="zip_code" required /></label>
                    <label>Telefone<input name="phone" type="tel" required /></label>
                    <label>Email<input name="email" type="email" required /></label>
                    <label>Senha<input name="password" type="password" minLength="6" required /></label>
                    <button disabled={saving} type="submit">{saving ? 'Salvando...' : 'Cadastrar cliente'}</button>
                  </form>
                </section>

                <section className="data-section">
                  <div className="section-heading"><div><p className="eyebrow">FROTA</p><h2>Novo veículo</h2></div></div>
                  <form className="form-grid" onSubmit={(event) => submitForm(event, '/vehicles')}>
                    <label className="wide-field">Cliente<select name="customer_id" required defaultValue=""><option value="" disabled>Selecione o cliente</option>{customers.map((customer) => <option key={customer.id_customer} value={customer.id_customer}>{customer.name} · {customer.phone}</option>)}</select></label>
                    <label>Placa<input name="plate" required /></label>
                    <label>Modelo<input name="model" required /></label>
                    <label>Marca<input name="brand" required /></label>
                    <button disabled={saving || customers.length === 0} type="submit">{saving ? 'Salvando...' : 'Cadastrar veículo'}</button>
                  </form>
                </section>

                <section className="data-section">
                  <div className="section-heading"><div><p className="eyebrow">OFICINA</p><h2>Abrir ordem de serviço</h2></div></div>
                  <form className="form-grid" onSubmit={(event) => submitForm(event, '/service-orders')}>
                    <label className="wide-field">Veículo<select name="vehicle_id" required defaultValue=""><option value="" disabled>Selecione o veículo</option>{vehicles.map((vehicle) => <option key={vehicle.id_vehicles} value={vehicle.id_vehicles}>{vehicle.plate} · {vehicle.brand} {vehicle.model}</option>)}</select></label>
                    <label className="wide-field">Relato do cliente<textarea name="customer_report" rows="3" required /></label>
                    <label className="wide-field">Observações<textarea name="notes" rows="2" /></label>
                    <button disabled={saving || vehicles.length === 0} type="submit">{saving ? 'Salvando...' : 'Abrir ordem'}</button>
                  </form>
                </section>
              </>
            )}

            {canCreateRecords && (
              <>
                <section className="data-section">
                  <div className="section-heading"><div><p className="eyebrow">ACOMPANHAMENTO</p><h2>Ordens de serviço</h2></div><span>{serviceOrders.length} no total</span></div>
                  {serviceOrders.length ? <div className="record-list">{serviceOrders.map((order) => <article className="record-row" key={order.id_service_orders}><strong>OS #{order.id_service_orders}</strong><span>Veículo {order.vehicle_id} · {order.status}</span><span>{order.customer_report}</span></article>)}</div> : <p className="empty-state">Nenhuma ordem de serviço encontrada.</p>}
                </section>
                <section className="data-section">
                  <div className="section-heading"><div><p className="eyebrow">CADASTROS</p><h2>Clientes e veículos</h2></div></div>
                  <div className="summary-grid">
                    <div><strong>{customers.length}</strong><span>Clientes</span></div>
                    <div><strong>{vehicles.length}</strong><span>Veículos</span></div>
                    <div><strong>{users.length}</strong><span>Funcionários</span></div>
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;