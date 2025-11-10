import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { productService } from '../services/product.service';
import { toast } from 'sonner';
import { Heart } from 'lucide-react';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId, onNavigate }) => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useUser();
  const [product, setProduct] = useState<any>(null);
  const [productVariants, setProductVariants] = useState<any[]>([]); // API에서 받은 variants 저장
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  
  useEffect(() => {
    loadProduct();
  }, [productId]);
  
  const loadProduct = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading product from API:', productId);
      const response = await productService.getById(productId);
      console.log('📦 API Response:', response);
      
      // 실제 응답 구조 처리 (타입 무시)
      const responseAny: any = response;
      
      // Axios 전체 response 객체인 경우 (response.data가 있음)
      let actualData: any = responseAny;
      if (responseAny?.data && (responseAny?.status || responseAny?.headers)) {
        actualData = responseAny.data;
      }
      
      // 중첩된 data 구조인 경우
      if (actualData?.data?.data) {
        actualData = actualData.data;
      }
      
      // 실제 product 데이터 추출
      const productData = actualData?.data || actualData;
      
      console.log('📦 Actual data:', actualData);
      console.log('📦 Product data:', productData);
      console.log('📦 Success:', actualData?.success);
      
      if (productData && (actualData?.success || !actualData?.success)) {
        // images 처리
        let imageUrl = '';
        try {
          if (Array.isArray(productData.images)) {
            imageUrl = productData.images[0] || '';
          } else if (typeof productData.images === 'string') {
            const parsed = JSON.parse(productData.images);
            imageUrl = Array.isArray(parsed) ? parsed[0] : parsed;
          }
        } catch (e) {
          console.warn('Failed to parse images:', e);
        }

        // variants 저장
        if (productData.variants && Array.isArray(productData.variants)) {
          setProductVariants(productData.variants);
        }
        
        // variants에서 중복 제거하여 size와 color 추출
        const sizesSet = new Set<string>();
        const colorsSet = new Set<string>();
        
        if (productData.variants && Array.isArray(productData.variants)) {
          productData.variants.forEach((v: any) => {
            if (v.size) sizesSet.add(v.size);
            if (v.color) colorsSet.add(v.color);
          });
        }
        
        const sizes = sizesSet.size > 0 ? Array.from(sizesSet) : ['S', 'M', 'L'];
        const colors = colorsSet.size > 0 ? Array.from(colorsSet) : ['Black'];

        const transformedProduct = {
          id: productData.id,
          name: productData.name,
          price: productData.price,
          image: imageUrl || 'https://via.placeholder.com/400',
          category: productData.category?.slug || 'accessories',
          gender: productData.gender || 'unisex',
          sizes,
          colors,
          description: productData.description || '',
          composition: productData.composition || '',
          careInfo: productData.careInfo || '',
        };
        console.log('✅ Product loaded:', transformedProduct);
        console.log('✅ Variants loaded:', productData.variants);
        setProduct(transformedProduct);
      } else {
        console.warn('⚠️ Invalid API response format:', response);
        console.warn('⚠️ Actual data:', actualData);
        console.warn('⚠️ Product data:', productData);
        toast.error('상품 데이터 형식이 올바르지 않습니다');
      }
    } catch (error: any) {
      console.error('❌ Failed to load product:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error(`상품을 불러올 수 없습니다: ${error.message || 'API 연결 실패'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error('사이즈와 색상을 선택해주세요');
      return;
    }
    
    try {
      // variant 찾기 (API에서 가져온 variants 사용 또는 API 호출)
      let variantId: string | null = null;
      
      // 먼저 이미 로드된 variants에서 찾기
      const existingVariant = productVariants.find(
        (v: any) => v.size === selectedSize && v.color === selectedColor
      );
      
      if (existingVariant) {
        variantId = existingVariant.id;
        console.log('✅ Found variant in loaded variants:', variantId);
      } else {
        // API에서 variant 찾기
        console.log('🔍 Searching for variant via API...');
        try {
          const variantResponse = await productService.getVariantBySizeAndColor(
            productId,
            selectedSize,
            selectedColor
          );
          
          // 응답 구조 처리
          let variantData = variantResponse;
          if ((variantResponse as any).data?.data) {
            variantData = (variantResponse as any).data;
          } else if ((variantResponse as any).data) {
            variantData = (variantResponse as any).data;
          }
          
          if (variantData?.id || (variantData as any).data?.id) {
            variantId = variantData?.id || (variantData as any).data?.id;
            console.log('✅ Found variant via API:', variantId);
          }
        } catch (variantError: any) {
          console.error('❌ Failed to find variant:', variantError);
          toast.error(`사이즈(${selectedSize})와 색상(${selectedColor}) 조합을 찾을 수 없습니다`);
          return;
        }
      }
      
      if (!variantId) {
        toast.error('상품 옵션을 찾을 수 없습니다');
        return;
      }
      
      // 장바구니에 추가 (variantId 전달)
      console.log('📦 Calling addToCart with variantId:', variantId);
      await addToCart(product, selectedSize, selectedColor, variantId);
      
      // 토스트는 CartContext에서 표시하므로 여기서는 표시하지 않음
      
      // 장바구니 페이지로 이동 (약간의 딜레이)
      setTimeout(() => {
        onNavigate('cart');
      }, 500);
    } catch (error: any) {
      console.error('❌ Failed to add to cart:', error);
      toast.error(error.message || '장바구니 추가 실패');
    }
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-16">
          {/* Product Image */}
          <div className="aspect-[3/4] overflow-hidden bg-secondary">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-wide flex-1">{product.name}</h1>
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="p-2 bg-white hover:bg-gray-50 rounded-full transition-all ml-4"
                  aria-label={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart 
                    className={`w-6 h-6 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                  />
                </button>
              </div>
              <p className="text-xl sm:text-2xl">₩{product.price.toLocaleString('ko-KR')}</p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-sm tracking-[0.15em] mb-3 sm:mb-4">{t('product.size')}</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 sm:px-6 py-2 sm:py-3 border text-sm transition-colors ${
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-foreground border-black/20 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-sm tracking-[0.15em] mb-3 sm:mb-4">{t('product.color')}</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-5 sm:px-6 py-2 sm:py-3 border text-sm transition-colors ${
                      selectedColor === color
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-foreground border-black/20 hover:border-black'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full py-5 sm:py-6 bg-black text-white hover:bg-black/90 tracking-[0.15em] text-sm sm:text-base"
            >
              {t('product.addToCart')}
            </Button>

            {/* Product Details */}
            <div className="pt-6 sm:pt-8 space-y-5 sm:space-y-6">
              <div>
                <h3 className="text-sm tracking-[0.15em] mb-2 sm:mb-3">{t('product.description')}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              <div>
                <h3 className="text-sm tracking-[0.15em] mb-2 sm:mb-3">{t('product.composition')}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{product.composition}</p>
              </div>

              <div>
                <h3 className="text-sm tracking-[0.15em] mb-2 sm:mb-3">{t('product.careInfo')}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{product.careInfo}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};