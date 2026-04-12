'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/UI/ThemeToggle';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar} id="main-navbar">
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo} id="navbar-logo">
          <span className={styles.logoText}>GoWo</span>
        </Link>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu de navegacion"
          id="navbar-hamburger"
        >
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ''}`} />
        </button>

        <div className={`${styles.menu} ${menuOpen ? styles.menuOpen : ''}`}>
          <Link href="/profiles" className={styles.link} id="nav-profiles" onClick={() => setMenuOpen(false)}>
            Perfiles
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className={styles.link} id="nav-dashboard" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <div className={styles.userSection}>
                <span className={styles.roleBadge}>
                  {user?.role === 'empresa' ? 'Empresa' : 'Egresado'}
                </span>
                <button className="btn btn-outline btn-sm" onClick={logout} id="nav-logout">
                  Salir
                </button>
              </div>
            </>
          ) : (
            <div className={styles.authButtons}>
              <Link href="/login" className="btn btn-secondary btn-sm" id="nav-login" onClick={() => setMenuOpen(false)}>
                Ingresar
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm" id="nav-register" onClick={() => setMenuOpen(false)}>
                Registrarse
              </Link>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
