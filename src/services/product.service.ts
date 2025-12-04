import api from '../utils/api';

export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  price: number;
  comparePrice?: number;
  sku: string;
  slug: string;
  status: string;
  featured: boolean;
  gender?: string;
  images: string[] | string; // 백엔드에서 JSON 문자열로 올 수 있음
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  variants?: ProductVariant[];
  averageRating?: number;
  _count?: {
    reviews?: number;
  };
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface ProductResponse {
  success: boolean;
  data: Product | Product[];
}

export interface FeaturedProductsResponse {
  success: boolean;
  data: Product[];
}

// 이미지 필드 정규화 헬퍼 함수
const normalizeProductImages = (product: any): Product => {
  let images: string[] = [];
  
  if (product.images) {
    if (Array.isArray(product.images)) {
      // 이미 배열인 경우 그대로 사용
      images = product.images.filter((img: any) => img && typeof img === 'string');
    } else if (typeof product.images === 'string') {
      try {
        // JSON 문자열인 경우 파싱 시도
        const parsed = JSON.parse(product.images);
        if (Array.isArray(parsed)) {
          images = parsed.filter((img: any) => img && typeof img === 'string');
        } else if (parsed && typeof parsed === 'string') {
          images = [parsed];
        }
      } catch (e) {
        // JSON 파싱 실패 시 문자열 자체를 배열로 처리
        images = [product.images];
      }
    }
  }
  
  const normalized = {
    ...product,
    images
  };
  
  // 디버깅: 이미지가 없는 경우 로그 출력
  if (images.length === 0 && product.images) {
    console.warn(`⚠️ No valid images found for product ${product.id}:`, {
      originalImages: product.images,
      imagesType: typeof product.images,
      isArray: Array.isArray(product.images)
    });
  }
  
  return normalized;
};

export const productService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    gender?: string;
    status?: string;
    featured?: boolean;
  }): Promise<ProductsResponse> => {
    const response = await api.get('/products', { params }) as ProductsResponse;
    
    // 이미지 정규화
    if (response.success && response.data?.products) {
      response.data.products = response.data.products.map(normalizeProductImages);
    }
    
    return response;
  },
  
  getFeatured: async (): Promise<FeaturedProductsResponse> => {
    const rawResponse = await api.get('/products/featured');
    
    console.log('📦 Raw API response:', rawResponse);
    console.log('📦 Response type:', typeof rawResponse);
    console.log('📦 Response keys:', Object.keys(rawResponse || {}));
    
    // axios response 객체인 경우 처리 (status, headers 등이 있으면)
    let responseData: any = rawResponse;
    if (rawResponse && typeof rawResponse === 'object' && 'status' in rawResponse && 'data' in rawResponse) {
      console.log('📦 Detected axios response object, extracting data...');
      responseData = (rawResponse as any).data;
    }
    
    // 응답 구조 처리: { success: true, data: [...] } 형식
    let productsArray: any[] = [];
    if (Array.isArray(responseData)) {
      // 직접 배열인 경우
      productsArray = responseData;
    } else if (responseData?.success && Array.isArray(responseData.data)) {
      // { success: true, data: [...] } 형식
      productsArray = responseData.data;
    } else if (responseData?.data && Array.isArray(responseData.data)) {
      // { data: [...] } 형식
      productsArray = responseData.data;
    }
    
    console.log('📦 Extracted products array:', productsArray.length);
    
    // 이미지 정규화 및 데이터 검증
    if (productsArray.length > 0) {
      const normalizedProducts = productsArray.map(normalizeProductImages);
      console.log(`✅ Processed ${normalizedProducts.length} featured products`);
      
      return {
        success: true,
        data: normalizedProducts
      };
    } else {
      console.warn('⚠️ No products found in response');
      return {
        success: false,
        data: []
      };
    }
  },
  
  getById: async (id: string): Promise<ProductResponse> => {
    const rawResponse = await api.get(`/products/${id}`);
    
    console.log('📦 Raw API response (getById):', rawResponse);
    
    // axios response 객체인 경우 처리
    let responseData: any = rawResponse;
    if (rawResponse && typeof rawResponse === 'object' && 'status' in rawResponse && 'data' in rawResponse) {
      console.log('📦 Detected axios response object, extracting data...');
      responseData = (rawResponse as any).data;
    }
    
    // 응답 구조 처리: { success: true, data: {...} } 형식
    let productData: any = null;
    if (responseData?.success && responseData.data) {
      productData = Array.isArray(responseData.data) ? responseData.data[0] : responseData.data;
    } else if (responseData?.data) {
      productData = Array.isArray(responseData.data) ? responseData.data[0] : responseData.data;
    } else if (responseData && !responseData.success) {
      // success가 없는 경우 직접 product 데이터일 수 있음
      productData = Array.isArray(responseData) ? responseData[0] : responseData;
    }
    
    if (productData) {
      // 이미지 정규화
      const normalizedProduct = normalizeProductImages(productData);
      
      return {
        success: true,
        data: normalizedProduct
      };
    }
    
    console.warn('⚠️ No product data found in response');
    return {
      success: false,
      data: null as any
    };
  },
  
  search: async (query: string, page?: number, limit?: number): Promise<ProductsResponse> => {
    const response = await api.get('/products/search', { 
      params: { q: query, page, limit } 
    }) as ProductsResponse;
    
    // 이미지 정규화
    if (response.success && response.data?.products) {
      response.data.products = response.data.products.map(normalizeProductImages);
    }
    
    return response;
  },
  
  getReviews: async (productId: string) => {
    return api.get(`/products/${productId}/reviews`);
  },
  
  getVariantBySizeAndColor: async (productId: string, size: string, color: string) => {
    const rawResponse = await api.get(`/products/${productId}/variant`, {
      params: { size, color }
    });
    
    console.log('📦 Raw variant response:', rawResponse);
    
    // axios response 객체인 경우 처리
    let responseData: any = rawResponse;
    if (rawResponse && typeof rawResponse === 'object' && 'status' in rawResponse && 'data' in rawResponse) {
      responseData = (rawResponse as any).data;
    }
    
    // 응답 구조 처리: { success: true, data: {...} } 형식
    if (responseData?.success && responseData.data) {
      return responseData.data;
    } else if (responseData?.data) {
      return responseData.data;
    } else if (responseData && !responseData.success) {
      // success가 없는 경우 직접 variant 데이터일 수 있음
      return responseData;
    }
    
    return null;
  },
};

