'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { profileService, type Profile } from '@/lib/profileService';
import ProfileCard from '@/components/UI/ProfileCard';
import styles from './page.module.css';

export default function Home() {
  const [featuredProfiles, setFeaturedProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileService
      .getProfiles(1, 3)
      .then((data) => setFeaturedProfiles(data.profiles))
      .catch(() => setFeaturedProfiles([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.hero} id="hero-section">
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>Plataforma para egresados</span>
            <h1 className={styles.heroTitle}>
              Conecta tu <span className={styles.highlight}>talento</span> con el mundo profesional
            </h1>
            <p className={styles.heroSubtitle}>
              GoWo conecta egresados con empresas que buscan profesionales con habilidades en programacion, electronica, musica y mas.
            </p>
            <div className={styles.heroCta}>
              <Link href="/register" className="btn btn-primary btn-lg" id="hero-cta-register">
                Comenzar ahora
              </Link>
              <Link href="/profiles" className="btn btn-outline btn-lg" id="hero-cta-profiles">
                Ver perfiles
              </Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <h3>+100</h3>
              <p>Egresados registrados</p>
            </div>
            <div className={styles.heroCard}>
              <h3>+50</h3>
              <p>Empresas activas</p>
            </div>
            <div className={styles.heroCard}>
              <h3>+200</h3>
              <p>Conexiones realizadas</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.features} id="features-section">
        <div className="container">
          <h2 className={styles.sectionTitle}>Como funciona</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureItem}>
              <div className={styles.featureNumber}>01</div>
              <h3 className={styles.featureTitle}>Crea tu perfil</h3>
              <p className={styles.featureDesc}>Registra tus habilidades, experiencia y areas de especializacion</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureNumber}>02</div>
              <h3 className={styles.featureTitle}>Se descubierto</h3>
              <p className={styles.featureDesc}>Las empresas exploran perfiles y encuentran al talento que necesitan</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureNumber}>03</div>
              <h3 className={styles.featureTitle}>Conectate</h3>
              <p className={styles.featureDesc}>Recibe solicitudes de contratacion y agenda entrevistas directamente</p>
            </div>
          </div>
        </div>
      </section>

      {featuredProfiles.length > 0 && (
        <section className={styles.featured} id="featured-section">
          <div className="container">
            <h2 className={styles.sectionTitle}>Perfiles destacados</h2>
            <div className={styles.profileGrid}>
              {featuredProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
            <div className={styles.viewAll}>
              <Link href="/profiles" className="btn btn-secondary" id="view-all-profiles">
                Ver todos los perfiles
              </Link>
            </div>
          </div>
        </section>
      )}

      {loading && featuredProfiles.length === 0 && (
        <section className={styles.featured}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Perfiles destacados</h2>
            <div className={styles.loadingPlaceholder}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.skeleton} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
