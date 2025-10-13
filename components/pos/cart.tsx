'use client';

import React, { useState } from 'react';
import { Trash2, Plus, Minus, FileText } from 'lucide-react';
import { usePOSStore } from '@/store/pos-store';
import { formatCurrency } from '@/lib/utils';
import { Card } from '../ui/card';

export const Cart: React.FC = () => {
  const activeTab = usePOSStore((state) => state.getActiveTab());
  const { updateQuantity, removeFromCart, updateItemNote } = usePOSStore();
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  if (!activeTab || activeTab.cart.length === 0) {
    return (
      <Card className="text-center py-8">
        <p className="text-gray-500">Giỏ hàng trống</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {activeTab.cart.map((item) => (
        <Card key={item.product.id} className="p-3">
          <div className="flex items-start gap-3">
            <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
              {item.product.image ? (
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <span className="text-2xl"></span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">
                {item.product.name}
              </h4>
              <p className="text-sm text-gray-500">
                {formatCurrency(item.product.price)}
              </p>
              
              {item.note ? (
                <div className="mt-1 text-xs text-blue-600 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  <span>{item.note}</span>
                  <button
                    onClick={() => setEditingNoteId(item.product.id)}
                    className="text-gray-400 hover:text-blue-600"
                  >
                    
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingNoteId(item.product.id)}
                  className="mt-1 text-xs text-gray-400 hover:text-blue-600"
                >
                  + Thêm ghi chú
                </button>
              )}
              
              {editingNoteId === item.product.id && (
                <div className="mt-2">
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
                    placeholder="Nhập ghi chú..."
                    className="w-full px-2 py-1 text-xs border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                className="w-8 h-8 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                className="w-8 h-8 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {formatCurrency(item.product.price * item.quantity)}
              </p>
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="text-red-600 hover:text-red-700 mt-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
