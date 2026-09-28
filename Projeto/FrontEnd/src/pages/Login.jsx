import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Permite alterar a URL da API com VITE_API_URL em outros ambientes.
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // O backend devolve a credencial dentro de session.access_token.
        if (data.session?.access_token) {
          localStorage.setItem('token', data.session.access_token);
        }

        // Armazena os dados do usuário para fácil acesso depois
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        // Redirecionamento por tipo de perfil
        switch (data.user?.role) {
          case 'owner':
            navigate('/owner');
            break;
          case 'attendant':
            navigate('/attendant');
            break;
          case 'technician':
            navigate('/technician');
            break;
          default:
            alert('Tipo de usuário não reconhecido.');
            break;
        }
      } else {
        alert(data.message || data.error || 'Erro ao realizar o login.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
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