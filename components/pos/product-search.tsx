'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tìm kiếm sản phẩm..."
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};
