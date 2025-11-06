import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { initKakao, kakaoLogin } from '../utils/kakaoAuth';
import { initGoogle, googleLogin } from '../utils/googleAuth';
import { naverLogin } from '../utils/naverAuth';
import { authService } from '../services/auth.service';

// 같은 탭에서 UserContext 업데이트 트리거
const triggerUserUpdate = (): void => {
  window.dispatchEvent(new CustomEvent('userUpdated'));
};

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

/** ----- 타입/가드 ----- */
type UserData = {
  id?: string | number;
  email?: string;
  name?: string;
  [k: string]: unknown;
};

type ApiResponse = {
  success: boolean;
  data?: unknown;
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

const extractUserData = (result: unknown): UserData | null => {
  if (!isRecord(result)) return null;
  const success = typeof result.success === 'boolean' ? result.success : false;
  if (!success) return null;

  const data = (result as ApiResponse).data;
  if (isRecord(data)) {
    if ('user' in data && isRecord((data as Record<string, unknown>).user)) {
      return data.user as UserData;
    }
    return data as UserData;
  }
  return null;
};

export const LoginPage = ({ onNavigate }: LoginPageProps) => {
  const { login } = useUser();
  const { language, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [kakaoReady, setKakaoReady] = useState(true);
  const [googleReady, setGoogleReady] = useState(true);

  useEffect(() => {
    async function initKakaoSDK(): Promise<void> {
      try {
        await initKakao();
        setKakaoReady(true);
      } catch (err) {
        setKakaoReady(false);
        console.error('Kakao SDK Init Error:', err);
      }
    }

    async function initGoogleSDK(): Promise<void> {
      try {
        await initGoogle();
        setGoogleReady(true);
      } catch (err) {
        setGoogleReady(false);
        console.error('Google SDK Init Error:', err);
      }
    }

    // OAuth 콜백 처리
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    const error_description = urlParams.get('error_description');
    
    // URL 경로로 카카오/네이버 구분
    const currentPath = window.location.pathname;
    const isKakaoCallback = currentPath.includes('/oauth/kakao/callback');
    const isNaverCallback = currentPath.includes('/oauth/naver/callback');

    if (error) {
      toast.error(
        language === 'KO'
          ? `소셜 로그인 실패: ${error_description ?? error}`
          : `Social login failed: ${error_description ?? error}`
      );
      window.history.replaceState({}, '', '/login');
    } else if (code && state) {
      // URL 경로 우선, 없으면 state로 구분
      const kakaoState = sessionStorage.getItem('kakao_state');
      const isKakao = isKakaoCallback || (isNaverCallback === false && state === kakaoState);

      (async () => {
        try {
          setIsLoading(true);
          // authorization 요청 시 사용한 redirectUri를 sessionStorage에서 가져오기
          // 카카오는 저장된 값 사용, 네이버는 현재 URL 사용
          const redirectUri = isKakao 
            ? sessionStorage.getItem('kakao_redirect_uri') || `${window.location.origin}${currentPath}`
            : `${window.location.origin}${currentPath}`;
          
          console.log('📋 Using redirectUri:', { isKakao, redirectUri, currentPath });
          
          console.log('🔗 OAuth Callback - Starting login...', { isKakao, hasCode: !!code, hasState: !!state, redirectUri });
          
          const result = isKakao
            ? await authService.kakaoLogin(code, state, redirectUri)
            : await authService.naverLogin(code, state, redirectUri);

          console.log('📦 OAuth Callback - Login result:', result);

          // auth.service에서 이미 localStorage에 저장했지만, 한번 더 확인
          const userData = extractUserData(result);
          if (userData) {
            // auth.service에서 이미 저장했지만, 확실하게 하기 위해 다시 저장
            localStorage.setItem('user', JSON.stringify(userData));
            
            // 토큰도 저장 (auth.service에서 저장했지만 확인)
            if (result.success && result.data?.token) {
              localStorage.setItem('token', result.data.token);
            }
            
            triggerUserUpdate();
            
            console.log('✅ OAuth Callback - User saved:', userData);
            
            toast.success(
              language === 'KO'
                ? `${isKakao ? '카카오' : '네이버'} 로그인 성공`
                : `${isKakao ? 'Kakao' : 'Naver'} login successful`
            );
            setTimeout(() => onNavigate('home'), 300);
          } else {
            console.error('❌ OAuth Callback - User data not found:', result);
            toast.error(
              language === 'KO'
                ? `${isKakao ? '카카오' : '네이버'} 로그인 응답 형식 오류`
                : `${isKakao ? 'Kakao' : 'Naver'} login response format error`
            );
          }
        } catch (err: unknown) {
          const msg =
            err instanceof Error
              ? err.message
              : language === 'KO'
              ? `${isKakao ? '카카오' : '네이버'} 로그인 실패`
              : `${isKakao ? 'Kakao' : 'Naver'} login failed`;
          toast.error(msg);
        } finally {
          setIsLoading(false);
          // callback 경로를 /login으로 변경
          if (isKakaoCallback || isNaverCallback) {
            window.history.replaceState({}, '', '/login');
          }
        }
      })();
    } else {
      void initKakaoSDK();
      void initGoogleSDK();
    }
  }, [language, onNavigate]);

  /** ----- 이메일/비밀번호 로그인 ----- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const contextSuccess = login(email, password);
      if (contextSuccess) {
        toast.success(language === 'KO' ? '로그인 성공' : 'Login successful');
        onNavigate('home');
        setIsLoading(false);
        return;
      }

      const result = await authService.login({ email, password });
      
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        triggerUserUpdate();
        toast.success(language === 'KO' ? '로그인 성공' : 'Login successful');
        setTimeout(() => onNavigate('home'), 300);
        return;
      }

      const userData = extractUserData(result);
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
          triggerUserUpdate();
        toast.success(language === 'KO' ? '로그인 성공' : 'Login successful');
        setTimeout(() => onNavigate('home'), 300);
        } else {
        toast.error(language === 'KO' ? '로그인 응답 형식 오류' : 'Login response format error');
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : language === 'KO'
          ? '이메일 또는 비밀번호가 잘못되었습니다'
          : 'Invalid email or password';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  /** ----- 소셜 핸들러 ----- */
  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await initGoogle();
      const idToken = await googleLogin();
      if (!idToken) throw new Error('Failed to get ID token from Google');

      const result = await authService.googleLogin(idToken);
      const userData = extractUserData(result);
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        triggerUserUpdate();
        toast.success(language === 'KO' ? '구글 로그인 성공' : 'Google login successful');
        setTimeout(() => onNavigate('home'), 300);
      } else {
        toast.error(language === 'KO' ? '구글 로그인 응답 형식 오류' : 'Google login response format error');
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : language === 'KO' ? '구글 로그인 실패' : 'Google login failed';
      if (msg.includes('origin is not allowed') || msg.toLowerCase().includes('cors')) {
        toast.error(
          language === 'KO'
            ? '구글 로그인 설정 오류: Google Cloud Console에서 현재 도메인을 승인해주세요.'
            : 'Google login setup error: Please authorize this domain in Google Cloud Console.'
        );
      } else {
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNaverLogin = (): void => naverLogin();
  const handleKakaoLogin = (): void => kakaoLogin();

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

        <div className="mt-6 space-y-3">
          {googleReady && (
            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-gray-100 tracking-[0.2em] py-6 border border-black"
            >
              {t('login.googleLogin') || 'LOGIN WITH GOOGLE'}
            </Button>
          )}
          <Button
            type="button"
            onClick={handleKakaoLogin}
            disabled={isLoading}
            className="w-full bg-[#FEE500] text-black hover:bg-[#FEE500]/90 tracking-[0.2em] py-6 border border-black"
          >
            {t('login.kakaoLogin') || 'LOGIN WITH KAKAO'}
          </Button>
          <Button
            type="button"
            onClick={handleNaverLogin}
            disabled={isLoading}
            className="w-full bg-[#03C75A] text-black hover:bg-[#03C75A]/90 tracking-[0.2em] py-6 border border-black"
          >
            {t('login.naverLogin') || 'LOGIN WITH NAVER'}
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
      </div>
    </div>
  );
};
