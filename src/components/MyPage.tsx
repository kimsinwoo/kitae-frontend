import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useAdmin } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';
import { orderService } from '../services/order.service';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ProductCard } from './ProductCard';
import { User, Package, Heart, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface MyPageProps {
  onNavigate: (page: string, productId?: string) => void;
}

export const MyPage = ({ onNavigate }: MyPageProps) => {
  const { user, favorites, updateProfile, logout } = useUser();
  const { products } = useAdmin();
  const { language, t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
  });
  
  // Load orders and favorites from API
  useEffect(() => {
    if (user) {
      loadOrders();
      loadFavorites();
    } else {
      setFavoriteProducts([]);
    }
  }, [user]);

  const loadFavorites = async () => {
    setIsLoadingFavorites(true);
    try {
      const { favoriteService } = await import('../services/favorite.service');
      const response = await favoriteService.getFavorites();
      
      // Extract products from favorites
      const favoriteProductsData: any[] = [];
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach((fav: any) => {
          if (fav.product) {
            // Parse images
            let imageUrl = '';
            try {
              if (Array.isArray(fav.product.images)) {
                imageUrl = fav.product.images[0] || '';
              } else if (typeof fav.product.images === 'string') {
                const parsed = JSON.parse(fav.product.images);
                imageUrl = Array.isArray(parsed) ? parsed[0] : parsed;
              }
            } catch (e) {
              console.warn('Failed to parse product images:', e);
            }

            favoriteProductsData.push({
              id: fav.product.id,
              name: fav.product.name,
              price: fav.product.price,
              image: imageUrl || 'https://via.placeholder.com/400',
            });
          }
        });
      }
      
      setFavoriteProducts(favoriteProductsData);
      console.log('✅ Favorites loaded:', favoriteProductsData.length);
    } catch (error) {
      console.error('❌ Failed to load favorites:', error);
      toast.error(t('mypage.loadFavoritesError') || 'Failed to load favorites');
    } finally {
      setIsLoadingFavorites(false);
    }
  };
  
  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const response = await orderService.getMyOrders();
      console.log('📦 Orders response:', response);
      
      // 응답 구조 처리
      let ordersData = response;
      if ((response as any).data?.data) {
        ordersData = (response as any).data;
      }
      
      if (ordersData.success && ordersData.data) {
        // 서버 주문 데이터를 프론트엔드 형식으로 변환
        const transformedOrders = (ordersData.data.orders || ordersData.data || []).map((order: any) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          userId: order.userId,
          date: order.createdAt,
          total: order.total,
          status: order.status,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          items: order.items?.map((item: any) => ({
            productId: item.productId,
            productName: item.product?.name || '',
            productImage: Array.isArray(item.product?.images)
              ? item.product.images[0] || ''
              : typeof item.product?.images === 'string'
                ? JSON.parse(item.product.images)[0] || ''
                : '',
            quantity: item.quantity,
            size: item.variant?.size || '',
            color: item.variant?.color || '',
            price: item.price,
          })) || [],
          shippingAddress: {
            street: order.shippingAddress1 || '',
            city: order.shippingCity || '',
            state: '',
            zipCode: order.shippingZip || '',
            country: order.shippingCountry || 'Korea',
          },
        }));
        
        console.log('✅ Orders loaded:', transformedOrders);
        setUserOrders(transformedOrders);
      }
    } catch (error) {
      console.error('❌ Failed to load orders:', error);
      toast.error(t('mypage.loadOrdersError') || 'Failed to load orders');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-8">
        <div className="text-center">
          <h2 className="text-2xl tracking-[0.2em] mb-8">
            {t('mypage.loginRequired') || 'PLEASE LOGIN'}
          </h2>
          <Button onClick={() => onNavigate('login')} className="tracking-[0.15em]">
            {t('mypage.goToLogin') || 'GO TO LOGIN'}
          </Button>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      });
      setIsEditing(false);
      toast.success(t('mypage.profileUpdated') || 'Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(t('mypage.updateProfileError') || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    onNavigate('home');
    toast.success(t('mypage.loggedOut') || 'Logged out successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusKey = `mypage.${status.toLowerCase()}`;
    return t(statusKey) || status.toUpperCase();
  };

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl tracking-[0.2em] mb-4">
            {t('mypage.title') || 'MY PAGE'}
          </h1>
          <p className="text-sm tracking-[0.15em] text-muted-foreground">
            {t('mypage.welcome') || 'Welcome back'}, {user.name}
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="profile" className="tracking-[0.15em] gap-2">
              <User className="w-4 h-4" />
              {t('mypage.profile') || 'PROFILE'}
            </TabsTrigger>
            <TabsTrigger value="orders" className="tracking-[0.15em] gap-2">
              <Package className="w-4 h-4" />
              {t('mypage.orders') || 'ORDERS'}
            </TabsTrigger>
            <TabsTrigger value="favorites" className="tracking-[0.15em] gap-2">
              <Heart className="w-4 h-4" />
              {t('mypage.favorites') || 'FAVORITES'}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-8">
            <div className="max-w-2xl mx-auto bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl tracking-[0.15em]">
                  {t('mypage.profileInfo') || 'PROFILE INFORMATION'}
                </h2>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="tracking-[0.15em] gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    {t('mypage.edit') || 'EDIT'}
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveProfile}
                      className="tracking-[0.15em]"
                    >
                      {t('mypage.save') || 'SAVE'}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name,
                          phone: user.phone,
                          street: user.address?.street || '',
                          city: user.address?.city || '',
                          state: user.address?.state || '',
                          zipCode: user.address?.zipCode || '',
                          country: user.address?.country || '',
                        });
                      }}
                      variant="outline"
                      className="tracking-[0.15em]"
                    >
                      {t('mypage.cancel') || 'CANCEL'}
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm tracking-[0.1em]">
                      {t('mypage.name') || 'NAME'}
                    </Label>
                    {isEditing ? (
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border-black"
                      />
                    ) : (
                      <p className="py-2">{user.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm tracking-[0.1em]">
                      {t('mypage.email') || 'EMAIL'}
                    </Label>
                    <p className="py-2 text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm tracking-[0.1em]">
                    {t('mypage.phone') || 'PHONE'}
                  </Label>
                  {isEditing ? (
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="border-black"
                    />
                  ) : (
                    <p className="py-2">{user.phone || '-'}</p>
                  )}
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-sm tracking-[0.1em] mb-4">
                    {t('mypage.address') || 'ADDRESS'}
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm tracking-[0.1em]">
                        {t('mypage.street') || 'STREET'}
                      </Label>
                      {isEditing ? (
                        <Input
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          className="border-black"
                        />
                      ) : (
                        <p className="py-2">{user.address?.street || '-'}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm tracking-[0.1em]">
                          {t('mypage.city') || 'CITY'}
                        </Label>
                        {isEditing ? (
                          <Input
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="border-black"
                          />
                        ) : (
                          <p className="py-2">{user.address?.city || '-'}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm tracking-[0.1em]">
                          {t('mypage.state') || 'STATE'}
                        </Label>
                        {isEditing ? (
                          <Input
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="border-black"
                          />
                        ) : (
                          <p className="py-2">{user.address?.state || '-'}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm tracking-[0.1em]">
                          {t('mypage.zipCode') || 'ZIP CODE'}
                        </Label>
                        {isEditing ? (
                          <Input
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            className="border-black"
                          />
                        ) : (
                          <p className="py-2">{user.address?.zipCode || '-'}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm tracking-[0.1em]">
                          {t('mypage.country') || 'COUNTRY'}
                        </Label>
                        {isEditing ? (
                          <Input
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="border-black"
                          />
                        ) : (
                          <p className="py-2">{user.address?.country || '-'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full tracking-[0.15em]"
                  >
                    {t('mypage.logout') || 'LOGOUT'}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-xl tracking-[0.15em] text-center mb-8">
              {t('mypage.orderHistory') || 'ORDER HISTORY'}
            </h2>

            {userOrders.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground tracking-[0.1em]">
                  {t('mypage.noOrders') || 'No orders yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {userOrders.map((order) => (
                  <div key={order.id} className="bg-white p-8 shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <p className="tracking-[0.1em] mb-2">
                          {t('mypage.orderNumber') || 'ORDER'} #{order.id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>

                    <div className="space-y-4 border-t pt-6">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-20 h-20 object-cover"
                          />
                          <div className="flex-1">
                            <p className="tracking-[0.05em] mb-1">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.color} / {item.size} / Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="tracking-[0.1em]">${item.price}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t mt-6">
                      <p className="tracking-[0.1em]">
                        {t('mypage.total') || 'TOTAL'}
                      </p>
                      <p className="text-xl tracking-[0.1em]">${order.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <h2 className="text-xl tracking-[0.15em] text-center mb-8">
              {t('mypage.wishlist') || 'MY WISHLIST'}
            </h2>

            {isLoadingFavorites ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground tracking-[0.1em]">
                  {language === 'KO' ? '로딩 중...' : 'Loading...'}
                </p>
              </div>
            ) : favoriteProducts.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground tracking-[0.1em] mb-8">
                  {t('mypage.noFavorites') || 'No favorites yet'}
                </p>
                <Button onClick={() => onNavigate('shop')} className="tracking-[0.15em]">
                  {t('mypage.shopNow') || 'SHOP NOW'}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {favoriteProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onNavigate={() => onNavigate('product', product.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
