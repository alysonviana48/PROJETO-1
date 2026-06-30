import styles from './style.module.css';
import { RouterLink } from '../RouterLink';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';

export function Footer() {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <footer className={styles.footer}>
      <RouterLink href='/about-pomodoro/'>
        Entenda como funciona a técnica pomodoro
      </RouterLink>
      <RouterLink href='/home'>
        Chronos Pomodoro &copy; {new Date().getFullYear()} - Feito com 💚
      </RouterLink>
      <button
        className={styles.logoutBtn}
        onClick={handleLogout}
        aria-label='Sair do sistema'
        title='Sair do sistema'
      >
        Sair
      </button>
    </footer>
  );
}