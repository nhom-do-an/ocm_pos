'use client';

import React, { useState } from 'react';
import { CreditCard, Banknote, Smartphone, X, CheckCircle } from 'lucide-react';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [cashAmount, setCashAmount] = useState<string>('');
  
  const { createOrder, getTotal, clearCart, getActiveTab } = usePOSStore();
  const activeTab = getActiveTab();
  const total = getTotal();

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setPaymentMethod('cash');
      setCashAmount('');
      setIsProcessing(false);
    }
  }, [isOpen]);

  // Calculate change amount for cash payment
  const getChangeAmount = () => {
    const cashValue = parseFloat(cashAmount || '0');
    return Math.max(0, cashValue - total);
  };

  // Format number with dots as thousand separators
  const formatNumberWithDots = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Handle cash amount input with formatting
  const handleCashAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setCashAmount(value);
  };

  // Get formatted display value
  const getFormattedCashAmount = () => {
    return cashAmount ? formatNumberWithDots(cashAmount) : '';
  };

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate API call with a small delay
    setTimeout(() => {
      createOrder(paymentMethod);
      setIsProcessing(false);
      onClose();
    }, 800);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thanh toán đơn hàng" size="lg">
      <div className="grid grid-cols-3 gap-4">
        {/* Left Column - Order Summary */}
        <div className="flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
          <div className="p-4">
            <h3 className="text-blue-800 font-medium mb-3 flex items-center">
              <div className="w-6 h-6 rounded-full bg-blue-500 mr-2 flex items-center justify-center">
                <span className="text-white text-xs font-bold">#</span>
              </div>
              Thông tin đơn hàng
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-blue-200">
                <span className="text-gray-600 text-sm">Đơn hàng:</span>
                <span className="font-semibold text-gray-900 text-sm">{activeTab?.name || 'Đơn hiện tại'}</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-blue-200">
                <span className="text-gray-600 text-sm">Số lượng:</span>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-900 text-sm">{activeTab?.cart.length || 0}</span>
                  <span className="text-gray-500 ml-1 text-sm">sản phẩm</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-1">
                <span className="text-gray-800 font-medium text-sm">Tổng cộng:</span>
                <span className="text-xl font-bold text-blue-700">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - Payment Method Details */}
        <div className="flex flex-col">
          {/* Cash Payment */}
          {paymentMethod === 'cash' && (
            <div className="bg-green-50 rounded-xl border border-green-200 animate-fade-in h-[260px]">
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Banknote className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="font-medium text-green-800">Thanh toán tiền mặt</h3>
                </div>
                
                <div className="space-y-4">
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Tiền khách đưa</label>
                           <div className="relative">
                             <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₫</span>
                             <input
                               value={getFormattedCashAmount()}
                               onChange={handleCashAmountChange}
                               placeholder="0"
                               type="text"
                               className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                             />
                             {cashAmount && (
                               <button 
                                 onClick={() => setCashAmount('')}
                                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                               >
                                 <X className="w-4 h-4" />
                               </button>
                             )}
                           </div>
                         </div>
                
                  {parseFloat(cashAmount || '0') > 0 && (
                    <div className="flex justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <span className="text-gray-600">Tiền thừa:</span>
                      <span className={getChangeAmount() >= 0 
                        ? 'text-green-600 font-medium' 
                        : 'text-red-600 font-medium'
                      }>
                        {formatCurrency(getChangeAmount())}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Card Payment */}
          {paymentMethod === 'card' && (
            <div className="bg-blue-50 rounded-xl border border-blue-200 animate-fade-in h-[260px]">
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-blue-800">Thanh toán thẻ</h3>
                </div>
                
                <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số thẻ</label>
                  <input
                    type="text"
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Transfer Payment */}
          {paymentMethod === 'transfer' && (
            <div className="bg-purple-50 rounded-xl border border-purple-200 animate-fade-in h-[260px]">
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <Smartphone className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-purple-800">Chuyển khoản</h3>
                </div>
                
                <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Ngân hàng:</span>
                    <span className="font-medium">BIDV</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Số tài khoản:</span>
                    <span className="font-medium">12345678900</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Chủ tài khoản:</span>
                    <span className="font-medium">CÔNG TY OMNI</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã giao dịch</label>
                  <input
                    type="text"
                    placeholder="Nhập mã giao dịch"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Payment Methods */}
        <div className="flex flex-col">
          <div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`w-full p-4 rounded-xl transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-500 shadow-md'
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    paymentMethod === 'cash' 
                      ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Banknote className="w-6 h-6" />
                  </div>
                         <div className="flex-1 text-left">
                           <p className={`font-medium ${paymentMethod === 'cash' ? 'text-green-700' : 'text-gray-700'}`}>
                             Tiền mặt
                           </p>
                         </div>
                  {paymentMethod === 'cash' && (
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  )}
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`w-full p-4 rounded-xl transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-500 shadow-md'
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    paymentMethod === 'card' 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    <CreditCard className="w-6 h-6" />
                  </div>
                         <div className="flex-1 text-left">
                           <p className={`font-medium ${paymentMethod === 'card' ? 'text-blue-700' : 'text-gray-700'}`}>
                             Thẻ tín dụng
                           </p>
                         </div>
                  {paymentMethod === 'card' && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={`w-full p-4 rounded-xl transition-all ${
                  paymentMethod === 'transfer'
                    ? 'bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-500 shadow-md'
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    paymentMethod === 'transfer' 
                      ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Smartphone className="w-6 h-6" />
                  </div>
                         <div className="flex-1 text-left">
                           <p className={`font-medium ${paymentMethod === 'transfer' ? 'text-purple-700' : 'text-gray-700'}`}>
                             Chuyển khoản
                           </p>
                         </div>
                  {paymentMethod === 'transfer' && (
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
          
               {/* Action Button - Full Width */}
               <div className="border-t mt-6 pt-5 col-span-3">
                 <div className="flex justify-center">
                   <Button 
                     variant="success" 
                     onClick={handlePayment} 
                     className="px-8 py-3 text-base bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg"
                     disabled={isProcessing}
                   >
                     {isProcessing ? (
                       <>
                         <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                         Đang xử lý...
                       </>
                     ) : (
                       <>
                         <CheckCircle className="w-5 h-5 mr-2" />
                         Xác nhận thanh toán
                       </>
                     )}
                   </Button>
                 </div>
               </div>
      </div>
    </Modal>
  );
};
