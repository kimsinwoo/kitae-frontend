import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart } from 'lucide-react';
import { useUser } from '../context/UserContext';

// Product 인터페이스 정의 (백엔드 응답 형식에 맞춤)
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  gender?: string;
  sizes?: string[];
  colors?: string[];
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { isFavorite, toggleFavorite } = useUser();
  const isFav = isFavorite(product.id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onClick
    await toggleFavorite(product.id);
  };

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer space-y-3 sm:space-y-4 transition-opacity hover:opacity-80 relative"
    >
      <div className="aspect-[3/4] overflow-hidden bg-secondary relative">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full transition-all shadow-sm z-10"
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart 
            className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
          />
        </button>
      </div>
      <div className="space-y-1 sm:space-y-2">
        <div className="text-sm sm:text-base tracking-wide">{product.name}</div>
        <div className="text-sm sm:text-base text-muted-foreground">₩{product.price.toLocaleString('ko-KR')}</div>
      </div>
    </div>
  );
};