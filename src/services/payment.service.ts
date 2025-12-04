import api from '../utils/api';

export interface ConfirmPaymentRequest {
  paymentKey: string;
  orderId: string;
  tossOrderId?: string;
  amount: number;
}

export interface CancelPaymentRequest {
  paymentKey: string;
  cancelReason: string;
}

export interface PaymentResponse {
  success: boolean;
  data: any;
  message: string;
}

export const paymentService = {
  confirmPayment: async (data: ConfirmPaymentRequest): Promise<PaymentResponse> => {
    const rawResponse = await api.post('/payments/confirm', data);
    
    console.log('📦 Raw payment response:', rawResponse);
    
    // axios response 객체인 경우 처리
    let responseData: any = rawResponse;
    if (rawResponse && typeof rawResponse === 'object' && 'status' in rawResponse && 'data' in rawResponse) {
      console.log('📦 Detected axios response object, extracting data...');
      responseData = (rawResponse as any).data;
    }
    
    // 응답 구조 처리
    if (responseData?.success !== undefined) {
      return responseData;
    } else if (responseData) {
      return {
        success: true,
        data: responseData,
        message: 'Payment confirmed'
      };
    }
    
    return {
      success: false,
      data: null,
      message: 'Payment confirmation failed'
    };
  },

  cancelPayment: async (data: CancelPaymentRequest): Promise<PaymentResponse> => {
    const rawResponse = await api.post('/payments/cancel', data);
    
    // axios response 객체인 경우 처리
    let responseData: any = rawResponse;
    if (rawResponse && typeof rawResponse === 'object' && 'status' in rawResponse && 'data' in rawResponse) {
      responseData = (rawResponse as any).data;
    }
    
    // 응답 구조 처리
    if (responseData?.success !== undefined) {
      return responseData;
    } else if (responseData) {
      return {
        success: true,
        data: responseData,
        message: 'Payment cancelled'
      };
    }
    
    return {
      success: false,
      data: null,
      message: 'Payment cancellation failed'
    };
  },
};

