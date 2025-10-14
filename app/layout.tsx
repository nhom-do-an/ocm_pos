import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'OMNI POS System - Quản lý bán hàng chuyên nghiệp',
  description: 'Hệ thống POS hiện đại với giao diện đẹp, dễ sử dụng cho cửa hàng bán lẻ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full">
      <body className={`${inter.className} ${inter.variable} h-full antialiased`}>
        {children}
      </body>
    </html>
  );
}
