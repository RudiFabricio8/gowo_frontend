'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { profileService, type Profile } from '@/lib/profileService';
import { requestService, type ContactRequest } from '@/lib/requestService';
import ProtectedRoute from '@/components/UI/ProtectedRoute';
import SkillBadge from '@/components/UI/SkillBadge';
import Loader from '@/components/UI/Loader';
import type { ApiError } from '@/lib/http';
import styles from './page.module.css';

function EgresadoDashboard() {
  const [nombre, setNombre] = useState('');
  const [experiencia, setExperiencia] = useState(0);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [githubUsername, setGithubUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    profileService
      .getProfiles(1, 100)
      .then((data) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const myProfile = data.profiles.find((p) => p.userId === user.id);
        if (myProfile) {
          setCurrentProfile(myProfile);
          setNombre(myProfile.nombre);
          setExperiencia(myProfile.experienciaMeses);
          setSkills(myProfile.profileSkills?.map((ps) => ps.skill.name) || []);
          setGithubUsername(myProfile.githubUsername || '');
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));

    requestService
      .getMyRequests()
      .then((data) => setRequests(data.requests))
      .catch(() => {})
      .finally(() => setLoadingRequests(false));
  }, []);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (s: string) => setSkills(skills.filter((sk) => sk !== s));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const data = await profileService.upsertProfile({ nombre, experiencia_meses: experiencia, skills, github_username: githubUsername });
      setCurrentProfile(data.profile);
      setSuccess('Perfil actualizado correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError((err as ApiError).message || 'Error al guardar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async (id: string, estado: 'aceptada' | 'rechazada') => {
    setUpdatingId(id);
    try {
      const { request } = await requestService.updateStatus(id, estado);
      setRequests((prev) => prev.map((r) => (r.id === id ? request : r)));
    } catch (e) {
      alert((e as ApiError).message || 'Error al actualizar solicitud');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loadingProfile) return <Loader />;

  return (
    <div className={styles.egresadoLayout}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{currentProfile ? 'Editar perfil' : 'Crear perfil'}</h2>
        <form onSubmit={handleSubmit} className={styles.form} id="profile-form">
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}
          <div className="input-group">
            <label htmlFor="nombre" className="input-label">Nombre completo</label>
            <input id="nombre" type="text" className="input-field" placeholder="Tu nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div className="input-group">
            <label htmlFor="experiencia" className="input-label">Meses de experiencia</label>
            <input id="experiencia" type="number" className="input-field" min={0} value={experiencia} onChange={(e) => setExperiencia(parseInt(e.target.value) || 0)} />
          </div>
          <div className="input-group">
            <label htmlFor="github" className="input-label">Usuario de GitHub</label>
            <input id="github" type="text" className="input-field" placeholder="ej: octocat" value={githubUsername} onChange={(e) => setGithubUsername(e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Habilidades</label>
            <div className={styles.skillInputRow}>
              <input type="text" className="input-field" placeholder="Ej: React, Python..." value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleKeyDown} id="skill-input" />
              <button type="button" className="btn btn-secondary" onClick={addSkill} id="add-skill-btn">Agregar</button>
            </div>
            {skills.length > 0 && (
              <div className={styles.skillTags}>
                {skills.map((skill) => (
                  <span key={skill} className={styles.skillTag}>
                    <SkillBadge name={skill} />
                    <button type="button" className={styles.removeSkill} onClick={() => removeSkill(skill)} aria-label={`Eliminar ${skill}`}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="save-profile-btn" style={{ width: '100%' }}>
            {loading ? 'Guardando...' : 'Guardar perfil'}
          </button>
        </form>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Solicitudes recibidas</h2>
        {loadingRequests ? <Loader /> : requests.length === 0 ? (
          <p className={styles.emptyMsg}>Aún no has recibido solicitudes de empresas.</p>
        ) : (
          <div className={styles.requestsList}>
            {requests.map((req) => (
              <div key={req.id} className={styles.requestCard}>
                <div className={styles.requestHeader}>
                  <span className={styles.requestCompany}>{req.empresa?.email || 'Empresa'}</span>
                  <span className={`${styles.requestBadge} ${styles[req.estado]}`}>{req.estado}</span>
                </div>
                <p className={styles.requestDesc}>{req.descripcion}</p>
                <p className={styles.requestDate}>{new Date(req.createdAt).toLocaleDateString('es-ES')}</p>
                {req.estado === 'pendiente' && (
                  <div className={styles.requestActions}>
                    <button className="btn btn-primary" onClick={() => handleUpdateRequest(req.id, 'aceptada')} disabled={updatingId === req.id} id={`accept-${req.id}`}>Aceptar</button>
                    <button className="btn btn-secondary" onClick={() => handleUpdateRequest(req.id, 'rechazada')} disabled={updatingId === req.id} id={`reject-${req.id}`}>Rechazar</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmpresaDashboard() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestService
      .getMyRequests()
      .then((data) => setRequests(data.requests))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = requests.length;
  const aceptadas = requests.filter((r) => r.estado === 'aceptada').length;
  const pendientes = requests.filter((r) => r.estado === 'pendiente').length;
  const rechazadas = requests.filter((r) => r.estado === 'rechazada').length;

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Panel de empresa</h2>
      {loading ? <Loader /> : (
        <>
          <div className={styles.empresaContent}>
            <div className={styles.statCard}>
              <h3 className={styles.statValue}>{total}</h3>
              <p className={styles.statLabel}>Solicitudes enviadas</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statValue}>{aceptadas}</h3>
              <p className={styles.statLabel}>Aceptadas</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statValue}>{pendientes}</h3>
              <p className={styles.statLabel}>Pendientes</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statValue}>{rechazadas}</h3>
              <p className={styles.statLabel}>Rechazadas</p>
            </div>
          </div>
          {requests.length > 0 && (
            <div className={styles.requestsList} style={{ marginTop: '1.5rem' }}>
              {requests.map((req) => (
                <div key={req.id} className={styles.requestCard}>
                  <div className={styles.requestHeader}>
                    <span className={styles.requestCompany}>{req.profile?.nombre || 'Egresado'}</span>
                    <span className={`${styles.requestBadge} ${styles[req.estado]}`}>{req.estado}</span>
                  </div>
                  <p className={styles.requestDesc}>{req.descripcion}</p>
                  <p className={styles.requestDate}>{new Date(req.createdAt).toLocaleDateString('es-ES')}</p>
                </div>
              ))}
            </div>
          )}
          {requests.length === 0 && (
            <p className={styles.emptyMsg}>Aún no has enviado solicitudes. Explora perfiles de egresados.</p>
          )}
        </>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <ProtectedRoute>
      <div className="page-content">
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>Dashboard</h1>
            <span className={styles.rolePill}>{user?.role === 'empresa' ? 'Empresa' : 'Egresado'}</span>
          </div>
          {user?.role === 'egresado' ? <EgresadoDashboard /> : <EmpresaDashboard />}
        </div>
      </div>
    </ProtectedRoute>
  );
}
