'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { ApiError } from '@/lib/http';
import styles from './page.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`page-content ${styles.page}`}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Bienvenido de vuelta</h1>
          <p className={styles.subtitle}>Ingresa a tu cuenta GoWo</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} id="login-form">
          {error && <div className={styles.error} id="login-error">{error}</div>}

          <div className="input-group">
            <label htmlFor="email" className="input-label">Correo electrónico</label>
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">Contraseña</label>
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            id="login-submit"
            style={{ width: '100%' }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className={styles.footer}>
          ¿No tienes cuenta?{' '}
          <Link href="/register" className={styles.link} id="login-to-register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}
