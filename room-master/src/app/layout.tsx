import './globals.css';
import { Inter } from 'next/font/google';
import { NextAuthProvider } from './providers';

import NavBar from '@/components/NavBar/NavBar';
import Link from 'next/link';

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
        <body className={`min-h-screen flex flex-col justify-between  ${inter.className}`}>
          <div>
            <NavBar/>
            <main className="flex flex-col mb-auto p-6 sm:p-24 text-center md:text-left">
              {children}
            </main>
          </div>
          <footer className="footer p-10 bg-base-dark text-neutral">
            <div>
              <Link href="https://koosha.dev">Made with ❤ (and a lot of frustration) by KooshaG</Link>
            </div>
            <div className="grid-flow-col gap-3 md:place-self-center md:justify-self-end">
              <Link href="https://koosha.dev"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm-26.37 144h52.74C149 186.34 140 202.87 128 215.89c-12-13.02-21-29.55-26.37-47.89ZM98 152a145.72 145.72 0 0 1 0-48h60a145.72 145.72 0 0 1 0 48Zm-58-24a87.61 87.61 0 0 1 3.33-24h38.46a161.79 161.79 0 0 0 0 48H43.33A87.61 87.61 0 0 1 40 128Zm114.37-40h-52.74C107 69.66 116 53.13 128 40.11c12 13.02 21 29.55 26.37 47.89Zm19.84 16h38.46a88.15 88.15 0 0 1 0 48h-38.46a161.79 161.79 0 0 0 0-48Zm32.16-16h-35.43a142.39 142.39 0 0 0-20.26-45a88.37 88.37 0 0 1 55.69 45ZM105.32 43a142.39 142.39 0 0 0-20.26 45H49.63a88.37 88.37 0 0 1 55.69-45ZM49.63 168h35.43a142.39 142.39 0 0 0 20.26 45a88.37 88.37 0 0 1-55.69-45Zm101.05 45a142.39 142.39 0 0 0 20.26-45h35.43a88.37 88.37 0 0 1-55.69 45Z"/></svg></Link> 
              <Link href="https://github.com/KooshaG"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/></svg></Link>
              <Link href="https://www.linkedin.com/in/koosha-gholipour/"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z"/></svg></Link>
            </div>
          </footer>
        </body>
      </NextAuthProvider>
    </html>
  );
}
