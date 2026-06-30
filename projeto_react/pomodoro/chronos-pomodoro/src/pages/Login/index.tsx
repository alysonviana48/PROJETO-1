import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { DefaultInput } from '../../components/DefaultInput';
import { useAuthContext } from '../../contexts/AuthContext';
import { showMessage } from '../../adapters/showMessage';
import { api } from '../../services/api';
import styles from './styles.module.css';

type ViewMode = 'login' | 'register' | 'forgot' | 'reset';

export function Login() {
  const navigate   = useNavigate();
  const { login, register } = useAuthContext();

  // Campos controlados
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken,      setResetToken]      = useState('');
  const [newPassword,     setNewPassword]     = useState('');

  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [isLoading, setIsLoading] = useState(false);

  const firstInputRef = useRef<HTMLInputElement>(null);

  // Foca no primeiro campo ao mudar de tela
  useEffect(() => {
    firstInputRef.current?.focus();
  }, [viewMode]);

  useEffect(() => {
    document.title = 'Login - Chronos Pomodoro';
  }, []);

  useEffect(() => {
    showMessage.dismiss();
  }, [viewMode]);

  // Login
  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    showMessage.dismiss();

    if (!email.trim()) { showMessage.warn('Informe o e-mail'); return; }
    if (!password)      { showMessage.warn('Informe a senha'); return; }

    setIsLoading(true);
    const ok = await login(email, password);
    setIsLoading(false);

    if (ok) {
      showMessage.success('Bem-vindo!');
      navigate('/home');
    } else {
      showMessage.error('E-mail ou senha inválidos');
    }
  }

  // Cadastro
  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    showMessage.dismiss();

    if (!name.trim())  { showMessage.warn('Informe o nome'); return; }
    if (!email.trim()) { showMessage.warn('Informe o e-mail'); return; }
    if (password.length < 6) { showMessage.warn('Senha deve ter no mínimo 6 caracteres'); return; }
    if (password !== confirmPassword) { showMessage.warn('As senhas não coincidem'); return; }

    setIsLoading(true);
    const ok = await register(name, email, password);
    setIsLoading(false);

    if (ok) {
      showMessage.success('Conta criada! Bem-vindo!');
      navigate('/home');
    } else {
      showMessage.error('Erro ao cadastrar. E-mail já em uso?');
    }
  }

  // Esqueci a senha
  async function handleForgotPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    showMessage.dismiss();

    if (!email.trim()) { showMessage.warn('Informe o e-mail'); return; }

    setIsLoading(true);
    try {
      const data = await api.post<{ message: string; resetToken?: string }>(
        '/auth/forgot-password',
        { email },
      );
      showMessage.success(data.message);
      if (data.resetToken) {
        setResetToken(data.resetToken);
        showMessage.info(`Token: ${data.resetToken}`);
      }
      setViewMode('reset');
    } catch {
      showMessage.error('Erro ao solicitar recuperação');
    } finally {
      setIsLoading(false);
    }
  }

  // Redefinir senha
  async function handleResetPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    showMessage.dismiss();

    if (!resetToken)   { showMessage.warn('Informe o token'); return; }
    if (newPassword.length < 6) { showMessage.warn('Senha deve ter no mínimo 6 caracteres'); return; }

    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', {
        token: resetToken,
        password: newPassword,
      });
      showMessage.success('Senha redefinida! Faça login.');
      setViewMode('login');
    } catch (err: unknown) {
      showMessage.error(err instanceof Error ? err.message : 'Token inválido ou expirado');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <div className={styles.header}>
          <span className={styles.logoIcon}>⏱</span>
          <h1 className={styles.title}>Chronos Pomodoro</h1>
          <p className={styles.subtitle}>
            {viewMode === 'login'    && 'Acesse sua conta'}
            {viewMode === 'register' && 'Criar nova conta'}
            {viewMode === 'forgot'   && 'Recuperar senha'}
            {viewMode === 'reset'    && 'Redefinir senha'}
          </p>
        </div>

        {/* ── LOGIN ── */}
        {viewMode === 'login' && (
          <form onSubmit={handleLogin} className={styles.form} action=''>
            <div className={styles.field}>
              <DefaultInput
                id='login-email'
                labelText='E-mail'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='seu@email.com'
                ref={firstInputRef}
                autoComplete='email'
              />
            </div>
            <div className={styles.field}>
              <DefaultInput
                id='login-pass'
                labelText='Senha'
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='Sua senha'
                autoComplete='current-password'
              />
            </div>
            <button type='submit' className={styles.btnPrimary} disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
            <div className={styles.links}>
              <button type='button' className={styles.btnLink}
                onClick={() => setViewMode('register')}>
                Não tem conta? Cadastre-se
              </button>
              <button type='button' className={styles.btnLink}
                onClick={() => setViewMode('forgot')}>
                Esqueci minha senha
              </button>
            </div>
          </form>
        )}

        {/* ── CADASTRO ── */}
        {viewMode === 'register' && (
          <form onSubmit={handleRegister} className={styles.form} action=''>
            <div className={styles.field}>
              <DefaultInput
                id='reg-name'
                labelText='Nome'
                type='text'
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder='Seu nome'
                ref={firstInputRef}
                autoComplete='name'
              />
            </div>
            <div className={styles.field}>
              <DefaultInput
                id='reg-email'
                labelText='E-mail'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='seu@email.com'
                autoComplete='email'
              />
            </div>
            <div className={styles.field}>
              <DefaultInput
                id='reg-pass'
                labelText='Senha'
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='Mínimo 6 caracteres'
                autoComplete='new-password'
              />
            </div>
            <div className={styles.field}>
              <DefaultInput
                id='reg-confirm'
                labelText='Confirmar senha'
                type='password'
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder='Repita a senha'
                autoComplete='new-password'
              />
            </div>
            <button type='submit' className={styles.btnPrimary} disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
            <div className={styles.links}>
              <button type='button' className={styles.btnLink}
                onClick={() => setViewMode('login')}>
                Já tem conta? Faça login
              </button>
            </div>
          </form>
        )}

        {/* ── ESQUECI A SENHA ── */}
        {viewMode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className={styles.form} action=''>
            <p className={styles.infoText}>
              Informe seu e-mail e o token de recuperação será exibido no console da API.
            </p>
            <div className={styles.field}>
              <DefaultInput
                id='forgot-email'
                labelText='E-mail'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='seu@email.com'
                ref={firstInputRef}
                autoComplete='email'
              />
            </div>
            <button type='submit' className={styles.btnPrimary} disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar token'}
            </button>
            <div className={styles.links}>
              <button type='button' className={styles.btnLink}
                onClick={() => setViewMode('login')}>
                Voltar ao login
              </button>
            </div>
          </form>
        )}

        {/* ── REDEFINIR SENHA ── */}
        {viewMode === 'reset' && (
          <form onSubmit={handleResetPassword} className={styles.form} action=''>
            <p className={styles.infoText}>
              Cole o token recebido no console e defina sua nova senha.
            </p>
            <div className={styles.field}>
              <DefaultInput
                id='reset-token'
                labelText='Token de recuperação'
                type='text'
                value={resetToken}
                onChange={e => setResetToken(e.target.value)}
                placeholder='Cole o token aqui'
                ref={firstInputRef}
              />
            </div>
            <div className={styles.field}>
              <DefaultInput
                id='reset-pass'
                labelText='Nova senha'
                type='password'
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder='Mínimo 6 caracteres'
                autoComplete='new-password'
              />
            </div>
            <button type='submit' className={styles.btnPrimary} disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Redefinir senha'}
            </button>
            <div className={styles.links}>
              <button type='button' className={styles.btnLink}
                onClick={() => setViewMode('login')}>
                Voltar ao login
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}