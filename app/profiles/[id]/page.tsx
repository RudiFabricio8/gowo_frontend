'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { profileService, type Profile } from '@/lib/profileService';
import { useAuth } from '@/context/AuthContext';
import SkillBadge from '@/components/UI/SkillBadge';
import Loader from '@/components/UI/Loader';
import ErrorMessage from '@/components/UI/ErrorMessage';
import styles from './page.module.css';

export default function ProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    profileService
      .getProfileById(id)
      .then((data) => setProfile(data.profile))
      .catch(() => setError('No se pudo cargar el perfil'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleContact = () => {
    setContactSent(true);
    setTimeout(() => setContactSent(false), 3000);
  };

  if (loading) return <div className="page-content"><Loader /></div>;
  if (error) return <div className="page-content"><div className="container"><ErrorMessage message={error} onRetry={() => router.refresh()} /></div></div>;
  if (!profile) return null;

  const skills = profile.profileSkills?.map((ps) => ps.skill.name) || [];
  const rating = parseFloat(profile.rating) || 0;
  const initials = profile.nombre.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="page-content">
      <div className="container">
        <button className={styles.back} onClick={() => router.back()} id="profile-back">
          Volver
        </button>

        <div className={styles.layout}>
          <div className={styles.main}>
            <div className={styles.profileHeader}>
              <div className={styles.avatar}>
                <span className={styles.initials}>{initials}</span>
              </div>
              <div className={styles.headerInfo}>
                <h1 className={styles.name}>{profile.nombre}</h1>
                {profile.user?.email && (
                  <p className={styles.email}>{profile.user.email}</p>
                )}
                <div className={styles.meta}>
                  <span>{profile.experienciaMeses} {profile.experienciaMeses === 1 ? 'mes' : 'meses'} de experiencia</span>
                  <span className={styles.dot}>·</span>
                  <span>{rating.toFixed(1)} ({profile.resenasCount} resenas)</span>
                </div>
              </div>
            </div>

            {skills.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Habilidades</h2>
                <div className={styles.skillsGrid}>
                  {skills.map((skill) => (
                    <SkillBadge key={skill} name={skill} />
                  ))}
                </div>
              </div>
            )}

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Informacion</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Miembro desde</span>
                  <span className={styles.infoValue}>
                    {new Date(profile.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Ultima actualizacion</span>
                  <span className={styles.infoValue}>
                    {new Date(profile.updatedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.contactCard}>
              <h3 className={styles.contactTitle}>Interesado en este perfil?</h3>
              <p className={styles.contactDesc}>Envia una solicitud de contacto para conectar con este profesional</p>
              {isAuthenticated && user?.role === 'empresa' ? (
                <button
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  onClick={handleContact}
                  disabled={contactSent}
                  id="contact-btn"
                >
                  {contactSent ? 'Solicitud enviada' : 'Enviar solicitud'}
                </button>
              ) : isAuthenticated ? (
                <p className={styles.contactNote}>Solo las empresas pueden enviar solicitudes</p>
              ) : (
                <button
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  onClick={() => router.push('/login')}
                  id="login-to-contact"
                >
                  Ingresar para contactar
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
