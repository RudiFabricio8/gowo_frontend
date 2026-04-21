import styles from './SkillBadge.module.css';

interface SkillBadgeProps {
  name: string;
}

export default function SkillBadge({ name }: SkillBadgeProps) {
  return <span className={styles.badge}>{name}</span>;
}
