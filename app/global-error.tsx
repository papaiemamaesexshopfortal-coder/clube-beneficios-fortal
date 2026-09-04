'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(new Error('Erro global de renderização do aplicativo'));
  }, []);

  return (
    <html lang="pt-BR">
      <body>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
          <section style={{ maxWidth: 560, textAlign: 'center' }}>
            <h1>Algo deu errado</h1>
            <p>Não foi possível carregar esta página agora. Tente novamente.</p>
            <button onClick={() => reset()} style={{ padding: '12px 18px', cursor: 'pointer' }}>
              Tentar novamente
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
