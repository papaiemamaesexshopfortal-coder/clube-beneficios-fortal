import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Clube Benefícios Fortal',
  description: 'Clube de benefícios, descontos e sorteios para associados.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
