'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { PaymentMethod } from '@/types/response/payment-method';
import { Transaction } from '@/containers/pos/hooks/use-pos';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethods: PaymentMethod[];
  onAddTransaction: (transaction: Transaction) => void;
  remainingAmount: number;
  totalAmount: number;
  totalPaid: number;
  onCompletePayment?: () => void;
  canCompletePayment?: boolean;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  paymentMethods,
  onAddTransaction,
  remainingAmount,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [amount, setAmount] = useState<string>('');

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedMethod(null);
      setAmount('');
    }
  }, [isOpen]);

  // Set amount to remaining amount when a method is selected
  React.useEffect(() => {
    if (selectedMethod && !amount) {
      setAmount(remainingAmount.toString());
    }
  }, [selectedMethod, remainingAmount, amount]);

  // Format number with dots as thousand separators
  const formatNumberWithDots = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Handle amount input with formatting
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setAmount(value);
  };

  // Get formatted display value
  const getFormattedAmount = () => {
    return amount ? formatNumberWithDots(amount) : '';
  };

  const handleAddTransaction = () => {
    if (!selectedMethod || !amount || parseFloat(amount) <= 0) {
      alert('Vui lòng chọn phương thức thanh toán và nhập số tiền!');
      return;
    }

    const transaction: Transaction = {
      id: `txn-${Date.now()}`,
      payment_method_id: selectedMethod.id,
      payment_method_name: selectedMethod.name || 'Thanh toán',
      amount: parseFloat(amount),
    };

    onAddTransaction(transaction);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thêm phương thức thanh toán" size='md'>
      <div className="space-y-4">
        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Phương thức thanh toán
          </label>
          <Select value={selectedMethod?.id.toString()} onValueChange={(value) => {
            const method = paymentMethods.find(m => m.id.toString() === value);
            if (method) setSelectedMethod(method);
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn phương thức thanh toán" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((method) => (
                <SelectItem key={method.id} value={method.id.toString()}>
                  {method.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Số tiền thanh toán
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
              ₫
            </span>
            <input
              value={getFormattedAmount()}
              onChange={handleAmountChange}
              placeholder="0"
              type="text"
              className="w-full pl-10 pr-4 py-1  border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleAddTransaction}
            disabled={!selectedMethod || !amount || parseFloat(amount) <= 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            Xác nhận
          </Button>
        </div>
      </div >
    </Modal >
  );
};
