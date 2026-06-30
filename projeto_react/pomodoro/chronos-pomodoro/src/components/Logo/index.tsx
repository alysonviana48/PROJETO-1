import { TimerIcon } from 'lucide-react';
import styles from './style.module.css';
import { RouterLink } from '../RouterLink';

export function Logo() {
  return (
    <div className={styles.logo}>
      <RouterLink className={styles.logoLink} href='/home'>
        <TimerIcon />
        <span>Chronos</span>
      </RouterLink>
    </div>
  );
}