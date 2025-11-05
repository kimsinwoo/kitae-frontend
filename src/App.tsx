import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { UserProvider } from './context/UserContext';
import { AppRouter } from './AppRouter';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  return (
    <LanguageProvider>
      <UserProvider>
        <CartProvider>
          <AdminProvider>
            <>
              <AppRouter />
              <Toaster />
            </>
          </AdminProvider>
        </CartProvider>
      </UserProvider>
    </LanguageProvider>
  );
}

export default function App() {
  return <AppContent />;
}