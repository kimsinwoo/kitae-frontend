import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { useUser } from './context/UserContext';

// Lazy load components for code splitting
const HomePageComponent = lazy(() => import('./components/HomePage').then(m => ({ default: m.HomePage })));
const BrandPage = lazy(() => import('./components/BrandPage').then(m => ({ default: m.BrandPage })));
const LookbookPage = lazy(() => import('./components/LookbookPage').then(m => ({ default: m.LookbookPage })));
const ProductListingPage = lazy(() => import('./components/ProductListingPage').then(m => ({ default: m.ProductListingPage })));
const ProductDetailPage = lazy(() => import('./components/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const CartPage = lazy(() => import('./components/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('./components/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const CheckoutSuccessPage = lazy(() => import('./components/CheckoutSuccessPage').then(m => ({ default: m.CheckoutSuccessPage })));
const CheckoutFailPage = lazy(() => import('./components/CheckoutFailPage').then(m => ({ default: m.CheckoutFailPage })));
const AdminLogin = lazy(() => import('./components/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const LoginPage = lazy(() => import('./components/LoginPage').then(m => ({ default: m.LoginPage })));
const SignUpPage = lazy(() => import('./components/SignUpPage').then(m => ({ default: m.SignUpPage })));
const ResetPasswordPage = lazy(() => import('./components/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const MyPage = lazy(() => import('./components/MyPage').then(m => ({ default: m.MyPage })));

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-black">Loading...</div>
  </div>
);

// 보호된 라우트 (로그인 필요)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const storedUser = localStorage.getItem('user');
  
  if (!user && !storedUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin 보호된 라우트
const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const storedUser = localStorage.getItem('user');
  
  let isAdmin = user?.role === 'admin';
  
  if (!isAdmin && storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      isAdmin = userData?.role === 'admin';
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
    }
  }
  
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

// 레이아웃 컴포넌트
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden w-full">
      <Header />
      <main className="w-full">{children}</main>
      <Footer />
    </div>
  );
};

// Info 페이지 컴포넌트
const InfoPage = () => {
  return (
    <div className="min-h-screen pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl tracking-[0.2em] mb-10 sm:mb-12 text-center">INFO</h1>
        <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6 text-center">
          <p className="text-base sm:text-lg text-muted-foreground">
            For inquiries, please contact us at contact@kitae.com
          </p>
          <p className="text-base sm:text-lg text-muted-foreground">
            Customer service hours: Monday - Friday, 9AM - 6PM EST
          </p>
        </div>
      </div>
    </div>
  );
};

// Wrapper components for React Router integration
const HomePageWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string, productId?: string) => {
    if (page === 'product' && productId) {
      navigate(`/product/${productId}`);
    } else if (page === 'shop') {
      navigate('/shop');
    } else if (page === 'lookbook') {
      navigate('/lookbook');
    } else {
      navigate(`/${page}`);
    }
  };
  return <HomePageComponent onNavigate={handleNavigate} />;
};

const ProductListingPageWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string, productId?: string) => {
    if (page === 'product' && productId) {
      navigate(`/product/${productId}`);
    } else {
      navigate(`/${page}`);
    }
  };
  return <ProductListingPage onNavigate={handleNavigate} />;
};

const ProductDetailPageWrapper = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };
  return <ProductDetailPage productId={productId || ''} onNavigate={handleNavigate} />;
};

const CartPageWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };
  return <CartPage onNavigate={handleNavigate} />;
};

const CheckoutPageWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };
  return <CheckoutPage onNavigate={handleNavigate} />;
};

const MyPageWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string, productId?: string) => {
    if (page === 'product' && productId) {
      navigate(`/product/${productId}`);
    } else {
      navigate(`/${page}`);
    }
  };
  return <MyPage onNavigate={handleNavigate} />;
};

const LoginPageWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };
  return <LoginPage onNavigate={handleNavigate} />;
};

const SignUpPageWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };
  return <SignUpPage onNavigate={handleNavigate} />;
};

const AdminLoginWrapper = () => {
  const navigate = useNavigate();
  const handleLoginSuccess = () => {
    navigate('/admin');
  };
  return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
};

const AdminDashboardWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };
  return <AdminDashboard onNavigate={handleNavigate} />;
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes with Layout */}
          <Route path="/" element={<Layout><HomePageWrapper /></Layout>} />
          <Route path="/brand" element={<Layout><BrandPage /></Layout>} />
          <Route path="/lookbook" element={<Layout><LookbookPage /></Layout>} />
          <Route path="/shop" element={<Layout><ProductListingPageWrapper /></Layout>} />
          <Route path="/product/:productId" element={<Layout><ProductDetailPageWrapper /></Layout>} />
          <Route path="/info" element={<Layout><InfoPage /></Layout>} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPageWrapper />} />
          <Route path="/signup" element={<SignUpPageWrapper />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Protected Routes */}
          <Route path="/cart" element={<ProtectedRoute><Layout><CartPageWrapper /></Layout></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Layout><CheckoutPageWrapper /></Layout></ProtectedRoute>} />
          <Route path="/checkout/success" element={<ProtectedRoute><Layout><CheckoutSuccessPage /></Layout></ProtectedRoute>} />
          <Route path="/checkout/fail" element={<ProtectedRoute><Layout><CheckoutFailPage /></Layout></ProtectedRoute>} />
          <Route path="/mypage" element={<ProtectedRoute><Layout><MyPageWrapper /></Layout></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginWrapper />} />
          <Route path="/admin" element={<AdminProtectedRoute><AdminDashboardWrapper /></AdminProtectedRoute>} />
          
          {/* 404 - Redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
