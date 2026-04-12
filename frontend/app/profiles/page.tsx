'use client';

import { useEffect, useState, useCallback } from 'react';
import { profileService, type Profile } from '@/lib/profileService';
import ProfileCard from '@/components/UI/ProfileCard';
import Pagination from '@/components/UI/Pagination';
import Loader from '@/components/UI/Loader';
import ErrorMessage from '@/components/UI/ErrorMessage';
import styles from './page.module.css';

const LIMIT = 9;

export default function Profiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfiles = useCallback(async (currentPage: number) => {
    setLoading(true);
    setError('');
    try {
      const data = await profileService.getProfiles(currentPage, LIMIT);
      setProfiles(data.profiles);
      setTotal(data.total);
    } catch {
      setError('No se pudieron cargar los perfiles. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles(page);
  }, [page, fetchProfiles]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="page-content">
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Perfiles de egresados</h1>
          <p className={styles.subtitle}>
            Descubre profesionales con talento en diversas áreas
          </p>
        </div>

        {loading && <Loader />}

        {error && <ErrorMessage message={error} onRetry={() => fetchProfiles(page)} />}

        {!loading && !error && profiles.length === 0 && (
          <div className={styles.empty}>
            <p>Aun no hay perfiles registrados</p>
          </div>
        )}

        {!loading && !error && profiles.length > 0 && (
          <>
            <div className={styles.grid} id="profiles-grid">
              {profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
