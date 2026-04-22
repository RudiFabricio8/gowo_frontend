'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { profileService, type Profile } from '@/lib/profileService';
import { githubService, type GithubRepo } from '@/lib/githubService';
import { requestService } from '@/lib/requestService';
import { useAuth } from '@/context/AuthContext';
import SkillBadge from '@/components/UI/SkillBadge';
import Loader from '@/components/UI/Loader';
import ErrorMessage from '@/components/UI/ErrorMessage';
import type { ApiError } from '@/lib/http';
import styles from './page.module.css';

export default function ProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    if (!id) return;
    profileService
      .getProfileById(id)
      .then((data) => {
        setProfile(data.profile);
        if (data.profile.githubUsername) {
          githubService
            .getRepos(data.profile.githubUsername)
            .then((r) => setRepos(r.repos))
            .catch(() => {});
        }
      })
      .catch(() => setError('No se pudo cargar el perfil'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleContact = async () => {
    if (!profile) return;
    setContactError('');
    setContactLoading(true);
    try {
      await requestService.createRequest(profile.id, descripcion);
      setContactSent(true);
      setShowContactForm(false);
      setDescripcion('');
    } catch (e) {
      const err = e as ApiError;
      setContactError(err.message || 'Error al enviar solicitud');
    } finally {
      setContactLoading(false);
    }
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
        <button className={styles.back} onClick={() => router.back()} id="profile-back">← Volver</button>
        <div className={styles.layout}>
          <div className={styles.main}>
            <div className={styles.profileHeader}>
              <div className={styles.avatar}><span className={styles.initials}>{initials}</span></div>
              <div className={styles.headerInfo}>
                <h1 className={styles.name}>{profile.nombre}</h1>
                {profile.user?.email && <p className={styles.email}>{profile.user.email}</p>}
                <div className={styles.meta}>
                  <span>{profile.experienciaMeses} {profile.experienciaMeses === 1 ? 'mes' : 'meses'} de experiencia</span>
                  <span className={styles.dot}>·</span>
                  <span>⭐ {rating.toFixed(1)} ({profile.resenasCount} reseñas)</span>
                </div>
              </div>
            </div>

            {skills.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Habilidades</h2>
                <div className={styles.skillsGrid}>
                  {skills.map((skill) => <SkillBadge key={skill} name={skill} />)}
                </div>
              </div>
            )}

            {repos.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  Repositorios en GitHub
                  {profile.githubUsername && (
                    <a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noreferrer" className={styles.githubLink}>
                      @{profile.githubUsername}
                    </a>
                  )}
                </h2>
                <div className={styles.reposGrid}>
                  {repos.map((repo) => (
                    <a key={repo.id} href={repo.url} target="_blank" rel="noreferrer" className={styles.repoCard}>
                      <p className={styles.repoName}>{repo.name}</p>
                      {repo.description && <p className={styles.repoDesc}>{repo.description}</p>}
                      <div className={styles.repoMeta}>
                        {repo.language && <span className={styles.repoLang}>{repo.language}</span>}
                        <span>⭐ {repo.stars}</span>
                        <span>🍴 {repo.forks}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Información</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Miembro desde</span>
                  <span className={styles.infoValue}>{new Date(profile.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Última actualización</span>
                  <span className={styles.infoValue}>{new Date(profile.updatedAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.contactCard}>
              <h3 className={styles.contactTitle}>¿Interesado en este perfil?</h3>
              <p className={styles.contactDesc}>Envía una solicitud de contacto para conectar con este profesional.</p>
              {contactSent && <p className={styles.contactSuccess}>✓ Solicitud enviada correctamente</p>}
              {contactError && <p className={styles.contactErrorMsg}>{contactError}</p>}
              {isAuthenticated && user?.role === 'empresa' ? (
                <>
                  {!contactSent && !showContactForm && (
                    <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => setShowContactForm(true)} id="contact-btn">
                      Enviar solicitud
                    </button>
                  )}
                  {showContactForm && (
                    <div className={styles.contactForm}>
                      <textarea
                        className="input-field"
                        placeholder="Describe por qué te interesa este perfil (mínimo 10 caracteres)..."
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        rows={4}
                        id="contact-descripcion"
                      />
                      <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }} onClick={handleContact} disabled={contactLoading || descripcion.length < 10} id="contact-submit">
                        {contactLoading ? 'Enviando...' : 'Confirmar solicitud'}
                      </button>
                      <button className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }} onClick={() => setShowContactForm(false)}>
                        Cancelar
                      </button>
                    </div>
                  )}
                </>
              ) : isAuthenticated ? (
                <p className={styles.contactNote}>Solo las empresas pueden enviar solicitudes.</p>
              ) : (
                <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => router.push('/login')} id="login-to-contact">
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
