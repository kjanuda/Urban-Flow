'use client';

import { usePathname } from 'next/navigation';
import Navbar from './footer&Navbar/navbar';
import Footer from './footer&Navbar/footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  
  // Routes where navbar and footer should not be displayed
  const authRoutes = [
    '/user/login',
    '/user/register',
    '/admin/login',
    '/admin/register',
    'user/forgot-password'
  ];
  
  const isAuthRoute = authRoutes.includes(pathname);
  
  return (
    <>
      {!isAuthRoute && <Navbar />}
      <main className="min-h-screen">
        {children}
      </main>
      {!isAuthRoute && <Footer />}
    </>
  );
};

export default ConditionalLayout;