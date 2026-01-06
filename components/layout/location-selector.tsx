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
        className="flex items-center gap-2 text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
      >
        <MapPin className="w-5 h-5" />
        <div className="text-sm text-left">
          <div className="text-xs opacity-90">Chỉ nhánh</div>
          <div className="font-medium">{selectedLocation?.name || 'Chọn chi nhánh'}</div>
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-700">Chọn chi nhánh</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {locations.map((location) => (
              <button
                key={location.id}
                onClick={() => handleSelectLocation(location)}
                className={cn(
                  "w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center justify-between",
                  selectedLocation?.id === location.id && "bg-blue-50"
                )}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{location.name}</p>
                    {location.isDefault && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                        Mặc định
                      </span>
                    )}
                  </div>
                  {location.address && (
                    <p className="text-sm text-gray-500 mt-1">{location.address}</p>
                  )}
                </div>
                {selectedLocation?.id === location.id && (
                  <Check className="w-5 h-5 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
