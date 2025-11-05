import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { initKakao, kakaoLogin } from '../utils/kakaoAuth';
import { authService } from '../services/auth.service';

// Custom event to trigger UserContext update
const triggerUserUpdate = () => {
  // 같은 탭에서 localStorage 변경을 감지하기 위한 커스텀 이벤트
  window.dispatchEvent(new CustomEvent('userUpdated'));
};

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage = ({ onNavigate }: LoginPageProps) => {
  const { login } = useUser();
  const { language, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initKakao();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Context 함수와 API 서비스 둘 다 시도
      const contextSuccess = login(email, password);
      if (contextSuccess) {
        toast.success(t('login.success') || 'Login successful');
        onNavigate('home');
        setIsLoading(false);
        return;
      }

      // API 호출 (세션 쿠키가 자동으로 설정됨)
      const result = await authService.login({ email, password });
      console.log('📦 Login API Response from authService:', result);
      
      // authService에서 이미 처리했지만, 한번 더 확인
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        console.log('✅ User already saved in authService:', userData);
        
        // UserContext 업데이트 트리거
        triggerUserUpdate();
        
        setTimeout(() => {
          const confirmed = localStorage.getItem('user');
          if (confirmed) {
            const parsed = JSON.parse(confirmed);
            console.log('✅ User confirmed saved:', parsed.email);
            console.log('✅ Current UserContext should be updated');
          }
        }, 100);
        
        toast.success(t('login.success') || 'Login successful');
        
        // 로그인 성공 후 무조건 홈으로 이동
        setTimeout(() => {
          onNavigate('home');
        }, 300);
      } else {
        // authService에서 저장되지 않은 경우 직접 처리
        console.warn('⚠️ User not saved in authService, trying to extract from result');
        
        let userData = null;
        if (result.success) {
          if (result.data?.user) {
            userData = result.data.user;
          } else if (result.data && result.data.id) {
            userData = result.data;
          } else if (result.user) {
            userData = result.user;
          }
        }
        
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
          console.log('✅ User saved manually:', userData);
          triggerUserUpdate();
          toast.success(t('login.success') || 'Login successful');
          setTimeout(() => {
            onNavigate('home');
          }, 300);
        } else {
          console.error('❌ User data not found in response:', result);
          toast.error(t('login.responseError') || 'Login response format error');
        }
      }
    } catch (error: any) {
      toast.error(error.message || t('login.error') || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    try {
      setIsLoading(true);
      await initKakao();
      const accessToken = await kakaoLogin();
      
      const result = await authService.kakaoLogin(accessToken as string);
      
      console.log('📦 Kakao Login API Response:', result);
      
      // 응답 구조 확인 및 사용자 정보 추출
      let userData = null;
      
      if (result.success) {
        if (result.data?.user) {
          userData = result.data.user;
        } else if (result.data && !result.data.user) {
          userData = result.data;
        } else if (result.user) {
          userData = result.user;
        }
      }
      
      console.log('👤 Extracted user data (Kakao):', userData);
      
      if (userData) {
        // localStorage에 user 정보 저장
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('✅ User saved to localStorage (Kakao):', userData);
        
        // UserContext 업데이트 트리거
        triggerUserUpdate();
        
        setTimeout(() => {
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            const parsed = JSON.parse(savedUser);
            console.log('✅ User confirmed saved (Kakao):', parsed.email);
          }
        }, 100);
        
        toast.success(t('login.kakaoSuccess') || 'Kakao login successful');
        
        // 로그인 성공 후 무조건 홈으로 이동
        setTimeout(() => {
          onNavigate('home');
        }, 300);
      } else {
        console.error('❌ User data not found in Kakao response:', result);
        toast.error(t('login.kakaoResponseError') || 'Kakao login response format error');
      }
    } catch (error: any) {
      toast.error(error.message || t('login.kakaoError') || 'Kakao login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-16">
          <h1 className="text-4xl tracking-[0.3em] mb-4">KITAE</h1>
          <p className="text-sm tracking-[0.2em] text-muted-foreground">
            {t('login.title') || 'LOGIN'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm tracking-[0.15em]">
              {t('login.email') || 'EMAIL'}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-center tracking-[0.1em] border-black"
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm tracking-[0.15em]">
              {t('login.password') || 'PASSWORD'}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-center tracking-[0.1em] border-black"
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white hover:bg-black/90 tracking-[0.2em] py-6 disabled:opacity-50"
          >
            {isLoading ? t('login.loading') : (t('login.submit') || 'LOGIN')}
          </Button>
        </form>

        <div className="mt-6">
          <Button
            type="button"
            onClick={handleKakaoLogin}
            disabled={isLoading}
            className="w-full bg-[#FEE500] text-black hover:bg-[#FEE500]/90 tracking-[0.2em] py-6"
          >
            {t('login.kakaoLogin') || 'LOGIN WITH KAKAO'}
          </Button>
        </div>

        <div className="mt-8 space-y-3 text-center">
          <p className="text-sm text-muted-foreground tracking-[0.1em]">
            {t('login.noAccount') || "Don't have an account?"}{' '}
            <button
              onClick={() => onNavigate('signup')}
              className="text-foreground underline hover:no-underline"
            >
              {t('login.signUp') || 'Sign up'}
            </button>
          </p>
          <div className="text-center">
            <button
              onClick={() => window.location.href = '/reset-password'}
              className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm"
            >
              {t('login.resetPassword') || 'Reset Password'}
            </button>
          </div>
        </div>

        <div className="mt-12 p-6 bg-gray-50 text-center">
          <p className="text-xs text-muted-foreground tracking-[0.1em] mb-2">
            {t('login.demoAccounts') || 'Demo Accounts'}
          </p>
          <p className="text-xs text-muted-foreground">
            user@kitae.com / password123
          </p>
        </div>
      </div>
    </div>
  );
};
