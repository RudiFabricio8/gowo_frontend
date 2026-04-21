import Link from 'next/link';
import type { Profile } from '@/lib/profileService';
import SkillBadge from './SkillBadge';
import styles from './ProfileCard.module.css';

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const skills = profile.profileSkills?.map((ps) => ps.skill.name) || [];
  const rating = parseFloat(profile.rating) || 0;
  const initials = profile.nombre
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={`/profiles/${profile.id}`} className={styles.card} id={`profile-card-${profile.id}`}>
      <div className={styles.avatar}>
        <span className={styles.initials}>{initials}</span>
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{profile.nombre}</h3>
        {profile.user?.email && (
          <span className={styles.email}>{profile.user.email}</span>
        )}
        <div className={styles.meta}>
          <span className={styles.experience}>
            {profile.experienciaMeses} {profile.experienciaMeses === 1 ? 'mes' : 'meses'} exp.
          </span>
          <span className={styles.separator}>·</span>
          <span className={styles.rating}>
            {rating.toFixed(1)} ({profile.resenasCount})
          </span>
        </div>
      </div>
      {skills.length > 0 && (
        <div className={styles.skills}>
          {skills.slice(0, 4).map((skill) => (
            <SkillBadge key={skill} name={skill} />
          ))}
          {skills.length > 4 && (
            <span className={styles.moreSkills}>+{skills.length - 4}</span>
          )}
        </div>
      )}
    </Link>
  );
}
