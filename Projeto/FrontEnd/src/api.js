const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = result.message || result.error || result.Error || 'Falha na comunicação com a API.';
    const details = import.meta.env.DEV
      ? [result.error, result.details, result.cleanupError]
        .filter((detail) => typeof detail === 'string' && detail !== message)
      : [];

    throw new Error(details.length ? `${message} (${details.join('; ')})` : message);
  }

  return result;
}

export function apiGet(path) {
  return apiRequest(path);
}

export function apiPost(path, body) {
  return apiRequest(path, { method: 'POST', body: JSON.stringify(body) });
}