'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Check, ChevronDown } from 'lucide-react';
import { usePOSStore } from '@/store/pos-store';
import { Location } from '@/types';
import { cn } from '@/lib/utils';

export const LocationSelector: React.FC = () => {
  const { locations, selectedLocationId, setSelectedLocation, loadLocations } = usePOSStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedLocation = locations.find((loc) => loc.id === selectedLocationId) ||
                          locations.find((loc) => loc.isDefault) ||
                          locations[0];

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location.id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 text-white hover:bg-white/10 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors"
      >
        <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
        <div className="text-left hidden sm:block">
          <div className="text-[10px] sm:text-xs opacity-90">Chi nhánh</div>
          <div className="font-medium text-xs sm:text-sm truncate max-w-[100px] md:max-w-[150px]">{selectedLocation?.name || 'Chọn chi nhánh'}</div>
        </div>
        <ChevronDown className={cn(
          "w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          <div className="px-3 sm:px-4 py-2 border-b border-gray-200">
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Chọn chi nhánh</p>
          </div>
          <div className="max-h-72 sm:max-h-96 overflow-y-auto">
            {locations.map((location) => (
              <button
                key={location.id}
                onClick={() => handleSelectLocation(location)}
                className={cn(
                  "w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-blue-50 transition-colors flex items-center justify-between",
                  selectedLocation?.id === location.id && "bg-blue-50"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">{location.name}</p>
                    {location.isDefault && (
                      <span className="px-1.5 sm:px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] sm:text-xs rounded-full shrink-0">
                        Mặc định
                      </span>
                    )}
                  </div>
                  {location.address && (
                    <p className="text-[10px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1 truncate">{location.address}</p>
                  )}
                </div>
                {selectedLocation?.id === location.id && (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 ml-2" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
