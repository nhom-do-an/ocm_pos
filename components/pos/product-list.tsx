'use client';

import React from 'react';
import { usePOSStore } from '@/store/pos-store';
import { formatCurrency } from '@/lib/utils';

export const ProductList: React.FC = () => {
  const products = usePOSStore((state) => state.products);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(product => (
        <div key={product.id} className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-gray-600">{formatCurrency(product.price)}</p>
          <p className="text-sm text-gray-500">Stock: {product.stock}</p>
        </div>
      ))}
    </div>
  );
};
