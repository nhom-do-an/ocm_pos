'use client';

import React, { useEffect } from 'react';
import { PaymentModal } from '@/components/pos/payment-modal';
import { CustomerSearch } from '@/components/pos/customer-search';
import { CartTable } from '@/components/pos/cart-table';
import { usePos } from './hooks/use-pos';
import { formatCurrency } from '@/lib/utils';
import { usePOSStore } from '@/store/pos-store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { PlusCircle, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ProductSearchDropdown } from '@/components/pos/product-search-dropdown';

const POSView: React.FC = () => {
  const {
    updateTabNote,
    selectedLocationId,
  } = usePOSStore();

  const {
    activeTab,
    canCheckout,
    canFinalizePayment,
    isPaymentModalOpen,
    printReceipt,
    transactions,
    paymentMethods,
    setIsPaymentModalOpen,
    setPrintReceipt,
    handlePaymentClick,
    addTransaction,
    removeTransaction,
    subtotal,
    total,
    hasValidStock,
  } = usePos();

  // Calculate total paid from transactions
  const totalPaid = transactions.reduce((sum, t) => sum + t.amount, 0);
  const remainingAmount = total - totalPaid;

  // Check inventory when location changes
  useEffect(() => {
    if (activeTab?.cart && activeTab.cart.length > 0) {
      const outOfStockItems = activeTab.cart.filter(
        (item) => (item.product.stock || 0) <= 0
      );
      if (outOfStockItems.length > 0) {
        toast.error(
          `Có ${outOfStockItems.length} sản phẩm hết hàng tại chi nhánh này. Vui lòng kiểm tra lại giỏ hàng.`
        );
      }
    }
  }, [selectedLocationId, activeTab?.cart]);

  return (
    <div className="flex h-full bg-gray-100">
      {/* Product Search - Only visible on small screens */}
      <div className="sm:hidden fixed top-[56px] left-0 right-0 z-10 px-2 py-2 bg-gray-100">
        <ProductSearchDropdown />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden px-2 sm:px-3 md:px-5 py-2 sm:py-3 md:py-4 gap-2 sm:gap-3 md:gap-4 pt-14 sm:pt-2">
        {/* Left Side: Cart + Note */}
        <div className="flex-1 flex flex-col overflow-hidden lg:w-[70%] xl:w-[75%] bg-white rounded-lg gap-2 pb-2 sm:pb-3 order-2 lg:order-1">
          {/* Cart Table */}
          <div className="flex-1 overflow-hidden border-b border-gray-200 flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <CartTable />
            </div>
          </div>

          {/* Note Section */}
          <div className="rounded-lg max-w-full sm:max-w-[300px] h-auto sm:h-[100px] flex items-end px-2 sm:px-4 pb-2">
            <Input
              value={activeTab?.note || ''}
              onChange={(e) => updateTabNote(e.target.value)}
              placeholder="Nhập ghi chú đơn hàng..."
              className="resize-none w-full"
            />
          </div>
        </div>

        {/* Right Side: Customer & Checkout */}
        <div className="flex flex-col overflow-hidden w-full lg:w-[30%] xl:w-[25%] bg-white rounded-lg p-3 sm:p-4 order-1 lg:order-2 max-h-[40vh] lg:max-h-none">
          {/* Customer Search */}
          <div className="mb-3">
            <CustomerSearch />
          </div>

          {/* Checkout Summary */}
          <div className="flex-1 flex flex-col overflow-hidden ">
            <div className="flex-1 overflow-y-auto pb-2">
              <div className="space-y-4">
                {/* Summary Section */}
                <div className="space-y-1">
                  {/* Total Products */}
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">
                      Tổng tiền hàng ({activeTab?.cart.length || 0} sản phẩm)
                    </span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  {/* Customer Must Pay */}
                  <div className="border-gray-200">
                    <div className="flex justify-between font-bold text-sm sm:text-base">
                      <span className="text-gray-900">Khách phải trả</span>
                      <span className="text-blue-600">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Methods Section */}
                <div className="">
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-2 sm:mb-3">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">
                      Tiền khách đưa
                    </span>
                    <Button
                      onClick={() => setIsPaymentModalOpen(true)}
                      variant="ghost"
                      size="sm"
                      className="!text-blue-600 hover:text-blue-700 text-xs sm:text-sm"
                    >
                      <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                      <span className="hidden sm:inline">Thêm phương thức</span>
                      <span className="sm:hidden">Thêm</span>
                    </Button>
                  </div>

                  {/* Transaction List */}
                  {transactions.length > 0 && (
                    <div className="space-y-1.5 sm:space-y-2">
                      {transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between gap-1 p-2 sm:p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1 flex justify-between items-center min-w-0">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                {transaction.payment_method_name}
                              </span>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600 ml-2 sm:ml-6 shrink-0">
                              {formatCurrency(transaction.amount)}
                            </div>
                          </div>
                          <Button
                            onClick={() => removeTransaction(transaction.id)}
                            variant="ghost"
                            size="sm"
                            className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 sm:h-8 sm:w-8 p-0 shrink-0"
                          >
                            <X size={14} className="sm:hidden" />
                            <X size={15} className="hidden sm:block" />
                          </Button>
                        </div>
                      ))}

                      {/* Payment Summary */}
                      <div className="pt-2 sm:pt-3 border-t border-gray-200 space-y-1.5 sm:space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-medium text-gray-700">
                            Tổng thanh toán
                          </span>
                          <span className="text-sm sm:text-base font-semibold text-gray-900">
                            {formatCurrency(totalPaid)}
                          </span>
                        </div>

                        {/* Remaining Amount or Change */}
                        {remainingAmount > 0 ? (
                          <div className="flex justify-between items-center p-1.5 sm:p-2 bg-red-50 rounded">
                            <span className="text-xs sm:text-sm font-medium text-red-700">
                              Tiền thiếu
                            </span>
                            <span className="text-sm sm:text-base font-semibold text-red-700">
                              {formatCurrency(remainingAmount)}
                            </span>
                          </div>
                        ) : remainingAmount < 0 ? (
                          <div className="flex justify-between items-center p-1.5 sm:p-2 bg-green-50 rounded">
                            <span className="text-xs sm:text-sm font-medium text-green-700">
                              Tiền thừa trả khách
                            </span>
                            <span className="text-sm sm:text-base font-semibold text-green-700">
                              {formatCurrency(Math.abs(remainingAmount))}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer: Print Receipt & Payment Button */}
            <div className="space-y-2 sm:space-y-3 bg-white rounded-b-lg border-t border-gray-200 pt-2 sm:pt-3">
              {/* Print Receipt Checkbox */}
              <label className="flex items-center w-full cursor-pointer gap-2 sm:gap-3">
                <Checkbox
                  className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700 w-4 h-4 sm:w-5 sm:h-5"
                  checked={printReceipt}
                  onCheckedChange={(checked) => setPrintReceipt(checked as boolean)}
                />
                <span className="flex-1 font-medium text-gray-700 text-xs sm:text-sm">In hóa đơn tự động</span>
                <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded bg-gray-100 text-gray-600 border border-gray-300 hidden sm:inline">
                  F10
                </kbd>
              </label>

              {/* Payment Button */}
              <Button
                onClick={handlePaymentClick}
                disabled={!canCheckout}
                className="w-full py-2 text-sm sm:text-base md:text-lg font-medium cursor-pointer"
                size="md"
              >
                <span>Thanh toán</span>
                <kbd className="ml-2 sm:ml-3 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm font-normal rounded bg-white/20 hidden sm:inline">
                  F9
                </kbd>
              </Button>
              {!hasValidStock && activeTab && activeTab.cart.length > 0 && (
                <p className="text-[10px] sm:text-xs text-red-600 text-center">
                  Có sản phẩm hết hàng trong giỏ hàng
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        paymentMethods={paymentMethods}
        onAddTransaction={addTransaction}
        remainingAmount={remainingAmount > 0 ? remainingAmount : 0}
        totalAmount={total}
        totalPaid={totalPaid}
        onCompletePayment={handlePaymentClick}
        canCompletePayment={!!canFinalizePayment}
      />
    </div>
  );
};

export default POSView;
