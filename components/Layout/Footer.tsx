import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer} id="main-footer">
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span className={styles.logo}>GoWo</span>
          <p className={styles.tagline}>Conectando egresados con oportunidades profesionales</p>
        </div>
        <div className={styles.links}>
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Plataforma</h4>
            <span className={styles.footerLink}>Perfiles</span>
            <span className={styles.footerLink}>Empresas</span>
            <span className={styles.footerLink}>Oportunidades</span>
          </div>
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Soporte</h4>
            <span className={styles.footerLink}>Contacto</span>
            <span className={styles.footerLink}>FAQ</span>
            <span className={styles.footerLink}>Terminos</span>
          </div>
        </div>
        <div className={styles.bottom}>
          <span>&copy; {new Date().getFullYear()} GoWo. Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  );
}
