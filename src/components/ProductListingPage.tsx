import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from './ProductCard';
import { Checkbox } from './ui/checkbox';
import { productService } from '../services/product.service';
import { toast } from 'sonner';

interface ProductListingPageProps {
  onNavigate: (page: string, productId?: string) => void;
}

export const ProductListingPage: React.FC<ProductListingPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  
  useEffect(() => {
    loadProducts();
  }, [selectedCategories, selectedGenders]);
  
  const loadProducts = async () => {
    try {
      console.log('🔍 Loading featured products from API...');
      
      // /products/featured 엔드포인트 사용
      const response = await productService.getFeatured();
      
      console.log('📦 API Response:', response);
      console.log('📦 Response type:', typeof response);
      console.log('📦 Response keys:', Object.keys(response || {}));
      
      // 응답 구조 처리 - axios response 객체일 수도 있음
      let responseData: any = response;
      
      // axios response 객체인 경우 (status, headers 등이 있으면)
      if (response && typeof response === 'object' && 'status' in response && 'data' in response) {
        console.log('📦 Detected axios response object, extracting data...');
        responseData = (response as any).data;
      }
      
      // 중첩된 data 구조 처리
      if (responseData?.data && responseData.success !== undefined) {
        responseData = responseData.data;
      }
      
      console.log('📦 Processed response data:', responseData);
      console.log('📦 Is array:', Array.isArray(responseData));
      console.log('📦 Length:', Array.isArray(responseData) ? responseData.length : 'N/A');
      
      // 배열인 경우 직접 사용
      let productsArray: any[] = [];
      if (Array.isArray(responseData)) {
        productsArray = responseData;
      } else if (responseData?.success && Array.isArray(responseData.data)) {
        productsArray = responseData.data;
      } else if (responseData?.data && Array.isArray(responseData.data)) {
        productsArray = responseData.data;
      }
      
      if (productsArray.length > 0) {
        console.log(`✅ Found ${productsArray.length} featured products`);
        
        // 이미지와 variants 변환
        const transformedProducts = productsArray.map((p: any) => {
          // images 처리
          let imageUrl = '';
          if (Array.isArray(p.images) && p.images.length > 0) {
            imageUrl = p.images[0];
          } else if (typeof p.images === 'string') {
            try {
              const parsed = JSON.parse(p.images);
              imageUrl = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : (parsed || '');
            } catch {
              imageUrl = p.images;
            }
          }

          // variants에서 중복 제거하여 size와 color 추출
          const sizesSet = new Set<string>();
          const colorsSet = new Set<string>();
          
          if (p.variants && Array.isArray(p.variants)) {
            p.variants.forEach((v: any) => {
              if (v.size) sizesSet.add(v.size);
              if (v.color) colorsSet.add(v.color);
            });
          }
          
          const sizes = sizesSet.size > 0 ? Array.from(sizesSet) : ['S', 'M', 'L'];
          const colors = colorsSet.size > 0 ? Array.from(colorsSet) : ['Black'];

          return {
            id: p.id,
            name: p.name,
            price: p.price,
            image: imageUrl || 'https://via.placeholder.com/400',
            category: p.category?.slug || 'accessories',
            gender: p.gender || 'unisex',
            sizes,
            colors,
          };
        });
        
        console.log(`✅ Transformed ${transformedProducts.length} products`);
        setProducts(transformedProducts);
      } else {
        console.warn('⚠️ No products found in response');
        console.warn('⚠️ Response structure:', {
          responseType: typeof response,
          responseDataType: typeof responseData,
          isArray: Array.isArray(responseData),
          hasData: !!responseData?.data,
          responseKeys: Object.keys(response || {}),
          responseDataKeys: Object.keys(responseData || {})
        });
        setProducts([]);
      }
    } catch (error: any) {
      console.error('❌ Failed to load products:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error(`상품을 불러올 수 없습니다: ${error.message || 'API 연결 실패'}`);
      setProducts([]);
    }
  };

  const categories = ['tops', 'bottoms', 'outerwear', 'accessories'];
  const genders = ['women', 'men', 'unisex'];

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const toggleGender = (gender: string) => {
    setSelectedGenders((prev) =>
      prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender]
    );
  };

  const filteredProducts = products;
  
  // 필터는 API에서 이미 처리되므로 여기서는 그대로 표시
  // 필요하면 클라이언트 사이드 필터링도 가능:
  // const filteredProducts = products.filter((product) => {
  //   const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
  //   const genderMatch = selectedGenders.length === 0 || selectedGenders.includes(product.gender);
  //   return categoryMatch && genderMatch;
  // });

  return (
    <div className="min-h-screen pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-56 xl:w-64 space-y-6 lg:space-y-8">
            <div>
              <h3 className="text-sm tracking-[0.15em] mb-3 sm:mb-4">{t('filter.category')}</h3>
              <div className="space-y-2 sm:space-y-3">
                {categories.map((category) => (
                  <div key={category} className="flex items-center gap-3">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <label
                      htmlFor={category}
                      className="cursor-pointer capitalize text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t(`filter.${category}`)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm tracking-[0.15em] mb-3 sm:mb-4">{t('filter.gender')}</h3>
              <div className="space-y-2 sm:space-y-3">
                {genders.map((gender) => (
                  <div key={gender} className="flex items-center gap-3">
                    <Checkbox
                      id={gender}
                      checked={selectedGenders.includes(gender)}
                      onCheckedChange={() => toggleGender(gender)}
                    />
                    <label
                      htmlFor={gender}
                      className="cursor-pointer capitalize text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t(`filter.${gender}`)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {(selectedCategories.length > 0 || selectedGenders.length > 0) && (
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedGenders([]);
                }}
                className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
              >
                Clear Filters
              </button>
            )}
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6 sm:mb-8">
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  {selectedCategories.length > 0 || selectedGenders.length > 0 
                    ? '데이터가 없습니다' 
                    : '상품이 없습니다'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => onNavigate('product', product.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};