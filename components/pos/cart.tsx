'use client';

import React, { useState } from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { usePOSStore } from '@/store/pos-store';
import { formatCurrency } from '@/lib/utils';

export const Cart: React.FC = () => {
  const activeTab = usePOSStore((state) => state.getActiveTab());
  const { updateQuantity, removeFromCart, updateItemNote } = usePOSStore();
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  if (!activeTab || activeTab.cart.length === 0) {
    return (
      <div className="flex items-center justify-center h-full animate-fade-in">
        <div className="text-center py-12 px-4">
          <div className="text-gray-300 mb-4">
            <svg className="w-24 h-24 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-2">Chưa có sản phẩm trong giỏ</p>
          <p className="text-gray-400 text-xs">
            Nhấn <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded font-semibold">F3</span> để tìm kiếm sản phẩm
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {activeTab.cart.map((item, index) => (
        <div 
          key={item.product.id} 
          className="p-4 hover:bg-gray-50 transition-all duration-200 animate-slide-down"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-start gap-3">
            {/* Product Image */}
            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
              {item.product.image ? (
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl">📦</span>
              )}
            </div>
            
            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Đơn vị: ---
                  </p>
                </div>
                
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-gray-400 hover:text-red-600 hover:scale-110 transition-all duration-200 ml-2 p-1 rounded hover:bg-red-50"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Price, Quantity, Total */}
              <div className="grid grid-cols-3 gap-4 items-center">
                {/* Price */}
                <div>
                  <p className="text-xs text-gray-500">Đơn giá</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(item.product.price)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Số lượng</p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg border border-gray-300 hover:bg-gray-100 hover:border-gray-400 flex items-center justify-center transition-all duration-150 active:scale-95"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        updateQuantity(item.product.id, value);
                      }}
                      className="w-10 h-7 text-center border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      min="1"
                    />
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg border border-gray-300 hover:bg-gray-100 hover:border-gray-400 flex items-center justify-center transition-all duration-150 active:scale-95"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="text-right">
                  <p className="text-xs text-gray-500">Thành tiền</p>
                  <p className="text-sm font-semibold text-blue-600">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                </div>
              </div>

              {/* Note */}
              {item.note || editingNoteId === item.product.id ? (
                <div className="mt-2">
                  {editingNoteId === item.product.id ? (
                    <input
                      type="text"
                      defaultValue={item.note || ''}
                      onBlur={(e) => {
                        updateItemNote(item.product.id, e.target.value);
                        setEditingNoteId(null);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          updateItemNote(item.product.id, e.currentTarget.value);
                          setEditingNoteId(null);
                        }
                      }}
                      placeholder="Nhập ghi chú sản phẩm..."
                      className="w-full px-2 py-1 text-xs border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      autoFocus
                    />
                  ) : (
                    <div 
                      onClick={() => setEditingNoteId(item.product.id)}
                      className="text-xs text-blue-600 cursor-pointer hover:text-blue-700"
                    >
                      Ghi chú: {item.note}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setEditingNoteId(item.product.id)}
                  className="mt-2 text-xs text-gray-400 hover:text-blue-600 transition-colors"
                >
                  + Thêm ghi chú
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
