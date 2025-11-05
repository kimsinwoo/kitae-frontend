import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  const shippingCost = cartTotal > 0 ? 15 : 0;
  const total = cartTotal + shippingCost;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl tracking-[0.2em] mb-10 sm:mb-12 text-center">
            {t('cart.title')}
          </h1>
          <div className="text-center space-y-6 sm:space-y-8">
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">{t('cart.empty')}</p>
            <Button
              onClick={() => onNavigate('shop')}
              className="px-8 sm:px-10 lg:px-12 py-5 sm:py-6 bg-black text-white hover:bg-black/90 tracking-[0.15em] text-sm sm:text-base"
            >
              {t('cart.continueShopping')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl tracking-[0.2em] mb-10 sm:mb-12">{t('cart.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {cart.map((item) => (
              <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-black/10">
                <div className="w-24 h-32 sm:w-32 sm:h-40 flex-shrink-0 overflow-hidden bg-secondary">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-3 sm:space-y-4">
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="text-sm sm:text-base tracking-wide mb-1 sm:mb-2">{item.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {item.selectedSize} / {item.selectedColor}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm sm:text-base mb-1 sm:mb-2">${item.price}</p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 border border-black/20 hover:border-black transition-colors text-sm"
                    >
                      -
                    </button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 border border-black/20 hover:border-black transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-black/10 p-6 sm:p-8 space-y-5 sm:space-y-6 lg:sticky lg:top-32">
              <h2 className="text-base sm:text-lg tracking-[0.15em] mb-4 sm:mb-6">{t('cart.orderSummary') || 'ORDER SUMMARY'}</h2>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">{t('cart.shipping')}</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="pt-3 sm:pt-4 border-t border-black/10 flex justify-between">
                  <span className="text-sm sm:text-base tracking-[0.15em]">{t('cart.total')}</span>
                  <span className="text-lg sm:text-xl">${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={() => onNavigate('checkout')}
                className="w-full py-5 sm:py-6 bg-black text-white hover:bg-black/90 tracking-[0.15em] text-sm sm:text-base"
              >
                {t('cart.checkout')}
              </Button>

              <Button
                onClick={() => onNavigate('shop')}
                variant="outline"
                className="w-full py-5 sm:py-6 border-black/20 hover:border-black tracking-[0.15em] text-sm sm:text-base"
              >
                {t('cart.continueShopping')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};