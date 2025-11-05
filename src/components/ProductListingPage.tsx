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
      const category = selectedCategories.length > 0 ? selectedCategories[0] : undefined;
      const gender = selectedGenders.length > 0 ? selectedGenders[0] : undefined;
      
      console.log('🔍 Loading products from API...', { category, gender });
      
      const response = await productService.getAll({
        page: 1,
        limit: 100,
        category,
        gender,
        status: 'active'
      });
      
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
      
      // products 배열 추출
      const productsArray = actualData?.data?.products || actualData?.products || [];
      
      console.log('📦 Actual data:', actualData);
      console.log('📦 Products array:', productsArray);
      console.log('📦 Success:', actualData?.success);
      console.log('📦 Products count:', productsArray.length);
      
      // products 배열이 있으면 표시 (success 체크 무시)
      if (Array.isArray(productsArray) && productsArray.length > 0) {
        console.log(`✅ Found ${productsArray.length} products`);
        const transformedProducts = productsArray.map((p: any) => {
          // images 처리
          let imageUrl = '';
          try {
            if (Array.isArray(p.images)) {
              imageUrl = p.images[0] || '';
            } else if (typeof p.images === 'string') {
              const parsed = JSON.parse(p.images);
              imageUrl = Array.isArray(parsed) ? parsed[0] : parsed;
            }
          } catch (e) {
            console.warn('Failed to parse images for product:', p.id, e);
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
        console.warn('⚠️ Invalid API response format:', response);
        console.warn('⚠️ Actual data:', actualData);
        console.warn('⚠️ Products array:', productsArray);
        console.warn('⚠️ Products length:', productsArray.length);
        
        // products가 있으면 일단 표시
        if (Array.isArray(productsArray) && productsArray.length > 0) {
          console.log(`✅ Using products array directly: ${productsArray.length} products`);
          const transformedProducts = productsArray.map((p: any) => {
            let imageUrl = '';
            try {
              if (Array.isArray(p.images)) {
                imageUrl = p.images[0] || '';
              } else if (typeof p.images === 'string') {
                const parsed = JSON.parse(p.images);
                imageUrl = Array.isArray(parsed) ? parsed[0] : parsed;
              }
            } catch (e) {
              console.warn('Failed to parse images:', e);
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
          setProducts(transformedProducts);
        } else {
          toast.error('상품 데이터 형식이 올바르지 않습니다');
        }
      }
    } catch (error: any) {
      console.error('❌ Failed to load products:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error(`상품을 불러올 수 없습니다: ${error.message || 'API 연결 실패'}`);
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