'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { profileService, type Profile } from '@/lib/profileService';
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
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

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
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, []);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = await profileService.upsertProfile({
        nombre,
        experiencia_meses: experiencia,
        skills,
      });
      setCurrentProfile(data.profile);
      setSuccess('Perfil actualizado correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al guardar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) return <Loader />;

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>
        {currentProfile ? 'Editar perfil' : 'Crear perfil'}
      </h2>

      <form onSubmit={handleSubmit} className={styles.form} id="profile-form">
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className="input-group">
          <label htmlFor="nombre" className="input-label">Nombre completo</label>
          <input
            id="nombre"
            type="text"
            className="input-field"
            placeholder="Tu nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="experiencia" className="input-label">Meses de experiencia</label>
          <input
            id="experiencia"
            type="number"
            className="input-field"
            placeholder="0"
            min={0}
            value={experiencia}
            onChange={(e) => setExperiencia(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Habilidades</label>
          <div className={styles.skillInputRow}>
            <input
              type="text"
              className="input-field"
              placeholder="Ej: React, Python, Electronica..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDown}
              id="skill-input"
            />
            <button type="button" className="btn btn-secondary" onClick={addSkill} id="add-skill-btn">
              Agregar
            </button>
          </div>
          {skills.length > 0 && (
            <div className={styles.skillTags}>
              {skills.map((skill) => (
                <span key={skill} className={styles.skillTag}>
                  <SkillBadge name={skill} />
                  <button
                    type="button"
                    className={styles.removeSkill}
                    onClick={() => removeSkill(skill)}
                    aria-label={`Eliminar ${skill}`}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading}
          id="save-profile-btn"
          style={{ width: '100%' }}
        >
          {loading ? 'Guardando...' : 'Guardar perfil'}
        </button>
      </form>
    </div>
  );
}

function EmpresaDashboard() {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Panel de empresa</h2>
      <div className={styles.empresaContent}>
        <div className={styles.statCard}>
          <h3 className={styles.statValue}>0</h3>
          <p className={styles.statLabel}>Solicitudes enviadas</p>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.statValue}>0</h3>
          <p className={styles.statLabel}>Aceptadas</p>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.statValue}>0</h3>
          <p className={styles.statLabel}>Pendientes</p>
        </div>
      </div>
      <p className={styles.empresaNote}>
        Explora perfiles de egresados y envia solicitudes de contacto desde la seccion de perfiles.
      </p>
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
            <span className={styles.rolePill}>
              {user?.role === 'empresa' ? 'Empresa' : 'Egresado'}
            </span>
          </div>
          {user?.role === 'egresado' ? <EgresadoDashboard /> : <EmpresaDashboard />}
        </div>
      </div>
    </ProtectedRoute>
  );
}
