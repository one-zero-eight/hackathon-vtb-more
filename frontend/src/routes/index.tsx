import { createFileRoute } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Building2,
  Users,
  Briefcase,
  Brain,
  Zap,
  Shield,
  Target,
  ArrowRight,
  Star,
  CheckCircle,
} from 'lucide-react';
import Orb from '@/components/Orb';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Brain,
      title: 'ИИ-ассистент для собеседований',
      description:
        'Продвинутый ИИ проводит собеседования, анализирует ответы и оценивает кандидатов',
    },
    {
      icon: Target,
      title: 'Точная оценка навыков',
      description:
        'Многоуровневая система оценки технических и soft skills кандидатов',
    },
    {
      icon: Zap,
      title: 'Мгновенная обратная связь',
      description:
        'Получайте детальные отчеты и рекомендации сразу после собеседования',
    },
    {
      icon: Shield,
      title: 'Безопасность данных',
      description:
        'Защищенное хранение и обработка персональных данных кандидатов',
    },
  ];

  const stats = [
    { number: '95%', label: 'Точность оценки' },
    { number: '3x', label: 'Быстрее найм' },
    { number: '24/7', label: 'Доступность' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />

        {/* Orb Animation */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30">
          <Orb hue={280} hoverIntensity={0.3} />
        </div>

        <div className="relative z-10 container-w mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Logo and Brand */}
            <div className="flex items-center justify-center space-x-3 mb-8 animate-fade-in">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                AInna
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in animation-delay-200">
              <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                Революция в
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                найме талантов
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in animation-delay-300">
              Используйте силу искусственного интеллекта для проведения
              собеседований, оценки кандидатов и ускорения процесса найма
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in animation-delay-400">
              {isAuthenticated ? (
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 h-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => navigate({ to: '/user/vacancies' })}
                >
                  Перейти к вакансиям
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="text-lg px-8 py-4 h-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => navigate({ to: '/auth' })}
                  >
                    Начать работу
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-4 h-auto"
                    onClick={() => navigate({ to: '/user/vacancies' })}
                  >
                    Посмотреть вакансии
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container-w mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container-w mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Возможности платформы
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Современные инструменты для эффективного найма и оценки кандидатов
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl mb-2">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container-w mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Почему AInna?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Инновационные решения для современного HR
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-fade-in animation-delay-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Экономия времени
                    </h3>
                    <p className="text-muted-foreground">
                      Автоматизация процесса собеседований сокращает время найма
                      в 3 раза
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Объективная оценка
                    </h3>
                    <p className="text-muted-foreground">
                      ИИ исключает человеческий фактор и предвзятость при оценке
                      кандидатов
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Детальная аналитика
                    </h3>
                    <p className="text-muted-foreground">
                      Получайте подробные отчеты и рекомендации по каждому
                      кандидату
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative animate-slide-right animation-delay-300">
                <div className="relative">
                  <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-12 h-12 text-primary-foreground" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">AInna</h3>
                      <p className="text-muted-foreground">
                        Будущее найма уже здесь
                      </p>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/30 rounded-full animate-pulse" />
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary/40 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container-w mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-3xl p-12 md:p-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Готовы начать?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Присоединяйтесь к AInna и откройте новые возможности в найме
                талантов
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {isAuthenticated ? (
                  <Button
                    size="lg"
                    className="text-lg px-8 py-4 h-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => navigate({ to: '/user/vacancies' })}
                  >
                    Перейти к вакансиям
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="text-lg px-8 py-4 h-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => navigate({ to: '/auth' })}
                  >
                    Начать работу
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
