import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAdmin } from '../context/AdminContext';
import { authService } from '../services/auth.service';
import { toast } from 'sonner';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin = ({ onLoginSuccess }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await authService.login({ email, password });
      if (result.success) {
        const userData = result.data?.user || (result as any).user;
        if (userData && userData.role === 'admin') {
          toast.success('Admin 로그인 성공');
          onLoginSuccess();
        } else {
          setError('Admin 권한이 없습니다');
          setPassword('');
        }
      } else {
        setError('Invalid credentials');
        setPassword('');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-16">
          <h1 className="text-4xl tracking-[0.3em] mb-4">KITAE</h1>
          <p className="text-sm tracking-[0.2em] text-muted-foreground">ADMIN PORTAL</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm tracking-[0.15em]">
              EMAIL
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-center tracking-[0.1em] border-black"
              placeholder="Enter admin email"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm tracking-[0.15em]">
              PASSWORD
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-center tracking-[0.1em] border-black"
              placeholder="Enter admin password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center tracking-[0.1em]">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white hover:bg-black/90 tracking-[0.2em] py-6"
          >
            {isLoading ? 'LOGGING IN...' : 'LOGIN'}
          </Button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-xs text-muted-foreground tracking-[0.1em]">
            Demo: admin@kitae.com / admin123456
          </p>
        </div>
      </div>
    </div>
  );
};
