import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

export const BrandPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="text-center mb-16 sm:mb-20 lg:mb-24">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.25em] sm:tracking-[0.3em] mb-6 sm:mb-8">{t('brand.title')}</h1>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 xl:gap-24 items-center mb-20 sm:mb-24 lg:mb-32">
          <div className="space-y-6 sm:space-y-8">
            <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed">{t('brand.intro')}</p>
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">{t('brand.vision')}</p>
          </div>
          <div className="aspect-[3/4] overflow-hidden bg-secondary">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1588352979339-ded596bbb3e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbG9va2Jvb2slMjBtaW5pbWFsfGVufDF8fHx8MTc2MTYzMjQ4MXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Brand Philosophy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 xl:gap-24 items-center">
          <div className="order-2 lg:order-1 aspect-[4/3] overflow-hidden bg-secondary">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1614172745174-d76736beb78b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcnVud2F5JTIwbW9kZWx8ZW58MXx8fHwxNzYxNTU3MDc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Brand Values"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 lg:order-2 space-y-6 sm:space-y-8">
            <p className="text-base sm:text-lg lg:text-xl leading-relaxed">{t('brand.values')}</p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-20 sm:mt-24 lg:mt-32 max-w-4xl mx-auto text-center space-y-8 sm:space-y-10 lg:space-y-12">
          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.25em] sm:tracking-[0.3em]">KITAE</div>
          <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-muted-foreground px-4">
            {t('brand.mission')}
          </p>
        </div>
      </div>
    </div>
  );
};