import type { Metadata } from 'next';
import './globals.css';
import ClientProviders from './providers';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';

export const metadata: Metadata = {
  title: 'GoWo — Conecta tu talento con oportunidades',
  description: 'Plataforma para egresados que buscan oportunidades profesionales. Conecta con empresas que valoran tu talento y habilidades.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ClientProviders>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
