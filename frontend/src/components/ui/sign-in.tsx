import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { $api } from '@/api';
import { useNavigate } from '@tanstack/react-router';
import { useToast } from './toast-1';
import { useAuth } from '@/contexts/AuthContext';
// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10">
    {children}
  </div>
);

// --- MAIN COMPONENT ---

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login } = useAuth();
  const [authState, setAuthState] = useState<'signup' | 'login'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  // First, create a mutation hook
  const registerMutation = $api.useMutation('post', '/auth/register');
  const loginMutation = $api.useMutation('post', '/auth/token');
  const signUp = async () => {
    if (userData.password !== userData.confirm_password) {
      showToast('Пароли не совпадают', 'error', 'top-right');
      return;
    }
    if (!userData.email || !userData.password || !userData.full_name) {
      showToast('Заполните все поля', 'error', 'top-right');
      return;
    }
    try {
      const response = await registerMutation.mutateAsync({
        body: {
          email: userData.email,
          password: userData.password,
          name: userData.full_name,
          is_admin: true,
        },
      });
      login(response.access_token);
      showToast('Аккаунт успешно создан', 'success', 'top-right');
      navigate({ to: '/user/profile' });
    } catch (error) {
      showToast('Ошибка при создании аккаунта', 'error', 'top-right');
    }
  };

  const signIn = async () => {
    try {
      if (!userData.email || !userData.password) {
        showToast('Заполните все поля', 'error', 'top-right');
        return;
      }
      const response = await loginMutation.mutateAsync({
        body: {
          email: userData.email,
          password: userData.password,
        },
      });
      login(response.access_token);
      showToast('Вход в систему', 'success', 'top-right');
      navigate({ to: '/user/profile' });
    } catch (error) {
      showToast('Ошибка при входе в систему', 'error', 'top-right');
    }
  };

  const onSwitch = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (authState == 'login') setAuthState('signup');
    else setAuthState('login');
  };

  const handleUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row font-geist w-[100dvw]">
      {/* Left column: sign-in form */}
      {authState === 'signup' ? (
        <section
          key="signup"
          className="flex-1 flex items-center justify-center p-8"
        >
          <div className="w-full max-w-md">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight animate-fade-in">
                Добро пожаловать
              </h1>
              <p className="text-muted-foreground animate-fade-in animation-delay-200">
                Создайте аккаунт для начала работы
              </p>

              <form className="space-y-5" onSubmit={e => e.preventDefault()}>
                <div className="animate-fade-in animation-delay-300">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Полное имя
                  </label>
                  <GlassInputWrapper>
                    <input
                      name="full_name"
                      type="text"
                      placeholder="Введите ваше полное имя"
                      className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                      onChange={handleUserData}
                    />
                  </GlassInputWrapper>
                </div>

                <div className="animate-fade-in animation-delay-400">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Email адрес
                  </label>
                  <GlassInputWrapper>
                    <input
                      name="email"
                      type="email"
                      placeholder="Введите ваш email адрес"
                      className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                      onChange={handleUserData}
                    />
                  </GlassInputWrapper>
                </div>

                <div className="animate-fade-in animation-delay-500">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Пароль
                  </label>
                  <GlassInputWrapper>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Введите пароль"
                        className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                        onChange={handleUserData}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                        ) : (
                          <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                        )}
                      </button>
                    </div>
                  </GlassInputWrapper>
                </div>

                <div className="animate-fade-in animation-delay-600">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Подтвердите пароль
                  </label>
                  <GlassInputWrapper>
                    <div className="relative">
                      <input
                        name="confirm_password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Повторите пароль"
                        className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                        onChange={handleUserData}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                        ) : (
                          <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                        )}
                      </button>
                    </div>
                  </GlassInputWrapper>
                </div>

                <button
                  onClick={signUp}
                  type="submit"
                  className="animate-fade-in animation-delay-700 w-full rounded-2xl bg-primary py-4 font-medium  flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Создать аккаунт'
                  )}
                </button>
              </form>

              <p className="animate-fade-in animation-delay-800 text-center text-sm text-muted-foreground">
                Уже есть аккаунт?{' '}
                <a
                  href="#"
                  onClick={onSwitch}
                  className="text-violet-400 hover:underline transition-colors"
                >
                  Войти
                </a>
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section
          key="login"
          className="flex-1 flex items-center justify-center p-8"
        >
          <div className="w-full max-w-md">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight animate-fade-in">
                Добро пожаловать
              </h1>
              <p className="text-muted-foreground animate-fade-in animation-delay-200">
                Войдите в свой аккаунт
              </p>

              <form className="space-y-5" onSubmit={e => e.preventDefault()}>
                <div className="animate-fade-in animation-delay-300">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Email адрес
                  </label>
                  <GlassInputWrapper>
                    <input
                      name="email"
                      type="email"
                      placeholder="Введите ваш email адрес"
                      className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                      onChange={handleUserData}
                    />
                  </GlassInputWrapper>
                </div>

                <div className="animate-fade-in animation-delay-400">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Пароль
                  </label>
                  <GlassInputWrapper>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Введите пароль"
                        className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                        onChange={handleUserData}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                        ) : (
                          <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                        )}
                      </button>
                    </div>
                  </GlassInputWrapper>
                </div>

                <button
                  onClick={signIn}
                  type="submit"
                  className="animate-fade-in animation-delay-700 w-full rounded-2xl bg-primary py-4 font-medium  flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Войти'
                  )}
                </button>
              </form>

              <p className="animate-fade-in animation-delay-700 text-center text-sm text-muted-foreground">
                Нет аккаунта?{' '}
                <a
                  href="#"
                  onClick={onSwitch}
                  className="text-violet-400 hover:underline transition-colors"
                >
                  Создать аккаунт
                </a>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Right column: hero image */}
      <section className="hidden md:block flex-1 relative p-4">
        <div
          className="animate-slide-right absolute inset-4 rounded-3xl bg-cover bg-center"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80")`,
          }}
        ></div>
      </section>
    </div>
  );
};
