'use client';

import React, { useState } from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { usePOSStore } from '@/store/pos-store';
import { formatCurrency } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const CartTable: React.FC = () => {
  const activeTab = usePOSStore((state) => state.getActiveTab());
  const { updateQuantity, removeFromCart, updateItemNote } = usePOSStore();
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-200">
            <TableHead className="w-[45%] sm:w-[50%] text-xs sm:text-sm">Sản phẩm ({activeTab ? activeTab.cart.length : 0})</TableHead>
            <TableHead className="text-center text-xs sm:text-sm hidden md:table-cell">Đơn giá</TableHead>
            <TableHead className="text-center w-[90px] sm:w-[120px] text-xs sm:text-sm">SL</TableHead>
            <TableHead className="text-right text-xs sm:text-sm">Thành tiền</TableHead>
            <TableHead className="w-[28px] sm:w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeTab && activeTab.cart.map((item, index) => {
            const isOutOfStock = (item.product.stock || 0) <= 0;

            return (
              <TableRow
                key={item.product.id}
                className={`${isOutOfStock
                  ? 'bg-red-50 border-l-4 border-l-red-500 hover:bg-red-50'
                  : ''
                  } animate-slide-down`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Product Info */}
                <TableCell className="py-2 sm:py-3">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-base sm:text-xl">📦</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                        <h4 className="font-medium text-gray-900 text-xs sm:text-sm line-clamp-2">
                          {item.product.name}
                        </h4>
                        {isOutOfStock && (
                          <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
                            Hết hàng
                          </span>
                        )}
                      </div>
                      {item.product.title && (
                        <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1 truncate">
                          {item.product.title}
                        </p>
                      )}
                      <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">
                        Đơn vị: {item.product.unit || '---'} • Tồn:{' '}
                        {item.product.stock || 0}
                      </p>
                      {/* Mobile: show price here */}
                      <p className="text-xs text-gray-700 font-medium md:hidden mt-0.5">
                        {formatCurrency(item.product.price)}
                      </p>
                      {/* Note */}
                      {item.note || editingNoteId === item.product.id ? (
                        <div className="mt-0.5 sm:mt-1">
                          {editingNoteId === item.product.id ? (
                            <input
                              type="text"
                              defaultValue={item.note || ''}
                              onBlur={(e) => {
                                updateItemNote(item.product.id, e.target.value);
                                setEditingNoteId(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  updateItemNote(
                                    item.product.id,
                                    e.currentTarget.value
                                  );
                                  setEditingNoteId(null);
                                }
                              }}
                              placeholder="Nhập ghi chú sản phẩm..."
                              className="w-full px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              autoFocus
                            />
                          ) : (
                            <div
                              onClick={() => setEditingNoteId(item.product.id)}
                              className="text-[10px] sm:text-xs text-blue-600 cursor-pointer hover:text-blue-700 truncate"
                            >
                              Ghi chú: {item.note}
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingNoteId(item.product.id)}
                          className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-gray-400 hover:text-blue-600 transition-colors hidden sm:inline-block"
                        >
                          + Thêm ghi chú
                        </button>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Price - Hidden on mobile */}
                <TableCell className="text-left hidden md:table-cell">
                  <span className="text-xs sm:text-sm font-medium text-gray-900">
                    {formatCurrency(item.product.price)}
                  </span>
                </TableCell>

                {/* Quantity Controls */}
                <TableCell className="py-2 sm:py-3">
                  <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg border border-gray-300 hover:bg-gray-100 hover:border-gray-400 flex items-center justify-center transition-all duration-150 active:scale-95"
                    >
                      <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        updateQuantity(item.product.id, value);
                      }}
                      className="w-8 sm:w-12 h-6 sm:h-7 text-center border border-gray-300 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      min="1"
                    />
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg border border-gray-300 hover:bg-gray-100 hover:border-gray-400 flex items-center justify-center transition-all duration-150 active:scale-95"
                    >
                      <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </button>
                  </div>
                </TableCell>

                {/* Total */}
                <TableCell className="text-right py-2 sm:py-3">
                  <span className="text-xs sm:text-sm font-semibold text-blue-600">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </TableCell>

                {/* Delete Button */}
                <TableCell className="py-2 sm:py-3">
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-gray-400 hover:text-red-600 hover:scale-110 transition-all duration-200 p-0.5 sm:p-1 rounded hover:bg-red-50"
                    title="Xóa"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {!activeTab || activeTab.cart.length === 0 && <div className="flex-1 flex items-center justify-center h-full animate-fade-in">
        <div className="text-center py-8 sm:py-12 px-4">
          <div className="text-gray-300 mb-3 sm:mb-4">
            <svg
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-26 md:h-26 mx-auto opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 26 26"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-base sm:text-lg md:text-[20px] font-medium mb-1 sm:mb-2">
            Chưa có sản phẩm trong giỏ
          </p>
          <p className="text-gray-400 text-sm sm:text-base md:text-[16px]">
            Nhấn{' '}
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-700 rounded font-semibold text-xs sm:text-sm">
              F3
            </span>{' '}
            để tìm kiếm sản phẩm
          </p>
        </div>
      </div>}
    </div>

  );
};
