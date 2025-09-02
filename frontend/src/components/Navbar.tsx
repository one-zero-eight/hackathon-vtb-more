import React, { useState } from 'react';
import { useTheme } from '@/components/theme-provider';
import {
  Sun,
  Moon,
  Menu,
  X,
  Building2,
  Briefcase,
  Users,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { label: 'Главная', href: '/', icon: Home },
    { label: 'Вакансии', href: '/user/vacancies', icon: Briefcase },
    { label: 'Компании', href: '/companies', icon: Building2 },
    { label: 'О нас', href: '/about', icon: Users },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Логотип */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              VTB More
            </span>
          </div>

          {/* Десктопное меню */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-foreground/70 hover:text-foreground transition-colors duration-200 group"
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">{item.label}</span>
                </a>
              );
            })}
          </div>

          {/* Правая часть - кнопки и переключатель темы */}
          <div className="flex items-center space-x-4">
            {/* Переключатель темы */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0 hover:bg-accent"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* Кнопки авторизации */}
            <div className="hidden sm:flex items-center space-x-3">
              <Button variant="outline" size="sm">
                Войти
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Регистрация
              </Button>
            </div>

            {/* Мобильное меню кнопка */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="md:hidden w-9 h-9 p-0"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Мобильное меню */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-4 border-t border-border">
            {/* Мобильные пункты меню */}
            <div className="space-y-2">
              {menuItems.map(item => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 text-foreground/70 hover:text-foreground hover:bg-accent rounded-lg transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </a>
                );
              })}
            </div>

            {/* Мобильные кнопки авторизации */}
            <div className="space-y-3 px-4 pt-4 border-t border-border">
              <Button variant="outline" className="w-full">
                Войти
              </Button>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Регистрация
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
