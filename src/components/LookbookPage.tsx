import React, { useState } from 'react';
import Masonry from 'react-responsive-masonry';
import { useLanguage } from '../context/LanguageContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

export const LookbookPage: React.FC = () => {
  const { t } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const lookbookImages = [
    {
      url: 'https://images.unsplash.com/photo-1629922949137-e236a5ab497d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZmFzaGlvbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTU0OTQ3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Minimalist Elegance',
    },
    {
      url: 'https://images.unsplash.com/photo-1611702817465-8dedb5de2103?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZGl0b3JpYWwlMjBmYXNoaW9uJTIwYmxhY2t8ZW58MXx8fHwxNzYxNjMyNDgwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Editorial Black',
    },
    {
      url: 'https://images.unsplash.com/photo-1715541448446-3369e1cc0ee9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBzdHVkaW98ZW58MXx8fHwxNzYxNTUwMzg2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Studio Collection',
    },
    {
      url: 'https://images.unsplash.com/photo-1645997098653-ed4519760b10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25vY2hyb21lJTIwZmFzaGlvbiUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2MTYzMjQ4MXww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Monochrome',
    },
    {
      url: 'https://images.unsplash.com/photo-1588352979339-ded596bbb3e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbG9va2Jvb2slMjBtaW5pbWFsfGVufDF8fHx8MTc2MTYzMjQ4MXww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Lookbook Essential',
    },
    {
      url: 'https://images.unsplash.com/photo-1760565020939-8dfb81ff0d47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGNsb3RoaW5nJTIwZGV0YWlsfGVufDF8fHx8MTc2MTU1MzA0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Designer Details',
    },
    {
      url: 'https://images.unsplash.com/photo-1614172745174-d76736beb78b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcnVud2F5JTIwbW9kZWx8ZW58MXx8fHwxNzYxNTU3MDc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Runway Moment',
    },
    {
      url: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwY2xvdGhpbmclMjBhcHBhcmVsfGVufDF8fHx8MTc2MTYzMjQ4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Minimalist Apparel',
    },
    {
      url: 'https://images.unsplash.com/photo-1620122830785-a18b43585b44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdoaXRlJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjE1NTEwMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Contrast',
    },
  ];

  return (
    <div className="min-h-screen pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-14 lg:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.25em] sm:tracking-[0.3em] mb-3 sm:mb-4">{t('lookbook.title')}</h1>
          <p className="text-sm sm:text-base tracking-[0.2em] text-muted-foreground">{t('lookbook.season')}</p>
        </div>

        {/* Desktop Masonry Grid */}
        <Masonry columnsCount={3} gutter="16px" className="hidden lg:block">
          {lookbookImages.map((item, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <ImageWithFallback
                src={item.url}
                alt={item.title}
                className="w-full transition-transform duration-500 group-hover:scale-105"
              />
              {hoveredIndex === index && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity">
                  <p className="text-white tracking-[0.2em] text-lg">{item.title}</p>
                </div>
              )}
            </div>
          ))}
        </Masonry>

        {/* Tablet Masonry Grid */}
        <Masonry columnsCount={2} gutter="16px" className="hidden sm:block lg:hidden">
          {lookbookImages.map((item, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <ImageWithFallback
                src={item.url}
                alt={item.title}
                className="w-full transition-transform duration-500 group-hover:scale-105"
              />
              {hoveredIndex === index && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity">
                  <p className="text-white tracking-[0.2em] text-base">{item.title}</p>
                </div>
              )}
            </div>
          ))}
        </Masonry>

        {/* Mobile Grid */}
        <div className="sm:hidden grid grid-cols-1 gap-6">
          {lookbookImages.map((item, index) => (
            <div key={index} className="relative overflow-hidden">
              <ImageWithFallback
                src={item.url}
                alt={item.title}
                className="w-full"
              />
              <div className="mt-2 text-center text-sm tracking-wide">{item.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};