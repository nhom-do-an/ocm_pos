'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { usePOSStore } from '@/store/pos-store';
import { formatCurrency } from '@/lib/utils';
import variantService, { Variant } from '@/services/variant';
import { toast } from 'sonner';

export const ProductSearchDropdown: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { addToCart, selectedLocationId } = usePOSStore();

  // Search variants from API
  const searchVariants = async (searchKey: string, pageNum: number = 1, append: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await variantService.getListVariants({
        key: searchKey,
        size: 20,
        page: pageNum,
        location_id: selectedLocationId ? parseInt(selectedLocationId) : undefined,
      });
      const newVariants = response.variants || [];

      if (append) {
        setVariants(prev => [...prev, ...newVariants]);
      } else {
        setVariants(newVariants);
      }

      setHasMore(newVariants.length === 20);
    } catch (error) {
      console.error('Error searching variants:', error);
      toast.error('Lỗi khi tìm kiếm sản phẩm');
      if (!append) setVariants([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial products when focus
  const loadInitialProducts = useCallback(() => {
    if (variants.length === 0) {
      setPage(1);
      searchVariants('', 1, false);
    }
  }, [variants.length]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      searchVariants(searchTerm, 1, false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedLocationId]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || isLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      const nextPage = page + 1;
      setPage(nextPage);
      searchVariants(searchTerm, nextPage, true);
    }
  }, [isLoading, hasMore, page, searchTerm]);

  // Handle product selection
  const handleSelectVariant = (variant: Variant) => {
    // Check inventory quantity
    if ((variant.inventory_quantity || 0) <= 0) {
      toast.error(`Sản phẩm "${variant.product_name || variant.title}" đã hết hàng`);
      return;
    }

    const product = {
      id: variant.id.toString(),
      name: variant.product_name || variant.title || 'Sản phẩm',
      price: variant.price || 0,
      category: '',
      sku: variant.sku || '',
      barcode: variant.barcode,
      stock: variant.inventory_quantity || 0,
      unit: variant.unit,
      image: variant.image?.url,
      title: variant.title, // Variant title (e.g. "Đỏ / L" or "Size M")
    };

    addToCart(product);
    setSearchTerm('');
    setIsOpen(false);
    setSelectedIndex(0);
    setVariants([]);
    inputRef.current?.focus();
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || variants.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < variants.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (variants[selectedIndex]) {
          handleSelectVariant(variants[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
    }
  };

  // Handle F3 shortcut
  useEffect(() => {
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      if (e.key === 'F3') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleGlobalKeydown);
    return () => document.removeEventListener('keydown', handleGlobalKeydown);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative rounded-full bg-white text-black w-full sm:w-[320px] md:w-[400px] lg:w-[450px]" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsOpen(true);
            loadInitialProducts();
          }}
          placeholder="Tìm sản phẩm hoặc SKU (F3)"
          className="w-full pl-8 sm:pl-10 pr-12 sm:pr-16 py-2 sm:py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm"
        />
        <span className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-[10px] sm:text-xs text-gray-400 font-medium bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded hidden sm:inline">
          F3
        </span>
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="absolute z-50 mt-1 w-full min-w-[280px] sm:min-w-0 bg-white border border-gray-200 rounded-lg shadow-xl max-h-72 sm:max-h-96 overflow-y-auto"
        >
          {variants.length > 0 ? (
            <>
              {variants.map((variant, index) => {
                const productName = variant.product_name || variant.title || 'Sản phẩm';
                const variantInfo = variant.option1 || variant.option2 || variant.option3
                  ? [variant.option1, variant.option2, variant.option3].filter(Boolean).join(' / ')
                  : '';

                const isOutOfStock = (variant.inventory_quantity || 0) <= 0;

                return (
                  <div
                    key={`${variant.id}-${index}`}
                    onClick={() => !isOutOfStock && handleSelectVariant(variant)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-100 last:border-0 transition-colors ${isOutOfStock
                      ? 'cursor-not-allowed opacity-50 bg-gray-50'
                      : 'cursor-pointer ' + (index === selectedIndex ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50')
                      }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {variant.image?.url ? (
                          <img
                            src={variant.image.url}
                            alt={productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-base sm:text-xl">📦</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate text-xs sm:text-sm">
                          {productName}
                          {variantInfo && <span className="text-gray-500 text-[10px] sm:text-sm ml-1 sm:ml-2">({variantInfo})</span>}
                        </p>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-3 text-[10px] sm:text-xs text-gray-500 mt-0.5">
                          {variant.sku && <span className="hidden sm:inline">SKU: {variant.sku}</span>}
                          {variant.sku && <span className="hidden sm:inline">•</span>}
                          <span className={isOutOfStock ? 'text-red-600 font-semibold' : ''}>
                            Tồn: {variant.inventory_quantity || 0}
                            {isOutOfStock && ' (Hết)'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-semibold text-blue-600 text-xs sm:text-sm">
                          {formatCurrency(variant.price || 0)}
                        </p>
                        {variant.unit && (
                          <p className="text-[10px] sm:text-xs text-gray-500">/{variant.unit}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {isLoading && (
                <div className="p-2 sm:p-3 text-center text-gray-500 text-xs sm:text-sm border-t">
                  Đang tải thêm...
                </div>
              )}
            </>
          ) : isLoading ? (
            <div className="p-3 sm:p-4 text-center text-gray-500 text-xs sm:text-sm">
              Đang tìm kiếm...
            </div>
          ) : (
            <div className="p-3 sm:p-4 text-center text-gray-500 text-xs sm:text-sm">
              Không tìm thấy sản phẩm
            </div>
          )}
        </div>
      )}
    </div>
  );
};
