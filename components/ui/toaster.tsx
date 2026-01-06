'use client';

import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        style: {
          background: 'white',
          color: '#1e293b',
          border: '1px solid #e2e8f0',
        },
        className: 'toast',
      }}
    />
  );
}
