'use client';

import React, { useState, useEffect } from 'react';
import { Search, Download, Filter } from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePOSStore } from '@/store/pos-store';
import { mockProducts, mockBranches } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');
  
  const { products, branches, setProducts, setBranches } = usePOSStore();

  useEffect(() => {
    setProducts(mockProducts);
    setBranches(mockBranches);
  }, [setProducts, setBranches]);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.barcode && product.barcode.includes(searchTerm));
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getStockForBranch = (product: typeof products[0]) => {
    if (selectedBranch === 'all') return product.stock;
    return product.branchStock?.[selectedBranch] || 0;
  };

  const getTotalValue = () => {
    return filteredProducts.reduce((sum, product) => {
      const stock = getStockForBranch(product);
      return sum + (product.price * stock);
    }, 0);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tra cứu tồn kho</h1>
          <p className="text-gray-600">
            Tổng giá trị tồn kho: <span className="font-semibold text-blue-600">{formatCurrency(getTotalValue())}</span>
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, SKU, mã vạch..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.filter(c => c !== 'all').map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả chi nhánh</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Lọc nâng cao
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
        </div>

        {/* Inventory Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">SKU</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Mã vạch</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tên sản phẩm</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Danh mục</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Giá</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Tồn kho</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Giá trị</th>
                  {selectedBranch === 'all' && (
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Chi tiết chi nhánh</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => {
                  const stock = getStockForBranch(product);
                  const value = product.price * stock;
                  
                  return (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-600 font-mono text-sm">{product.sku}</td>
                      <td className="py-3 px-4 text-gray-600 font-mono text-sm">{product.barcode || '-'}</td>
                      <td className="py-3 px-4 font-medium">{product.name}</td>
                      <td className="py-3 px-4 text-gray-600">{product.category}</td>
                      <td className="py-3 px-4 text-right font-semibold text-blue-600">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          stock > 20 ? 'bg-green-100 text-green-800' : 
                          stock > 10 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {stock}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        {formatCurrency(value)}
                      </td>
                      {selectedBranch === 'all' && product.branchStock && (
                        <td className="py-3 px-4">
                          <div className="flex flex-col text-xs space-y-1">
                            {branches.map(branch => (
                              <div key={branch.id} className="flex justify-between">
                                <span className="text-gray-600">{branch.name}:</span>
                                <span className="font-medium">{product.branchStock![branch.id] || 0}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                <tr>
                  <td colSpan={selectedBranch === 'all' ? 6 : 5} className="py-3 px-4 text-right font-bold text-gray-900">
                    Tổng giá trị:
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-blue-600 text-lg">
                    {formatCurrency(getTotalValue())}
                  </td>
                  {selectedBranch === 'all' && <td></td>}
                </tr>
              </tfoot>
            </table>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Không tìm thấy sản phẩm nào
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
