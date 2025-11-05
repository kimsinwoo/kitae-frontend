import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { authService } from '../services/auth.service';
import { ArrowLeft } from 'lucide-react';

const translations: any = {
  ko: {
    title: '비밀번호 변경',
    emailPlaceholder: '이메일을 입력하세요',
    codePlaceholder: '인증 코드를 입력하세요',
    passwordPlaceholder: '새 비밀번호를 입력하세요',
    confirmPasswordPlaceholder: '비밀번호를 다시 입력하세요',
    sendCode: '인증 코드 발송',
    verify: '인증하기',
    reset: '비밀번호 변경',
    resend: '재발송',
    backToLogin: '로그인으로 돌아가기',
    seconds: '초',
    codeSent: '인증 코드가 발송되었습니다',
    passwordReset: '비밀번호가 변경되었습니다',
    passwordMismatch: '비밀번호가 일치하지 않습니다',
    passwordMinLength: '비밀번호는 최소 6자 이상이어야 합니다',
  },
  en: {
    title: 'Reset Password',
    emailPlaceholder: 'Enter your email',
    codePlaceholder: 'Enter verification code',
    passwordPlaceholder: 'Enter new password',
    confirmPasswordPlaceholder: 'Confirm password',
    sendCode: 'Send Verification Code',
    verify: 'Verify',
    reset: 'Reset Password',
    resend: 'Resend',
    backToLogin: 'Back to Login',
    seconds: 'seconds',
    codeSent: 'Verification code sent',
    passwordReset: 'Password reset successfully',
    passwordMismatch: 'Passwords do not match',
    passwordMinLength: 'Password must be at least 6 characters',
  },
};

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  // KITAE uses 'EN' and 'KO', but translations use 'ko' and 'en'
  const langKey = language === 'KO' ? 'ko' : 'en';
  const t = translations[langKey];
  
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendCode = async () => {
    if (!email) {
      toast.error(langKey === 'ko' ? '이메일을 입력해주세요' : 'Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      await authService.sendResetPasswordVerification(email);
      toast.success(t.codeSent);
      setStep('verify');
      setCountdown(180);
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      toast.error(error?.message || (langKey === 'ko' ? '인증 코드 발송 실패' : 'Failed to send verification code'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!code) {
      toast.error(langKey === 'ko' ? '인증 코드를 입력해주세요' : 'Please enter verification code');
      return;
    }

    setIsLoading(true);
    try {
      setStep('reset');
      toast.success(langKey === 'ko' ? '인증이 완료되었습니다' : 'Verification successful');
    } catch (error: any) {
      toast.error(error?.message || (langKey === 'ko' ? '인증 실패' : 'Verification failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error(langKey === 'ko' ? '비밀번호를 입력해주세요' : 'Please enter password');
      return;
    }

    if (password.length < 6) {
      toast.error(t.passwordMinLength);
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t.passwordMismatch);
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPasswordWithVerification(email, code, password);
      toast.success(t.passwordReset);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error: any) {
      toast.error(error?.message || (langKey === 'ko' ? '비밀번호 변경 실패' : 'Failed to reset password'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/login')}
              className="text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-4xl tracking-[0.3em]">KITAE</h1>
          </div>
          <p className="text-sm tracking-[0.2em] text-muted-foreground">{t.title}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-lg">

          {step === 'email' && (
            <div className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm tracking-[0.15em]">
                  {langKey === 'ko' ? '이메일' : 'EMAIL'}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="text-center tracking-[0.1em] border-black"
                  required
                />
              </div>

              <Button
                onClick={handleSendCode}
                disabled={isLoading}
                className="w-full bg-black text-white hover:bg-black/90 tracking-[0.2em] py-6 disabled:opacity-50"
              >
                {isLoading ? (langKey === 'ko' ? '발송 중...' : 'Sending...') : t.sendCode}
              </Button>
            </div>
          )}

          {step === 'verify' && (
            <div className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="code" className="text-sm tracking-[0.15em]">
                  {langKey === 'ko' ? '인증 코드' : 'VERIFICATION CODE'}
                </Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder={t.codePlaceholder}
                  className="text-center tracking-[0.1em] border-black text-2xl tracking-widest"
                  maxLength={6}
                />
                {countdown > 0 && (
                  <p className="text-sm text-muted-foreground text-center">
                    {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')} {t.seconds}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setStep('email');
                    setCode('');
                  }}
                  variant="outline"
                  className="flex-1 tracking-[0.1em]"
                >
                  {langKey === 'ko' ? '이메일 변경' : 'Change Email'}
                </Button>
                <Button
                  onClick={handleVerify}
                  disabled={isLoading || code.length !== 6}
                  className="flex-1 bg-black text-white hover:bg-black/90 tracking-[0.2em] py-6 disabled:opacity-50"
                >
                  {isLoading ? (langKey === 'ko' ? '인증 중...' : 'Verifying...') : t.verify}
                </Button>
              </div>

              {countdown === 0 && (
                <Button
                  onClick={handleSendCode}
                  variant="outline"
                  className="w-full tracking-[0.1em]"
                >
                  {t.resend}
                </Button>
              )}
            </div>
          )}

          {step === 'reset' && (
            <div className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm tracking-[0.15em]">
                  {langKey === 'ko' ? '새 비밀번호' : 'NEW PASSWORD'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="text-center tracking-[0.1em] border-black"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-sm tracking-[0.15em]">
                  {langKey === 'ko' ? '비밀번호 확인' : 'CONFIRM PASSWORD'}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t.confirmPasswordPlaceholder}
                  className="text-center tracking-[0.1em] border-black"
                  required
                />
              </div>

              <Button
                onClick={handleResetPassword}
                disabled={isLoading}
                className="w-full bg-black text-white hover:bg-black/90 tracking-[0.2em] py-6 disabled:opacity-50"
              >
                {isLoading ? (langKey === 'ko' ? '변경 중...' : 'Resetting...') : t.reset}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

