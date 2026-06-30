import { HistoryIcon, HouseIcon, LogOutIcon, MoonIcon, SettingsIcon, SunIcon } from 'lucide-react';
import styles from './style.module.css';
import { useState, useEffect } from 'react';
import { RouterLink } from '../RouterLink';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';

type AvailableThemes = 'dark' | 'light';

export function Menu() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const [theme, setTheme] = useState<AvailableThemes>(() => {
    return (localStorage.getItem('theme') as AvailableThemes) || 'dark';
  });

  function handleThemeChange(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault();
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const themeIcon = theme === 'dark' ? <SunIcon /> : <MoonIcon />;

  return (
    <nav className={styles.menu}>
      {user && (
        <span className={styles.welcome}>
          Olá, <strong>{user.name}</strong>!
        </span>
      )}
      <RouterLink className={styles.menuLink} href='/home' aria-label='Home' title='Home'>
        <HouseIcon />
      </RouterLink>
      <RouterLink className={styles.menuLink} href='/history/' aria-label='Histórico' title='Histórico'>
        <HistoryIcon />
      </RouterLink>
      <RouterLink className={styles.menuLink} href='/settings/' aria-label='Configurações' title='Configurações'>
        <SettingsIcon />
      </RouterLink>
      <a className={styles.menuLink} href='#' aria-label='Mudar Tema' title='Mudar Tema' onClick={handleThemeChange}>
        {themeIcon}
      </a>
      <button className={`${styles.menuLink} ${styles.logoutBtn}`} onClick={handleLogout} aria-label='Sair' title='Sair'>
        <LogOutIcon />
      </button>
    </nav>
  );
}