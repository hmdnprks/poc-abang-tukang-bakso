import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.scss';
import { Poppins } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const tselBatik = localFont({
  src: [
    {
      path: './fonts/TelkomselBatikSans-Regular.woff',
      weight: '400',
      style: 'normal',
    }, {
      path: './fonts/TelkomselBatikSans-Bold.woff',
      weight: '700',
      style: 'normal'
    }
  ],
  fallback: ['sans-serif'],
  variable: '--font-tsel-batik',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Abang Tukang Bakso',
  description: 'A tracking map of Kang Bakso'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${poppins.variable} ${tselBatik.variable} antialiased`}
      >
        {children}
        <ToastContainer autoClose={2000} />
      </body>
    </html>
  );
}
