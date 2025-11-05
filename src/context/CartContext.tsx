import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../data/products';
import { cartService } from '../services/cart.service';
import { toast } from 'sonner';

interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  variantId?: string; // variant ID 저장
  productId?: string; // product ID 명시적으로 저장
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string, variantId?: string) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 로그인되어 있으면 서버에서 장바구니 로드
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      loadCartFromServer();
    }
  }, []);

  const loadCartFromServer = async () => {
    const user = localStorage.getItem('user');
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await cartService.getCart();
      console.log('🛒 Cart response:', response);
      
      // 응답 구조 처리
      let cartData = response;
      if ((response as any).data?.data) {
        cartData = (response as any).data;
      }
      
      if (cartData.success && cartData.data) {
        // 서버 데이터 구조: { items: Cart[], subtotal, total }
        // 각 Cart는 { items: CartItem[] } 형태
        const allCartItems: any[] = [];
        
        if (cartData.data.items && Array.isArray(cartData.data.items)) {
          cartData.data.items.forEach((cart: any) => {
            if (cart.items && Array.isArray(cart.items)) {
              cart.items.forEach((item: any) => {
                allCartItems.push({
                  id: item.id, // CartItem ID (장바구니 아이템 ID)
                  productId: cart.productId || item.variant?.product?.id || '',
                  name: cart.product?.name || item.variant?.product?.name || '',
                  description: cart.product?.description || '',
                  price: cart.product?.price || item.variant?.product?.price || 0,
                  image: Array.isArray(cart.product?.images)
                    ? cart.product.images[0] || ''
                    : typeof cart.product?.images === 'string'
                      ? JSON.parse(cart.product.images)[0] || ''
                      : '',
                  images: Array.isArray(cart.product?.images)
                    ? cart.product.images
                    : typeof cart.product?.images === 'string'
                      ? JSON.parse(cart.product.images)
                      : [],
                  sku: item.variant?.sku || '',
                  slug: cart.product?.slug || '',
                  status: cart.product?.status || 'active',
                  featured: cart.product?.featured || false,
                  category: cart.product?.category?.slug || '',
                  quantity: item.quantity,
                  selectedSize: item.variant?.size || '',
                  selectedColor: item.variant?.color || '',
                  variantId: item.variantId, // variantId 저장
                });
              });
            }
          });
        }
        
        console.log('✅ Cart items loaded from server:', allCartItems);
        setCart(allCartItems);
      }
    } catch (error) {
      console.error('❌ Failed to load cart from server:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCartToState = (newCart: CartItem[]) => {
    setCart(newCart);
  };

  const addToCart = async (product: Product, size: string, color: string, variantId?: string) => {
    setIsLoading(true);
    const user = localStorage.getItem('user');
    
    if (!user) {
      toast.error('로그인이 필요합니다');
      setIsLoading(false);
      return;
    }
    
    console.log('🛒 addToCart called:', { productId: product.id, size, color, variantId, hasCartItems: cart.length });
    
    try {
      // variantId가 없으면 찾기
      let finalVariantId = variantId;
      
      if (!finalVariantId) {
        console.log('🔍 Variant ID not provided, searching...');
        try {
          const variantResponse = await import('../services/product.service').then(m => 
            m.productService.getVariantBySizeAndColor(product.id, size, color)
          );
          
          console.log('📦 Variant response:', variantResponse);
          
          // 응답 구조 처리
          let variantData = variantResponse;
          if ((variantResponse as any).data?.data) {
            variantData = (variantResponse as any).data;
          } else if ((variantResponse as any).data) {
            variantData = (variantResponse as any).data;
          }
          
          finalVariantId = variantData?.id || (variantData as any).data?.id;
          
          if (!finalVariantId) {
            console.error('❌ Could not extract variant ID from response');
            throw new Error('Variant not found');
          }
          
          console.log('✅ Found variant ID:', finalVariantId);
        } catch (variantError) {
          console.error('❌ Failed to find variant:', variantError);
          toast.error('상품 옵션을 찾을 수 없습니다');
          setIsLoading(false);
          return;
        }
      }
      
      // 기존 장바구니에서 같은 variant가 있는지 확인
      const existingItem = cart.find((item) => item.variantId === finalVariantId);
      console.log('🔍 Existing cart item:', existingItem);
      
      if (existingItem) {
        // 수량 증가
        const newQuantity = existingItem.quantity + 1;
        console.log('📈 Updating quantity to:', newQuantity);
        try {
          await cartService.updateQuantity(existingItem.id, newQuantity);
          // 서버에서 다시 로드
          await loadCartFromServer();
          toast.success('장바구니에 추가되었습니다');
        } catch (error: any) {
          console.error('❌ Failed to update cart on server:', error);
          console.error('❌ Error response:', error.response?.data);
          toast.error('장바구니 업데이트 실패');
        }
      } else {
        // 새 아이템 추가
        console.log('➕ Adding new cart item');
        try {
          await cartService.addToCart({
            productId: product.id,
            variantId: finalVariantId!,
            quantity: 1,
          });
          // 서버에서 다시 로드
          await loadCartFromServer();
          toast.success('장바구니에 추가되었습니다');
        } catch (error: any) {
          console.error('❌ Failed to add to cart on server:', error);
          console.error('❌ Error response:', error.response?.data);
          toast.error('장바구니 추가 실패');
        }
      }
    } catch (error: any) {
      console.error('❌ Add to cart error:', error);
      toast.error(error.message || '장바구니 추가 실패');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    setIsLoading(true);
    const user = localStorage.getItem('user');
    
    if (!user) {
      toast.error('로그인이 필요합니다');
      setIsLoading(false);
      return;
    }
    
    try {
      await cartService.removeFromCart(cartItemId);
      // 서버에서 다시 로드
      await loadCartFromServer();
      toast.success('장바구니에서 삭제되었습니다');
    } catch (error) {
      console.error('❌ Failed to remove from cart on server:', error);
      toast.error('장바구니 삭제 실패');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    setIsLoading(true);
    const user = localStorage.getItem('user');
    
    if (!user) {
      toast.error('로그인이 필요합니다');
      setIsLoading(false);
      return;
    }
    
    try {
      await cartService.updateQuantity(cartItemId, quantity);
      // 서버에서 다시 로드
      await loadCartFromServer();
    } catch (error) {
      console.error('❌ Failed to update quantity on server:', error);
      toast.error('수량 업데이트 실패');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    const user = localStorage.getItem('user');
    
    if (!user) {
      toast.error('로그인이 필요합니다');
      setIsLoading(false);
      return;
    }
    
    try {
      await cartService.clearCart();
      // 서버에서 다시 로드 (비어있을 것)
      await loadCartFromServer();
      toast.success('장바구니가 비워졌습니다');
    } catch (error) {
      console.error('❌ Failed to clear cart on server:', error);
      toast.error('장바구니 비우기 실패');
    } finally {
      setIsLoading(false);
    }
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, isLoading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
