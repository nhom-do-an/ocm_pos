'use client';

import React from 'react';
import { User, ChevronDown } from 'lucide-react';
import { usePOSStore } from '@/store/pos-store';

export const EmployeeSelector: React.FC = () => {
  const { employees, selectedEmployeeId, setSelectedEmployee, selectedBranchId } = usePOSStore();

  const branchEmployees = employees.filter(e =>
    !selectedBranchId || e.id === selectedBranchId
  );

  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);

  return (
    <div className="relative">
      <select
        value={selectedEmployeeId || ''}
        onChange={(e) => setSelectedEmployee(e.target.value)}
        className="appearance-none w-full pl-10 pr-8 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Chọn nhân viên</option>
        {branchEmployees.map(employee => (
          <option key={employee.id} value={employee.id}>
            {employee.name} ({employee.id})
          </option>
        ))}
      </select>
      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
};
