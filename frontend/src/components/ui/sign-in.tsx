import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10">
    {children}
  </div>
);

// --- MAIN COMPONENT ---

export const SignInPage: React.FC = () => {
  const [authState, setAuthState] = useState<'signup' | 'login'>('login');
  const [showPassword, setShowPassword] = useState(false);

  const onSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Вход в систему');
  };

  const onResetPassword = () => {
    console.log('Сброс пароля');
  };

  const onCreateAccount = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setAuthState('signup');
  };

  const onSwitchToLogin = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setAuthState('login');
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

              <form className="space-y-5" onSubmit={onSignIn}>
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

                <div className="animate-fade-in animation-delay-700 flex items-center justify-between text-sm">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      className="custom-checkbox"
                    />
                    <span className="text-foreground/90">Запомнить меня</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="animate-fade-in animation-delay-700 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Создать аккаунт
                </button>
              </form>

              <p className="animate-fade-in animation-delay-800 text-center text-sm text-muted-foreground">
                Уже есть аккаунт?{' '}
                <a
                  href="#"
                  onClick={onSwitchToLogin}
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

              <form className="space-y-5" onSubmit={onSignIn}>
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

                <div className="animate-fade-in animation-delay-500 flex items-center justify-between text-sm">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      className="custom-checkbox"
                    />
                    <span className="text-foreground/90">Запомнить меня</span>
                  </label>
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      onResetPassword();
                    }}
                    className="hover:underline text-violet-400 transition-colors"
                  >
                    Забыли пароль?
                  </a>
                </div>

                <button
                  type="submit"
                  className="animate-fade-in animation-delay-600 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Войти
                </button>
              </form>

              <p className="animate-fade-in animation-delay-700 text-center text-sm text-muted-foreground">
                Нет аккаунта?{' '}
                <a
                  href="#"
                  onClick={onCreateAccount}
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
