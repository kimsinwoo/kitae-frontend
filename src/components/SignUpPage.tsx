import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { authService } from '../services/auth.service';

// Custom event to trigger UserContext update
const triggerUserUpdate = () => {
  // 같은 탭에서 localStorage 변경을 감지하기 위한 커스텀 이벤트
  window.dispatchEvent(new CustomEvent('userUpdated'));
};

interface SignUpPageProps {
  onNavigate: (page: string) => void;
}

export const SignUpPage = ({ onNavigate }: SignUpPageProps) => {
  const { signup } = useUser();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error(t('signup.passwordMismatch') || 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error(t('signup.passwordLength') || 'Password must be at least 6 characters');
      return;
    }

    // Context 방식 먼저 시도 (로컬 개발용)
    const contextSuccess = signup({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });

    if (contextSuccess) {
      toast.success(t('signup.success') || 'Account created successfully');
      onNavigate('home');
      return;
    }

    // API 방식 시도
    try {
      const result = await authService.register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
      });

      if (result.success && result.data?.user) {
        // localStorage에 user 정보 저장 (확실하게 저장)
        const userData = result.data.user;
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('✅ User saved to localStorage:', userData);
        
        // UserContext 업데이트 트리거
        triggerUserUpdate();
        
        // 짧은 딜레이 후 UserContext 업데이트 확인
        setTimeout(() => {
          // 다시 한번 확인하여 저장되었는지 확인
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            console.log('✅ User confirmed saved:', JSON.parse(savedUser).email);
          }
        }, 50);
        
        toast.success(t('signup.success') || 'Account created successfully');
        
        // 회원가입 성공 후 무조건 홈으로 이동
        setTimeout(() => {
          onNavigate('home');
        }, 200);
      }
    } catch (error: any) {
      toast.error(error.message || t('signup.emailExists') || 'Email already exists');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-16">
          <h1 className="text-4xl tracking-[0.3em] mb-4">KITAE</h1>
          <p className="text-sm tracking-[0.2em] text-muted-foreground">
            {t('signup.title') || 'CREATE ACCOUNT'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-sm tracking-[0.15em]">
              {t('signup.name') || 'NAME'}
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="text-center tracking-[0.1em] border-black"
              placeholder="Your Name"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm tracking-[0.15em]">
              {t('signup.email') || 'EMAIL'}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="text-center tracking-[0.1em] border-black"
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="phone" className="text-sm tracking-[0.15em]">
              {t('signup.phone') || 'PHONE'}
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="text-center tracking-[0.1em] border-black"
              placeholder="+1 (555) 000-0000"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm tracking-[0.15em]">
              {t('signup.password') || 'PASSWORD'}
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="text-center tracking-[0.1em] border-black"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="confirmPassword" className="text-sm tracking-[0.15em]">
              {t('signup.confirmPassword') || 'CONFIRM PASSWORD'}
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="text-center tracking-[0.1em] border-black"
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-black/90 tracking-[0.2em] py-6"
          >
            {t('signup.submit') || 'CREATE ACCOUNT'}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground tracking-[0.1em]">
            {t('signup.haveAccount') || 'Already have an account?'}{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-foreground underline hover:no-underline"
            >
              {t('signup.login') || 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
