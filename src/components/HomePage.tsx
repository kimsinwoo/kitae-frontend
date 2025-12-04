import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from './ProductCard';
import { Button } from './ui/button';
// import { ImageWithFallback } from './figma/ImageWithFallback'; // ⛔️ 더 이상 사용 안 함
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { productService } from '../services/product.service';
import { toast } from 'sonner';

interface HomePageProps {
  onNavigate?: (page: string, productId?: string) => void;
}

interface HeroImage {
  src: string;
  position: string; // background-position
}

const HomePageContent: React.FC<HomePageProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      console.log('🔍 Loading featured products from API...');
      const response = await productService.getFeatured();
      console.log('📦 API Response:', response);
      console.log('📦 Response success:', response.success);
      console.log('📦 Response data type:', Array.isArray(response.data) ? 'array' : typeof response.data);
      console.log('📦 Response data length:', Array.isArray(response.data) ? response.data.length : 'N/A');

      // product.service.ts에서 이미 정리된 데이터를 반환
      if (response.success && Array.isArray(response.data) && response.data.length > 0) {
        console.log(`✅ Loaded ${response.data.length} featured products`);
        console.log('📦 First product sample:', response.data[0]);
        setProducts(response.data);
      } else {
        console.warn('⚠️ No featured products found, trying fallback...');
        console.warn('⚠️ Response structure:', {
          success: response.success,
          hasData: !!response.data,
          isArray: Array.isArray(response.data),
          length: Array.isArray(response.data) ? response.data.length : undefined
        });
        await loadAllProducts();
      }
    } catch (error: any) {
      console.error('❌ Failed to load featured products:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error(`상품을 불러올 수 없습니다: ${error.message || 'API 연결 실패'}`);
      await loadAllProducts();
    }
  };

  const loadAllProducts = async () => {
    try {
      console.log('🔄 Trying to load all products as fallback...');
      const response = await productService.getAll({
        page: 1,
        limit: 20,
        featured: true,
        status: 'active',
      });

      // product.service.ts에서 이미 정리된 데이터를 반환
      if (response.success && response.data?.products && response.data.products.length > 0) {
        console.log(`✅ Loaded ${response.data.products.length} products as fallback`);
        setProducts(response.data.products);
      } else {
        console.warn('⚠️ No products found in fallback response');
      }
    } catch (error: any) {
      console.error('❌ Fallback also failed:', error);
      toast.error(
        t('home.serverConnectionError') ||
          'Unable to connect to server. Please check if the backend is running.',
      );
    }
  };

  // ✅ 이미지 + 위치를 함께 관리
  const heroImages: HeroImage[] = [
    {
      src: 'https://lupl.notion.site/image/attachment%3Aeeb4c73a-95f1-41f6-9451-bd2a30c30bcd%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A29725.jpg?table=block&id=2bea6583-95de-801a-9508-cf1697fe3249&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      position: 'center 15%', // 👉 원하는 대로 조절 (위쪽 보고 싶으면 0~20%)
    },
    {
      src: 'https://lupl.notion.site/image/attachment%3A5c0b7078-5340-454f-bc79-08275b73a315%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210302.jpg?table=block&id=2bea6583-95de-804b-918e-ec1282a3ce45&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      position: 'center 30%',
    },
    {
      src: 'https://lupl.notion.site/image/attachment%3A200ff74d-320c-4531-8dbc-40b960700cbb%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210597.jpg?table=block&id=2bea6583-95de-8005-9439-c6b1871fa8f5&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      position: 'center 20%',
    },
    {
      src: 'https://lupl.notion.site/image/attachment%3A8f7eed1b-40ed-4fbd-aed4-3b0a644be0fa%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210887.jpg?table=block&id=2bea6583-95de-80bc-86eb-c36c76a8a7d4&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      position: 'center 20%',
    },
  ];

  const featuredProducts = products.slice(0, 6);
  console.log('📦 Featured products count:', featuredProducts.length);

  const transformedProducts = featuredProducts.map((p) => {
    // 이미지 처리 - product.service.ts에서 이미 정규화되었지만 안전하게 처리
    let imageUrl = '';
    try {
      if (Array.isArray(p.images) && p.images.length > 0) {
        imageUrl = p.images[0];
      } else if (typeof p.images === 'string') {
        // 문자열인 경우 JSON 파싱 시도
        try {
          const parsed = JSON.parse(p.images);
          imageUrl = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : (parsed || '');
        } catch {
          // JSON이 아닌 경우 문자열 자체를 사용
          imageUrl = p.images;
        }
      }
    } catch (e) {
      console.warn('Failed to parse images for product:', p.id, p.name, e);
    }

    // Variants에서 size와 color 추출
    const sizesSet = new Set<string>();
    const colorsSet = new Set<string>();

    if (p.variants && Array.isArray(p.variants) && p.variants.length > 0) {
      p.variants.forEach((v: any) => {
        if (v.size) sizesSet.add(v.size);
        if (v.color) colorsSet.add(v.color);
      });
    }

    const sizes = sizesSet.size > 0 ? Array.from(sizesSet) : ['S', 'M', 'L'];
    const colors = colorsSet.size > 0 ? Array.from(colorsSet) : ['Black'];

    const transformed = {
      id: p.id,
      name: p.name,
      price: p.price,
      image: imageUrl || 'https://via.placeholder.com/400',
      category: p.category?.slug || 'accessories',
      gender: p.gender || 'unisex',
      sizes,
      colors,
    };

    if (!imageUrl) {
      console.warn(`⚠️ No image found for product: ${p.id} - ${p.name}`, {
        images: p.images,
        imagesType: typeof p.images,
        isArray: Array.isArray(p.images)
      });
    }

    return transformed;
  });

  console.log('📦 Transformed products count:', transformedProducts.length);
  console.log('📦 Transformed products sample:', transformedProducts[0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const currentHero = heroImages[currentSlide];

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <section className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {/* ✅ 여기서 배경 이미지 + 위치 직접 제어 */}
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${currentHero.src})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: currentHero.position, // ← 여기 값으로 위치 완전 컨트롤
              }}
            />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 text-white hover:opacity-80 transition-opacity"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 text-white hover:opacity-80 transition-opacity"
          aria-label="Next slide"
        >
          <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-6 sm:w-8' : 'bg-white/50 w-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-[0.15em] sm:tracking-[0.2em] text-center mb-8 sm:mb-10 lg:mb-12 max-w-5xl">
            {t('home.slogan')}
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              onClick={() => {
                if (onNavigate) {
                  onNavigate('shop');
                } else {
                  navigate('/shop');
                }
              }}
              className="px-8 sm:px-10 lg:px-12 py-5 sm:py-6 bg-white text-black hover:bg-white/90 tracking-[0.15em] text-sm sm:text-base"
            >
              {t('home.shopNow')}
            </Button>
            <Button
              onClick={() => {
                if (onNavigate) {
                  onNavigate('lookbook');
                } else {
                  navigate('/lookbook');
                }
              }}
              className="px-8 sm:px-10 lg:px-12 py-5 sm:py-6 bg-transparent border-2 border-white text-white hover:bg-white hover:text-black tracking-[0.15em] text-sm sm:text-base"
            >
              {t('home.viewLookbook')}
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Philosophy */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 xl:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
          <p className="text-base sm:text-lg lg:text-xl leading-relaxed">
            {t('home.philosophy')}
          </p>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-24">
        <h2 className="text-center tracking-[0.2em] mb-12 sm:mb-14 lg:mb-16">
          {t('home.featured')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
          {transformedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => {
                if (onNavigate) {
                  onNavigate('product', product.id);
                } else {
                  navigate(`/product/${product.id}`);
                }
              }}
            />
          ))}
        </div>
        <div className="flex justify-center mt-12 sm:mt-14 lg:mt-16">
          <Button
            onClick={() => {
              if (onNavigate) {
                onNavigate('shop');
              } else {
                navigate('/shop');
              }
            }}
            className="px-8 sm:px-10 lg:px-12 py-5 sm:py-6 bg-black text-white hover:bg-black/90 tracking-[0.15em] text-sm sm:text-base"
          >
            {t('nav.shop')}
          </Button>
        </div>
      </section>
    </div>
  );
};

// Wrapper for backward compatibility
export const HomePage: React.FC = () => <HomePageContent />;
