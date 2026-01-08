'use client';

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-[95vw] sm:max-w-sm',
    md: 'max-w-[95vw] sm:max-w-xl md:max-w-2xl',
    lg: 'max-w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl',
    xl: 'max-w-[95vw] sm:max-w-3xl md:max-w-4xl lg:max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-2 sm:p-4">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className={cn(
          'relative bg-white rounded-lg sm:rounded-xl shadow-2xl w-full mx-2 sm:mx-4 animate-fade-in-up max-h-[90vh] overflow-hidden flex flex-col',
          sizes[size]
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-5 border-b shrink-0">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate pr-2">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5 sm:p-2 transition-all shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-3 sm:p-4 md:p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
