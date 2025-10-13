'use client';

import React from 'react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Card } from '../ui/card';
import { usePOSStore } from '@/store/pos-store';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addToCart = usePOSStore((state) => state.addToCart);

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => addToCart(product)}
    >
      <div className="aspect-square bg-gray-200 rounded-md mb-3 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-4xl"></div>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 mb-1 truncate">{product.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{product.category}</p>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-blue-600">
          {formatCurrency(product.price)}
        </span>
        <span className="text-sm text-gray-500">
          Kho: {product.stock}
        </span>
      </div>
    </Card>
  );
};
