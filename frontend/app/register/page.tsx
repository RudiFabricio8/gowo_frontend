'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { ApiError } from '@/lib/http';
import styles from './page.module.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'egresado' | 'empresa'>('egresado');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, role);
      router.push('/dashboard');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`page-content ${styles.page}`}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Crear cuenta</h1>
          <p className={styles.subtitle}>Unite a la comunidad GoWo</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} id="register-form">
          {error && <div className={styles.error} id="register-error">{error}</div>}

          <div className={styles.roleSelector}>
            <button
              type="button"
              className={`${styles.roleOption} ${role === 'egresado' ? styles.roleActive : ''}`}
              onClick={() => setRole('egresado')}
              id="role-egresado"
            >
              <span className={styles.roleLabel}>Egresado</span>
              <span className={styles.roleDesc}>Busco oportunidades</span>
            </button>
            <button
              type="button"
              className={`${styles.roleOption} ${role === 'empresa' ? styles.roleActive : ''}`}
              onClick={() => setRole('empresa')}
              id="role-empresa"
            >
              <span className={styles.roleLabel}>Empresa</span>
              <span className={styles.roleDesc}>Busco talento</span>
            </button>
          </div>

          <div className="input-group">
            <label htmlFor="email" className="input-label">Correo electronico</label>
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
            <label htmlFor="password" className="input-label">Contrasena</label>
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="Minimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword" className="input-label">Confirmar contrasena</label>
            <input
              id="confirmPassword"
              type="password"
              className="input-field"
              placeholder="Repite tu contrasena"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            id="register-submit"
            style={{ width: '100%' }}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className={styles.footer}>
          Ya tienes cuenta?{' '}
          <Link href="/login" className={styles.link} id="register-to-login">Inicia sesion</Link>
        </p>
      </div>
    </div>
  );
}
