'use client';

import React from 'react';
import { usePOSStore } from '@/store/pos-store';
import { formatCurrency } from '@/lib/utils';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface CheckoutSummaryProps {
  onCheckout: () => void;
}

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ onCheckout }) => {
  const activeTab = usePOSStore((state) => state.getActiveTab());
  const { setDiscount, getSubtotal, getTotal, tax, clearCart, setTabNote } = usePOSStore();
  
  const subtotal = getSubtotal();
  const taxAmount = subtotal * tax;
  const total = getTotal();

  if (!activeTab) return null;

  return (
    <Card className="sticky top-4">
      <h3 className="text-lg font-semibold mb-4">Tổng đơn hàng</h3>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Tạm tính:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>Thuế (10%):</span>
          <span>{formatCurrency(taxAmount)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Giảm giá:</span>
          <input
            type="number"
            value={activeTab.discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="w-28 px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>
        
        <div className="border-t pt-3">
          <div className="flex justify-between text-xl font-bold">
            <span>Tổng cộng:</span>
            <span className="text-blue-600">{formatCurrency(total)}</span>
          </div>
        </div>
        
        <div className="border-t pt-3">
          <textarea
            value={activeTab.note || ''}
            onChange={(e) => setTabNote(e.target.value)}
            placeholder="Ghi chú đơn hàng..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Button
          variant="success"
          className="w-full"
          onClick={onCheckout}
          disabled={activeTab.cart.length === 0}
        >
          Thanh toán ({activeTab.cart.length})
        </Button>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={clearCart}
          disabled={activeTab.cart.length === 0}
        >
          Xóa giỏ hàng
        </Button>
      </div>
    </Card>
  );
};
