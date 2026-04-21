import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={`page-content ${styles.page}`}>
      <div className={styles.content}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>Pagina no encontrada</h1>
        <p className={styles.subtitle}>La pagina que buscas no existe o fue movida</p>
        <Link href="/" className="btn btn-primary btn-lg" id="not-found-home">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
