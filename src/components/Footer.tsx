import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../data/translations';

export const Footer: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const languages: Language[] = ['EN', 'KO', 'JP', 'ZH', 'ES'];

  return (
    <footer className="border-t border-black/10 bg-white mt-16 sm:mt-20 lg:mt-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 sm:gap-12 lg:gap-8">
          {/* Left: Logo and Description */}
          <div className="space-y-3 sm:space-y-4">
            <div className="text-sm sm:text-base tracking-[0.2em]">KITAE</div>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t('footer.description')}
            </p>
          </div>

          {/* Middle: Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <div className="text-sm tracking-[0.15em]">{t('footer.shop')}</div>
            <div className="space-y-2 sm:space-y-3">
              <Link
                to="/shop"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('nav.shop')}
              </Link>
              <Link
                to="/lookbook"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('nav.lookbook')}
              </Link>
              <Link
                to="/brand"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('footer.about')}
              </Link>
            </div>
          </div>

          {/* Right: Social and Language */}
          <div className="space-y-3 sm:space-y-4">
            <div className="text-sm tracking-[0.15em]">{t('footer.help')}</div>
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                {t('footer.contact')}
              </div>
              <div className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                {t('footer.faq')}
              </div>
              <div className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                {t('footer.shipping')}
              </div>
              <div className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                {t('footer.returns')}
              </div>
              <Link
                to="/admin"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left block"
              >
                Admin Portal
              </Link>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
              <button className="hover:opacity-60 transition-opacity" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="hover:opacity-60 transition-opacity" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="hover:opacity-60 transition-opacity" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2 pt-2 sm:pt-4 flex-wrap">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 border text-xs transition-colors ${
                    language === lang
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-foreground border-black/20 hover:border-black'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 sm:mt-14 lg:mt-16 pt-6 sm:pt-8 border-t border-black/10 text-center text-xs sm:text-sm text-muted-foreground">
          © 2025 KITAE. All rights reserved.
        </div>
      </div>
    </footer>
  );
};