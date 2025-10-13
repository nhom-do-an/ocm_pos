'use client';

import React, { useState } from 'react';
import { CreditCard, Banknote, Smartphone } from 'lucide-react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { usePOSStore } from '@/store/pos-store';
import { formatCurrency } from '@/lib/utils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const { createOrder, getTotal, clearCart } = usePOSStore();

  const handlePayment = () => {
    createOrder(paymentMethod, customerName || undefined, customerPhone || undefined);
    setCustomerName('');
    setCustomerPhone('');
    onClose();
  };

  const total = getTotal();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thanh toán" size="md">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Phương thức thanh toán</h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                paymentMethod === 'cash'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Banknote className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Tiền mặt</p>
            </button>
            
            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                paymentMethod === 'card'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <CreditCard className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Thẻ</p>
            </button>
            
            <button
              onClick={() => setPaymentMethod('transfer')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                paymentMethod === 'transfer'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Smartphone className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Chuyển khoản</p>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <Input
            label="Tên khách hàng (tùy chọn)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nhập tên khách hàng"
          />
          
          <Input
            label="Số điện thoại (tùy chọn)"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="Nhập số điện thoại"
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between text-2xl font-bold mb-4">
            <span>Tổng cộng:</span>
            <span className="text-blue-600">{formatCurrency(total)}</span>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Hủy
            </Button>
            <Button variant="success" onClick={handlePayment} className="flex-1">
              Xác nhận thanh toán
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
