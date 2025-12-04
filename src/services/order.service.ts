import api from '../utils/api';

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  product?: {
    name: string;
    images: any;
  };
  variant?: {
    size: string;
    color: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  userId: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress1: string;
  shippingAddress2?: string;
  shippingCity: string;
  shippingZip: string;
  shippingCountry: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  shippingName: string;
  shippingPhone: string;
  shippingAddress1: string;
  shippingAddress2?: string;
  shippingCity: string;
  shippingZip: string;
  shippingCountry?: string;
  notes?: string;
  paymentMethod?: string;
  items?: Array<{
    productId: string;
    variantId: string | null;
    quantity: number;
  }>;
}

export interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface OrderResponse {
  success: boolean;
  data: Order;
}

export const orderService = {
  createOrder: async (data: CreateOrderRequest): Promise<OrderResponse> => {
    const rawResponse = await api.post('/orders', data);
    
    console.log('📦 Raw order response:', rawResponse);
    
    // axios response 객체인 경우 처리
    let responseData: any = rawResponse;
    if (rawResponse && typeof rawResponse === 'object' && 'status' in rawResponse && 'data' in rawResponse) {
      console.log('📦 Detected axios response object, extracting data...');
      responseData = (rawResponse as any).data;
    }
    
    // 응답 구조 처리: { success: true, data: {...} } 형식
    if (responseData?.success && responseData.data) {
      return {
        success: true,
        data: responseData.data
      };
    } else if (responseData?.data) {
      return {
        success: true,
        data: responseData.data
      };
    } else if (responseData && !responseData.success) {
      // success가 없는 경우 직접 order 데이터일 수 있음
      return {
        success: true,
        data: responseData
      };
    }
    
    console.warn('⚠️ Invalid order response format');
    return {
      success: false,
      data: null as any
    };
  },

  getMyOrders: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<OrdersResponse> => {
    const rawResponse = await api.get('/orders', { params });
    
    // axios response 객체인 경우 처리
    let responseData: any = rawResponse;
    if (rawResponse && typeof rawResponse === 'object' && 'status' in rawResponse && 'data' in rawResponse) {
      responseData = (rawResponse as any).data;
    }
    
    // 응답 구조 처리
    if (responseData?.success && responseData.data) {
      return responseData;
    } else if (responseData?.data) {
      return {
        success: true,
        data: responseData.data
      };
    }
    
    return {
      success: false,
      data: { orders: [], pagination: undefined }
    };
  },

  getOrderById: async (orderId: string): Promise<OrderResponse> => {
    const rawResponse = await api.get(`/orders/${orderId}`);
    
    // axios response 객체인 경우 처리
    let responseData: any = rawResponse;
    if (rawResponse && typeof rawResponse === 'object' && 'status' in rawResponse && 'data' in rawResponse) {
      responseData = (rawResponse as any).data;
    }
    
    // 응답 구조 처리
    if (responseData?.success && responseData.data) {
      return {
        success: true,
        data: responseData.data
      };
    } else if (responseData?.data) {
      return {
        success: true,
        data: responseData.data
      };
    }
    
    return {
      success: false,
      data: null as any
    };
  },

  cancelOrder: async (orderId: string): Promise<{ success: boolean; message: string }> => {
    const rawResponse = await api.put(`/orders/${orderId}/cancel`);
    
    // axios response 객체인 경우 처리
    let responseData: any = rawResponse;
    if (rawResponse && typeof rawResponse === 'object' && 'status' in rawResponse && 'data' in rawResponse) {
      responseData = (rawResponse as any).data;
    }
    
    return responseData || { success: false, message: '주문 취소 실패' };
  },
};

