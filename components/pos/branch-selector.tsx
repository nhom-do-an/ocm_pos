'use client';

import React from 'react';
import { Building2, ChevronDown } from 'lucide-react';
import { usePOSStore } from '@/store/pos-store';

export const BranchSelector: React.FC = () => {
  const { branches, selectedBranchId, setSelectedBranch } = usePOSStore();
  const selectedBranch = branches.find(b => b.id === selectedBranchId);

  return (
    <div className="relative">
      <select
        value={selectedBranchId || ''}
        onChange={(e) => setSelectedBranch(e.target.value)}
        className="appearance-none w-full pl-10 pr-8 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Chọn chi nhánh</option>
        {branches.map(branch => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>
      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
};
