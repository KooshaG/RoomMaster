import './globals.css';
import { Inter } from 'next/font/google';
import { NextAuthProvider } from './providers';

import NavBar from '@/components/NavBar/NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'Room Master',
    template: '%s | Room Master'
  },
  description: "A bot to help student reserve the Concordia Webster Library easily!",
  manifest: '/site.webmanifest',
  authors: [{name: "Koosha Gholipour"}],
  colorScheme: 'only light',
  creator: 'Koosha Gholipour',
  keywords: ["Concordia", "Library", "Koosha", "Gholipour", "Computer Science", "Software Engineering", "AI", "Next.JS", "React", "Project"],
  themeColor: '#004000',
  openGraph: {
    title: 'Room Master',
    description: "A bot to help student reserve the Concordia Webster Library easily!",
    url: 'https://master.koosha.dev',
    siteName: 'Room Master',
    locale: 'en-US',
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: 'Room Master',
    description: 'A bot to help student reserve the Concordia Webster Library easily!',

  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <NextAuthProvider>
        <body className={`min-h-screen  ${inter.className}`}>
          <NavBar/>
          <main className="flex flex-col p-6 sm:p-24 text-center md:text-left">
            {children}
          </main>
        </body>
      </NextAuthProvider>
    </html>
  );
}
