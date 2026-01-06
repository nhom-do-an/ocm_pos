'use client';

import React, { useState } from 'react';
import { Phone, Calendar, FileText } from 'lucide-react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import customerService from '@/services/customer';
import { Customer } from '@/types/response/customer';
import { toast } from 'sonner';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (customer: Customer) => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    phone: '',
    gender: '',
    dob: '',
    note: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      toast.error('Vui lòng nhập đầy đủ họ, tên và số điện thoại');
      return;
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Số điện thoại không hợp lệ (9-11 chữ số)');
      return;
    }

    try {
      setIsLoading(true);

      // Prepare request data with optional fields
      const requestData: any = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
      };

      // Add optional fields if provided
      if (formData.gender) {
        requestData.gender = formData.gender as 'male' | 'female' | 'other';
      }
      if (formData.dob) {
        requestData.dob = formData.dob;
      }
      if (formData.note) {
        requestData.note = formData.note;
      }

      // Call API to create customer
      const newCustomer = await customerService.createCustomer(requestData);

      // Success callback
      if (onSuccess) {
        onSuccess(newCustomer);
      }

      // Reset form
      setFormData({
        lastName: '',
        firstName: '',
        phone: '',
        gender: '',
        dob: '',
        note: '',
      });

      onClose();
    } catch (error: any) {
      console.error('Failed to create customer:', error);
      toast.error(error.response?.data?.message || 'Thêm khách hàng thất bại!');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle ESC key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thêm mới khách hàng" size="md">
      <div className="" onKeyDown={handleKeyDown}>
        <div className="space-y-2 flex flex-wrap gap-1 items-center justify-between mb-2">
          {/* Last Name */}
          <div className='w-[48%]'>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Nhập họ"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
              disabled={isLoading}
            />
          </div>

          {/* First Name */}
          <div className='w-[48%]'>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Nhập tên"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
              disabled={isLoading}
            />
          </div>

          {/* Phone */}
          <div className='w-[48%]'>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Nhập số điện thoại"
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Gender */}
          <div className='w-[48%]'>
            <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
            <div className="flex gap-4">
              {[
                { value: 'male', label: 'Nam' },
                { value: 'female', label: 'Nữ' },
                { value: 'other', label: 'Khác' }
              ].map((option) => (
                <label key={option.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={option.value}
                    checked={formData.gender === option.value}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date of Birth */}
          <div className='w-[48%]'>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Note */}
          <div className='w-[48%]'>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <textarea
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                placeholder="Nhập ghi chú về khách hàng..."
                rows={3}
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm resize-none"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-3 px-2 border-t border-gray-200 ">
        <Button
          variant="outline"
          onClick={onClose}
          className="px-4 py-2 text-sm cursor-pointer"
          disabled={isLoading}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? 'Đang thêm...' : 'Thêm mới'}
        </Button>
      </div>
    </Modal>
  );
};
