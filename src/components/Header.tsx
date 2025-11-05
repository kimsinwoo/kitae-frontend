import React from 'react';
import { Link } from 'react-router-dom';
import { Search, User, ShoppingCart, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { Language } from '../data/translations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
export const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { cart } = useCart();
  const { user } = useUser();

  const languages: Language[] = ['EN', 'KO'];

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-black/10 z-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="tracking-[0.2em] hover:opacity-60 transition-opacity text-sm sm:text-base"
          >
            <img src="/KITAE-logo.jpg" alt="KITAE Logo" className="w-10 h-10 rounded-lg" style={{ background: 'transparent' }} />
          </Link>

          {/* Center Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-12">
            <Link
              to="/lookbook"
              className="text-sm tracking-[0.15em] hover:opacity-60 transition-opacity"
            >
              {t('nav.lookbook')}
            </Link>
            <Link
              to="/shop"
              className="text-sm tracking-[0.15em] hover:opacity-60 transition-opacity"
            >
              {t('nav.shop')}
            </Link>
            <Link
              to="/brand"
              className="text-sm tracking-[0.15em] hover:opacity-60 transition-opacity"
            >
              {t('nav.brand')}
            </Link>
            <Link
              to="/info"
              className="text-sm tracking-[0.15em] hover:opacity-60 transition-opacity"
            >
              {t('nav.info')}
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button className="hover:opacity-60 transition-opacity hidden lg:block" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            {/* Admin 버튼 (role이 admin인 경우에만 표시) */}
            {(user?.role === 'admin' || (() => {
              try {
                const storedUser = localStorage.getItem('user');
                return storedUser ? JSON.parse(storedUser).role === 'admin' : false;
              } catch {
                return false;
              }
            })()) && (
              <Link
                to="/admin"
                className="hover:opacity-60 transition-opacity hidden lg:block text-sm tracking-[0.15em]"
                aria-label="Admin"
              >
                ADMIN
              </Link>
            )}
            <Link
              to={user ? '/mypage' : '/login'}
              className="hover:opacity-60 transition-opacity hidden lg:block"
              aria-label={user ? 'My Page' : 'Login'}
            >
              <User className="w-5 h-5" />
            </Link>
            <Link
              to="/cart"
              className="hover:opacity-60 transition-opacity relative"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:opacity-60 transition-opacity flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <span className="text-xs tracking-wider hidden sm:inline">{language}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border border-black/10">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`cursor-pointer tracking-wider text-sm ${
                      language === lang ? 'bg-black text-white' : ''
                    }`}
                  >
                    {lang}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex lg:hidden items-center justify-center gap-6 sm:gap-8 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-black/10">
          <Link
            to="/lookbook"
            className="text-xs sm:text-sm tracking-[0.15em] hover:opacity-60 transition-opacity"
          >
            {t('nav.lookbook')}
          </Link>
          <Link
            to="/shop"
            className="text-xs sm:text-sm tracking-[0.15em] hover:opacity-60 transition-opacity"
          >
            {t('nav.shop')}
          </Link>
          <Link
            to="/brand"
            className="text-xs sm:text-sm tracking-[0.15em] hover:opacity-60 transition-opacity"
          >
            {t('nav.brand')}
          </Link>
        </nav>
      </div>
    </header>
  );
};