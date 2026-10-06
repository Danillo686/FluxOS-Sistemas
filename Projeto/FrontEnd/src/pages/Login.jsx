import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    try {
      const data = await apiPost('/login', { email, password });
      if (!data.session?.access_token || !data.user) {
        throw new Error('A API não retornou uma sessão válida.');
      }

      localStorage.setItem('token', data.session.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (error) {
      alert(error.message || 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
