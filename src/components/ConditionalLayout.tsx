'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Check if the current path is an admin page
  const isAdminPage = pathname.startsWith('/admin');
  
  if (isAdminPage) {
    // For admin pages, don't show Navbar or Footer
    return <main>{children}</main>;
  }
  
  // For all other pages, show Navbar and Footer
  return (
    <>
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}
